# Spacing Tokens

A consistent spacing scale used for padding, margin, gap, and layout. All spacing values derive from a 4px base unit.

---

## Scale

| Token | Value (rem) | Value (px) | Usage guidance |
|---|---|---|---|
| `space.0`  | `0`       | 0px  | Explicit zero |
| `space.1`  | `0.25rem` | 4px  | Icon padding, micro gaps |
| `space.2`  | `0.5rem`  | 8px  | Tight component internals |
| `space.3`  | `0.75rem` | 12px | Compact form elements |
| `space.4`  | `1rem`    | 16px | Default internal padding |
| `space.5`  | `1.25rem` | 20px | |
| `space.6`  | `1.5rem`  | 24px | Section spacing within panels |
| `space.8`  | `2rem`    | 32px | Component separation |
| `space.10` | `2.5rem`  | 40px | |
| `space.12` | `3rem`    | 48px | Section breaks |
| `space.16` | `4rem`    | 64px | Major layout sections |
| `space.20` | `5rem`    | 80px | Page-level vertical rhythm |
| `space.24` | `6rem`    | 96px | |

---

## Semantic Spacing Tokens

These map scale values to purpose. Use semantic tokens in component specs.

### Component internal spacing
| Token | Maps to | Usage |
|---|---|---|
| `spacing.component.xs` | `space.1` | Icon-only buttons, tight badges |
| `spacing.component.sm` | `space.2` | Compact inputs, table cells |
| `spacing.component.md` | `space.4` | Default padding for most components |
| `spacing.component.lg` | `space.6` | Panels, cards |
| `spacing.component.xl` | `space.8` | Large containers |

### Form spacing
| Token | Maps to | Usage |
|---|---|---|
| `spacing.form.field-gap` | `space.6` | Vertical gap between form fields |
| `spacing.form.label-gap` | `space.2` | Gap between label and input |
| `spacing.form.hint-gap`  | `space.1` | Gap between hint and input |
| `spacing.form.error-gap` | `space.1` | Gap between error and input |
| `spacing.form.group-gap` | `space.8` | Gap between field groups / fieldsets |

### Layout spacing
| Token | Maps to | Usage |
|---|---|---|
| `spacing.layout.xs` | `space.4`  | Column gutters (mobile) |
| `spacing.layout.sm` | `space.6`  | Column gutters (tablet) |
| `spacing.layout.md` | `space.8`  | Column gutters (desktop) |
| `spacing.layout.section` | `space.12` | Between page sections |
| `spacing.layout.page` | `space.16` | Page padding / top-level margin |

---

## Usage Rules

- Use scale tokens only through their semantic equivalents in component specs.
- Do not use arbitrary pixel values — extend the scale via a DDR if a value is genuinely missing.
- Avoid mixing spacing systems (e.g. combining Tailwind utilities with these tokens in a hybrid codebase without mapping).

---

## Touch Target Sizing

Minimum touch target: **44×44px** — WCAG 2.2 Success Criterion 2.5.8 (Target Size, AA).

This is enforced at the component level. See individual component specs for implementation notes.
