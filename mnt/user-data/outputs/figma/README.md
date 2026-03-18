# Figma Integration — DHCW Single Record Design System

This folder documents how Figma variables and components map to code tokens and specs.

---

## Workflow

1. Design tokens are created as **Figma Variables** (colour, number, string)
2. Components and patterns are built in Figma using those variables
3. In Claude sessions, the Figma MCP connection pulls values directly
4. Token values are documented in `/foundations/` and mapped here
5. Platform teams consume tokens from this documentation

---

## Figma MCP Usage in Claude Sessions

When Figma is connected via MCP, use these tools:

| Tool | Use |
|---|---|
| `get_design_context` | Extract component specs, layout, and code hints from a Figma node |
| `get_variable_defs` | Pull variable/token values from a Figma file |
| `get_metadata` | Inspect layer structure of a Figma file |

**To use**: paste a Figma node URL into the Claude session and request extraction.

---

## Figma File Structure (Recommended)

```
Single Record Design System (Figma file)
├── 🎨 Foundations         — variables: colour, type, spacing
├── 🧱 Components          — all core components, all states
├── 🗂 Patterns            — composed patterns with real data
└── 📋 Specs / Handoff     — annotated layouts for developers
```

Product-specific Figma files extend the core library — they do not duplicate it.

---

## Variable Naming Convention

Match token naming in `/foundations/`:

```
color/primary/default
color/status/error
color/text/muted
spacing/component/gap-sm
typography/size/body
```

---

## Files in This Folder

| File | Contents |
|---|---|
| `variable-map.md` | Figma variable → CSS/platform token mapping (TBD) |
| `component-handoff-notes.md` | Per-component platform notes (TBD) |
