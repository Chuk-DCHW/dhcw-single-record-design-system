# Figma Variable Mapping

Maps Figma variable names to design token names used in this repository and in code.

This file must be kept in sync whenever tokens are added, renamed, or removed.

---

## Convention

| Layer | Format | Example |
|---|---|---|
| Figma variable (primitives) | `Primitives/Group/Scale` | `Primitives/Blue/800` |
| Figma variable (semantic) | `DHCW/Category/Name` | `DHCW/Interactive/Primary` |
| Design token (primitives) | `color.{hue}.{scale}` | `color.blue.800` |
| Design token (semantic) | `dhcw.color.{category}.{name}` | `dhcw.color.interactive.primary` |
| CSS custom property | `--dhcw-color-{category}-{name}` | `--dhcw-color-interactive-primary` |
| MAUI resource | `DhcwColor{Category}{Name}` | `DhcwColorInteractivePrimary` |

---

## Primitive Colour Variables

Source: `/foundations/tokens/primitives/color.json`

### Blue (NHS Wales Blue)
| Figma Variable | Token | Hex |
|---|---|---|
| `Primitives/Blue/900` | `color.blue.900` | `#1E3050` |
| `Primitives/Blue/800` | `color.blue.800` | `#325083` |
| `Primitives/Blue/700` | `color.blue.700` | `#3D6199` |
| `Primitives/Blue/600` | `color.blue.600` | `#4C72AE` |
| `Primitives/Blue/500` | `color.blue.500` | `#5C6991` |
| `Primitives/Blue/400` | `color.blue.400` | `#828DAC` |
| `Primitives/Blue/300` | `color.blue.300` | `#AAB1C6` |
| `Primitives/Blue/200` | `color.blue.200` | `#D4D8E2` |
| `Primitives/Blue/100` | `color.blue.100` | `#ECEEF3` |
| `Primitives/Blue/50`  | `color.blue.50`  | `#F4F5F8` |

### Cyan (DHCW Blue)
| Figma Variable | Token | Hex |
|---|---|---|
| `Primitives/Cyan/900` | `color.cyan.900` | `#0A6A84` |
| `Primitives/Cyan/800` | `color.cyan.800` | `#0D8BAD` |
| `Primitives/Cyan/700` | `color.cyan.700` | `#12A3C9` |
| `Primitives/Cyan/600` | `color.cyan.600` | `#71ACCD` |
| `Primitives/Cyan/500` | `color.cyan.500` | `#8DC0DA` |
| `Primitives/Cyan/400` | `color.cyan.400` | `#AFD4E5` |
| `Primitives/Cyan/300` | `color.cyan.300` | `#D6EAF2` |
| `Primitives/Cyan/100` | `color.cyan.100` | `#EBF5FA` |
| `Primitives/Cyan/50`  | `color.cyan.50`  | `#F4FAFC` |

### Navy (DHCW Navy)
| Figma Variable | Token | Hex |
|---|---|---|
| `Primitives/Navy/900` | `color.navy.900` | `#1B294A` |
| `Primitives/Navy/700` | `color.navy.700` | `#464C64` |
| `Primitives/Navy/500` | `color.navy.500` | `#707488` |
| `Primitives/Navy/300` | `color.navy.300` | `#9EA1AF` |
| `Primitives/Navy/100` | `color.navy.100` | `#CDCFD6` |

### Status & Utility
| Figma Variable | Token | Hex |
|---|---|---|
| `Primitives/Red/600` | `color.red.600` | `#D5281B` |
| `Primitives/Red/100` | `color.red.100` | `#FCDBD9` |
| `Primitives/Green/600` | `color.green.600` | `#007F3B` |
| `Primitives/Green/100` | `color.green.100` | `#D9EFE5` |
| `Primitives/Yellow/500` | `color.yellow.500` | `#F8CA4D` |
| `Primitives/Yellow/100` | `color.yellow.100` | `#FDF6DC` |
| `Primitives/Info Blue` | `color.info-blue` | `#005AA8` |
| `Primitives/Info Blue/100` | `color.info-blue.100` | `#D6E8F5` |
| `Primitives/Focus Yellow` | `color.focus-yellow` | `#FFEB3B` |
| `Primitives/Grey/900` | `color.grey.900` | `#212B32` |
| `Primitives/Grey/600` | `color.grey.600` | `#4C6272` |
| `Primitives/Grey/200` | `color.grey.200` | `#D8DDE0` |
| `Primitives/Grey/100` | `color.grey.100` | `#F0F4F5` |
| `Primitives/White` | `color.white` | `#FFFFFF` |

---

## Semantic Colour Variables

Source: `/foundations/tokens/semantic/color.json`

All semantic variables alias primitives — no raw hex values.

### Interactive
| Figma Variable | Token | Aliases |
|---|---|---|
| `DHCW/Interactive/Primary` | `dhcw.color.interactive.primary` | `color.blue.800` |
| `DHCW/Interactive/Primary Hover` | `dhcw.color.interactive.primary-hover` | `color.blue.900` |
| `DHCW/Interactive/Secondary` | `dhcw.color.interactive.secondary` | `color.navy.900` |
| `DHCW/Interactive/Link` | `dhcw.color.interactive.link` | `color.info-blue` |
| `DHCW/Interactive/Destructive` | `dhcw.color.interactive.destructive` | `color.red.600` |

### Surface
| Figma Variable | Token | Aliases |
|---|---|---|
| `DHCW/Surface/Default` | `dhcw.color.surface.default` | `color.grey.100` |
| `DHCW/Surface/Card` | `dhcw.color.surface.card` | `color.white` |
| `DHCW/Surface/Accent` | `dhcw.color.surface.accent` | `color.cyan.100` |
| `DHCW/Surface/Subtle` | `dhcw.color.surface.subtle` | `color.blue.50` |
| `DHCW/Surface/Header` | `dhcw.color.surface.header` | `color.navy.900` |

### Text
| Figma Variable | Token | Aliases |
|---|---|---|
| `DHCW/Text/Primary` | `dhcw.color.text.primary` | `color.grey.900` |
| `DHCW/Text/Secondary` | `dhcw.color.text.secondary` | `color.grey.600` |
| `DHCW/Text/Inverse` | `dhcw.color.text.inverse` | `color.white` |

### Border
| Figma Variable | Token | Aliases |
|---|---|---|
| `DHCW/Border/Default` | `dhcw.color.border.default` | `color.grey.200` |
| `DHCW/Border/Strong` | `dhcw.color.border.strong` | `color.grey.600` |
| `DHCW/Border/Focus` | `dhcw.color.border.focus` | `color.focus-yellow` |

### Status
| Figma Variable | Token | Aliases |
|---|---|---|
| `DHCW/Status/Critical` | `dhcw.color.status.critical` | `color.red.600` |
| `DHCW/Status/Critical Surface` | `dhcw.color.status.critical-surface` | `color.red.100` |
| `DHCW/Status/Success` | `dhcw.color.status.success` | `color.green.600` |
| `DHCW/Status/Success Surface` | `dhcw.color.status.success-surface` | `color.green.100` |
| `DHCW/Status/Warning` | `dhcw.color.status.warning` | `color.yellow.500` |
| `DHCW/Status/Warning Surface` | `dhcw.color.status.warning-surface` | `color.yellow.100` |
| `DHCW/Status/Info` | `dhcw.color.status.info` | `color.info-blue` |
| `DHCW/Status/Info Surface` | `dhcw.color.status.info-surface` | `color.info-blue.100` |

---

## Spacing Variables

| Figma Variable | Token | CSS Custom Property |
|---|---|---|
| `Spacing/Component/XS` | `spacing.component.xs` | `--spacing-component-xs` |
| `Spacing/Component/SM` | `spacing.component.sm` | `--spacing-component-sm` |
| `Spacing/Component/MD` | `spacing.component.md` | `--spacing-component-md` |
| `Spacing/Component/LG` | `spacing.component.lg` | `--spacing-component-lg` |
| `Spacing/Component/XL` | `spacing.component.xl` | `--spacing-component-xl` |
| `Spacing/Form/Field Gap` | `spacing.form.field-gap` | `--spacing-form-field-gap` |
| `Spacing/Form/Label Gap` | `spacing.form.label-gap` | `--spacing-form-label-gap` |

---

## Typography Variables

| Figma Variable | Token | CSS Custom Property |
|---|---|---|
| `Type/Size/Base` | `type.size.base` | `--type-size-base` |
| `Type/Weight/Regular` | `type.weight.regular` | `--type-weight-regular` |
| `Type/Weight/Bold` | `type.weight.bold` | `--type-weight-bold` |
| `Type/Leading/Normal` | `type.leading.normal` | `--type-leading-normal` |

*(Full list to be completed when Figma library is set up)*

---

## Maintenance

- When adding a new Figma variable, add a corresponding row to this file in the same commit.
- When renaming, update all columns simultaneously.
- Breaking changes (token renames that affect code) require a DDR before implementation.
- JSON sources are the machine-readable single source of truth. This file is the human-readable reference.
