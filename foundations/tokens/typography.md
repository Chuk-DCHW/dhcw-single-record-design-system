# Typography Tokens

All type decisions are defined here. Components reference these tokens — do not hardcode font values.

---

## Typeface

| Role | Family | Rationale |
|---|---|---|
| Primary (UI) | `Inter` | High legibility at small sizes; extensive weight range; free and widely supported |
| Fallback | `system-ui, -apple-system, sans-serif` | Graceful degradation |
| Monospace | `'Roboto Mono', 'Courier New', monospace` | Clinical codes, identifiers, reference numbers |

**Note:** Typeface selection requires design lead sign-off. Inter is provisionally recommended pending review against NHS England guidance.

---

## Scale

Based on a modular scale with a 1.25 ratio (Major Third), anchored at 16px base.

| Token | Size (rem) | Size (px) | Usage |
|---|---|---|---|
| `type.size.xs`   | `0.75rem`  | 12px | Labels, badges, legal text |
| `type.size.sm`   | `0.875rem` | 14px | Secondary body, captions |
| `type.size.base` | `1rem`     | 16px | Default body text |
| `type.size.lg`   | `1.125rem` | 18px | Lead text, intro paragraphs |
| `type.size.xl`   | `1.25rem`  | 20px | H4, card titles |
| `type.size.2xl`  | `1.5rem`   | 24px | H3 |
| `type.size.3xl`  | `1.875rem` | 30px | H2 |
| `type.size.4xl`  | `2.25rem`  | 36px | H1 |

Minimum body text: **16px** — consistent with WCAG 2.2 and NHS guidance for clinical readability.

---

## Weight

| Token | Value | Usage |
|---|---|---|
| `type.weight.regular` | `400` | Body text |
| `type.weight.medium`  | `500` | Labels, table headers |
| `type.weight.semibold`| `600` | UI labels, sub-headings |
| `type.weight.bold`    | `700` | Headings, key data |

---

## Line Height

| Token | Value | Usage |
|---|---|---|
| `type.leading.tight`   | `1.2` | Headings |
| `type.leading.snug`    | `1.35` | Table cells, compact UI |
| `type.leading.normal`  | `1.5` | Body text |
| `type.leading.relaxed` | `1.75` | Long-form documentation |

Minimum line height for body text: **1.5** — WCAG 2.2 requirement.

---

## Letter Spacing

| Token | Value | Usage |
|---|---|---|
| `type.tracking.tight`  | `-0.01em` | Large headings only |
| `type.tracking.normal` | `0` | Default |
| `type.tracking.wide`   | `0.05em` | All-caps labels |
| `type.tracking.wider`  | `0.1em` | Badges, status chips |

---

## Semantic Text Styles

These combine the tokens above into named styles used directly in Figma and referenced in component specs.

| Style | Size | Weight | Leading | Usage |
|---|---|---|---|---|
| `heading.h1` | 4xl | bold | tight | Page titles |
| `heading.h2` | 3xl | bold | tight | Section headings |
| `heading.h3` | 2xl | semibold | snug | Sub-sections |
| `heading.h4` | xl | semibold | snug | Card/panel headings |
| `body.default` | base | regular | normal | All body text |
| `body.lead` | lg | regular | normal | Intro/summary paragraphs |
| `body.small` | sm | regular | normal | Supporting, secondary |
| `label.default` | sm | medium | snug | Form labels |
| `label.strong` | sm | semibold | snug | Required field labels |
| `data.mono` | sm | regular | snug | Clinical codes, IDs, reference numbers |
| `caption` | xs | regular | normal | Table footnotes, image captions |

---

## Accessibility Notes

- Do not use `type.size.xs` for any text that conveys essential meaning without a visible alternative.
- Do not use colour alone to distinguish text styles — use weight or size differences as well.
- Ensure text can be resized to 200% without loss of content or functionality (WCAG 1.4.4).
- Line length (measure) should be 60–80 characters for body text. Use layout constraints, not `max-width` on text tokens.
