# DHCW Single Record Design System

A design system for the Single Record programme within a DHCW directorate (NHS Wales).

## Purpose

Provide a shared design language, consistent UI patterns, and reusable components across all products within the Single Record programme — and structured to support additional DHCW programmes in the future.

## Guiding Standards

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [GDS Design System](https://design-system.service.gov.uk/) — proven public sector patterns
- [NHS England Design System](https://service-manual.nhs.uk/design-system) — clinical UI conventions
- [Centre for Digital Public Services Wales (CDPS)](https://digitalpublicservices.gov.wales/)

## Programme & Product Scope

```
dhcw-single-record-design-system/
│
├── Single Record (this system)       ← primary design system
│   ├── Product A                     ← product-specific overrides/extensions (TBD)
│   └── Product B                     ← product-specific overrides/extensions (TBD)
│
└── [Future Programme]                ← separate design system, inherits shared foundations
```

The core system (tokens, components, patterns) is shared across all Single Record products. Product-specific decisions live in `/products/`.

## Technology Landscape

| Platform | Technology |
|---|---|
| Web apps | Blazor, .NET |
| Desktop / Mobile | .NET MAUI, Delphi |
| Future | TBD (modern frameworks expected) |

## Repository Structure

```
/foundations       — Tokens: colour, typography, spacing, elevation, motion
/components        — Individual UI components (specs and design decisions)
/patterns          — Composed UI patterns (forms, tables, records, navigation)
/products          — Product-specific extensions or overrides
/decisions         — Design decision records (DDRs)
/figma             — Figma-to-code bridge: variable mappings and handoff notes
PROJECT_MEMORY.md  — Persistent context for AI-assisted sessions
CONTRIBUTING.md    — How to contribute to this system
```

## Status

🟡 In initialisation — foundational work in progress.

## Contacts

Design lead: [your name]
Repository: `dhcw-single-record-design-system`
Programme: Single Record, DHCW
