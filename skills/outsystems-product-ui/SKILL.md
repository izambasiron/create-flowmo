---
name: outsystems-product-ui
description: >-
  Companion to the outsystems-ui skill. Overrides default OutSystems scaffolding
  to generate modern, high-fidelity, consumer-grade user interfaces. Defines
  visual identity (color ratios, typography, depth) and creative principles
  (progressive disclosure, micro-interactions, asymmetric layouts). Use this
  skill whenever a user requests a new screen, dashboard, widget, or UI
  component. This skill provides DESIGN guidance only — you MUST also follow
  the outsystems-ui skill for structural rules, layout templates, and the
  workflow checklist (generate → self-check → install → dev server → visual verify).
compatibility: Designed for OutSystems Service Studio (O11/ODC) and create-flowmo scaffolding.
metadata:
  version: "1.0"
  domain: "UI/UX Design"
---

# OutSystems Product UI Design Skill

> **This skill is a companion to `outsystems-ui`, not a replacement.**
> It adds creative design principles on top of the structural rules in `outsystems-ui`.
> You MUST follow both skills together. Specifically:
> - Use the layout templates, utility classes, and HTML structure from `outsystems-ui`
> - Follow the `outsystems-ui` **Workflow** checklist after generating every screen (generate → self-check → install deps → start dev server → visual verification)
> - Apply the design principles below to make the output visually polished

When generating OutSystems screens, act as a Senior Product Designer. Avoid standard "Service Center" aesthetic scaffolding — produce modern, consumer-grade interfaces instead.

## Core Creative Principles

### The Anti-Scaffold Rule

Never use the standard Table or List Screen patterns for consumer-facing apps unless explicitly requested. Use Gallery, custom Flex containers, or List with heavily customized Card Item widgets instead.

### Progressive Disclosure

Hide complex secondary details behind Accordion, Sidebar, or Popover patterns to keep the primary UI clean. Show only what the user needs at each step.

### State-Based Design

Always consider and design for:
- **Empty State** — use the Blank Slate pattern with a clear illustration or icon and a call-to-action
- **Active/Hover State** — interactive elements must have visible hover and active feedback
- **Loading State** — use skeleton placeholders or shimmer effects rather than spinners when possible

## Visual Identity & Application

Apply OutSystems UI utility classes (from `colors.md`) using modern design ratios.

### Color Ratio (60-30-10 Rule)

- **60% Base** (Backgrounds): Use `background-neutral-0` (light mode) or `background-neutral-10` (dark mode)
- **30% Secondary** (Cards/Containers): Use `background-neutral-1` or `background-neutral-9` to create subtle contrast against the base
- **10% Accent** (Actions): Reserve `background-primary`, `background-secondary`, or semantic colors (`background-success`, `background-error`) strictly for call-to-action buttons, active states, or critical badges

### Typography & Hierarchy

- **Hero Numbers** — use `.font-size-display` for massive dashboard metrics
- **Overlines** — use `.font-size-xs` combined with `.text-uppercase` and `.text-neutral-6` for category labels above titles
- **Readability** — avoid absolute black for body text. Use `.text-neutral-8` for primary text and `.text-neutral-6` for secondary text

### Depth & Texture

- **Shadows** — use `--shadow-s` for standard resting cards and `--shadow-l` for active, floating, or hovered elements to create a tactile feel
- **Visual techniques** — choose the right technique for the context:
  - **Glassmorphism** — semi-transparent background (e.g. `rgba(255,255,255,0.1)`) with `backdrop-filter: blur(16px)` and a subtle border. Good for overlays and floating panels
  - **Gradients** — subtle linear gradients for hero sections, card backgrounds, or accent strips
  - **Frosted glass** — blurred background with reduced opacity for navigation bars or sidebars
  - **Textured backgrounds** — subtle dot grids, noise, or geometric patterns for sections that need visual separation
  - **Layered shadows** — multiple box-shadows at different spreads for realistic depth

## Layout Configuration

Do not default to standard symmetric grids for everything.

### Asymmetry

Prefer `Columns Small Left` or `Columns Medium Right` to break up visual boxiness in dashboards and detail screens. Symmetric grids (`Columns2`, `Columns3`) are fine for card galleries and uniform content.

### Breaking the Box

Allow decorative icons, background shapes, or accent elements to bleed outside of their parent containers using `position: relative` / `position: absolute` and `overflow: hidden` on the parent. This creates visual interest and avoids the "everything in a rectangle" look.

### Whitespace

Use generous padding and margins. Cramped UIs feel cheap. When in doubt, go larger on spacing between sections (`padding-y-xxl`) and tighter within groups (`padding-y-s`).

## Micro-Interactions

Every primary interaction should have tactile feedback.

### Entrances

Use the Animate pattern (variants: `fade-in`, `bottom-to-top`, or `scale-up`) for lists and cards entering the viewport. Stagger animation delays across list items for a polished cascade effect.

### Feedback

Use Feedback Message or floating toasts for success states rather than redirecting the user. The user should stay in context after an action completes.

### Hover & Focus

Interactive cards should subtly lift on hover (translate + shadow change). Focus states should be visible and distinct from hover.

## Gotchas

- **Hardcoded colors** — never output hex codes in CSS if a CSS variable exists. Use `var(--color-primary)` instead of `#1068EB`. Custom hex values are fine for brand-specific colors that aren't in the OSUI palette.
- **Tables for everything** — `<table>` is correct for actual tabular data (spreadsheets, comparison grids, financial reports). But for consumer dashboards, product listings, or task views, use List with Card widgets or Gallery patterns instead. If you reach for a table and the data isn't genuinely tabular, reconsider.
- **Flat, monotone surfaces** — if every card, section, and container uses the same background color with no shadow or border variation, the UI will look flat and boring. Alternate between `background-neutral-0` and `background-neutral-1`, and apply shadow tokens to create visual layers.
- **Icon-less interfaces** — icons provide instant visual anchoring. Use them for navigation items, KPI cards, empty states, and action buttons. Rely on Font Awesome (already available via CDN link) or inline SVGs.
- **Skipping validation** — do NOT stop after generating the HTML file. You MUST complete the full workflow from the `outsystems-ui` skill: self-check the code, install dependencies if needed, start the dev server (`npm run dev`), and visually verify the screen in the browser. If you skip this, layout bugs and invisible text will go unnoticed.
