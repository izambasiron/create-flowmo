---
name: outsystems-ui
description: >
  Build OutSystems UI screens using the official pattern library and utility-first
  CSS classes. Use when creating .visual.html prototypes, styling components, using
  layout patterns (Cards, Columns, Forms, Tables, Tabs), applying spacing, colors,
  typography, or scaffolding screens — even if the user doesn't mention "OutSystems"
  explicitly. Covers all 86 UI patterns across 8 categories, 16 core widgets, and
  the complete design token system (spacing, colors, borders, shadows, typography).
compatibility: Requires outsystems-ui.css linked in the HTML file. Designed for VS Code agents.
metadata:
  version: "1.0"
  source: "OutSystems UI Cheat Sheet"
---

# OutSystems UI — Vibe Coding Skill

Build pixel-perfect OutSystems-compatible `.visual.html` prototypes using only the official OSUI pattern library and utility classes. Every class and CSS variable below comes directly from the OutSystems UI Cheat Sheet.

## General Rules

1. **Utility-first styling** — use OSUI utility classes (`.padding-m`, `.text-bold`, `.background-primary`) for standard spacing, color, and typography. Inline `style=""` attributes are allowed — the visual inspector copies class, style, and attribute from the DOM, so inline styles are a first-class mechanism. Use `<style>` blocks in `<head>` for screen-specific CSS that requires pseudo-elements, media queries, or hover states.
2. **12-column grid** — use `.columns.columns2` through `.columns.columns6` for responsive layouts. The parent div MUST have BOTH the `.columns` base class AND the number class (e.g. `class="columns columns3 gutter-base"`). Children MUST use `.columns-item` — NOT `.column`. Without `.columns`, `display: flex` is missing and items stack vertically.
3. **No external JavaScript** — all interaction patterns are CSS/class-driven.
4. **Layout is CRITICAL** — every screen MUST use one of the three OutSystems layouts. Pick the right one and use the exact HTML structure from the layout template files. The `.active-screen` wrapper is REQUIRED or utility classes will not resolve. See the **Layouts** section below.
5. **Scroll model** — OSUI sets `html { overflow: hidden }`. The `.active-screen` div is the actual scroll container. The `grid.css` file provides `.active-screen { overflow-y: auto; height: 100vh; }` — make sure `grid.css` is linked.
6. **Strip platform IDs** — never include `os-internal-id` or similar platform-generated attributes.
7. **Widget slots** — use `{{content}}` placeholders in templates where nested widgets would go.
8. **Three CSS files** — every screen links three stylesheets in order: `outsystems-ui.css` (framework), `grid.css` (platform grid & scroll), `theme.css` (project styles). See the **Theme Customization** section below.

## Layouts

OutSystems has four top-level page layouts. **Every screen must use one.** The layout controls the header, navigation, sidebar, and content structure. Do NOT invent your own layout wrapper — use the correct template.

### Choosing a Layout

| Layout | Class | Best for | Template |
|--------|-------|----------|----------|
| **LayoutTopMenu** | `.layout.layout-top` | Web apps with 3–6 top-level pages. Horizontal nav in header. | [assets/layout-top.html](assets/layout-top.html) |
| **LayoutSideMenu** | `.layout.layout-side` | Backoffice/admin apps with many pages or deep navigation. Vertical sidebar. | [assets/layout-side.html](assets/layout-side.html) |
| **LayoutBase** | `.layout.layout-blank` | Landing pages, marketing pages, public screens. Full-width sections. Same header/nav as LayoutTopMenu. | [assets/layout-base.html](assets/layout-base.html) |
| **LayoutBlank** | `.layout.blank` | Login, error pages, splash screens. No header, no footer, no navigation. | [assets/layout-blank.html](assets/layout-blank.html) |

**Mixing layouts** within one app is normal. Use LayoutBase for the landing page and LayoutTopMenu for inner pages. Or LayoutBlank for login and LayoutSideMenu for the main app.

### Layout Structure

#### LayoutTopMenu & LayoutBase (shared pattern)

```
.active-screen
  └── .layout.layout-top.fixed-header  (or .layout.layout-blank.fixed-header)
        └── .main
              ├── header.header [role=banner]
              │     └── .header-top.ThemeGrid_Container
              │           └── .header-content.display-flex
              │                 ├── .menu-icon [role=button]       ← hidden on desktop, visible on mobile
              │                 └── .header-navigation (flex:1)
              │                       └── nav.app-menu-content.display-flex [role=navigation]
              │                             ├── .header-logo                ← padding-right for gap
              │                             │     └── .application-name    ← logo + app title
              │                             ├── .app-menu-links [role=menubar] (flex:1)
              │                             │     └── <a role="menuitem">  ← .active on current page
              │                             ├── .app-login-info > .user-info
              │                             └── .app-menu-overlay [role=button]
              ├── .content
              │     ├── .main-content.ThemeGrid_Container [role=main]    ← LayoutTopMenu
              │     │     ├── .content-breadcrumbs
              │     │     ├── .content-top.display-flex.align-items-center
              │     │     │     ├── .content-top-title.heading1
              │     │     │     └── .content-top-actions
              │     │     └── .content-middle
              │     │
              │     │  OR for LayoutBase:
              │     ├── .main-content [role=main]                        ← NO ThemeGrid_Container
              │     │     └── .content-middle
              │     │           └── LayoutBaseSection (.full-width-section)
              │     │                 └── .ThemeGrid_Container (inside EACH section)
              │     │
              │     └── footer.content-bottom [role=contentinfo]
              │           └── .footer.ThemeGrid_Container
```

#### LayoutSideMenu (different structure)

The sidebar `<aside>` sits OUTSIDE `.main`, as a sibling:

```
.active-screen
  └── .layout.layout-side.fixed-header
        ├── aside.aside-navigation [role=complementary]    ← OUTSIDE .main
        │     └── Common.Menu block (same nav as header)
        │           ├── .app-menu-content
        │           │     ├── .header-logo > .application-name
        │           │     ├── .app-menu-links [role=menubar]
        │           │     └── .app-login-info > .user-info
        │           └── .app-menu-overlay [role=button]
        └── .main
              ├── header.header [role=banner]
              │     └── .header-top.ThemeGrid_Container
              │           └── .header-content.display-flex
              │                 ├── .menu-icon [role=button]
              │                 ├── .application-name
              │                 └── .header-navigation
              │                       └── Common.Menu block (duplicate for desktop)
              └── .content
                    ├── .main-content.ThemeGrid_Container [role=main]
                    │     ├── .content-breadcrumbs
                    │     ├── .content-top > .content-top-title + .content-top-actions
                    │     └── .content-middle
                    └── footer.content-bottom [role=contentinfo]
                          └── .footer.ThemeGrid_Container
```

#### LayoutBlank (minimal)

```
.active-screen
  └── .layout.blank
        └── .content [role=main]
              └── .main-content
```

No header, no footer, no navigation. For login pages, error pages, etc.

### Common.Menu Block (standard navigation)

All layouts that have navigation use the **same `Common.Menu` block**. It provides:
- **App title/logo** in `.header-logo` > `.application-name`
- **Menu links** in `.app-menu-links` with `role="menubar"`
  - Simple links: `<a role="menuitem" href="#">Page</a>`
  - Subsequent links use `.ThemeGrid_MarginGutter` for spacing
  - Active page: add `.active` class to the link
  - Dropdown submenus: use `Navigation.Submenu` pattern (`.osui-submenu`)
- Subsequent links add `.ThemeGrid_MarginGutter` for spacing
- **User info** in `.app-login-info` > `.user-info`
- **Overlay** `.app-menu-overlay` for mobile menu backdrop

### Mobile Responsive Behavior

The layouts are **automatically responsive** via the OSUI CSS — no custom media queries needed:

| Viewport | body class | Menu behavior |
|----------|-----------|---------------|
| Desktop | `desktop landscape` | Menu links visible in header (top) or sidebar (side) |
| Tablet | `tablet` | Burger icon appears, menu slides in from left |
| Phone | `phone portrait` | Burger icon appears, menu slides in from left |

How it works:
1. `.menu-icon` (burger) is `display: none` on desktop, `display: flex` on tablet/phone
2. Clicking burger adds `.menu-visible` to the layout wrapper
3. `.app-menu-content` slides in: `position: fixed; left: -300px` → `translateX(300px)`
4. `.app-menu-overlay` goes from `opacity: 0` to `opacity: 1` with `pointer-events: auto`
5. Menu links switch from `flex-direction: row` (desktop) to `flex-direction: column` (mobile)

## Buttons

From the Cheat Sheet. Buttons are the most commonly used widget.

### Types

| Visual | Classes |
|--------|---------|
| Secondary (default) | `.btn` |
| Primary | `.btn .btn-primary` |
| Cancel | `.btn .btn-cancel` |
| Success | `.btn .btn-success` |
| Error | `.btn .btn-error` |

### Sizes

| Size | Classes |
|------|---------|
| Small | `.btn .btn-small` |
| Default | `.btn` |
| Large | `.btn .btn-large` |

### Shapes

Combine any button type/size with a border-radius class:

| Shape | Add class |
|-------|-----------|
| None (square) | `.border-radius-none` |
| Soft | `.border-radius-soft` |
| Rounded | `.border-radius-rounded` |
| Circle | `.border-radius-circle` |

### Loading State

Add `.btn-loading` to the button and include a spinner element inside. This is CSS-driven, not JavaScript.

```html
<button class="btn btn-primary btn-loading">
  <span class="btn-loading-spinner"></span>
  Loading...
</button>
```

### Button Specificity Warning

The `.btn` class sets its own `color` and `background-color` with high specificity. **DO NOT** try to override button colors with OSUI color utilities like `.background-neutral-0` or `.text-primary` — they will be overridden by `.btn` rules and the text will become invisible.

**Wrong** (text invisible — white on white):
```html
<button class="btn btn-primary background-neutral-0 text-primary">Open Account</button>
```

**Right** — use inline styles, a named class in `theme.css`, or a `<style>` block:
```html
<!-- Inline style (fine for one-off buttons) -->
<button class="btn" style="background: var(--bank-gold); color: var(--bank-navy); border: 2px solid var(--bank-gold);">Open Account</button>

<!-- Named class (preferred when reused across multiple elements) -->
<button class="btn hero-btn-primary">Open Account</button>
```
```css
/* theme.css */
.hero-btn-primary {
  background: var(--bank-gold) !important;
  color: var(--bank-navy) !important;
  border: 2px solid var(--bank-gold) !important;
}
```

If you need a button style that doesn't match `.btn-primary`, `.btn-cancel`, `.btn-success`, or `.btn-error`, use an inline style for one-off cases or create a custom class in `theme.css` when the same style is reused across multiple elements.

## Utility & Token Reference

Technical reference for utility classes (borders, spacing, typography, shadows) and pattern-scoped CSS variables.

**Load [references/utility-tokens.md](references/utility-tokens.md)** for the complete technical tables of these design tokens.

## Colors — Quick Reference

Most-used palette entries. Load [references/colors.md](references/colors.md) for the full extended + neutral palettes and all CSS variables.

### Brand Colors

| Name | Hex | Class (bg) | Class (text) | CSS Variable |
|------|-----|------------|--------------|--------------|
| Primary | #1068EB | `.background-primary` | `.text-primary` | `--color-primary` |
| Secondary | #303D60 | `.background-secondary` | `.text-secondary` | `--color-secondary` |

### Semantic Colors

| Name | Class (bg) | Class (text) | CSS Variable |
|------|------------|--------------|--------------|
| Info | `.background-info` | `.text-info` | `--color-info` |
| Success | `.background-success` | `.text-success` | `--color-success` |
| Warning | `.background-warning` | `.text-warning` | `--color-warning` |
| Error | `.background-error` | `.text-error` | `--color-error` |

## UI Pattern Categories

OutSystems UI includes 86 patterns across 8 categories plus 16 core widgets. All verified HTML structures are in **[references/ui-patterns.md](references/ui-patterns.md)** — load it when building any UI pattern.

| Category | Count | Key patterns |
|----------|-------|-------------|
| Adaptive | 12 | Columns 2–6, Columns Medium/Small Left/Right, Gallery, Master Detail, Display On Device |
| Content | 16 | Card, Card Background, Card Item, Card Sectioned, Accordion, Alert, Tag, Section, Tooltip, User Avatar, Chat Message, Flip Content, Floating Content, List Item Content, Blank Slate, Section Group |
| Interaction | 18 | Animated Label, Carousel, Date Picker, Dropdown Search, Dropdown Tags, Floating Actions, Input With Icon, Lightbox Image, Notification, Range Slider, Search, Sidebar, Stacked Cards, Video, Action Sheet, Animate, Scrollable Area, Range Slider Interval |
| Navigation | 9 | Breadcrumbs, Tabs, Pagination, Wizard, Timeline Item, Bottom Bar Item, Section Index, Submenu, Overflow Menu |
| Numbers | 6 | Badge, Counter, Icon Badge, Progress Bar, Progress Circle, Rating |
| Utilities | 9 | Align Center, Button Loading, Center Content, Inline SVG, Margin Container, Separator, Mouse Events, Swipe Events, Touch Events |
| Widgets | 16 | Button, Button Group, Checkbox, Dropdown, Feedback Message, Form, Input, Link, List, Popover, Popup, Radio Group, Switch, Table, TextArea, Upload |
| Advanced | 1 | DropdownServerSide |

For complete screen scaffolds (Dashboard, List/Detail, Form, Login, etc.), load [references/screen-templates.md](references/screen-templates.md).


## Core Layout Gotchas (CSS-only)

These behaviors are active in the `outsystems-ui.css` theme and affect visual rendering even in static prototypes.

| Gotcha | OSUI Behavior | Prototyping Fix |
|--------|---------------|-----------------|
| **Button Sibling** | `.btn + .btn` adds a 24px left margin. | Fails for `ButtonLoading` blocks. Use `.margin-left-m` or custom sibling selectors. |
| **List Clipping** | `.list.list-group` has `overflow: hidden`. | Clips Popovers/Tooltips inside lists. Add `.overflow-visible` override. |
| **Validation Overlap** | `.validation-message` uses `position: absolute`. | Overlaps elements below in dense forms. Use `position: static` override. |

**Load [references/architectural-heuristics.md](references/architectural-heuristics.md)** for deep platform behaviors (OSInline, OSBlockWidget, List Virtualization).

## Responsive & Device Classes

OutSystems uses a **JavaScript-based** responsive system, not CSS media queries. A runtime script detects the viewport size and applies device + orientation classes to `<body>`. All OSUI responsive CSS rules are scoped to these body classes.

### Body Classes

| Viewport width | Body class | Orientation class |
|----------------|-----------|-------------------|
| `< 768px` | `phone` | `portrait` (w ≤ h) or `landscape` (w > h) |
| `768px – 1024px` | `tablet` | `portrait` or `landscape` |
| `> 1024px` | `desktop` | `landscape` (typically) |

In the real OutSystems platform, this is handled by the platform runtime. For static `.visual.html` files, include the **`device-detect.js`** script at the bottom of `<body>` — it replicates the same behavior:

```html
<script src="../scripts/device-detect.js"></script>
```

This script runs on load AND on resize, so the body class updates when the browser window changes size.

### Column Break Behavior

Columns patterns (`columns2` through `columns6`, `columns-small-left`, etc.) stay side-by-side on desktop. On tablet and phone, you control how they collapse using **break classes**:

| Break class | Effect on the target breakpoint |
|-------------|--------------------------------|
| *(none)* | Columns keep their desktop proportions — no stacking |
| `{device}-break-all` | **All** columns stack to 100% width (full-width rows) |
| `{device}-break-first` | **First** column breaks to 100% width; remaining stay side-by-side |
| `{device}-break-last` | **Last** column breaks to 100% width; preceding stay side-by-side |
| `{device}-break-middle` | Middle columns break — behavior varies by column count (see below) |

Where `{device}` is `tablet` or `phone`. You can combine both independently:

```html
<!-- On tablet: first column breaks. On phone: all columns stack. -->
<div class="columns columns3 gutter-base tablet-break-first phone-break-all">
  <div class="columns-item">Sidebar</div>
  <div class="columns-item">Main</div>
  <div class="columns-item">Aside</div>
</div>
```

#### `break-middle` Details

`break-middle` is a halfway collapse — it reduces the column count without going to full-width:

| Column type | `break-middle` result |
|-------------|----------------------|
| `columns2` | All items → 100% width (same as break-all) |
| `columns3` | Last item → 100% width; first two stay side-by-side |
| `columns4` | All items → 50% width (2×2 grid) |
| `columns5` / `columns6` | First 3 items → 33.333% width (3-col row); rest flow below |
| `columns-small-left`, `-medium-left`, `-small-right`, `-medium-right` | All items → 100% width |

### Gutter Classes

The gutter controls spacing between columns. It works with break classes — when columns stack, the gutter becomes vertical margin:

| Gutter | Class |
|--------|-------|
| None | `gutter-none` |
| XS (4px) | `gutter-xs` |
| S (8px) | `gutter-s` |
| Base (16px) | `gutter-base` |
| M (24px) | `gutter-m` |
| L (32px) | `gutter-l` |
| XL (40px) | `gutter-xl` |
| XXL (48px) | `gutter-xxl` |

### Display On Device

Show/hide entire elements per breakpoint:

```html
<div class="display-on-device-desktop">Desktop only content</div>
<div class="display-on-device-tablet">Tablet only content</div>
<div class="display-on-device-phone">Phone only content</div>
```

These require the correct body class to work — so `device-detect.js` is required for static previews.

## Theme Customization

Every project ships three CSS files and one JS file, loaded in this order:

1. **`outsystems-ui.css`** — the OSUI framework (patterns, utilities, layout). Never edit this.
2. **`grid.css`** — platform grid definitions (`.ThemeGrid_Container` max-width, `.ThemeGrid_Width*` columns, `.ThemeGrid_MarginGutter` spacing, `.active-screen` scroll model). Normally injected by OutSystems at runtime — we provide it statically. Never edit this.
3. **`theme.css`** — project-specific brand tokens and custom styles. This is the only file you should edit.
4. **`device-detect.js`** (in `scripts/`) — viewport detection script that applies `phone`/`tablet`/`desktop` + `portrait`/`landscape` classes to `<body>`. Required for responsive column breaks and `display-on-device-*` classes. Never edit this.

All three `<link>` tags must be present in `<head>`, and the script at the bottom of `<body>`:
```html
<head>
  <link rel="stylesheet" href="../theme/outsystems-ui.css" />
  <link rel="stylesheet" href="../theme/grid.css" />
  <link rel="stylesheet" href="../theme/theme.css" />
</head>
<body>
  <!-- ... page content ... -->
  <script src="../scripts/device-detect.js"></script>
</body>
```

### What theme.css MUST contain

1. **Brand tokens** — override `:root` CSS variables:
   ```css
   :root {
     --color-primary: #1a56db;
     --color-secondary: #0a1628;
     --font-family-base: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
   }
   ```

2. **Custom component classes** — for styles that can't be achieved with OSUI utilities alone (e.g. hero buttons, gradient backgrounds, themed footers). Use **BEM naming** (`block__element--modifier`):
   ```css
   .hero__btn--primary { ... }
   .hero__btn--outline { ... }
   .footer__link--active { ... }
   .stats__number { ... }
   .card__icon--large { ... }
   ```
   BEM keeps custom classes predictable and avoids collisions with OSUI's own class names.

### What theme.css should NOT do

- Don't redefine OSUI layout structure (`.layout`, `.main`, `.content`, `.header-content`)
- Don't redefine grid classes (`.ThemeGrid_*`) — those belong in `grid.css`
- Don't add `@media` queries — OSUI handles responsiveness
- Don't override `.btn` base styles — create new named classes instead

### Common OSUI specificity traps

These OSUI classes set background/color with high specificity that utility classes can't override:

| Class | Sets | Don't override with |
|-------|------|--------------------|
| `.btn` | `color`, `background-color` | `.text-*`, `.background-*` |
| `.list-item` | `background-color: white` | Needs `background: transparent !important` in dark contexts |
| `.card` | `background-color: white` | Needs explicit override for dark backgrounds |
| `.badge` | `background-color`, `color` | Use `!important` or a custom class |

### Icons

OSUI does not bundle an icon font. If your screen uses Font Awesome icons (`<i class="fa fa-*">`), you MUST add the CDN link in `<head>`:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
```

Alternatively, use inline SVGs with the `.icon` class if you want to avoid external dependencies.

### Dark section styling

When placing content on a dark background (`.background-primary`, `.background-secondary`, or custom dark sections), remember:
- Use `.text-neutral-0` for white text (headings, paragraphs)
- Footer `.list-item` elements have `background: white` by default — override with `background: transparent !important`
- Links default to the primary color — use custom classes for white/light link colors
- Border colors may be invisible — use `border-color: rgba(255,255,255,0.1)` overrides

## Workflow

Follow this checklist when creating or editing a screen. Do not skip steps.

- [ ] Step 1: **Generate the screen** — create the `.visual.html` file and any `theme.css` updates
- [ ] Step 2: **Self-check** — verify the generated file against these rules:
  1. Root `<div>` has class `active-screen` wrapping a `.layout` div
  2. Inline `style=""` attributes are allowed — prefer OSUI utility classes for standard spacing/color/typography, but inline styles are valid for dynamic values, one-off visual tweaks, and computed positioning
  3. All classes are OSUI utilities OR custom classes defined in `theme.css` or `<style>` blocks
  4. All three CSS stylesheets linked in `<head>`: `outsystems-ui.css`, `grid.css`, `theme.css` (in that order)
  5. `device-detect.js` script tag present at end of `<body>`
  6. If Font Awesome icons are used, the FA CDN `<link>` is in `<head>`
  7. No `@media` queries or custom breakpoints
  8. Scroll model and grid are handled by `grid.css` (not duplicated in `theme.css`)
  9. **Text readability** — for every text element, confirm the text color contrasts with its background:
     - Dark backgrounds (`.background-primary`, `.background-neutral-10`, navy/dark sections) → use light text (`.text-neutral-0` or white custom class)
     - Light backgrounds (`.background-neutral-0`, white sections) → use dark text (`.text-neutral-10` or default)
     - **Header and menu links are especially prone** — if the header has a dark background, menu links MUST use a light text class. OSUI link defaults are the primary color, which may be invisible on a dark header.
     - Buttons: check that button text contrasts with the button background (`.btn` defaults to white text — don't add `.text-neutral-0` on a white button)
  10. **Responsive columns** — for every `.columns*` pattern, verify the break behavior:
     - Every multi-column layout SHOULD have a `phone-break-*` class. Without one, columns stay side-by-side on phone, which is almost always wrong.
     - Choose the right break: `phone-break-all` (stack everything) is the safe default. Use `phone-break-first`/`-last` when one column should stay full-width while others share a row.
     - For tablet, add `tablet-break-*` only if the column count is 4+ or if side-by-side is too cramped at 768px.
     - `break-middle` is the right choice for `columns4`–`columns6` on tablet — it goes to a 2- or 3-column grid instead of full-width stacking.
     - Verify gutter class is present (`gutter-base` is the safe default).
  11. If any check fails, fix and re-check before continuing
- [ ] Step 3: **Install dependencies** — if `node_modules/` does not exist, run `npm install`
- [ ] Step 4: **Start the dev server** — run `npm run dev` to serve the project at `http://localhost:5173/`
- [ ] Step 5: **Visual verification** — open the screen URL in the browser and check:
  - Layout renders correctly (no collapsed sections, no overlapping elements)
  - **Text readability** — read every section and confirm ALL text is visible against its background. Pay special attention to: header/nav menu links, buttons, text in dark sections, links in footers
  - Page scrolls within `.active-screen`
  - Icons render (not 0×0 invisible boxes)
  - Menu links and form fields have proper spacing (`.ThemeGrid_MarginGutter`)
  - If anything looks wrong, fix the issue and reload to verify the fix

## Gotchas

- **Columns require TWO classes on the parent + `.columns-item` children** — The parent MUST have both `.columns` AND the number class: `class="columns columns3 gutter-base"`. The `.columns` class provides `display: flex` — without it, items stack vertically. Children MUST be `class="columns-item"` — NOT `class="column"` (that class does not exist in OSUI). Wrong: `<div class="columns3"><div class="column">`. Right: `<div class="columns columns3 gutter-base"><div class="columns-item">`.
- `.active-screen` is **REQUIRED** as the outermost wrapper. Without it, utility classes and CSS variables will NOT resolve. It also serves as the **scroll container** \u2014 OSUI sets `html { overflow: hidden }` so `.active-screen` must have `overflow-y: auto; height: 100vh` (provided by `grid.css`).\n- **`.ThemeGrid_MarginGutter` needs `grid.css`** \u2014 this class is used for menu link spacing and form field gutters, but its `margin-left` value is NOT in `outsystems-ui.css`. It comes from `grid.css`. Without it, menu links will bunch together with no spacing.
- **Button + color utilities don't mix** — `.btn` overrides `color` and `background-color` at high specificity. Stacking `.btn .background-neutral-0 .text-primary` will produce invisible text (white on white). Create custom button classes in `theme.css` instead.
- **Header menu links vanish on dark headers** — OSUI link color defaults to `var(--color-primary)`. On a dark header where `--color-primary` is also dark (e.g. navy), menu links become invisible. Fix: add a custom class in `theme.css` that forces light link color in the header (e.g. `.header__link { color: #fff; }`).
- **`.list-item` has white background** — In dark-background sections (footer, sidebar), list items will show as white rectangles. Override with `background: transparent !important` in `theme.css`.
- **Font Awesome is not bundled** — If using `<i class="fa fa-exchange">` style icons, add the FA 4.7 CDN link to `<head>` or the icons will be invisible (0×0 size).
- OutSystems pattern previews render inside iframes — CSS resolves against the OSUI framework, not browser defaults. Your `.visual.html` must link the OSUI stylesheet.
- **Never mix** inline `style=""` attributes with utility classes. Always prefer utility classes.
- `.columns*` patterns auto-stack on mobile breakpoints **only if a break class is applied** (e.g. `phone-break-all`). Without a break class, columns stay side-by-side on all viewports. Do NOT add custom `@media` queries — use the break classes instead.
- **`device-detect.js` is required** — responsive column breaks and `display-on-device-*` classes are scoped to body classes (`phone`, `tablet`, `desktop`). Without the script, they have no effect in static previews.
- Button loading state is purely CSS (`.btn-loading` + spinner element), not a JavaScript toggle.
- Use `{{content}}` placeholders in component templates to indicate where nested child widgets go.
- Always generate BOTH the `.visual.html` AND corresponding `theme.css` styles together. A screen without proper theme styles will look broken.
