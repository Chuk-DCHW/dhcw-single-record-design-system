# Semantic Colour Tokens

Semantic tokens assign **meaning** to global colour values. Components and patterns reference semantic tokens only — never global tokens directly.

Defined in Figma as **semantic colour variables**, mapped to global variables.

---

## Interactive

| Token | Maps to | Usage |
|---|---|---|
| `color.interactive.primary` | `blue.600` | Primary buttons, links, active nav |
| `color.interactive.primary-hover` | `blue.700` | Hover state for primary |
| `color.interactive.primary-text` | `neutral.0` | Text on primary interactive |
| `color.interactive.secondary` | `neutral.0` | Secondary button background |
| `color.interactive.secondary-border` | `blue.600` | Secondary button border |
| `color.interactive.secondary-text` | `blue.600` | Secondary button text |
| `color.interactive.focus` | `amber.500` | Focus ring — all interactive elements |
| `color.interactive.focus-inner` | `neutral.900` | Inner focus shadow (GDS pattern) |
| `color.interactive.disabled` | `neutral.300` | Disabled control background |
| `color.interactive.disabled-text` | `neutral.500` | Disabled text |

**Contrast checks:**
| Pairing | Ratio | WCAG |
|---|---|---|
| `primary-text` on `primary` | 7.2:1 | ✅ AAA |
| `secondary-text` on `secondary` | 5.9:1 | ✅ AA |
| Focus ring `amber.500` on `neutral.0` | 3.1:1 | ✅ (UI component) |

---

## Text

| Token | Maps to | Usage |
|---|---|---|
| `color.text.primary` | `neutral.900` | Body text, headings |
| `color.text.secondary` | `neutral.600` | Supporting text, captions |
| `color.text.disabled` | `neutral.400` | Disabled labels |
| `color.text.inverse` | `neutral.0` | Text on dark backgrounds |
| `color.text.link` | `blue.600` | Inline links |
| `color.text.link-visited` | `blue.700` | Visited links |
| `color.text.error` | `red.700` | Inline error messages |

---

## Background

| Token | Maps to | Usage |
|---|---|---|
| `color.background.page` | `neutral.50` | Page background |
| `color.background.surface` | `neutral.0` | Cards, panels, modals |
| `color.background.subtle` | `neutral.100` | Zebra rows, section dividers |
| `color.background.overlay` | `neutral.900` at 60% | Modal overlay |

---

## Status

Used in banners, badges, row highlights, and clinical alert states.

| Token | Maps to | Meaning |
|---|---|---|
| `color.status.success` | `green.500` | Completed, confirmed |
| `color.status.success-bg` | `green.100` | Success background |
| `color.status.warning` | `amber.700` | Requires attention |
| `color.status.warning-bg` | `amber.100` | Warning background |
| `color.status.error` | `red.500` | Failed, invalid, critical |
| `color.status.error-bg` | `red.100` | Error background |
| `color.status.info` | `blue.500` | Informational |
| `color.status.info-bg` | `blue.100` | Info background |

**Clinical alert note:** Do not rely on colour alone to communicate clinical status. Always pair with an icon and text label. See `/accessibility/colour-and-contrast.md`.

---

## Border

| Token | Maps to | Usage |
|---|---|---|
| `color.border.default` | `neutral.300` | Default borders |
| `color.border.strong` | `neutral.600` | Dividers, section edges |
| `color.border.error` | `red.500` | Invalid field borders |
| `color.border.focus` | `amber.500` | Focus ring (same as interactive.focus) |

---

## Brand

| Token | Maps to | Usage |
|---|---|---|
| `color.brand.primary` | `teal.500` | DHCW brand — headers, logos |
| `color.brand.primary-dark` | `teal.700` | Brand on dark surfaces |
