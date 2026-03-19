#!/usr/bin/env node
/**
 * push-variables.js
 *
 * Pushes DHCW design token colours to Figma as Variables via the REST API.
 *
 * Creates two collections in the target Figma file:
 *   - "Primitives"  raw palette values (hidden from publishing)
 *   - "DHCW"        semantic aliases referencing Primitives
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
 *   - This script is additive (CREATE only). Run it once on a fresh Figma file,
 *     or delete existing Primitives / DHCW collections before re-running.
 *   - Primitive variables are marked hiddenFromPublishing so they don't
 *     appear in the public library — only DHCW semantic tokens are exposed.
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

const primitiveTokens = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'foundations/tokens/primitives/color.json'), 'utf8')
);
const semanticTokens = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'foundations/tokens/semantic/color.json'), 'utf8')
);

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Convert a 6-digit hex colour to Figma's { r, g, b, a } RGBA (0–1 range). */
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
 * Flatten a nested W3C Design Token object into a flat array of
 * { path: string, value: string } entries. Skips $-prefixed metadata keys.
 */
function flattenTokens(obj, prefix = '') {
  const results = [];
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const tokenPath = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && '$value' in val) {
      results.push({ path: tokenPath, value: val.$value });
    } else if (val && typeof val === 'object') {
      results.push(...flattenTokens(val, tokenPath));
    }
  }
  return results;
}

/**
 * Convert a primitive token path to a Figma variable name.
 * e.g.  color.blue.900          → Blue/900
 *       color.info-blue.default → Info Blue
 *       color.info-blue.100     → Info Blue/100
 *       color.white.default     → White
 */
function primitivePathToFigmaName(tokenPath) {
  const parts = tokenPath.replace(/^color\./, '').split('.');
  return parts
    .filter(p => p !== 'default')
    .map(p => p.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '))
    .join('/');
}

/**
 * Convert a semantic token path to a Figma variable name.
 * e.g.  dhcw.color.interactive.primary        → Interactive/Primary
 *       dhcw.color.status.critical-surface    → Status/Critical Surface
 */
function semanticPathToFigmaName(tokenPath) {
  const parts = tokenPath.replace(/^dhcw\.color\./, '').split('.');
  return parts
    .map(p => p.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '))
    .join('/');
}

/** Generate a stable temp ID from a token path for use within a single API payload. */
function tempId(prefix, tokenPath) {
  return `${prefix}__${tokenPath.replace(/[^a-z0-9]/gi, '_')}`;
}

// ─── Resolve token entries ─────────────────────────────────────────────────────

const primitiveEntries = flattenTokens(primitiveTokens);
const semanticEntries  = flattenTokens(semanticTokens);

// Map: primitive token path → its temp variable ID (for alias resolution)
const primitiveIdByPath = {};
for (const { path: p } of primitiveEntries) {
  primitiveIdByPath[p] = tempId('prim', p);
}

// ─── Build Figma API payload ───────────────────────────────────────────────────

const COLL_PRIM_ID = 'coll__primitives';
const COLL_SEM_ID  = 'coll__dhcw';
const MODE_PRIM_ID = 'mode__primitives_default';
const MODE_SEM_ID  = 'mode__dhcw_default';

const variableCollections = [
  {
    action: 'CREATE',
    id: COLL_PRIM_ID,
    name: 'Primitives',
    initialModeId: MODE_PRIM_ID,
  },
  {
    action: 'CREATE',
    id: COLL_SEM_ID,
    name: 'DHCW',
    initialModeId: MODE_SEM_ID,
  },
];

// Rename the auto-created initial modes to "Default"
const variableModes = [
  {
    action: 'UPDATE',
    id: MODE_PRIM_ID,
    name: 'Default',
    variableCollectionId: COLL_PRIM_ID,
  },
  {
    action: 'UPDATE',
    id: MODE_SEM_ID,
    name: 'Default',
    variableCollectionId: COLL_SEM_ID,
  },
];

const variables          = [];
const variableModeValues = [];

// ── Primitive variables ────────────────────────────────────────────────────────
for (const { path: tokenPath, value: hex } of primitiveEntries) {
  const id = primitiveIdByPath[tokenPath];

  variables.push({
    action: 'CREATE',
    id,
    name: primitivePathToFigmaName(tokenPath),
    variableCollectionId: COLL_PRIM_ID,
    resolvedType: 'COLOR',
    hiddenFromPublishing: true,   // internal use only
    scopes: ['ALL_SCOPES'],
  });

  variableModeValues.push({
    variableId: id,
    modeId: MODE_PRIM_ID,
    value: hexToRgba(hex),
  });
}

// ── Semantic variables (aliases) ───────────────────────────────────────────────
const warnings = [];

for (const { path: tokenPath, value: aliasRef } of semanticEntries) {
  // aliasRef is "{color.blue.800}" — extract the inner path
  const match = aliasRef.match(/^\{(.+)\}$/);
  if (!match) {
    warnings.push(`Skipped "${tokenPath}": value "${aliasRef}" is not an alias reference.`);
    continue;
  }

  const primitivePath   = match[1];
  const primitiveVarId  = primitiveIdByPath[primitivePath];

  if (!primitiveVarId) {
    warnings.push(`Skipped "${tokenPath}": no primitive found for "${primitivePath}".`);
    continue;
  }

  const id = tempId('sem', tokenPath);

  variables.push({
    action: 'CREATE',
    id,
    name: semanticPathToFigmaName(tokenPath),
    variableCollectionId: COLL_SEM_ID,
    resolvedType: 'COLOR',
    hiddenFromPublishing: false,  // exposed in library
    scopes: ['ALL_SCOPES'],
  });

  variableModeValues.push({
    variableId: id,
    modeId: MODE_SEM_ID,
    value: {
      type: 'VARIABLE_ALIAS',
      id: primitiveVarId,
    },
  });
}

if (warnings.length) {
  console.warn('\nWarnings:');
  warnings.forEach(w => console.warn(' ⚠', w));
}

const payload = { variableCollections, variableModes, variables, variableModeValues };

// ─── Push to Figma API ─────────────────────────────────────────────────────────

async function push() {
  const primitiveCount = primitiveEntries.length;
  const semanticCount  = variables.length - primitiveCount;

  console.log(`\nDHCW Design System — Figma Variable Push`);
  console.log(`  File key : ${FIGMA_FILE_KEY}`);
  console.log(`  Collections: Primitives (${primitiveCount} vars), DHCW (${semanticCount} vars)`);
  console.log(`  Total variables: ${variables.length}\n`);

  const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Figma-Token': FIGMA_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    console.error(`Figma API error (HTTP ${res.status}):`);
    console.error(JSON.stringify(json, null, 2));
    process.exit(1);
  }

  const createdVarCount = json.meta?.variables
    ? Object.keys(json.meta.variables).length
    : 'unknown';

  console.log(`Done. ${createdVarCount} variables created in Figma.`);
  console.log(`\nOpen your Figma file → Local variables to verify.`);
}

push().catch(err => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
