# Pattern: Form Validation

**Status:** Planned
**Last updated:** 2026-03

---

## Problem

Users make errors in complex clinical forms. Validation must communicate which fields are invalid, why, and how to fix them — without causing confusion or distress to clinical staff under time pressure.

---

## Solution

Two-layer validation: an **error summary** at the top of the form, and **inline errors** next to each invalid field. Both are always shown together.

---

## Error Summary

Displayed at the top of the form, immediately after a failed submission attempt.

**Behaviour:**
- Appears above the form heading (not within the form body)
- Contains a heading: "There is a problem" (or "There are X problems")
- Lists every error as a link — clicking jumps to the relevant field
- Focus moves to the error summary on page load/re-render after failed submission

**Components used:** `alert-banner` (error variant), ordered list of anchor links

```
┌─────────────────────────────────────────────────────────┐
│ ✕  There is a problem                                   │
│    • Date of birth must be in the past                  │
│    • NHS number must be 10 digits                       │
└─────────────────────────────────────────────────────────┘
```

---

## Inline Error

Displayed between the label (and hint, if present) and the input field.

**Behaviour:**
- Shown immediately below the label/hint, above the input
- Red left border on the field container
- Error text in `color.text.error`, prefixed with visually hidden "Error:" for screen readers
- Associated with the field via `aria-describedby`

```
Label text
Hint text (optional)
Error: Date of birth must be in the past
[ Day  ] [ Month ] [ Year ]
```

**Component used:** `inline-error`

---

## When to Validate

| Trigger | Approach |
|---|---|
| Form submission | Full validation — show error summary + all inline errors |
| Field blur (leaving a field) | Inline error for that field only — no error summary |
| Real-time / on keypress | Only for format feedback (e.g. character count) — not for required fields |

Do not validate empty required fields on blur — only on submission. This prevents premature errors while the user is still completing the form.

---

## Error Message Guidelines

- Be specific: "Enter a date of birth" not "This field is required"
- Tell the user what format is expected: "Enter the date as DD MM YYYY"
- Do not blame the user: avoid "You entered an invalid…" — use "The date must be…"
- Match the error in the summary to the error inline — same wording
- Sentence case, no trailing full stop

---

## Accessibility

- Error summary receives focus on submission failure (`tabindex="-1"`, focus set programmatically)
- Each error link in the summary must navigate to and focus the invalid field
- `aria-invalid="true"` on invalid inputs
- `aria-describedby` links input to its inline error message
- Error messages are announced by screen readers when the field is focused
- Do not use colour alone — the "Error:" prefix and field border style convey error state visually without colour

---

## Related

- `/components/inline-error/spec.md`
- `/components/alert-banner/spec.md`
- `/patterns/forms/form-layout.md`
- GDS: [Error summary](https://design-system.service.gov.uk/components/error-summary/)
- GDS: [Error message](https://design-system.service.gov.uk/components/error-message/)
