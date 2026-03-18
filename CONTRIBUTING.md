# Contributing to the DHCW Single Record Design System

## Core Principle

The core system (foundations, components, patterns) is shared across all Single Record products. Changes to core affect all products — treat them accordingly.

Product-specific behaviour belongs in `/products/[product-name]/`, not in core.

---

## Adding a Foundation Token

1. Define the value in Figma as a variable first
2. Document it in `/foundations/[area].md`
3. If the decision is non-obvious, create a DDR in `/decisions/`

## Adding a Component

1. Confirm the component is not a product-specific variant of an existing one
2. Create a spec file: `/components/[component-name].md`
3. Build and test in Figma
4. Document platform considerations (Blazor, MAUI, Delphi)
5. Log any significant choices in a DDR

## Adding a Pattern

Patterns are compositions of components. They live in `/patterns/`.
A pattern must reference at least one real product use case.

## Adding Product-Specific Work

If a component or pattern only applies to one product:
- Document it in `/products/[product-name]/`
- Reference the core component it extends (if applicable)
- Do not modify core files to accommodate a single-product need

---

## Decision Records (DDRs)

Use the template at `/decisions/DDR-000-template.md`.
Log any decision about: colour choices, type scale, spacing, component behaviour, or platform trade-offs.

---

## Accessibility Checklist

Every component and pattern must pass before being considered complete:

- [ ] Colour contrast meets WCAG 2.2 AA (4.5:1 text, 3:1 UI components)
- [ ] Keyboard navigable in logical order
- [ ] Focus indicator visible and meets WCAG 2.2 SC 2.4.11
- [ ] Screen reader tested or ARIA guidance documented in spec
- [ ] Works at 200% zoom without loss of content or function
- [ ] Does not rely on colour alone to convey meaning

---

## Versioning

Semantic versioning begins at v1.0. Until then, changes are tracked by date in DDRs and git history.
