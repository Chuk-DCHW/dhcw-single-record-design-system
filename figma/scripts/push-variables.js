#!/usr/bin/env node
/**
 * push-variables.js
 *
 * Pushes DHCW design tokens to Figma as Variables via the REST API.
 *
 * Creates two collections in the target Figma file:
 *   "Primitives"    — raw values (colour palette + typography scale + breakpoints)
 *                     Hidden from publishing.
 *   "Single Record" — semantic aliases referencing Primitives (colour + typography)
 *                     Published to the library.
 *
 * Prerequisites:
 *   Node.js 18+ (uses native fetch — no install needed)
 *
 * Usage:
 *   FIGMA_TOKEN=<token> FIGMA_FILE_KEY=<key> node figma/scripts/push-variables.js
 *
 * Environment variables:
 *   FIGMA_TOKEN     Personal access token — Figma → Settings → Personal access tokens.
 *                   Must have the "Variables: Read and Write" scope.
 *   FIGMA_FILE_KEY  Key from your Figma file URL:
 *                   https://figma.com/design/<FILE_KEY>/...
 *
 * Notes:
 *   - This script is additive (CREATE only). Delete the "Primitives" and
 *     "Single Record" collections in Figma before re-running after changes.
 *   - Composite typography tokens (sr.typography.*) are flattened into
 *     individual property variables (Font Size, Line Height, etc.) because
 *     the Figma Variables API has no composite typography type. Use Figma
 *     Text Styles for fully-composed type styles.
 *   - em-based letter-spacing values are pushed as STRING variables since
 *     the Figma FLOAT/LETTER_SPACING scope requires pixel values.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Environment ───────────────────────────────────────────────────────────────

const FIGMA_TOKEN    = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error('Error: required environment variables are not set.\n');
  console.error('  FIGMA_TOKEN     — Personal access token with Variables scope');
  console.error('  FIGMA_FILE_KEY  — Key from the Figma file URL\n');
  console.error('Example:');
  console.error('  FIGMA_TOKEN=figd_xxx FIGMA_FILE_KEY=AbCdEf node figma/scripts/push-variables.js');
  process.exit(1);
}

// ─── Load token files ──────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '../..');

function loadTokens(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}

const colourPrimTokens = loadTokens('foundations/tokens/primitives/color.json');
const colourSemTokens  = loadTokens('foundations/tokens/semantic/color.json');
const typoPrimTokens   = loadTokens('foundations/tokens/primitives/typography.json');
const typoSemTokens    = loadTokens('foundations/tokens/semantic/typography.json');
const breakpointTokens = loadTokens('foundations/tokens/breakpoints.json');

// ─── Core helpers ──────────────────────────────────────────────────────────────

/** Convert a 6-digit hex colour to Figma's { r, g, b, a } (0–1 range). */
function hexToRgba(hex) {
  const h = hex.replace('#', '');
  if (h.length !== 6) throw new Error(`Unexpected hex value: ${hex}`);
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
    a: 1,
  };
}

/**
 * Determine the Figma resolvedType from a W3C DTCG $type and its value.
 *   fontFamily               → STRING
 *   fontWeight               → FLOAT
 *   dimension (em-based)     → STRING  (em values are context-relative; can't store as FLOAT px)
 *   dimension (px / numeric) → FLOAT
 */
function figmaResolvedType(dtcgType, value) {
  if (dtcgType === 'fontFamily') return 'STRING';
  if (dtcgType === 'fontWeight') return 'FLOAT';
  if (dtcgType === 'dimension') {
    if (typeof value === 'string' && value.includes('em')) return 'STRING';
    return 'FLOAT';
  }
  if (dtcgType === 'color') return 'COLOR';
  return 'STRING';
}

/**
 * Convert a W3C token value to the raw value Figma expects for a given resolvedType.
 *   FLOAT  — strip trailing unit suffix ("px", etc.); "0" → 0
 *   STRING — join arrays with ", "; leave strings as-is
 *   COLOR  — call hexToRgba
 */
function toFigmaValue(resolvedType, value) {
  if (resolvedType === 'FLOAT') {
    if (value === '0') return 0;
    const n = parseFloat(value);
    if (isNaN(n)) throw new Error(`Cannot convert "${value}" to FLOAT`);
    return n;
  }
  if (resolvedType === 'STRING') {
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  }
  if (resolvedType === 'COLOR') {
    return hexToRgba(value);
  }
  return value;
}

/**
 * Variable scopes tell Figma where a variable can be applied in the UI.
 * Scopes vary by resolvedType and semantic meaning.
 */
function figmaScopes(resolvedType, semanticHint) {
  if (resolvedType === 'COLOR')  return ['ALL_SCOPES'];
  if (resolvedType === 'STRING') {
    if (semanticHint === 'fontFamily') return ['FONT_FAMILIES'];
    return ['ALL_SCOPES'];
  }
  if (resolvedType === 'FLOAT') {
    if (semanticHint === 'fontSize')      return ['FONT_SIZE'];
    if (semanticHint === 'lineHeight')    return ['LINE_HEIGHT'];
    if (semanticHint === 'letterSpacing') return ['LETTER_SPACING'];
    if (semanticHint === 'breakpoint')    return ['WIDTH_HEIGHT'];
    return ['ALL_SCOPES'];
  }
  return ['ALL_SCOPES'];
}

/** Generate a stable temp ID from a token path for use within a single API payload. */
function tempId(ns, tokenPath) {
  return `${ns}__${tokenPath.replace(/[^a-z0-9]/gi, '_')}`;
}

// ─── Token flatteners ──────────────────────────────────────────────────────────

/**
 * Flatten a nested W3C Design Token object into leaf entries.
 * Skips $-prefixed metadata keys.
 * Returns: Array<{ path, value, dtcgType }>
 */
function flattenTokens(obj, prefix = '') {
  const results = [];
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const tokenPath = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && '$value' in val) {
      results.push({ path: tokenPath, value: val.$value, dtcgType: val.$type || null });
    } else if (val && typeof val === 'object') {
      results.push(...flattenTokens(val, tokenPath));
    }
  }
  return results;
}

/**
 * Flatten composite typography tokens (sr.typography.*) into individual
 * per-property entries. Skips non-composite tokens.
 * Returns: Array<{ compositePath, propKey, ref }>
 *   ref is a W3C alias string e.g. "{font.size.48}"
 */
function flattenTypographyComposites(obj, prefix = '') {
  const results = [];
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const tokenPath = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && val.$type === 'typography' && typeof val.$value === 'object') {
      for (const [propKey, ref] of Object.entries(val.$value)) {
        results.push({ compositePath: tokenPath, propKey, ref });
      }
    } else if (val && typeof val === 'object') {
      results.push(...flattenTypographyComposites(val, tokenPath));
    }
  }
  return results;
}

// ─── Naming conventions ────────────────────────────────────────────────────────

/** Capitalise each word and join with a space. */
function titleCase(str) {
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Colour primitive path → Figma variable name (unchanged from v1).
 * color.blue.900          → Blue/900
 * color.info-blue.default → Info Blue
 * color.white.default     → White
 */
function colourPrimToFigmaName(tokenPath) {
  const parts = tokenPath.replace(/^color\./, '').split('.');
  return parts
    .filter(p => p !== 'default')
    .map(titleCase)
    .join('/');
}

/**
 * Colour semantic path → Figma variable name (unchanged from v1).
 * sr.color.interactive.primary     → Interactive/Primary
 * sr.color.status.critical-surface → Status/Critical Surface
 */
function colourSemToFigmaName(tokenPath) {
  const parts = tokenPath.replace(/^sr\.color\./, '').split('.');
  return parts.map(titleCase).join('/');
}

/**
 * Typography / breakpoint primitive path → Figma variable name.
 * font.family.primary         → Font/Family/Primary
 * font.weight.bold            → Font/Weight/Bold
 * font.size.48                → Font/Size/48
 * font.line-height.54         → Font/Line Height/54
 * font.letter-spacing.default → Font/Letter Spacing/Default
 * breakpoint.desktop.min      → Breakpoint/Desktop/Min
 */
function genericPrimToFigmaName(tokenPath) {
  const parts = tokenPath.split('.');
  return parts.map(p => titleCase(p)).join('/');
}

/**
 * Typography semantic composite property → Figma variable name.
 * sr.typography.heading-xl.desktop, fontSize → Typography/Heading XL/Desktop/Font Size
 * sr.typography.body.mobile, lineHeight      → Typography/Body/Mobile/Line Height
 */
function typoSemToFigmaName(compositePath, propKey) {
  const propLabels = {
    fontFamily:    'Font Family',
    fontSize:      'Font Size',
    lineHeight:    'Line Height',
    fontWeight:    'Font Weight',
    letterSpacing: 'Letter Spacing',
  };
  const inner = compositePath.replace(/^sr\.typography\./, '');
  const parts  = inner.split('.').map(titleCase);
  const prop   = propLabels[propKey] || titleCase(propKey);
  return `Typography/${parts.join('/')}/${prop}`;
}

// ─── Flatten all token sources ─────────────────────────────────────────────────

const colourPrimEntries = flattenTokens(colourPrimTokens);
const colourSemEntries  = flattenTokens(colourSemTokens);
const typoPrimEntries   = flattenTokens(typoPrimTokens);
const bpEntries         = flattenTokens(breakpointTokens);
const typoSemEntries    = flattenTypographyComposites(typoSemTokens);

// ─── Primitive lookup maps ─────────────────────────────────────────────────────

// Unified map: primitive token path → { tempId, resolvedType }
// Used when resolving alias references in semantic tokens.
const primLookup = {};

for (const { path: p, value, dtcgType } of colourPrimEntries) {
  primLookup[p] = { id: tempId('prim', p), resolvedType: 'COLOR' };
}
for (const { path: p, value, dtcgType } of typoPrimEntries) {
  const rType = figmaResolvedType(dtcgType, value);
  primLookup[p] = { id: tempId('prim', p), resolvedType: rType };
}
for (const { path: p, value, dtcgType } of bpEntries) {
  primLookup[p] = { id: tempId('prim', p), resolvedType: 'FLOAT' };
}

// ─── Collections & modes ───────────────────────────────────────────────────────

const COLL_PRIM_ID   = 'coll__primitives';
const COLL_SEM_ID    = 'coll__sr';
const MODE_PRIM_ID   = 'mode__prim_default';
const MODE_SEM_ID    = 'mode__sr_default';

const variableCollections = [
  { action: 'CREATE', id: COLL_PRIM_ID, name: 'Primitives',    initialModeId: MODE_PRIM_ID },
  { action: 'CREATE', id: COLL_SEM_ID,  name: 'Single Record', initialModeId: MODE_SEM_ID  },
];

const variableModes = [
  { action: 'UPDATE', id: MODE_PRIM_ID, name: 'Default', variableCollectionId: COLL_PRIM_ID },
  { action: 'UPDATE', id: MODE_SEM_ID,  name: 'Default', variableCollectionId: COLL_SEM_ID  },
];

const variables          = [];
const variableModeValues = [];
const warnings           = [];

// ─── Primitives: colour ────────────────────────────────────────────────────────

for (const { path: tokenPath, value } of colourPrimEntries) {
  const { id } = primLookup[tokenPath];
  variables.push({
    action: 'CREATE',
    id,
    name: colourPrimToFigmaName(tokenPath),
    variableCollectionId: COLL_PRIM_ID,
    resolvedType: 'COLOR',
    hiddenFromPublishing: true,
    scopes: ['ALL_SCOPES'],
  });
  variableModeValues.push({ variableId: id, modeId: MODE_PRIM_ID, value: hexToRgba(value) });
}

// ─── Primitives: typography scale ─────────────────────────────────────────────

for (const { path: tokenPath, value, dtcgType } of typoPrimEntries) {
  const { id, resolvedType } = primLookup[tokenPath];

  // Semantic hint for scopes
  let hint = 'other';
  if (tokenPath.includes('size'))           hint = 'fontSize';
  else if (tokenPath.includes('line-height')) hint = 'lineHeight';
  else if (tokenPath.includes('letter-spacing') && resolvedType === 'FLOAT') hint = 'letterSpacing';
  else if (tokenPath.includes('family'))    hint = 'fontFamily';

  variables.push({
    action: 'CREATE',
    id,
    name: genericPrimToFigmaName(tokenPath),
    variableCollectionId: COLL_PRIM_ID,
    resolvedType,
    hiddenFromPublishing: true,
    scopes: figmaScopes(resolvedType, hint),
  });
  variableModeValues.push({
    variableId: id,
    modeId: MODE_PRIM_ID,
    value: toFigmaValue(resolvedType, value),
  });
}

// ─── Primitives: breakpoints ───────────────────────────────────────────────────

for (const { path: tokenPath, value } of bpEntries) {
  const { id } = primLookup[tokenPath];
  variables.push({
    action: 'CREATE',
    id,
    name: genericPrimToFigmaName(tokenPath),
    variableCollectionId: COLL_PRIM_ID,
    resolvedType: 'FLOAT',
    hiddenFromPublishing: true,
    scopes: figmaScopes('FLOAT', 'breakpoint'),
  });
  variableModeValues.push({
    variableId: id,
    modeId: MODE_PRIM_ID,
    value: toFigmaValue('FLOAT', value),
  });
}

// ─── Single Record: colour semantics ──────────────────────────────────────────

for (const { path: tokenPath, value: aliasRef } of colourSemEntries) {
  const match = aliasRef.match(/^\{(.+)\}$/);
  if (!match) {
    warnings.push(`Colour semantic "${tokenPath}": "${aliasRef}" is not an alias — skipped.`);
    continue;
  }
  const prim = primLookup[match[1]];
  if (!prim) {
    warnings.push(`Colour semantic "${tokenPath}": no primitive found for "${match[1]}" — skipped.`);
    continue;
  }

  const id = tempId('sem', tokenPath);
  variables.push({
    action: 'CREATE',
    id,
    name: colourSemToFigmaName(tokenPath),
    variableCollectionId: COLL_SEM_ID,
    resolvedType: 'COLOR',
    hiddenFromPublishing: false,
    scopes: ['ALL_SCOPES'],
  });
  variableModeValues.push({
    variableId: id,
    modeId: MODE_SEM_ID,
    value: { type: 'VARIABLE_ALIAS', id: prim.id },
  });
}

// ─── Single Record: typography semantics ──────────────────────────────────────
//
// Composite typography tokens are flattened into one variable per property.
// Each variable aliases the corresponding primitive variable.
// resolvedType is inherited from the referenced primitive.

for (const { compositePath, propKey, ref } of typoSemEntries) {
  const match = ref.match(/^\{(.+)\}$/);
  if (!match) {
    warnings.push(`Typography semantic "${compositePath}.${propKey}": "${ref}" is not an alias — skipped.`);
    continue;
  }
  const primPath = match[1];
  const prim     = primLookup[primPath];
  if (!prim) {
    warnings.push(`Typography semantic "${compositePath}.${propKey}": no primitive for "${primPath}" — skipped.`);
    continue;
  }

  const id = tempId('sem', `${compositePath}.${propKey}`);
  variables.push({
    action: 'CREATE',
    id,
    name: typoSemToFigmaName(compositePath, propKey),
    variableCollectionId: COLL_SEM_ID,
    resolvedType: prim.resolvedType,
    hiddenFromPublishing: false,
    scopes: figmaScopes(prim.resolvedType, propKey),
  });
  variableModeValues.push({
    variableId: id,
    modeId: MODE_SEM_ID,
    value: { type: 'VARIABLE_ALIAS', id: prim.id },
  });
}

// ─── Warnings ─────────────────────────────────────────────────────────────────

if (warnings.length) {
  console.warn('\nWarnings:');
  warnings.forEach(w => console.warn(' ⚠', w));
}

// ─── Push to Figma API ─────────────────────────────────────────────────────────

const payload = { variableCollections, variableModes, variables, variableModeValues };

async function push() {
  const counts = {
    colourPrim:  colourPrimEntries.length,
    typoPrim:    typoPrimEntries.length,
    breakpoints: bpEntries.length,
    colourSem:   colourSemEntries.length,
    typoSem:     typoSemEntries.length,
  };
  const totalPrim = counts.colourPrim + counts.typoPrim + counts.breakpoints;
  const totalSem  = counts.colourSem  + counts.typoSem;

  console.log('\nSingle Record Design System — Figma Variable Push');
  console.log(`  File key : ${FIGMA_FILE_KEY}`);
  console.log(`\n  Primitives collection (${totalPrim} variables):`);
  console.log(`    Colour      ${counts.colourPrim}`);
  console.log(`    Typography  ${counts.typoPrim}`);
  console.log(`    Breakpoints ${counts.breakpoints}`);
  console.log(`\n  Single Record collection (${totalSem} semantic variables):`);
  console.log(`    Colour      ${counts.colourSem}`);
  console.log(`    Typography  ${counts.typoSem} (${counts.typoSem / 5 | 0} tokens × 5 properties)`);
  console.log(`\n  Total variables: ${variables.length}\n`);

  const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables`;

  const res = await fetch(url, {
    method:  'POST',
    headers: { 'X-Figma-Token': FIGMA_TOKEN, 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    console.error(`Figma API error (HTTP ${res.status}):`);
    console.error(JSON.stringify(json, null, 2));
    process.exit(1);
  }

  const created = json.meta?.variables ? Object.keys(json.meta.variables).length : 'unknown';
  console.log(`Done. ${created} variables created in Figma.`);
  console.log(`\nOpen your Figma file → Local variables to verify.`);
  console.log(`\nVariable groups created:`);
  console.log(`  Primitives  →  Blue/, Cyan/, Navy/, Status/, Grey/, White/, Red/, Green/, Yellow/, Info Blue/, Focus Yellow/`);
  console.log(`                 Font/Family/, Font/Weight/, Font/Size/, Font/Line Height/, Font/Letter Spacing/`);
  console.log(`                 Breakpoint/`);
  console.log(`  Single Record → Interactive/, Surface/, Text/, Border/, Status/`);
  console.log(`                  Typography/Heading XL/, Typography/Heading L/, ... Typography/Caption/`);
}

push().catch(err => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
