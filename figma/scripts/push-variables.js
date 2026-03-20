#!/usr/bin/env node
/**
 * push-variables.js  v2
 *
 * Pushes DHCW design tokens to Figma as Variables via the REST API.
 *
 * v2 changes:
 *   - Upsert support: fetches existing variables first, UPDATEs matching
 *     ones, CREATEs new ones. Safe to re-run without deleting collections.
 *   - Spacing tokens added: primitives (space.*) + semantic (spacing.*)
 *
 * Creates / maintains two collections in the target Figma file:
 *   "Primitives"    — raw values (colour, typography, spacing, breakpoints)
 *                     Hidden from publishing.
 *   "Single Record" — semantic aliases referencing Primitives
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
 *   - Composite typography tokens are flattened into individual property
 *     variables (the Figma Variables API has no composite typography type).
 *     Use Figma Text Styles for fully-composed type styles.
 *   - em-based letter-spacing values are pushed as STRING variables.
 *   - Spacing and breakpoint variables use GAP + WIDTH_HEIGHT scopes so
 *     they appear in auto-layout and sizing pickers only, not font pickers.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Environment ───────────────────────────────────────────────────────────────

const FIGMA_TOKEN    = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error('Error: required environment variables are not set.\n');
  console.error('  FIGMA_TOKEN     — Personal access token with Variables Read + Write scope');
  console.error('  FIGMA_FILE_KEY  — Key from the Figma file URL\n');
  console.error('Example:');
  console.error('  FIGMA_TOKEN=figd_xxx FIGMA_FILE_KEY=AbCdEf node figma/scripts/push-variables.js');
  process.exit(1);
}

// ─── Load token files ──────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '../..');
const load = rel => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));

const colourPrimTokens  = load('foundations/tokens/primitives/color.json');
const colourSemTokens   = load('foundations/tokens/semantic/color.json');
const typoPrimTokens    = load('foundations/tokens/primitives/typography.json');
const typoSemTokens     = load('foundations/tokens/semantic/typography.json');
const spacingPrimTokens = load('foundations/tokens/primitives/spacing.json');
const spacingSemTokens  = load('foundations/tokens/semantic/spacing.json');
const breakpointTokens  = load('foundations/tokens/breakpoints.json');

// ─── Value helpers ─────────────────────────────────────────────────────────────

/** Convert a 6-digit hex to Figma's { r, g, b, a } (0–1 range). */
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

/** Determine Figma resolvedType from a W3C DTCG $type and its value. */
function figmaResolvedType(dtcgType, value) {
  if (dtcgType === 'fontFamily') return 'STRING';
  if (dtcgType === 'fontWeight') return 'FLOAT';
  if (dtcgType === 'dimension') {
    return (typeof value === 'string' && value.includes('em')) ? 'STRING' : 'FLOAT';
  }
  if (dtcgType === 'color') return 'COLOR';
  return 'STRING';
}

/** Convert a W3C token value to the raw value Figma expects. */
function toFigmaValue(resolvedType, value) {
  if (resolvedType === 'FLOAT') {
    if (value === '0' || value === '0px') return 0;
    const n = parseFloat(value);
    if (isNaN(n)) throw new Error(`Cannot convert "${value}" to FLOAT`);
    return n;
  }
  if (resolvedType === 'STRING') return Array.isArray(value) ? value.join(', ') : String(value);
  if (resolvedType === 'COLOR')  return hexToRgba(value);
  return value;
}

/**
 * Variable scopes tell Figma where a variable can be applied.
 * Spacing/breakpoints use GAP + WIDTH_HEIGHT to avoid cluttering font pickers.
 */
function figmaScopes(resolvedType, hint) {
  if (resolvedType === 'COLOR')  return ['ALL_SCOPES'];
  if (resolvedType === 'STRING') return hint === 'fontFamily' ? ['FONT_FAMILY'] : ['ALL_SCOPES'];
  if (resolvedType === 'FLOAT') {
    if (hint === 'fontSize')      return ['FONT_SIZE'];
    if (hint === 'lineHeight')    return ['LINE_HEIGHT'];
    if (hint === 'letterSpacing') return ['LETTER_SPACING'];
    if (hint === 'spacing')       return ['GAP', 'WIDTH_HEIGHT'];
    if (hint === 'breakpoint')    return ['WIDTH_HEIGHT'];
    return ['ALL_SCOPES'];
  }
  return ['ALL_SCOPES'];
}

// ─── ID helpers ────────────────────────────────────────────────────────────────

/** Generate a stable temp ID for use within a single API payload. */
function tempId(ns, tokenPath) {
  return `${ns}__${tokenPath.replace(/[^a-z0-9]/gi, '_')}`;
}

// ─── Token flatteners ──────────────────────────────────────────────────────────

/** Flatten a nested W3C Design Token object into leaf entries. */
function flattenTokens(obj, prefix = '') {
  const out = [];
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const tp = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && '$value' in val) {
      out.push({ path: tp, value: val.$value, dtcgType: val.$type || null });
    } else if (val && typeof val === 'object') {
      out.push(...flattenTokens(val, tp));
    }
  }
  return out;
}

/**
 * Flatten composite typography tokens into individual per-property entries.
 * Returns Array<{ compositePath, propKey, ref }> where ref is a W3C alias.
 */
function flattenTypographyComposites(obj, prefix = '') {
  const out = [];
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const tp = prefix ? `${prefix}.${key}` : key;
    if (val?.$type === 'typography' && typeof val.$value === 'object') {
      for (const [propKey, ref] of Object.entries(val.$value)) {
        out.push({ compositePath: tp, propKey, ref });
      }
    } else if (val && typeof val === 'object') {
      out.push(...flattenTypographyComposites(val, tp));
    }
  }
  return out;
}

// ─── Naming conventions ────────────────────────────────────────────────────────

// Size abbreviations that should be fully uppercased in Figma names
const ABBR = new Set(['xs', 'sm', 'md', 'lg', 'xl']);

function titleCase(str) {
  return str.split('-').map(w =>
    ABBR.has(w.toLowerCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
}

// color.blue.900          → Blue/900
// color.info-blue.default → Info Blue
// color.white.default     → White
function colourPrimToFigmaName(p) {
  return p.replace(/^color\./, '').split('.').filter(s => s !== 'default').map(titleCase).join('/');
}

// sr.color.interactive.primary     → Interactive/Primary
// sr.color.status.critical-surface → Status/Critical Surface
function colourSemToFigmaName(p) {
  return p.replace(/^sr\.color\./, '').split('.').map(titleCase).join('/');
}

// font.size.48           → Font/Size/48
// breakpoint.desktop.min → Breakpoint/Desktop/Min
function genericPrimToFigmaName(p) {
  return p.split('.').map(titleCase).join('/');
}

// sr.typography.heading-xl.desktop, fontSize → Typography/Heading XL/Desktop/Font Size
function typoSemToFigmaName(compositePath, propKey) {
  const labels = {
    fontFamily:    'Font Family',
    fontSize:      'Font Size',
    lineHeight:    'Line Height',
    fontWeight:    'Font Weight',
    letterSpacing: 'Letter Spacing',
  };
  const parts = compositePath.replace(/^sr\.typography\./, '').split('.').map(titleCase);
  return `Typography/${parts.join('/')}/${labels[propKey] || titleCase(propKey)}`;
}

// space.4  → Space/4
function spacingPrimToFigmaName(p) {
  return p.split('.').map(titleCase).join('/');
}

// spacing.component.xs        → Spacing/Component/XS
// spacing.form.field-gap      → Spacing/Form/Field Gap
// spacing.layout.section      → Spacing/Layout/Section
function spacingSemToFigmaName(p) {
  return p.split('.').map(titleCase).join('/');
}

// ─── Flatten all token sources ─────────────────────────────────────────────────

const colourPrimEntries  = flattenTokens(colourPrimTokens);
const colourSemEntries   = flattenTokens(colourSemTokens);
const typoPrimEntries    = flattenTokens(typoPrimTokens);
const typoSemEntries     = flattenTypographyComposites(typoSemTokens);
const spacingPrimEntries = flattenTokens(spacingPrimTokens);
const spacingSemEntries  = flattenTokens(spacingSemTokens);
const bpEntries          = flattenTokens(breakpointTokens);

// ─── Fetch existing Figma variables ────────────────────────────────────────────

/**
 * GET the file's existing local variables.
 * Returns:
 *   collections: { [name]: { id, modes: { [modeName]: modeId } } }
 *   variables:   { [`${collectionId}/${figmaName}`]: variableId }
 */
async function fetchExisting() {
  const res = await fetch(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`,
    { headers: { 'X-Figma-Token': FIGMA_TOKEN } }
  );

  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    console.warn(`  ⚠  Could not fetch existing variables (HTTP ${res.status}${j.message ? ': ' + j.message : ''}) — all will be CREATEd.`);
    return { collections: {}, variables: {} };
  }

  const json        = await res.json();
  const collections = {};
  const variables   = {};

  for (const coll of Object.values(json.meta?.variableCollections ?? {})) {
    const modes = {};
    for (const m of coll.modes ?? []) modes[m.name] = m.modeId;
    collections[coll.name] = { id: coll.id, modes };
  }

  for (const v of Object.values(json.meta?.variables ?? {})) {
    if (!v.remote) variables[`${v.variableCollectionId}/${v.name}`] = v.id;
  }

  const collCount = Object.keys(collections).length;
  const varCount  = Object.keys(variables).length;
  if (collCount) {
    console.log(`  Found ${varCount} existing variable(s) across ${collCount} collection(s)`);
    console.log(`  → Matching variables will be UPDATEd; new variables will be CREATEd.\n`);
  } else {
    console.log(`  No existing SR collections found — all variables will be CREATEd.\n`);
  }

  return { collections, variables };
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function push() {
  console.log('\nSingle Record Design System — Figma Variable Push  v2');
  console.log('─'.repeat(54));
  console.log(`  File key : ${FIGMA_FILE_KEY}\n`);

  const existing = await fetchExisting();

  // ── Resolve collection and mode IDs ──────────────────────────────────────────
  // Use real Figma IDs for existing collections/modes; temp IDs for new ones.

  const existingPrimColl = existing.collections['Primitives'];
  const existingSemColl  = existing.collections['Single Record'];

  const COLL_PRIM_ID = existingPrimColl?.id                   ?? 'coll__primitives';
  const COLL_SEM_ID  = existingSemColl?.id                    ?? 'coll__sr';
  const MODE_PRIM_ID = existingPrimColl?.modes?.['Default']   ?? 'mode__prim_default';
  const MODE_SEM_ID  = existingSemColl?.modes?.['Default']    ?? 'mode__sr_default';

  // ── Helper: resolve variable ID ───────────────────────────────────────────────
  // If a variable with this name exists in this collection, return its real ID.
  // Otherwise return a stable temp ID for use within this payload.

  function resolveVarId(collId, figmaName, ns, tokenPath) {
    const existId = existing.variables[`${collId}/${figmaName}`];
    return { id: existId ?? tempId(ns, tokenPath), isExisting: !!existId };
  }

  // ── Build primitive lookup ────────────────────────────────────────────────────
  // Maps token path → { id, resolvedType } for use when resolving semantic aliases.

  const primLookup = {};

  function registerPrim(collId, figmaName, ns, tokenPath, resolvedType) {
    const { id } = resolveVarId(collId, figmaName, ns, tokenPath);
    primLookup[tokenPath] = { id, resolvedType };
  }

  for (const { path: p } of colourPrimEntries)
    registerPrim(COLL_PRIM_ID, colourPrimToFigmaName(p), 'prim', p, 'COLOR');

  for (const { path: p, value, dtcgType } of typoPrimEntries)
    registerPrim(COLL_PRIM_ID, genericPrimToFigmaName(p), 'prim', p, figmaResolvedType(dtcgType, value));

  for (const { path: p } of spacingPrimEntries)
    registerPrim(COLL_PRIM_ID, spacingPrimToFigmaName(p), 'prim_sp', p, 'FLOAT');

  for (const { path: p } of bpEntries)
    registerPrim(COLL_PRIM_ID, genericPrimToFigmaName(p), 'prim', p, 'FLOAT');

  // ── Collections ──────────────────────────────────────────────────────────────

  const variableCollections = [
    {
      action:               existingPrimColl ? 'UPDATE' : 'CREATE',
      id:                   COLL_PRIM_ID,
      name:                 'Primitives',
      hiddenFromPublishing: true,
      ...(existingPrimColl ? {} : { initialModeId: MODE_PRIM_ID }),
    },
    {
      action:               existingSemColl ? 'UPDATE' : 'CREATE',
      id:                   COLL_SEM_ID,
      name:                 'Single Record',
      hiddenFromPublishing: false,
      ...(existingSemColl ? {} : { initialModeId: MODE_SEM_ID }),
    },
  ];

  const variableModes = [
    { action: 'UPDATE', id: MODE_PRIM_ID, name: 'Default', variableCollectionId: COLL_PRIM_ID },
    { action: 'UPDATE', id: MODE_SEM_ID,  name: 'Default', variableCollectionId: COLL_SEM_ID  },
  ];

  // ── Variable builder ─────────────────────────────────────────────────────────

  const variables          = [];
  const variableModeValues = [];
  const warnings           = [];

  function addVar({ collId, modeId, figmaName, ns, tokenPath, resolvedType, figmaValue, hidden, scopes }) {
    const { id, isExisting } = resolveVarId(collId, figmaName, ns, tokenPath);

    const entry = {
      action:               isExisting ? 'UPDATE' : 'CREATE',
      id,
      name:                 figmaName,
      hiddenFromPublishing: hidden,
      scopes,
    };
    // resolvedType and variableCollectionId are immutable — only set on CREATE
    if (!isExisting) {
      entry.variableCollectionId = collId;
      entry.resolvedType         = resolvedType;
    }

    variables.push(entry);
    variableModeValues.push({ variableId: id, modeId, value: figmaValue });
  }

  // ── Primitives: colour ───────────────────────────────────────────────────────

  for (const { path: p, value } of colourPrimEntries) {
    addVar({
      collId: COLL_PRIM_ID, modeId: MODE_PRIM_ID,
      figmaName: colourPrimToFigmaName(p), ns: 'prim', tokenPath: p,
      resolvedType: 'COLOR', figmaValue: hexToRgba(value),
      hidden: true, scopes: ['ALL_SCOPES'],
    });
  }

  // ── Primitives: typography ───────────────────────────────────────────────────

  for (const { path: p, value, dtcgType } of typoPrimEntries) {
    const resolvedType = figmaResolvedType(dtcgType, value);
    let hint = 'other';
    if (p.includes('size'))           hint = 'fontSize';
    else if (p.includes('line-height')) hint = 'lineHeight';
    else if (p.includes('letter-spacing') && resolvedType === 'FLOAT') hint = 'letterSpacing';
    else if (p.includes('family'))    hint = 'fontFamily';

    addVar({
      collId: COLL_PRIM_ID, modeId: MODE_PRIM_ID,
      figmaName: genericPrimToFigmaName(p), ns: 'prim', tokenPath: p,
      resolvedType, figmaValue: toFigmaValue(resolvedType, value),
      hidden: true, scopes: figmaScopes(resolvedType, hint),
    });
  }

  // ── Primitives: spacing ──────────────────────────────────────────────────────

  for (const { path: p, value } of spacingPrimEntries) {
    addVar({
      collId: COLL_PRIM_ID, modeId: MODE_PRIM_ID,
      figmaName: spacingPrimToFigmaName(p), ns: 'prim_sp', tokenPath: p,
      resolvedType: 'FLOAT', figmaValue: toFigmaValue('FLOAT', value),
      hidden: true, scopes: figmaScopes('FLOAT', 'spacing'),
    });
  }

  // ── Primitives: breakpoints ──────────────────────────────────────────────────

  for (const { path: p, value } of bpEntries) {
    addVar({
      collId: COLL_PRIM_ID, modeId: MODE_PRIM_ID,
      figmaName: genericPrimToFigmaName(p), ns: 'prim', tokenPath: p,
      resolvedType: 'FLOAT', figmaValue: toFigmaValue('FLOAT', value),
      hidden: true, scopes: figmaScopes('FLOAT', 'breakpoint'),
    });
  }

  // ── Semantic: colour ─────────────────────────────────────────────────────────

  for (const { path: p, value: aliasRef } of colourSemEntries) {
    const match = aliasRef.match(/^\{(.+)\}$/);
    if (!match) { warnings.push(`Colour sem "${p}": "${aliasRef}" is not an alias — skipped.`); continue; }
    const prim = primLookup[match[1]];
    if (!prim)  { warnings.push(`Colour sem "${p}": no primitive found for "${match[1]}" — skipped.`); continue; }

    addVar({
      collId: COLL_SEM_ID, modeId: MODE_SEM_ID,
      figmaName: colourSemToFigmaName(p), ns: 'sem', tokenPath: p,
      resolvedType: 'COLOR', figmaValue: { type: 'VARIABLE_ALIAS', id: prim.id },
      hidden: false, scopes: ['ALL_SCOPES'],
    });
  }

  // ── Semantic: typography (composite flattened) ───────────────────────────────

  for (const { compositePath, propKey, ref } of typoSemEntries) {
    const match = ref.match(/^\{(.+)\}$/);
    if (!match) { warnings.push(`Typo sem "${compositePath}.${propKey}": "${ref}" not an alias — skipped.`); continue; }
    const prim = primLookup[match[1]];
    if (!prim)  { warnings.push(`Typo sem "${compositePath}.${propKey}": no primitive for "${match[1]}" — skipped.`); continue; }

    addVar({
      collId: COLL_SEM_ID, modeId: MODE_SEM_ID,
      figmaName: typoSemToFigmaName(compositePath, propKey), ns: 'sem', tokenPath: `${compositePath}.${propKey}`,
      resolvedType: prim.resolvedType, figmaValue: { type: 'VARIABLE_ALIAS', id: prim.id },
      hidden: false, scopes: figmaScopes(prim.resolvedType, propKey),
    });
  }

  // ── Semantic: spacing ────────────────────────────────────────────────────────

  for (const { path: p, value: aliasRef } of spacingSemEntries) {
    const match = aliasRef.match(/^\{(.+)\}$/);
    if (!match) { warnings.push(`Spacing sem "${p}": "${aliasRef}" is not an alias — skipped.`); continue; }
    const prim = primLookup[match[1]];
    if (!prim)  { warnings.push(`Spacing sem "${p}": no primitive found for "${match[1]}" — skipped.`); continue; }

    addVar({
      collId: COLL_SEM_ID, modeId: MODE_SEM_ID,
      figmaName: spacingSemToFigmaName(p), ns: 'sem_sp', tokenPath: p,
      resolvedType: 'FLOAT', figmaValue: { type: 'VARIABLE_ALIAS', id: prim.id },
      hidden: false, scopes: figmaScopes('FLOAT', 'spacing'),
    });
  }

  // ── Warnings ─────────────────────────────────────────────────────────────────

  if (warnings.length) {
    console.warn('Warnings:');
    warnings.forEach(w => console.warn('  ⚠ ', w));
    console.warn('');
  }

  // ── Summary ──────────────────────────────────────────────────────────────────

  const creates = variables.filter(v => v.action === 'CREATE').length;
  const updates = variables.filter(v => v.action === 'UPDATE').length;

  console.log('  Primitives collection:');
  console.log(`    Colour        ${colourPrimEntries.length}`);
  console.log(`    Typography    ${typoPrimEntries.length}`);
  console.log(`    Spacing       ${spacingPrimEntries.length}`);
  console.log(`    Breakpoints   ${bpEntries.length}`);
  console.log(`    Subtotal      ${colourPrimEntries.length + typoPrimEntries.length + spacingPrimEntries.length + bpEntries.length}`);
  console.log('');
  console.log('  Single Record collection:');
  console.log(`    Colour        ${colourSemEntries.length}`);
  console.log(`    Typography    ${typoSemEntries.length}`);
  console.log(`    Spacing       ${spacingSemEntries.length}`);
  console.log(`    Subtotal      ${colourSemEntries.length + typoSemEntries.length + spacingSemEntries.length}`);
  console.log('');
  console.log(`  Action breakdown: ${creates} CREATE  ${updates} UPDATE`);
  console.log(`  Mode values to set: ${variableModeValues.length}`);
  console.log('');

  // ── POST to Figma API ─────────────────────────────────────────────────────────

  const payload = { variableCollections, variableModes, variables, variableModeValues };
  const url     = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables`;

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

  console.log('✓ Done. Open Figma → Local variables to verify.');
  console.log('');
  console.log('  Primitives (hidden)');
  console.log('    Blue/   Cyan/   Navy/   Red/   Green/   Yellow/');
  console.log('    Grey/   White/   Focus Yellow/   Info Blue/');
  console.log('    Font/   Space/   Breakpoint/');
  console.log('');
  console.log('  Single Record (published)');
  console.log('    Interactive/   Surface/   Text/   Border/   Status/');
  console.log('    Typography/   Spacing/');
}

push().catch(err => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
