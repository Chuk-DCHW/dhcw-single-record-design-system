# Figma

This directory manages the relationship between Figma design assets and the design system codebase.

---

## Contents

| File | Purpose |
|---|---|
| `variable-mapping.md` | Maps Figma variables to design token names |
| `handoff-conventions.md` | Rules for preparing designs for engineering handoff |
| `library-structure.md` | How the Figma library is organised |

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

## Access

Figma file access is managed by the design lead. Engineers should have at minimum **viewer** access to the production library.
