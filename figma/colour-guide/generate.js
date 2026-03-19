#!/usr/bin/env node
/**
 * generate.js
 *
 * Reads the W3C Design Token JSON files and generates a self-contained
 * colour-guide.html documentation page suitable for browser preview
 * and Figma code-to-canvas capture.
 *
 * Usage:
 *   node figma/colour-guide/generate.js
 *
 * Output:
 *   figma/colour-guide/colour-guide.html
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');

const primitiveTokens = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'foundations/tokens/primitives/color.json'), 'utf8')
);
const semanticTokens = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'foundations/tokens/semantic/color.json'), 'utf8')
);

// ─── Flatten helpers ───────────────────────────────────────────────────────────

function flattenTokens(obj, prefix = '') {
  const results = [];
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const p = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && '$value' in val) {
      results.push({ path: p, value: val.$value, description: val.$description || '' });
    } else if (val && typeof val === 'object') {
      results.push(...flattenTokens(val, p));
    }
  }
  return results;
}

// ─── Colour utilities ──────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex, bgHex) {
  const fg = hexToRgb(hex), bg = hexToRgb(bgHex);
  const l1 = relativeLuminance(fg.r, fg.g, fg.b);
  const l2 = relativeLuminance(bg.r, bg.g, bg.b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function textColour(hex) {
  const { r, g, b } = hexToRgb(hex);
  const l = relativeLuminance(r, g, b);
  return l > 0.179 ? '#212B32' : '#FFFFFF';
}

// ─── Token data shaped for the template ───────────────────────────────────────

const PRIMITIVE_GROUPS = [
  {
    id: 'blue',
    label: 'Blue',
    description: 'NHS Wales Blue — primary brand',
    swatches: [
      { scale: '900', token: 'color.blue.900', hex: '#1E3050' },
      { scale: '800', token: 'color.blue.800', hex: '#325083', tag: 'Brand primary' },
      { scale: '700', token: 'color.blue.700', hex: '#3D6199' },
      { scale: '600', token: 'color.blue.600', hex: '#4C72AE' },
      { scale: '500', token: 'color.blue.500', hex: '#5C6991' },
      { scale: '400', token: 'color.blue.400', hex: '#828DAC' },
      { scale: '300', token: 'color.blue.300', hex: '#AAB1C6' },
      { scale: '200', token: 'color.blue.200', hex: '#D4D8E2' },
      { scale: '100', token: 'color.blue.100', hex: '#ECEEF3' },
      { scale: '50',  token: 'color.blue.50',  hex: '#F4F5F8' },
    ],
  },
  {
    id: 'cyan',
    label: 'Cyan',
    description: 'DHCW Blue — secondary / accent',
    swatches: [
      { scale: '900', token: 'color.cyan.900', hex: '#0A6A84' },
      { scale: '800', token: 'color.cyan.800', hex: '#0D8BAD' },
      { scale: '700', token: 'color.cyan.700', hex: '#12A3C9', tag: 'Brand secondary' },
      { scale: '600', token: 'color.cyan.600', hex: '#71ACCD' },
      { scale: '500', token: 'color.cyan.500', hex: '#8DC0DA' },
      { scale: '400', token: 'color.cyan.400', hex: '#AFD4E5' },
      { scale: '300', token: 'color.cyan.300', hex: '#D6EAF2' },
      { scale: '100', token: 'color.cyan.100', hex: '#EBF5FA' },
      { scale: '50',  token: 'color.cyan.50',  hex: '#F4FAFC' },
    ],
  },
  {
    id: 'navy',
    label: 'Navy',
    description: 'DHCW Navy',
    swatches: [
      { scale: '900', token: 'color.navy.900', hex: '#1B294A' },
      { scale: '700', token: 'color.navy.700', hex: '#464C64' },
      { scale: '500', token: 'color.navy.500', hex: '#707488' },
      { scale: '300', token: 'color.navy.300', hex: '#9EA1AF' },
      { scale: '100', token: 'color.navy.100', hex: '#CDCFD6' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    description: 'Clinical and UI status colours',
    swatches: [
      { scale: 'red-600',       token: 'color.red.600',       hex: '#D5281B', tag: 'Critical' },
      { scale: 'red-100',       token: 'color.red.100',       hex: '#FCDBD9', tag: 'Critical surface' },
      { scale: 'green-600',     token: 'color.green.600',     hex: '#007F3B', tag: 'Success' },
      { scale: 'green-100',     token: 'color.green.100',     hex: '#D9EFE5', tag: 'Success surface' },
      { scale: 'yellow-500',    token: 'color.yellow.500',    hex: '#F8CA4D', tag: 'Warning' },
      { scale: 'yellow-100',    token: 'color.yellow.100',    hex: '#FDF6DC', tag: 'Warning surface' },
      { scale: 'info-blue',     token: 'color.info-blue',     hex: '#005AA8', tag: 'Info' },
      { scale: 'info-blue-100', token: 'color.info-blue.100', hex: '#D6E8F5', tag: 'Info surface' },
      { scale: 'focus',         token: 'color.focus-yellow',  hex: '#FFEB3B', tag: 'Focus ring' },
    ],
  },
  {
    id: 'neutral',
    label: 'Neutral',
    description: 'UI grey palette',
    swatches: [
      { scale: '900', token: 'color.grey.900', hex: '#212B32', tag: 'Primary text' },
      { scale: '600', token: 'color.grey.600', hex: '#4C6272', tag: 'Secondary text' },
      { scale: '200', token: 'color.grey.200', hex: '#D8DDE0', tag: 'Border' },
      { scale: '100', token: 'color.grey.100', hex: '#F0F4F5', tag: 'Surface' },
      { scale: 'white', token: 'color.white',  hex: '#FFFFFF' },
    ],
  },
];

const SEMANTIC_GROUPS = [
  {
    id: 'interactive',
    label: 'Interactive',
    rows: [
      { token: 'sr.color.interactive.primary',       hex: '#325083', alias: 'blue-800',    usage: 'Primary buttons, active navigation' },
      { token: 'sr.color.interactive.primary-hover', hex: '#1E3050', alias: 'blue-900',    usage: 'Hover state on primary elements' },
      { token: 'sr.color.interactive.secondary',     hex: '#1B294A', alias: 'navy-900',    usage: 'Secondary interactive elements' },
      { token: 'sr.color.interactive.link',          hex: '#005AA8', alias: 'info-blue',   usage: 'Inline hyperlinks' },
      { token: 'sr.color.interactive.destructive',   hex: '#D5281B', alias: 'red-600',     usage: 'Destructive actions, delete buttons' },
    ],
  },
  {
    id: 'surface',
    label: 'Surface',
    rows: [
      { token: 'sr.color.surface.default', hex: '#F0F4F5', alias: 'grey-100',  usage: 'Default page background' },
      { token: 'sr.color.surface.card',    hex: '#FFFFFF', alias: 'white',     usage: 'Cards, panels, modals' },
      { token: 'sr.color.surface.accent',  hex: '#EBF5FA', alias: 'cyan-100',  usage: 'Accent / highlight backgrounds' },
      { token: 'sr.color.surface.subtle',  hex: '#F4F5F8', alias: 'blue-50',   usage: 'Subtle section backgrounds' },
      { token: 'sr.color.surface.header',  hex: '#1B294A', alias: 'navy-900',  usage: 'Header bars, navigation' },
    ],
  },
  {
    id: 'text',
    label: 'Text',
    rows: [
      { token: 'sr.color.text.primary',   hex: '#212B32', alias: 'grey-900', usage: 'Body text, headings' },
      { token: 'sr.color.text.secondary', hex: '#4C6272', alias: 'grey-600', usage: 'Supporting text, captions, labels' },
      { token: 'sr.color.text.inverse',   hex: '#FFFFFF', alias: 'white',    usage: 'Text on dark backgrounds' },
    ],
  },
  {
    id: 'border',
    label: 'Border',
    rows: [
      { token: 'sr.color.border.default', hex: '#D8DDE0', alias: 'grey-200',     usage: 'Default input and card borders' },
      { token: 'sr.color.border.strong',  hex: '#4C6272', alias: 'grey-600',     usage: 'Dividers, strong section edges' },
      { token: 'sr.color.border.focus',   hex: '#FFEB3B', alias: 'focus-yellow', usage: 'Focus ring on all interactive elements' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    rows: [
      { token: 'sr.color.status.critical',         hex: '#D5281B', alias: 'red-600',       usage: 'Critical alerts, errors, invalid fields' },
      { token: 'sr.color.status.critical-surface', hex: '#FCDBD9', alias: 'red-100',       usage: 'Critical alert background' },
      { token: 'sr.color.status.success',          hex: '#007F3B', alias: 'green-600',     usage: 'Success confirmation, completed states' },
      { token: 'sr.color.status.success-surface',  hex: '#D9EFE5', alias: 'green-100',     usage: 'Success background' },
      { token: 'sr.color.status.warning',          hex: '#F8CA4D', alias: 'yellow-500',    usage: 'Warnings, attention required' },
      { token: 'sr.color.status.warning-surface',  hex: '#FDF6DC', alias: 'yellow-100',    usage: 'Warning background' },
      { token: 'sr.color.status.info',             hex: '#005AA8', alias: 'info-blue',     usage: 'Informational messages, in-progress' },
      { token: 'sr.color.status.info-surface',     hex: '#D6E8F5', alias: 'info-blue-100', usage: 'Info background' },
    ],
  },
];

// ─── HTML builders ─────────────────────────────────────────────────────────────

function swatchCard(s) {
  const fg = textColour(s.hex);
  const border = s.hex.toUpperCase() === '#FFFFFF' ? 'border:1px solid #D8DDE0;' : '';
  return `
    <div class="swatch-card">
      <div class="swatch-block" style="background:${s.hex};${border}color:${fg}">
        ${s.tag ? `<span class="swatch-tag">${s.tag}</span>` : ''}
      </div>
      <div class="swatch-meta">
        <span class="swatch-scale">${s.scale}</span>
        <span class="swatch-hex">${s.hex.toUpperCase()}</span>
      </div>
    </div>`;
}

function primitiveSection(g) {
  return `
    <section class="colour-group" id="${g.id}">
      <div class="group-header">
        <h3 class="group-label">${g.label}</h3>
        <p class="group-desc">${g.description}</p>
      </div>
      <div class="swatch-row">
        ${g.swatches.map(swatchCard).join('')}
      </div>
    </section>`;
}

function semanticRow(r) {
  const fg = textColour(r.hex);
  const border = r.hex.toUpperCase() === '#FFFFFF' ? 'border:1px solid #D8DDE0;' : '';
  return `
    <tr>
      <td><code class="token-name">${r.token}</code></td>
      <td>
        <div class="inline-swatch" style="background:${r.hex};${border}color:${fg}">
          <span>${r.hex.toUpperCase()}</span>
        </div>
      </td>
      <td class="alias-cell"><span class="alias-badge">${r.alias}</span></td>
      <td class="usage-cell">${r.usage}</td>
    </tr>`;
}

function semanticSection(g) {
  return `
    <section class="semantic-group" id="sr-${g.id}">
      <h3 class="semantic-group-label">${g.label}</h3>
      <table class="token-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Colour</th>
            <th>Alias</th>
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          ${g.rows.map(semanticRow).join('')}
        </tbody>
      </table>
    </section>`;
}

const navPrimitive = PRIMITIVE_GROUPS.map(g =>
  `<a href="#${g.id}">${g.label}</a>`).join('');
const navSemantic = SEMANTIC_GROUPS.map(g =>
  `<a href="#sr-${g.id}">${g.label}</a>`).join('');

// ─── Full HTML ─────────────────────────────────────────────────────────────────

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Colour Tokens — Single Record Design System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --grey-900: #212B32;
      --grey-600: #4C6272;
      --grey-200: #D8DDE0;
      --grey-100: #F0F4F5;
      --blue-800: #325083;
      --blue-50:  #F4F5F8;
      --navy-900: #1B294A;
      --white:    #FFFFFF;
      --page-max: 1280px;
      --page-pad: 64px;
    }

    body {
      font-family: 'Roboto', sans-serif;
      background: var(--white);
      color: var(--grey-900);
      font-size: 14px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Header ── */
    .site-header {
      background: var(--navy-900);
      padding: 16px var(--page-pad);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .site-mark {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }
    .site-mark-badge {
      background: #12A3C9;
      color: #fff;
      font-family: 'Roboto', sans-serif;
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 0.08em;
      padding: 4px 8px;
      border-radius: 4px;
    }
    .site-mark-name {
      color: rgba(255,255,255,0.85);
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.01em;
    }

    /* ── Hero ── */
    .hero {
      padding: 56px var(--page-pad) 40px;
      border-bottom: 1px solid var(--grey-200);
      max-width: var(--page-max);
      margin: 0 auto;
    }
    .hero-eyebrow {
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--blue-800);
      margin-bottom: 12px;
    }
    .hero-title {
      font-family: 'Roboto', sans-serif;
      font-weight: 900;
      font-size: 56px;
      line-height: 1.05;
      color: var(--grey-900);
      letter-spacing: -0.02em;
      margin-bottom: 16px;
    }
    .hero-subtitle {
      font-size: 16px;
      color: var(--grey-600);
      font-weight: 300;
      max-width: 560px;
      line-height: 1.6;
      margin-bottom: 32px;
    }

    /* ── Nav ── */
    .token-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0;
      font-size: 13px;
      align-items: center;
    }
    .nav-tier-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--grey-600);
      margin-right: 12px;
    }
    .token-nav a {
      color: var(--blue-800);
      text-decoration: none;
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 500;
      transition: background 0.15s;
    }
    .token-nav a:hover { background: var(--blue-50); }
    .nav-divider {
      width: 1px;
      height: 18px;
      background: var(--grey-200);
      margin: 0 8px;
    }

    /* ── Main layout ── */
    .main {
      max-width: var(--page-max);
      margin: 0 auto;
      padding: 0 var(--page-pad) 80px;
    }

    /* ── Tier headings ── */
    .tier-heading {
      padding: 48px 0 0;
      margin-bottom: 8px;
    }
    .tier-label {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--grey-600);
      margin-bottom: 6px;
    }
    .tier-label::before {
      content: '';
      display: block;
      width: 24px;
      height: 2px;
      background: var(--blue-800);
    }
    .tier-title {
      font-family: 'Roboto', sans-serif;
      font-weight: 700;
      font-size: 28px;
      color: var(--grey-900);
      letter-spacing: -0.01em;
      margin-bottom: 4px;
    }
    .tier-desc {
      font-size: 14px;
      color: var(--grey-600);
      margin-bottom: 0;
      font-weight: 300;
    }
    .tier-rule {
      height: 1px;
      background: var(--grey-200);
      border: none;
      margin: 24px 0 32px;
    }

    /* ── Primitive swatches ── */
    .colour-group {
      margin-bottom: 40px;
    }
    .group-header {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 14px;
    }
    .group-label {
      font-size: 16px;
      font-weight: 600;
      color: var(--grey-900);
    }
    .group-desc {
      font-size: 13px;
      color: var(--grey-600);
      font-weight: 400;
    }
    .swatch-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .swatch-card {
      display: flex;
      flex-direction: column;
      width: 108px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .swatch-block {
      height: 80px;
      display: flex;
      align-items: flex-end;
      padding: 6px 8px;
      position: relative;
    }
    .swatch-tag {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      opacity: 0.9;
      line-height: 1.2;
    }
    .swatch-meta {
      background: var(--white);
      border: 1px solid var(--grey-200);
      border-top: none;
      border-radius: 0 0 8px 8px;
      padding: 6px 8px 8px;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .swatch-scale {
      font-size: 12px;
      font-weight: 600;
      color: var(--grey-900);
      font-family: 'Roboto Mono', monospace;
    }
    .swatch-hex {
      font-size: 11px;
      color: var(--grey-600);
      font-family: 'Roboto Mono', monospace;
    }

    /* ── Semantic table ── */
    .semantic-group {
      margin-bottom: 40px;
    }
    .semantic-group-label {
      font-size: 16px;
      font-weight: 600;
      color: var(--grey-900);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .semantic-group-label::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--grey-200);
    }
    .token-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .token-table thead th {
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--grey-600);
      border-bottom: 2px solid var(--grey-200);
      padding: 8px 12px;
    }
    .token-table thead th:first-child { padding-left: 0; }
    .token-table tbody tr {
      border-bottom: 1px solid var(--grey-200);
    }
    .token-table tbody tr:last-child { border-bottom: none; }
    .token-table tbody td {
      padding: 12px 12px;
      vertical-align: middle;
    }
    .token-table tbody td:first-child { padding-left: 0; }
    .token-name {
      font-family: 'Roboto Mono', monospace;
      font-size: 12px;
      color: var(--navy-900);
      background: var(--blue-50);
      padding: 3px 7px;
      border-radius: 4px;
      white-space: nowrap;
    }
    .inline-swatch {
      width: 140px;
      height: 36px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 10px;
      font-family: 'Roboto Mono', monospace;
      font-size: 11px;
      font-weight: 500;
    }
    .alias-cell { white-space: nowrap; }
    .alias-badge {
      font-family: 'Roboto Mono', monospace;
      font-size: 11px;
      color: var(--grey-600);
      background: var(--grey-100);
      padding: 3px 7px;
      border-radius: 4px;
    }
    .usage-cell {
      color: var(--grey-600);
      max-width: 320px;
    }

    /* ── Footer ── */
    .site-footer {
      border-top: 1px solid var(--grey-200);
      padding: 24px var(--page-pad);
      max-width: var(--page-max);
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: var(--grey-600);
    }
    .site-footer a { color: var(--blue-800); text-decoration: none; }
  </style>
</head>
<body>

  <header class="site-header">
    <div class="site-mark">
      <span class="site-mark-badge">SR</span>
      <span class="site-mark-name">Single Record Design System</span>
    </div>
  </header>

  <div class="hero">
    <p class="hero-eyebrow">Foundations</p>
    <h1 class="hero-title">Colour Tokens</h1>
    <p class="hero-subtitle">
      A three-tier token architecture: primitives hold raw values, semantic tokens assign meaning.
      Components reference semantic tokens only.
    </p>
    <nav class="token-nav" aria-label="Jump to section">
      <span class="nav-tier-label">Tier 1</span>
      ${navPrimitive}
      <div class="nav-divider"></div>
      <span class="nav-tier-label">Tier 2</span>
      ${navSemantic}
    </nav>
  </div>

  <main class="main">

    <!-- ── Tier 1 ── -->
    <div class="tier-heading">
      <p class="tier-label">Tier 1</p>
      <h2 class="tier-title">Primitive Colours</h2>
      <p class="tier-desc">Raw palette values. Never reference these directly in components — use semantic tokens.</p>
    </div>
    <hr class="tier-rule">

    ${PRIMITIVE_GROUPS.map(primitiveSection).join('\n')}

    <!-- ── Tier 2 ── -->
    <div class="tier-heading">
      <p class="tier-label">Tier 2</p>
      <h2 class="tier-title">Semantic Tokens — <code style="font-size:0.8em;font-weight:400">sr.*</code></h2>
      <p class="tier-desc">All semantic tokens alias a primitive. Components and patterns use these exclusively.</p>
    </div>
    <hr class="tier-rule">

    ${SEMANTIC_GROUPS.map(semanticSection).join('\n')}

  </main>

  <footer class="site-footer">
    <span>Single Record Design System — DHCW</span>
    <span>Generated from <code>foundations/tokens/primitives/color.json</code> + <code>foundations/tokens/semantic/color.json</code></span>
  </footer>

</body>
</html>`;

// ─── Write output ───────────────────────────────────────────────────────────────

const outPath = path.join(__dirname, 'colour-guide.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log(`Written: ${outPath}`);
