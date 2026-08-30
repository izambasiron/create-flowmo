# Business Components

Reference for authoring reusable components under `components/business/` — the layer between a
one-off screen and a full OutSystems Block. This convention exists so a component can later be
bundled into a real OutSystems module by `npx flowmo block:build` (see that command's README
section in the `flowmo` package) without any rewrite. Every rule below is a precondition for that
command working, not just a style preference.

## Directory convention

```
components/business/<kebab-case-name>/
  index.js     ← required — the render function
  index.css    ← optional — styles scoped to this component
  demo.js      ← optional — demo props for previewing before real data is wired
components/shared/
  <name>.js    ← optional — reusable code any component may import (e.g. esc.js)
```

`<kebab-case-name>` (e.g. `job-nav-rail`) becomes a PascalCase component name (`JobNavRail`) when
bundled. A screen imports and mounts a component the normal ES-module way:

```js
import { render } from '../../components/business/job-nav-rail/index.js';
contentSlot.innerHTML = render({ jobNumber: '12345', tabs: JOB_TABS });
```

`flowmo block:build` bundles each component into its **own** folder under `dist/outsystems/` —
`dist/outsystems/JobNavRail/JobNavRail.js` + `JobNavRail.css` — pasted as that component's own
Script resource and Style Sheet. This is deliberate: Service Studio doesn't diff or merge a pasted
Script resource, so keeping one file per component means two developers working on different
components never touch the same generated file. See that command's README section in the `flowmo`
package for the full paste workflow.

## The `render(props)` contract

`index.js` must export a `render` function shaped exactly like this:

```js
export function render(props) {
  return `<div class="job-nav-rail">...</div>`;
}
```

- **Pure, and only this.** `render(props)` takes props in, returns an HTML string out. No DOM
  reads, no globals, no side effects.
- **Cross-imports are allowed from `components/shared/`, never from another component.** A
  component's `index.js` may `import` a named export from a file under `components/shared/` (e.g.
  `import { esc } from '../../shared/esc.js';`), but must not import another business component.
  Each component file needs to stand alone relative to its siblings.
- **Why this is a hard rule, not a style preference:** OutSystems can't host ES modules.
  `flowmo block:build` bundles each component by stripping its `export` keyword and wrapping the
  rest in an IIFE — a cross-component import would break silently or not at all under that
  transform, with nothing to resolve it. A `components/shared/` import is the one exception, and
  it works because `block:build` specifically rewrites it: `import { esc } from
  '../../shared/esc.js';` becomes `const { esc } = window.<Namespace>.Shared;` in the bundled
  output (everything under `components/shared/` is bundled once into its own
  `<Namespace>-Shared.js`, exposing each named export as `window.<Namespace>.Shared.<name>`). Local
  dev keeps the real ES import — only `block:build`'s output changes shape.

## Escape untrusted values — even with static mock data

Import the shared escaping helper rather than writing a local copy, and interpolate props into the
returned HTML through it, not raw template interpolation:

```js
import { esc } from '../../shared/esc.js';

export function render(props) {
  return `<div class="job-nav-rail">${esc(props.jobNumber)}</div>`;
}
```

This matters even while every screen still runs on hand-written mock data: an escaping gap is
invisible with today's fixtures and becomes a real bug the first time a real value contains `&`
or `<` — by which point it's live data, not a screen you're iterating on.

## Don't copy-paste a sibling's internal helpers

If two components need the same internal shape (e.g. a label/value row), put it under
`components/shared/` and have both import it, rather than copying the helper into each component
and letting the two drift. A copy is exactly where an escaping fix like the one above stops being
applied consistently: it lives in the original, not in the copy nobody remembered was a copy — this
happened for real (`job-voyage-card`'s copy of `job-context-card`'s field helper dropped its
escaping call; see `flowmo/reviews/2026-08-29-efm-cargo-retro.md` §4). A style shared across
components that isn't JS at all still belongs in `theme.css` as a class both use.

## CSS: one file, one destination

`index.css`, if present, targets **this component's own Block Style Sheet** once ported — nothing
else. See `architectural-heuristics.md` §1 for why this specifically means a bare selector that
merely *ties* an `outsystems-ui.css` rule's specificity will lose live even though it may look
fine in a local preview; qualify the selector with a class the component's own root element
carries.

## `demo.js`: props for previewing before data is wired

```js
// components/business/job-nav-rail/demo.js
export default {
  jobNumber: '12345',
  tabs: [{ label: 'General Details', href: '#', active: true }],
};
```

`flowmo block:build` reads this (default export, or a named `demoData` export) and bakes it into
that component's own generated Script resource, so a pasted Block renders a real-looking layout in
Service Studio before any aggregate is wired up. Without a `demo.js`, `block:build` still bundles
the component — it just warns and falls back to `{}`, which usually means an empty-looking Block
until real props are wired.

## When something should *not* be a component

A component ports into OutSystems by injecting its rendered HTML string into an empty container
(`el.innerHTML = render(props)`). That only carries **read-only, presentational** markup. Anything
that needs an OutSystems binding or event — a dropdown, a form input, a button wired to a screen
action — cannot be ported this way: `innerHTML` injection has no mechanism for OutSystems to
attach a binding to what it didn't render itself. For that content, build it directly in the
screen as native OutSystems widgets once you're wiring the real screen — a business component
under this convention is only ever a read-only shortcut for markup that's genuinely the same
everywhere it's used.
