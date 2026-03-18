# Focus Management

Keyboard users navigate entirely through focus. Focus management must be deliberate, consistent, and visible at all times.

---

## Focus Ring Design

**Implementation:**

```css
:focus-visible {
  outline: 3px solid #F59E0B;  /* color.interactive.focus */
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #111827;  /* color.interactive.focus-inner */
}
```

- Use `:focus-visible` not `:focus` — this suppresses the ring for mouse users while maintaining it for keyboard users.
- Never use `outline: none` without replacing it with a visible equivalent.
- The amber + dark inner shadow pattern is drawn from GDS — it works on both light and dark backgrounds.

---

## Tab Order

- Tab order follows DOM order. Ensure visual layout matches DOM structure.
- Do not use `tabindex` values greater than 0 — this breaks natural tab flow.
- Use `tabindex="0"` only to make non-interactive elements focusable when necessary.
- Use `tabindex="-1"` to make elements programmatically focusable without inserting them into tab flow (e.g. error summaries, dialog headings).

---

## Focus Trapping

Required in: modals, drawers, confirmation dialogs, and any overlay that blocks the page.

Rules:
- On open: move focus to the first interactive element or dialog heading
- Tab: cycles through interactive elements within the trap
- Shift+Tab: cycles backwards
- Escape: closes the overlay; focus returns to the trigger
- Clicking outside: does not close clinical dialogs (see confirmation-dialog pattern)

Implementation: use a focus trap library or implement manually. Do not rely on browser defaults.

---

## Programmatic Focus Management

When content changes without a page navigation (SPA behaviour, form submission, async load):

| Event | Focus action |
|---|---|
| Form submit error | Move focus to error summary (`tabindex="-1"`) |
| Modal/dialog open | Move focus to dialog heading or first input |
| Modal/dialog close | Return focus to the element that triggered it |
| Toast/notification | Do not move focus — use `aria-live` region instead |
| Page section update | Move focus to the updated region heading if content changes significantly |
| Step-by-step navigation | Move focus to new page/step heading |

---

## Skip Links

Every page must have a skip link as the first focusable element.

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

- Visually hidden by default; appears on keyboard focus
- Must be the first item in the DOM
- Target element must have `id="main-content"` and `tabindex="-1"`

See `/components/skip-link/spec.md`.

---

## Keyboard Interaction Patterns

Common patterns that must be keyboard operable:

| Component | Keys |
|---|---|
| Button | Enter, Space |
| Link | Enter |
| Checkbox | Space to toggle |
| Radio group | Arrow keys to move between options, Space/Enter to select |
| Select / dropdown | Arrow keys to navigate, Enter to select, Escape to close |
| Modal | Tab/Shift+Tab within, Escape to close |
| Tab component | Arrow keys between tabs, Enter to activate |
| Accordion | Enter/Space to expand/collapse |
| Autocomplete | Arrow keys, Enter to select, Escape to clear |

Follow ARIA Authoring Practices Guide (APG) patterns for composite widgets.

---

## Testing Focus Management

Verify manually:
1. Open the page with no mouse input
2. Tab through all interactive elements — confirm visible focus at every step
3. Confirm tab order matches visual reading order
4. Open and close each modal/dialog — confirm focus trap and restoration
5. Submit a form with errors — confirm focus moves to error summary
6. Resize browser to 400% zoom — confirm focus indicator remains visible
