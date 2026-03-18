# Guide for Designers

How to work within and contribute to this design system.

---

## Getting Started

1. **Request Figma access** from the design lead — you need at minimum editor access to the design system library.
2. **Read `CLAUDE.md`** — it defines the rules everyone on this project follows, including designers.
3. **Familiarise yourself with the foundations** — start with `/foundations/tokens/colour/semantic.md`, `/foundations/tokens/typography.md`, and `/foundations/grid-and-layout.md`.
4. **Review the component catalogue** — `/components/README.md`. Know what exists before designing something new.

---

## Figma Library Usage

- Use **library components** for everything — do not detach instances without a documented reason.
- Use **library variables** for all colour, spacing, and typography — no hardcoded values.
- If a component or variable you need does not exist, follow the process below before creating a local version.

---

## Designing a New Component

1. Check `/components/README.md` — is there an existing component that meets the need?
2. Check GDS and NHS England design systems — has this been solved already?
3. If genuinely new: raise with design lead. Agree scope before starting.
4. Design all states in Figma: default, hover, focus, active, disabled, error, loading.
5. Write a spec using the template at `/docs/templates/component-spec-template.md`.
6. Include an accessibility section in the spec — this is not optional.
7. Submit for design review and accessibility review before marking as approved.

---

## Designing a New Pattern

1. Check `/patterns/README.md` — does a pattern for this need exist?
2. Check GDS patterns — these are the baseline. Deviate only with justification.
3. Write a pattern doc using `/docs/templates/pattern-template.md`.
4. Reference the components it uses.
5. Submit for review.

---

## Accessibility in Design

- Every interactive element needs a visible focus state designed.
- Status and error states must not rely on colour alone.
- Consider screen reader experience — what gets announced? In what order?
- Check contrast ratios before submitting designs. See `/accessibility/colour-and-contrast.md`.
- Refer to `/accessibility/focus-management.md` for focus ring design.

---

## Preparing for Handoff

See `/figma/handoff-conventions.md` for the full checklist.

Key points:
- All states designed
- All tokens applied (no raw values)
- Component named consistently
- Spec file created or updated
- Accessibility notes in the spec

---

## Making a Design Decision

For significant choices (new token, new pattern approach, deviation from GDS), write a DDR using the template at `/docs/templates/ddr-template.md` and add it to `/decisions/`.

This creates a permanent record and prevents the same debate being had again in six months.

---

## Raising Issues

If you spot an inconsistency, accessibility concern, or a gap in the system — raise it. The design system is a shared resource and benefits from everyone's attention.
