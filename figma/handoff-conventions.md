# Handoff Conventions

Rules for preparing Figma designs for engineering handoff. Consistent handoff reduces back-and-forth and prevents implementation drift.

---

## Before Handoff

A design is ready for handoff when:

- [ ] All components use library components (no detached instances)
- [ ] All colours reference library colour variables (no hardcoded hex values)
- [ ] All typography uses library text styles
- [ ] Spacing uses library spacing variables (auto-layout where possible)
- [ ] All interactive states are designed (hover, focus, active, disabled, error, loading)
- [ ] Accessibility notes are added to the component spec in this repository
- [ ] The frame is named clearly and consistently (`ComponentName/Variant/State`)
- [ ] A cover frame or section label identifies the component and status

---

## Figma Frame Naming

Use this structure for all frames:

```
ComponentName / Variant / State
```

Examples:
- `Button / Primary / Default`
- `Button / Primary / Hover`
- `TextInput / Default / Error`
- `PatientBanner / Standard`

Section labels:
- `[Component] Button` — groups all button frames in one section

---

## Annotation Layer

Every component handoff frame should include an annotation layer (hidden from presentation view, visible in inspect mode):

- Token names for colours, spacing, and typography
- Accessible name (if applicable)
- Behaviour notes (e.g. "focus trap on open")
- Link to component spec in this repository

Use the Figma annotation plugin if available, or a dedicated annotations frame.

---

## Dev Mode

When Figma Dev Mode is available:
- Ensure all variables are mapped (inspect panel shows token names, not raw values)
- Link components in Dev Mode to the corresponding spec file in this repo
- Add a component description in Figma properties

---

## What Engineers Should Receive

| Item | Source |
|---|---|
| Figma link (view access) | Design lead |
| Component spec | `/components/{name}/spec.md` |
| Token reference | `/figma/variable-mapping.md` |
| Accessibility requirements | Component spec accessibility section |
| Pattern context | `/patterns/{category}/{pattern}.md` |

---

## Discrepancy Resolution

If the Figma design and the component spec conflict:
1. Flag to design lead before starting implementation
2. Do not silently adopt either version
3. The correct version is documented via a brief note or DDR, then both artefacts are updated
