# Patient Banner

**Status:** Planned
**Last updated:** 2026-03

---

## Purpose

Persistent strip displayed at the top of all patient-contextual screens. Ensures clinical staff always know which patient they are viewing, reducing the risk of wrong-patient errors.

This is a safety-critical component. Changes require clinical safety review in addition to standard design sign-off.

---

## Required Data Fields

The following fields must always be displayed when available:

| Field | Display format | Notes |
|---|---|---|
| Full name | `Surname, Forename(s)` | Bold — most prominent element |
| Date of birth | `DD MMM YYYY` + age in brackets | e.g. `15 Mar 1962 (64)` |
| NHS number | `XXX XXX XXXX` (formatted) | Monospace, clearly separated |
| Gender / sex | As recorded | Display only; do not abbreviate |
| Allergy status | Flag — see below | Always visible |

Optional fields (show if space permits, configurable per product):

- Address (abbreviated)
- GP surgery / registered practice
- Current ward / location
- Preferred name

---

## Allergy Flag

Displayed as a distinct visual element within the banner.

| State | Display |
|---|---|
| No known allergies | Muted indicator: "No known allergies" |
| Allergies recorded | High-visibility badge: "Allergies" — links to allergy list |
| Allergy status unknown | Amber indicator: "Allergy status unknown" |

Do not use colour alone — always include text. See `/accessibility/colour-and-contrast.md`.

---

## Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  SMITH, Jane Elizabeth        DOB: 15 Mar 1962 (64)  ⚠ Allergies    │
│  NHS: 485 777 3456            Female                                 │
└──────────────────────────────────────────────────────────────────────┘
```

- Full width — spans the entire viewport, outside the column grid.
- Fixed position at top of content area (below global navigation).
- Background: `color.brand.primary` — provides clear visual boundary from content.
- Text: `color.text.inverse`.

---

## States

| State | Behaviour |
|---|---|
| Loaded | Normal display |
| Loading | Skeleton placeholders for data fields — do not show partial data |
| No patient context | Banner not shown |
| Data error | Display name and NHS number if available; flag other fields as unavailable |

---

## Accessibility

- Banner is a landmark: `role="banner"` or `<header>` — but this conflicts with the page `<header>`. Use `role="region"` with `aria-label="Patient information"`.
- Allergy flag must be perceivable without colour: icon + text always.
- NHS number must be readable by screen readers as a grouped number, not individual digits. Use `aria-label="NHS number: 485 777 3456"`.
- Do not put interactive elements inside the banner that could distract from primary task flow.

---

## Clinical Safety Notes

- This component must never display data from a different patient session.
- Session timeout must clear the patient context and the banner simultaneously.
- Any modification to displayed fields must be reviewed by clinical informatics.

---

## Engineering Notes

- Patient context is typically provided via a service/state container shared across the application shell.
- Blazor: implement as a cascading parameter or a persistent layout component.
- MAUI: implement as a shared shell view, not repeated per-page.
- Do not cache patient data in local storage.
