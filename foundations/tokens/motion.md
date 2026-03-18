# Motion Tokens

Motion is used to communicate state changes and guide attention. In a clinical environment, motion must be purposeful and restrained.

---

## Duration

| Token | Value | Usage |
|---|---|---|
| `motion.duration.instant` | `0ms` | No animation — immediate state changes |
| `motion.duration.fast` | `100ms` | Micro-interactions (hover, checkbox tick) |
| `motion.duration.base` | `200ms` | Default transitions (focus, expand) |
| `motion.duration.slow` | `350ms` | Panel slide, modal entrance |
| `motion.duration.slower` | `500ms` | Page-level transitions (use rarely) |

---

## Easing

| Token | Value | Usage |
|---|---|---|
| `motion.easing.linear` | `linear` | Loading bars, progress indicators |
| `motion.easing.standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Most transitions |
| `motion.easing.enter` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering the screen |
| `motion.easing.exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving the screen |

---

## Reduced Motion

All animations must respect `prefers-reduced-motion`. When this preference is set:

- Duration should fall back to `motion.duration.instant`
- Transitions should use opacity only, not transforms

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

This is a **WCAG 2.2 requirement** (SC 2.3.3, AAA — but strongly recommended for clinical environments given prevalence of vestibular disorders).

---

## Usage Rules

- Never animate content that carries clinical meaning (e.g. alert banners should not fade in — they should appear immediately).
- Do not use motion to hide or reveal information on a timer.
- Looping animations are prohibited outside of explicit loading states.
