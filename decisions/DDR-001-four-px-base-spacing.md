# DDR-001: 4px Base Spacing Unit

**Date:** 2026-03-18
**Author:** Design lead
**Status:** Accepted
**Supersedes:** N/A

---

## Context

A consistent spacing scale is required for the design system. The base unit determines the granularity of all spacing decisions — padding, gaps, margins, and layout.

---

## Decision

Adopt **4px** as the base spacing unit. All spacing values are multiples of 4px.

---

## Options Considered

### Option A: 4px base
- **Pros:** Industry standard (Material Design, GDS, Tailwind default); enables both tight (4px, 8px) and comfortable (16px, 24px) spacing; maps cleanly to common screen densities
- **Cons:** None significant

### Option B: 8px base
- **Pros:** Simpler scale with fewer values
- **Cons:** Lacks granularity for compact clinical data views (table cells, badges, dense forms); misses the 4px and 12px values that clinical UI frequently requires

### Option C: 5px base
- **Pros:** Some designers prefer the 10/20/40 rhythm
- **Cons:** Doesn't align with standard pixel grids; awkward in code; not used by GDS or NHS England

---

## Rationale

Clinical interfaces require both compact data views (tables, records, identifiers) and comfortable form layouts. A 4px base provides the necessary range without requiring arbitrary off-scale values.

4px aligns with GDS and Material Design, making it familiar to engineers and compatible with reference implementations.

---

## Consequences

- All spacing tokens in `/foundations/tokens/spacing.md` are multiples of 4px.
- Off-scale values (e.g. 6px, 10px) are not permitted — raise a DDR if a genuine need arises.
- Figma auto-layout nudge values should be set to 4px.
