# Figma

This directory manages the relationship between Figma design assets and the design system codebase.

---

## Contents

| File | Purpose |
|---|---|
| `variable-mapping.md` | Maps Figma variables to design token names |
| `handoff-conventions.md` | Rules for preparing designs for engineering handoff |
| `scripts/push-variables.js` | Pushes colour tokens to Figma via the Variables REST API |
| `plugins/colour-palette/` | One-run Figma plugin to generate the colour palette page (interim — see below) |

---

## Figma Library Overview

The design system Figma library is the **source of truth** for visual design decisions. All component specs in `/components/` and token definitions in `/foundations/` must match what is in Figma.

If Figma and this repository conflict, raise it with the design lead. Do not silently resolve discrepancies in either direction.

---

## Figma to Code Workflow

```
Figma variable → Token name in /foundations/ → Code variable / class
```

1. Tokens are defined in Figma as **variables** (Figma's native variable system)
2. Variables are exported and mapped in `variable-mapping.md`
3. Engineers consume tokens via CSS custom properties, MAUI styles, or Blazor CSS variables
4. Any token change must be updated in Figma **and** this repository simultaneously

---

## Pushing Variables to Figma

The script at `figma/scripts/push-variables.js` reads the W3C Design Token JSON files and creates Figma variables via the REST API. No dependencies — requires Node.js 18+ only.

### One-time setup

1. Generate a personal access token in Figma: **Settings → Personal access tokens**
   - Enable the **"Variables: Read and Write"** scope
2. Copy your Figma file key from the URL:
   `https://figma.com/design/<FILE_KEY>/...`

### Run

```bash
FIGMA_TOKEN=figd_xxxx FIGMA_FILE_KEY=AbCdEfGhIj node figma/scripts/push-variables.js
```

This creates two collections in the Figma file:

| Collection | Contents | Published |
|---|---|---|
| `Primitives` | 38 raw palette variables | Hidden (internal) |
| `Single Record` | 23 semantic alias variables | Visible in library |

### Re-running

The script is CREATE-only. To re-run after changes:
1. Open the Figma file → **Local variables**
2. Delete the `Primitives` and `Single Record` collections
3. Re-run the script

### What it does not do

- Does not push spacing, typography, or elevation tokens (added later when those JSON files exist)
- Does not create component-level (Tier 3) tokens
- Does not modify existing variables — only creates new ones

---

## Ways of Working — Figma Tooling

There are three distinct ways this system interacts with Figma. Each has a specific role. Use the right tool for the job.

| Task | Tool | Reason |
|---|---|---|
| Push design tokens (variables) | **REST API** via `scripts/push-variables.js` + GitHub Actions | Variables API is the only REST endpoint that supports writes |
| Read design content (specs, layouts, screenshots) | **Figma MCP** (`get_design_context`, `get_metadata`, `get_screenshot`) | MCP provides structured output optimised for code generation |
| Write design content to canvas | **Code-to-canvas** via hosted static HTML + Figma import | MCP tools are read-only for design files; REST API has no design-node write endpoint |
| Generate documentation pages | `generate.js` → `colour-guide.html` → hosted URL → paste into Figma | Self-contained HTML, previewed at htmlpreview.github.io |

### MCP write capability — confirmed findings

After full investigation across all available MCP tools:

- `get_design_context`, `get_metadata`, `get_screenshot`, `get_variable_defs` — **read only**
- `generate_diagram` — **FigJam only** (Mermaid diagrams, not Figma design files)
- `send_code_connect_mappings`, `add_code_connect_map` — **Code Connect only**
- `create_design_system_rules` — generates a rules prompt, does not write to canvas

The Figma REST API has no endpoint for creating design nodes (frames, shapes, text). Write access to the design canvas requires either a Figma plugin running inside the app, or manual Figma UI interaction.

### Current status

| Capability | Approach | Status |
|---|---|---|
| Push colour variables | REST API → GitHub Actions | ✅ Live |
| Read design content | Figma MCP | ✅ Live |
| Write design content to canvas | Code-to-canvas via hosted HTML | ✅ Live — see below |
| Colour palette page | `figma/colour-guide/colour-guide.html` | ✅ Generated and hosted |

### Code-to-canvas workflow

Generated documentation pages are hosted on GitHub and can be captured into Figma in one step:

1. The page is live at:
   ```
   https://htmlpreview.github.io/?https://raw.githubusercontent.com/Chuk-DCHW/dhcw-single-record-design-system/claude/test-figma-mcp-OC5P4/figma/colour-guide/colour-guide.html
   ```
2. Open Figma → navigate to the `🌈 Colours` page
3. Use **Plugins → Figma** or **Main menu → File → Place image** to import, **or** simply press `K` to open the frame tool, paste the URL, and Figma renders it as an embedded frame

**Re-generating after token changes:**
```bash
node figma/colour-guide/generate.js
# commit colour-guide.html, push — the hosted URL auto-updates
```


---

## Access

Figma file access is managed by the design lead. Engineers should have at minimum **viewer** access to the production library.
