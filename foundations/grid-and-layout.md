# Grid and Layout

Defines the layout system for product interfaces. Consistent layout underpins readability in data-heavy clinical views.

---

## Breakpoints

| Token | Width | Target context |
|---|---|---|
| `breakpoint.xs` | `< 480px` | Mobile (limited use in clinical tools) |
| `breakpoint.sm` | `480px` | Small mobile |
| `breakpoint.md` | `768px` | Tablet — ward tablets, mobile workstations |
| `breakpoint.lg` | `1024px` | Desktop / clinical workstations |
| `breakpoint.xl` | `1280px` | Wide desktop |
| `breakpoint.2xl` | `1536px` | Ultra-wide, dual-screen setups |

**Primary target:** `1024px–1280px` — the majority of clinical workstations. Design and test at this range first.

---

## Column Grid

| Breakpoint | Columns | Gutter | Margin |
|---|---|---|---|
| xs | 4 | 16px | 16px |
| sm | 4 | 16px | 24px |
| md | 8 | 24px | 32px |
| lg | 12 | 24px | 40px |
| xl | 12 | 32px | 48px |
| 2xl | 12 | 32px | 64px |

---

## Common Layout Patterns

### Application shell
```
┌─────────────────────────────────────────────┐
│ Global navigation (top bar)                 │
├─────────────┬───────────────────────────────┤
│ Side nav    │ Main content area             │
│ (optional)  │                               │
│             │                               │
└─────────────┴───────────────────────────────┘
```

### Record / patient view
```
┌──────────────────────────────────────────────┐
│ Patient banner (persistent)                  │
├──────────────┬───────────────────────────────┤
│ Section nav  │ Record content (tabs/sections)│
│              │                               │
└──────────────┴───────────────────────────────┘
```

### Form page
```
┌───────────────────────────────────────────┐
│ Page heading + context                    │
├──────────────────────────┬────────────────┤
│ Form content (cols 1–8)  │ Summary / hint │
│                          │ (cols 9–12)    │
└──────────────────────────┴────────────────┘
```

Specific layout compositions are documented in `/patterns/`.

---

## Max Content Width

| Context | Max width |
|---|---|
| Body text / long-form content | `720px` |
| Forms (single column) | `560px` |
| Full-width data tables | `none` (full container) |
| Page container | `1400px` |

---

## Usage Rules

- Layout tokens are used in Figma auto-layout and code implementations.
- Do not create custom grid configurations per product — extend via `/products/{name}/` overrides if genuinely required.
- The patient banner is **always full width** and outside the column grid constraint.
- Avoid horizontal scrolling in all views except data tables with explicit overflow affordance.
