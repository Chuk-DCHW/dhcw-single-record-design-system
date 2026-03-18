# Accessibility

WCAG 2.2 AA compliance is a hard requirement for all products using this design system. This directory contains guidance, standards, and checklists to support accessible design and implementation.

---

## Contents

| File | Purpose |
|---|---|
| `wcag-22-checklist.md` | Success criteria checklist for design and engineering review |
| `colour-and-contrast.md` | Contrast requirements, testing tools, clinical colour considerations |
| `focus-management.md` | Focus ring design, keyboard navigation, focus trapping |
| `screen-reader-guidance.md` | ARIA usage, semantic HTML, testing with NVDA/JAWS/VoiceOver |
| `assistive-technology.md` | Supported AT matrix for DHCW products |
| `testing-process.md` | When and how to conduct accessibility testing |

---

## Standards Applied

| Standard | Level | Requirement |
|---|---|---|
| WCAG 2.2 | AA | Mandatory for all products |
| WCAG 2.2 | AAA | Target where feasible — especially for clinical content |
| EN 301 549 | Full | European standard — applies to Welsh public sector |
| Public Sector Bodies Accessibility Regulations 2018 | Full | Legal requirement |

---

## Key Principles for This Design System

### 1. Clinical context demands higher standards
Clinical staff may work under cognitive load, time pressure, or in environments with poor lighting. Interfaces must be clear, predictable, and error-tolerant beyond basic WCAG compliance.

### 2. No colour-only communication
Status, errors, and clinical alerts must always combine colour with icon and text. This applies to allergy flags, alert banners, validation errors, and all status indicators.

### 3. Keyboard accessibility is non-negotiable
All functionality must be operable by keyboard. Clinical staff frequently use keyboards only, or switch between keyboard and touch. Tab order, focus visibility, and shortcut keys must all be considered.

### 4. Screen reader testing is part of the definition of done
Components and patterns are not approved without screen reader testing. Minimum: NVDA + Chrome (Windows), JAWS + Chrome (Windows), VoiceOver + Safari (macOS/iOS).

### 5. Accessible names on all interactive elements
Every button, link, input, and icon-only control must have a programmatic accessible name. This is verified at design review and engineering handoff.

---

## Responsibility

| Stage | Responsible |
|---|---|
| Design | Design lead ensures specs include accessibility notes |
| Component spec | Component author completes accessibility section |
| Engineering | Engineer implements per spec; raises concerns before shipping |
| Review | Accessibility lead signs off new components and patterns |
| Live testing | Engineering team runs WCAG checklist pre-release |
