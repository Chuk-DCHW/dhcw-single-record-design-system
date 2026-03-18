# DDR-001 — Foundations-First Approach

**Date**: 2025
**Status**: Accepted
**Author**: Design Lead

---

## Context

Starting a new design system from scratch for the Single Record programme within DHCW. The system must serve two products initially, with potential to serve additional programmes in the future.

---

## Decision

Begin with **foundations** (colour, typography, spacing, elevation) before building any components or patterns. All decisions are made in Figma first, then documented here for code handoff.

---

## Rationale

- Foundations are the dependency everything else inherits
- Getting tokens right early prevents costly rework of components later
- Figma variables provide a single source of truth that maps directly to code tokens
- Clinical and data-heavy UIs are particularly sensitive to colour (status, severity, state) and typography (legibility at density)
- Having a shared token set ensures both Single Record products remain visually consistent

---

## Alternatives Considered

**Component-first**: Rejected. Without a token foundation, each component makes local decisions that diverge over time — especially problematic across two products.

**Pattern-first**: Rejected. Patterns require components, which require foundations.

---

## Consequences

- Colour system must be fully defined before any component work starts
- Typography scale must account for dense data views (small text, many rows, tight line heights)
- Spacing system must be compatible with Blazor/MAUI layout models
- Both products are blocked on components until foundations are complete — acceptable given the long-term benefit

---

## Standards References

- WCAG 2.2 SC 1.4.3 — Contrast (Minimum)
- WCAG 2.2 SC 1.4.4 — Resize Text
- WCAG 2.2 SC 1.4.11 — Non-text Contrast
- WCAG 2.2 SC 2.4.11 — Focus Appearance
