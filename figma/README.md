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
| Write design content (frames, components, layouts) | **Figma MCP** | MCP writes design content directly into Figma files without requiring a plugin |
| One-off generation (interim, pre-MCP write) | **Figma plugin** (e.g. `plugins/colour-palette/`) | Used only where MCP write capability has not yet been verified for the specific task |

### Current status

| Capability | Approach | Status |
|---|---|---|
| Push colour variables | REST API → GitHub Actions | Live |
| Read design content | Figma MCP | Live |
| Write design content | Figma MCP | **Pending test** — see below |
| Colour palette page | Figma plugin (interim) | Awaiting MCP write confirmation |

### When MCP write is confirmed

Once the MCP write capability for design content is confirmed working:

1. **Retire the plugin** at `figma/plugins/colour-palette/` — replace with an MCP-based generation call
2. **Update this table** to mark MCP write as Live
3. **Document the MCP call pattern** used so it can be replicated for other generated pages (typography, spacing, etc.)
4. Any future generated design pages (component documentation, token showcases) should use MCP by default, not plugins

---

## Access

Figma file access is managed by the design lead. Engineers should have at minimum **viewer** access to the production library.
