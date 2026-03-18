# Colour and Contrast

---

## Contrast Requirements

### Text (WCAG 1.4.3, 1.4.6)

| Text type | AA minimum | AAA target |
|---|---|---|
| Normal text (< 18pt / < 14pt bold) | 4.5:1 | 7:1 |
| Large text (≥ 18pt / ≥ 14pt bold) | 3:1 | 4.5:1 |
| Disabled text | Exempt | — |
| Logo / logotype | Exempt | — |

### UI components and focus (WCAG 1.4.11)

| Element | Minimum ratio |
|---|---|
| Input borders | 3:1 against background |
| Focus ring | 3:1 against adjacent colours |
| Icons conveying meaning | 3:1 against background |
| Status indicators | 3:1 (paired with text — see below) |

### Focus indicator (WCAG 2.4.11 — new in WCAG 2.2)

- Focus indicator area: at least as large as a 2px perimeter around the component
- Contrast of focus indicator: 3:1 against unfocused state

Our implementation: 3px solid `color.interactive.focus` (amber `#F59E0B`) with 2px `color.interactive.focus-inner` (near-black) inner shadow. This meets and exceeds the requirement.

---

## Verified Token Pairings

Key pairings from the semantic token set, verified against WCAG 2.2:

| Foreground token | Background token | Ratio | Level |
|---|---|---|---|
| `color.text.primary` (`#111827`) | `color.background.page` (`#F9FAFB`) | 18.1:1 | ✅ AAA |
| `color.text.primary` (`#111827`) | `color.background.surface` (`#FFFFFF`) | 19.0:1 | ✅ AAA |
| `color.text.secondary` (`#4B5563`) | `color.background.surface` (`#FFFFFF`) | 7.0:1 | ✅ AAA |
| `color.interactive.primary` (`#0E4F97`) | `color.background.surface` (`#FFFFFF`) | 8.9:1 | ✅ AAA |
| `color.interactive.primary-text` (`#FFFFFF`) | `color.interactive.primary` (`#0E4F97`) | 8.9:1 | ✅ AAA |
| `color.text.error` (`#B71C1C`) | `color.background.surface` (`#FFFFFF`) | 7.2:1 | ✅ AAA |
| `color.status.warning` (`#B45309`) | `color.background.surface` (`#FFFFFF`) | 5.1:1 | ✅ AA |
| `color.text.secondary` on `color.background.subtle` | `#F3F4F6` | 5.8:1 | ✅ AA |

**Action:** All new token pairings must be verified before use. Add to this table.

---

## Colour-Only Communication — Prohibited Uses

The following must **never** rely on colour alone:

| Context | Required supplement |
|---|---|
| Form field error state | Red border + error icon + "Error:" text prefix |
| Required field indicator | Asterisk (*) + hint text "Required fields are marked with *" |
| Allergy flag | Icon + text label |
| Clinical alert severity | Icon + text label + heading level |
| Status badge (active/inactive) | Text label always visible |
| Chart / graph data series | Pattern or shape differentiation + legend with text |
| Table row highlight | Secondary visual indicator (e.g. left border) |

---

## Testing Tools

| Tool | Use |
|---|---|
| [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/) | Desktop tool for pixel-level checking |
| [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) | Quick ratio checks |
| Figma plugin: Contrast | In-Figma contrast checking during design |
| Browser DevTools | Inspect computed contrast in rendered UI |
| axe DevTools | Automated contrast scanning in browser |

---

## Clinical Environment Considerations

- Clinical workstations are sometimes in bright, high-ambient-light environments (wards, A&E). Contrast should exceed minimums where possible.
- Some clinical staff have colour vision deficiency. Never use red/green alone for "go/stop" or "safe/unsafe" meaning.
- Night shift / low-light environments: avoid pure white backgrounds for full-page views — `neutral.50` (`#F9FAFB`) is preferred.

---

## Dark Mode

Not currently in scope. If introduced, all token pairings must be re-verified. Do not assume light-mode ratios carry over.
