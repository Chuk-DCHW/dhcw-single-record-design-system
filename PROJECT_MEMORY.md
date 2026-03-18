# PROJECT MEMORY — DHCW Single Record Design System

> **This file is the primary instruction file for AI-assisted sessions.**
> Load it at the start of every session. Keep it updated as decisions are made.

---

## Who I Am

Senior interaction designer working within a DHCW directorate (NHS Wales).
Building the Single Record Design System for internal clinical and administrative products.

---

## What We Are Building

A multi-platform design system that will:
1. Start in **Figma** (tokens, components, patterns, prototypes)
2. Expand into **code libraries** for multiple platforms
3. Serve **two products** under the Single Record programme initially
4. Be **structured to scale** to additional DHCW programmes without restructuring

---

## System Architecture

```
dhcw-single-record-design-system         ← this repository
│
├── Core (shared across all SR products)
│   ├── /foundations   — design tokens (colour, type, spacing, etc.)
│   ├── /components    — individual UI components
│   ├── /patterns      — composed UI patterns
│   └── /figma         — token/variable mappings
│
└── /products          — product-specific decisions and overrides
    ├── /products/product-a/   ← TBD (name to be confirmed)
    └── /products/product-b/   ← TBD (name to be confirmed)
```

**Key architectural decision**: The core design system is the Single Record system. Products extend it — they do not fork it. If a future DHCW programme needs a design system, it would be a separate repository that could reference shared foundations.

---

## Products This System Serves

| Product | Notes |
|---|---|
| Single Record Product A | TBD — name and scope to be confirmed |
| Single Record Product B | TBD — name and scope to be confirmed |
| Future DHCW products | Not in scope now; structure should not block them |

Products are internal, used by clinical and administrative staff. Interfaces are data-heavy: complex forms, dense records, large tables.

---

## Technology Stack

- **Current**: .NET, Blazor, .NET MAUI, Delphi
- **Future**: Modern JS frameworks expected — do not over-engineer for them now
- **Design tool**: Figma (MCP-connected in Claude sessions)
- **Version control**: GitHub

---

## Users

Clinical and administrative staff. Key characteristics:
- Varying digital confidence
- High cognitive load environments (wards, admin desks, clinical settings)
- Use dense forms, tables, and records daily
- Accessibility must be intrinsic — not bolted on

---

## Guiding Standards (Non-negotiable)

1. **WCAG 2.2** — minimum AA, aim for AAA where practical
2. **GDS Design System** — patterns and thinking
3. **NHS England Design System** — clinical UI conventions
4. **CDPS Wales** — Welsh government digital service standards

---

## Design Principles (Draft)

1. **Clarity over cleverness** — interfaces must be immediately readable under pressure
2. **Consistency across products and platforms** — same tokens, same patterns, adapted per platform
3. **Accessible by default** — every component built to WCAG 2.2 from the start
4. **Progressive** — works in legacy tech now, scales to modern frameworks later
5. **Evidence-based** — decisions are logged with rationale in DDRs

---

## Repository Structure

```
/foundations       — Design tokens (colour, type, spacing, elevation, motion)
/components        — Component specs and design notes
/patterns          — Composed patterns (forms, tables, navigation, records)
/products          — Per-product overrides and extensions
/decisions         — Decision records (DDRs)
/figma             — Figma variable mappings and handoff notes
PROJECT_MEMORY.md  — This file
CONTRIBUTING.md    — Contribution guidelines
README.md          — Public-facing overview
```

---

## Figma Integration

- Figma is available via MCP in Claude sessions
- Use `get_design_context` to extract component specs from a Figma node URL
- Use `get_variable_defs` to pull colour and spacing variable values
- Document all Figma-to-code mappings in `/figma/`
- Figma is the **source of truth** for design values during this phase

---

## Current Status

| Area | Status |
|---|---|
| Repository structure | ✅ Initialised |
| Product names confirmed | 🔲 TBD |
| Design tokens (colour) | 🔲 Not started |
| Design tokens (typography) | 🔲 Not started |
| Design tokens (spacing) | 🔲 Not started |
| Core components | 🔲 Not started |
| Figma file set up | 🔲 Not started |
| Product A scope | 🔲 TBD |
| Product B scope | 🔲 TBD |

---

## Key Decisions Made

| Date | Decision | Rationale |
|---|---|---|
| Init | Foundations-first approach | Tokens are the dependency everything inherits |
| Init | Single repo, products extend core | Avoids fragmentation; keeps core consistent |
| Init | Figma as source of truth (phase 1) | Team is design-led; code follows Figma |
| Init | WCAG 2.2 AA minimum | Clinical context; legal obligation; user need |

---

## How to Use This File in a Session

Paste at the start of a new Claude session:

> "Read PROJECT_MEMORY.md and continue working on the DHCW Single Record Design System. Today I want to work on: [topic]."

---

*Last updated: repo initialisation*
