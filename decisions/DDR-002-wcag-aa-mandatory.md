# DDR-002: WCAG 2.2 AA as Mandatory Baseline

**Date:** 2026-03-18
**Author:** Design lead
**Status:** Accepted
**Supersedes:** N/A

---

## Context

NHS Wales public sector digital services are subject to the Public Sector Bodies Accessibility Regulations 2018 and EN 301 549. A clear internal standard is required to guide design and engineering decisions.

---

## Decision

**WCAG 2.2 AA** is the mandatory minimum for all components, patterns, and products in this design system. AAA criteria are targeted where feasible, particularly for clinical content.

No component or pattern is approved without meeting this standard.

---

## Options Considered

### Option A: WCAG 2.1 AA (previous version)
- **Pros:** Widely implemented; extensive tooling
- **Cons:** Superseded; misses new 2.2 criteria that are particularly relevant to clinical UI (focus indicators SC 2.4.11, target size SC 2.5.8, accessible authentication SC 3.3.8)

### Option B: WCAG 2.2 AA (chosen)
- **Pros:** Current standard; legally required under EN 301 549; new criteria directly relevant to healthcare UI; future-proof
- **Cons:** Slightly higher implementation overhead — justified

### Option C: WCAG 2.2 AAA
- **Pros:** Highest standard
- **Cons:** Some AAA criteria are impossible to meet universally (e.g. SC 1.4.6 applies to all text) and WCAG itself does not expect full AAA conformance

---

## Rationale

WCAG 2.2 AA is the legally applicable standard for Welsh public sector digital services. It is also the right standard on clinical grounds — users include staff with disabilities, older users, and those working in challenging environments.

The new WCAG 2.2 additions (focus indicators, target size, accessible authentication) are directly applicable to clinical workstation interfaces.

---

## Consequences

- All colour pairings in `/foundations/tokens/colour/` are verified against WCAG 2.2 contrast requirements.
- Component specs must include an accessibility section meeting these criteria.
- No component is marked "Approved" without accessibility review.
- Clinical alert and status components additionally target AAA criteria for colour contrast and non-text contrast.
