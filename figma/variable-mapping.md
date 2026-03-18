# Figma Variable Mapping

Maps Figma variable names to design token names used in this repository and in code.

This file must be kept in sync whenever tokens are added, renamed, or removed.

---

## Convention

| Layer | Format | Example |
|---|---|---|
| Figma variable | `Group/Subgroup/Name` | `Color/Interactive/Primary` |
| Design token | `{tier}.{category}.{name}` | `color.interactive.primary` |
| CSS custom property | `--{tier}-{category}-{name}` | `--color-interactive-primary` |
| MAUI resource | `PascalCase` | `ColorInteractivePrimary` |

---

## Colour Variables

### Interactive
| Figma Variable | Token | CSS Custom Property |
|---|---|---|
| `Color/Interactive/Primary` | `color.interactive.primary` | `--color-interactive-primary` |
| `Color/Interactive/Primary Hover` | `color.interactive.primary-hover` | `--color-interactive-primary-hover` |
| `Color/Interactive/Focus` | `color.interactive.focus` | `--color-interactive-focus` |
| `Color/Interactive/Focus Inner` | `color.interactive.focus-inner` | `--color-interactive-focus-inner` |
| `Color/Interactive/Disabled` | `color.interactive.disabled` | `--color-interactive-disabled` |
| `Color/Interactive/Disabled Text` | `color.interactive.disabled-text` | `--color-interactive-disabled-text` |

### Text
| Figma Variable | Token | CSS Custom Property |
|---|---|---|
| `Color/Text/Primary` | `color.text.primary` | `--color-text-primary` |
| `Color/Text/Secondary` | `color.text.secondary` | `--color-text-secondary` |
| `Color/Text/Error` | `color.text.error` | `--color-text-error` |
| `Color/Text/Inverse` | `color.text.inverse` | `--color-text-inverse` |
| `Color/Text/Link` | `color.text.link` | `--color-text-link` |

### Background
| Figma Variable | Token | CSS Custom Property |
|---|---|---|
| `Color/Background/Page` | `color.background.page` | `--color-background-page` |
| `Color/Background/Surface` | `color.background.surface` | `--color-background-surface` |
| `Color/Background/Subtle` | `color.background.subtle` | `--color-background-subtle` |

### Status
| Figma Variable | Token | CSS Custom Property |
|---|---|---|
| `Color/Status/Success` | `color.status.success` | `--color-status-success` |
| `Color/Status/Success BG` | `color.status.success-bg` | `--color-status-success-bg` |
| `Color/Status/Warning` | `color.status.warning` | `--color-status-warning` |
| `Color/Status/Warning BG` | `color.status.warning-bg` | `--color-status-warning-bg` |
| `Color/Status/Error` | `color.status.error` | `--color-status-error` |
| `Color/Status/Error BG` | `color.status.error-bg` | `--color-status-error-bg` |
| `Color/Status/Info` | `color.status.info` | `--color-status-info` |
| `Color/Status/Info BG` | `color.status.info-bg` | `--color-status-info-bg` |

### Brand
| Figma Variable | Token | CSS Custom Property |
|---|---|---|
| `Color/Brand/Primary` | `color.brand.primary` | `--color-brand-primary` |
| `Color/Brand/Primary Dark` | `color.brand.primary-dark` | `--color-brand-primary-dark` |

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
- When renaming, update all three columns simultaneously.
- Breaking changes (token renames that affect code) require a DDR before implementation.
