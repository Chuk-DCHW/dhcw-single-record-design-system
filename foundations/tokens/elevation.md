# Elevation Tokens

Elevation communicates hierarchy and focus through shadow. Used sparingly — clinical interfaces prioritise clarity over visual depth.

---

## Scale

| Token | CSS Box Shadow | Usage |
|---|---|---|
| `elevation.0` | `none` | Flat surfaces, default state |
| `elevation.1` | `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)` | Cards, list items on subtle backgrounds |
| `elevation.2` | `0 4px 6px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)` | Dropdowns, tooltips, floating labels |
| `elevation.3` | `0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05)` | Modals, drawers |
| `elevation.4` | `0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04)` | System-critical alerts, toasts (reserved) |

---

## Usage Rules

- Use elevation to separate layers, not to decorate.
- Do not use `elevation.3` or `elevation.4` outside of modal/overlay contexts.
- Do not rely on shadow alone to indicate interactivity — pair with border or background change.
- On light-mode surfaces (`neutral.0` on `neutral.50`), prefer `elevation.1` over no border to maintain sufficient contrast.

---

## Focus Elevation

Focus rings are not managed through elevation. See `/foundations/tokens/colour/semantic.md` (`color.interactive.focus`) and `/accessibility/focus-management.md`.
