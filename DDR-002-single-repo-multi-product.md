# DDR-002 — Single Repository, Products Extend Core

**Date**: 2025
**Status**: Accepted
**Author**: Design Lead

---

## Context

The Single Record programme has two products that need a shared design system. A decision was needed on how to structure the relationship between the design system and individual products.

---

## Decision

Maintain a single design system repository (`dhcw-single-record-design-system`). Products extend the core system via a `/products/` folder rather than forking or creating separate repositories.

---

## Rationale

- Two products sharing one system stay visually consistent by default
- Changes to core tokens and components benefit both products simultaneously
- Product-specific needs are contained without polluting the shared system
- Future programmes can reference shared foundations without inheriting Single Record product specifics
- Simpler to maintain — one source of truth for design decisions

---

## Alternatives Considered

**Separate repo per product**: Rejected. Duplication of foundations and components across repos leads to divergence and double maintenance.

**Monorepo with full product isolation**: Rejected. Over-engineered for two products at this stage; can be revisited if complexity grows significantly.

---

## Consequences

- Any change to core components or tokens requires consideration of impact on both products
- Product teams must agree on core changes through the contribution process
- When product names are confirmed, `/products/product-a/` and `/products/product-b/` should be renamed
- If a future DHCW programme needs a design system, it would likely be a separate repository that references shared foundations

---

## Standards References

- GDS: Design system contribution model
