# OutSystems UI — Utility & Token Reference

Complete technical reference for utility classes and design tokens from the OutSystems UI Cheat Sheet.

## Spacing

OutSystems UI uses an 8px base scale. Every spacing utility has a corresponding CSS variable.

| Size | Value | Padding Class | Margin Class | CSS Variable |
|------|-------|---------------|--------------|--------------|
| None | 0 | `.padding-none` | `.margin-none` | `--space-none` |
| XS | 4px | `.padding-xs` | `.margin-xs` | `--space-xs` |
| S | 8px | `.padding-s` | `.margin-s` | `--space-s` |
| Base | 16px | `.padding-base` | `.margin-base` | `--space-base` |
| M | 24px | `.padding-m` | `.margin-m` | `--space-m` |
| L | 32px | `.padding-l` | `.margin-l` | `--space-l` |
| XL | 40px | `.padding-xl` | `.margin-xl` | `--space-xl` |
| XXL | 48px | `.padding-xxl` | `.margin-xxl` | `--space-xxl` |

### Directional Variants

Append direction to the class for single-side or axis spacing:

- **Single side**: `.padding-top-m`, `.padding-right-s`, `.padding-bottom-l`, `.padding-left-base`
- **Axis**: `.padding-vertical-m` (top + bottom), `.padding-horizontal-s` (left + right)
- Same pattern for `.margin-*` variants.

---

## Typography

### Font Sizes

| Name | Value | Class | CSS Variable |
|------|-------|-------|--------------|
| Display | 34px | `.font-size-display` | `--font-size-display` |
| H1 | 30px | `.font-size-h1` | `--font-size-h1` |
| H2 | 26px | `.font-size-h2` | `--font-size-h2` |
| H3 | 24px | `.font-size-h3` | `--font-size-h3` |
| H4 | 20px | `.font-size-h4` | `--font-size-h4` |
| H5 | 18px | `.font-size-h5` | `--font-size-h5` |
| H6 | 17px | `.font-size-h6` | `--font-size-h6` |
| Base (body) | 16px | `.font-size-base` | `--font-size-base` |
| S (body small) | 14px | `.font-size-s` | `--font-size-s` |
| XS (body extra small) | 12px | `.font-size-xs` | `--font-size-xs` |

### Font Weights

| Weight | Value | Class |
|--------|-------|-------|
| Light | 300 | `.font-weight-light` |
| Normal | 400 | `.font-weight-normal` |
| Semi-Bold | 600 | `.font-weight-semi-bold` |
| Bold | 700 | `.font-weight-bold` |

### Text Transforms

| Transform | Class |
|-----------|-------|
| Lowercase | `.text-lowercase` |
| Uppercase | `.text-uppercase` |
| Capitalize | `.text-capitalize` |
| Ellipsis overflow | `.text-ellipsis` |

---

## Borders

### Border Radius

| Size | Value | Class | CSS Variable |
|------|-------|-------|--------------|
| None | 0 | `.border-radius-none` | `--border-radius-none` |
| Soft | 4px | `.border-radius-soft` | `--border-radius-soft` |
| Rounded | 100px | `.border-radius-rounded` | `--border-radius-rounded` |
| Circle | 100% | `.border-radius-circle` | `--border-radius-circle` |

### Border Sizes

| Size | Value | Class | CSS Variable |
|------|-------|-------|--------------|
| None | 0 | `.border-size-none` | `--border-size-none` |
| S | 1px | `.border-size-s` | `--border-size-s` |
| M | 2px | `.border-size-m` | `--border-size-m` |
| L | 3px | `.border-size-l` | `--border-size-l` |

---

## Shadows

| Level | Class | CSS Variable |
|-------|-------|--------------|
| None | `.shadow-none` | `--shadow-none` |
| XS | `.shadow-xs` | `--shadow-xs` |
| S | `.shadow-s` | `--shadow-s` |
| M | `.shadow-m` | `--shadow-m` |
| L | `.shadow-l` | `--shadow-l` |
| XL | `.shadow-xl` | `--shadow-xl` |

---

## Pattern-Scoped CSS Variables

Some patterns expose CSS custom properties for fine-tuning. Set these on the pattern's root element.

| Pattern | CSS Variables |
|---------|-------------|
| Carousel | `--{element-id}-width` |
| Floating Actions | `--delay` |
| Master Detail | `--master-detail-height`, `--left-percentage: 50` |
| Gallery | `--grid-desktop: 4`, `--grid-tablet: 2`, `--grid-phone: 1`, `--grid-gap: var(--space-base)` |
| Rating | `--rating-size: 16px` |
| Scrollable Area | `--scrollable-area-width`, `--scrollable-area-height` |
