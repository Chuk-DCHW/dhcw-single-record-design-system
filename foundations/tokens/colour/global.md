# Global Colour Tokens

Global tokens define the raw palette. They are **not used directly** in components or patterns — always use semantic tokens.

These values are defined in Figma as **global colour variables**.

---

## Palette

### Blue
| Token | Value | Notes |
|---|---|---|
| `color.global.blue.100` | `#EBF3FB` | Lightest — backgrounds only |
| `color.global.blue.200` | `#C4DCF4` | |
| `color.global.blue.300` | `#8CBAE8` | |
| `color.global.blue.400` | `#4A90D4` | |
| `color.global.blue.500` | `#1565C0` | NHS Blue reference |
| `color.global.blue.600` | `#0E4F97` | |
| `color.global.blue.700` | `#09397A` | Darkest |

### Teal
| Token | Value | Notes |
|---|---|---|
| `color.global.teal.100` | `#E5F6F4` | |
| `color.global.teal.500` | `#007A74` | DHCW Teal — brand accent |
| `color.global.teal.700` | `#005651` | |

### Green (Status)
| Token | Value | Notes |
|---|---|---|
| `color.global.green.100` | `#EBF5EB` | |
| `color.global.green.500` | `#2E7D32` | |
| `color.global.green.700` | `#1B5E20` | |

### Amber (Status)
| Token | Value | Notes |
|---|---|---|
| `color.global.amber.100` | `#FFF8E1` | |
| `color.global.amber.500` | `#F59E0B` | |
| `color.global.amber.700` | `#B45309` | |

### Red (Status / Error)
| Token | Value | Notes |
|---|---|---|
| `color.global.red.100` | `#FDECEC` | |
| `color.global.red.500` | `#D32F2F` | |
| `color.global.red.700` | `#B71C1C` | |

### Neutral
| Token | Value | Notes |
|---|---|---|
| `color.global.neutral.0`   | `#FFFFFF` | White |
| `color.global.neutral.50`  | `#F9FAFB` | |
| `color.global.neutral.100` | `#F3F4F6` | |
| `color.global.neutral.200` | `#E5E7EB` | |
| `color.global.neutral.300` | `#D1D5DB` | |
| `color.global.neutral.400` | `#9CA3AF` | |
| `color.global.neutral.500` | `#6B7280` | |
| `color.global.neutral.600` | `#4B5563` | |
| `color.global.neutral.700` | `#374151` | |
| `color.global.neutral.800` | `#1F2937` | |
| `color.global.neutral.900` | `#111827` | Near-black |

---

## Contrast Verification

All semantic colour pairings must be checked against WCAG 2.2:
- **Text on background**: minimum 4.5:1 (AA), target 7:1 (AAA)
- **UI components and focus indicators**: minimum 3:1 against adjacent colours

Contrast checks are documented in `/foundations/tokens/colour/semantic.md`.

---

## Notes

- Values are provisional. Final palette requires sign-off from design lead.
- Do not reference `color.global.*` tokens in component files — use semantic tokens.
- Palette must support both light mode (current) and dark mode (future consideration).
