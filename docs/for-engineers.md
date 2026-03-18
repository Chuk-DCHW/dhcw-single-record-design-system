# Guide for Engineers

How to consume and contribute to this design system as an engineer.

---

## Getting Started

1. **Read `CLAUDE.md`** — project rules, conventions, and what not to do.
2. **Understand the token system** — all design values come from tokens. Start with `/foundations/tokens/`.
3. **Read the component spec** before implementing any component — `/components/{name}/spec.md`.
4. **Check the Figma library** for the current design. Access via the design lead.

---

## Token Consumption

Tokens are defined in `/foundations/tokens/` and mapped in `/figma/variable-mapping.md`.

### Web (Blazor)

Consume as CSS custom properties:

```css
:root {
  --color-interactive-primary: #0E4F97;
  --color-text-primary: #111827;
  --spacing-component-md: 1rem;
  /* etc. */
}

.button-primary {
  background-color: var(--color-interactive-primary);
  color: var(--color-interactive-primary-text);
  padding: var(--spacing-component-md);
}
```

### .NET MAUI

Consume as XAML resource dictionary:

```xml
<Color x:Key="ColorInteractivePrimary">#0E4F97</Color>
<Color x:Key="ColorTextPrimary">#111827</Color>
```

Reference token names from `/figma/variable-mapping.md` (MAUI column).

### Token source of truth

Until a token build pipeline is implemented, `/figma/variable-mapping.md` is the authoritative mapping. Keep it updated when tokens change.

---

## Implementing a Component

1. Read the spec at `/components/{name}/spec.md` fully before writing code.
2. Implement all states specified — do not skip hover, focus, disabled, or loading.
3. Apply the focus ring exactly as specified in `/accessibility/focus-management.md`.
4. Implement ARIA attributes as described in the spec's accessibility section.
5. Test with keyboard — tab to the component, interact with keyboard only.
6. Test with a screen reader (NVDA + Chrome minimum).
7. Run a contrast check on the rendered output.

---

## Accessibility Implementation Checklist

For every component or feature:

- [ ] All interactive elements have accessible names
- [ ] Focus ring is visible and uses the correct token values
- [ ] Tab order is logical and matches visual order
- [ ] `aria-invalid`, `aria-describedby`, and `aria-label` applied where specified
- [ ] Keyboard interaction matches spec
- [ ] `prefers-reduced-motion` respected — see `/foundations/tokens/motion.md`
- [ ] Minimum touch target: 44×44px (WCAG 2.2 SC 2.5.8)
- [ ] Screen reader testing completed

---

## Focus Ring Implementation

All interactive elements:

```css
:focus-visible {
  outline: 3px solid var(--color-interactive-focus);
  outline-offset: 2px;
  box-shadow: 0 0 0 2px var(--color-interactive-focus-inner);
}
```

Do not override this without a documented reason. Do not use `outline: none`.

---

## Semantic HTML

- Use native HTML elements where possible: `<button>`, `<a>`, `<input>`, `<select>`, `<details>`.
- Only use ARIA to extend semantics — do not use ARIA to repair broken HTML structure.
- `role="button"` on a `<div>` is wrong. Use `<button>`.

---

## Raising Issues

If a spec is unclear, missing states, or technically infeasible — raise it before implementing a workaround. Update the spec as part of the resolution.

If you find an accessibility issue in an existing component — raise it immediately. Do not ship with known accessibility failures.

---

## Contributing to the Design System

To add or modify a component:
1. Discuss with design lead
2. Update or create the spec in `/components/{name}/spec.md`
3. Write a DDR if the change is non-trivial
4. Update the component catalogue in `/components/README.md`
5. Commit with the appropriate commit convention (see `CLAUDE.md`)
