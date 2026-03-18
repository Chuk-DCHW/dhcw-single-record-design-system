# Iconography

Guidelines for icon usage across the design system.

---

## Icon Library

**Provisionally adopted:** [Material Symbols](https://fonts.google.com/icons) (Outlined variant)

| Reason | Detail |
|---|---|
| Coverage | 3,000+ icons including clinical and administrative symbols |
| Variable font | Single font file; weight, fill, grade, and optical size are variable |
| Accessibility | Designed for UI use at standard sizes |
| Licensing | Open source (Apache 2.0) |

**Alternatives under consideration:** Phosphor Icons, NHS England icon set. Requires design lead decision and DDR before changing.

---

## Sizes

| Token | Size | Usage |
|---|---|---|
| `icon.size.sm` | 16px | Inline with body text, status indicators |
| `icon.size.md` | 20px | Default UI — buttons, inputs, nav |
| `icon.size.lg` | 24px | Standalone icons, section headers |
| `icon.size.xl` | 32px | Empty states, feature icons |

Minimum interactive icon size: **44×44px touch target** (icon itself may be smaller with padding).

---

## Colour

Icons inherit `color.text.primary` by default. For status icons:

| Context | Token |
|---|---|
| Success | `color.status.success` |
| Warning | `color.status.warning` |
| Error | `color.status.error` |
| Info | `color.status.info` |
| Interactive | `color.interactive.primary` |
| Disabled | `color.interactive.disabled-text` |

---

## Accessibility Rules

1. **Decorative icons**: hide from assistive technology (`aria-hidden="true"`).
2. **Meaningful icons** (used without visible text label): must have an accessible name via `aria-label` or `title`.
3. **Icon + text**: the icon is decorative; the text carries the meaning. `aria-hidden` on the icon.
4. Do not use icons as the **only** way to convey status in clinical contexts — always pair with text.

---

## Usage Rules

- Do not use icons from multiple libraries in the same product.
- Do not modify icon paths or create bespoke icons without design lead approval.
- Avoid using icons for purely decorative purposes in dense data views — they add visual noise.
- Prefer the **outlined** variant as default; use **filled** only for selected/active states.
