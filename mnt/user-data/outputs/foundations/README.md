# Foundations — DHCW Single Record Design System

Design tokens are the atomic values everything else is built on. They are defined in Figma as variables and documented here for cross-platform use.

These foundations are **shared across all Single Record products**. Product-specific overrides (if ever needed) are documented in `/products/`.

---

## Token Status

| Foundation | Figma | Documented | Notes |
|---|---|---|---|
| Colour | 🔲 | 🔲 | RAG/status colours critical for clinical use |
| Typography | 🔲 | 🔲 | Must remain legible at high information density |
| Spacing | 🔲 | 🔲 | 4px or 8px base grid — TBD |
| Elevation / Shadow | 🔲 | 🔲 | Keep minimal — avoid decorative depth |
| Border radius | 🔲 | 🔲 | |
| Focus styles | 🔲 | 🔲 | WCAG 2.2 SC 2.4.11 — non-negotiable |
| Motion | 🔲 | 🔲 | Conservative — clinical contexts, no distraction |

---

## Naming Convention

Tokens are named **semantically**, not by visual value:

```
✅  color.status.error
✅  color.text.muted
✅  spacing.component.gap-sm
❌  color.red
❌  spacing.8
```

This keeps token names stable if values change (e.g. rebranding, dark mode, high contrast mode).

---

## Platform Notes

Token values are defined once in Figma. Platform teams consume them as:

| Platform | Format |
|---|---|
| Blazor / CSS | CSS custom properties (`--color-status-error`) |
| .NET MAUI | Resource dictionaries |
| Future web | CSS custom properties or design token JSON |

Platform-specific notes are added inline in each token file where behaviour differs.

---

## Files

| File | Contents |
|---|---|
| `colour.md` | Full colour token set (TBD) |
| `typography.md` | Type scale, font choices, line height, weight (TBD) |
| `spacing.md` | Spacing scale and layout grid (TBD) |
