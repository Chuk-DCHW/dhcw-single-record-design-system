# Components — DHCW Single Record Design System

Core UI components shared across all Single Record products.

Components are built on the foundations token set. Product-specific variants or extensions live in `/products/[product-name]/components/`.

---

## Status

No components defined yet. Work begins after foundations (colour, type, spacing) are established.

---

## Component Spec Format

Each component gets a markdown file: `/components/[component-name].md`

Contents:
- Purpose and when to use
- Anatomy (parts, variants, states)
- Behaviour notes
- Accessibility requirements and ARIA guidance
- Platform considerations (Blazor, MAUI, etc.)
- Figma node reference

---

## Planned Components (Initial Backlog)

Priority based on frequency across Single Record product interfaces.

| Component | Priority | Notes |
|---|---|---|
| Button | High | Primary, secondary, destructive, disabled |
| Text input | High | Label, hint, validation, error states |
| Select / Dropdown | High | Single-select; multi-select TBD |
| Checkbox | High | Including indeterminate state |
| Radio | High | |
| Table | High | Dense, sortable, paginated — core to clinical views |
| Badge / Tag | Medium | Status and severity indicators |
| Alert / Notification | Medium | RAG-status variants — clinical priority |
| Modal / Dialog | Medium | |
| Tabs | Medium | |
| Pagination | Medium | |
| Date input | Medium | Following GDS date input pattern |
| Breadcrumb | Low | |
| Accordion | Low | |
