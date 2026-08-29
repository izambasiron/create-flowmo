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
```

`<kebab-case-name>` (e.g. `job-nav-rail`) becomes a PascalCase component name (`JobNavRail`) when
bundled. A screen imports and mounts a component the normal ES-module way:

```js
import { render } from '../../components/business/job-nav-rail/index.js';
contentSlot.innerHTML = render({ jobNumber: '12345', tabs: JOB_TABS });
```

## The `render(props)` contract

`index.js` must export a `render` function shaped exactly like this:

```js
export function render(props) {
  return `<div class="job-nav-rail">...</div>`;
}
```

- **Pure, and only this.** `render(props)` takes props in, returns an HTML string out. No DOM
  reads, no globals, no side effects.
- **Zero cross-imports between components.** A component's `index.js` may import shared utilities
  from outside `components/business/` (e.g. an escaping helper), but must not import another
  business component. Each file needs to stand alone.
- **Why this is a hard rule, not a style preference:** OutSystems can't host ES modules.
  `flowmo block:build` bundles each component by stripping its `export` keyword and wrapping the
  rest in an IIFE. That transform only works — with no real bundler, no dependency graph to
  resolve — because there's nothing to resolve. A component that imports another component, or
  reaches for a DOM/global side effect, breaks silently or not at all under this transform; it
  won't surface until someone runs `block:build` against it.

## Escape untrusted values — even with static mock data

Interpolate props into the returned HTML with an escaping helper, not raw template
interpolation:

```js
function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function render(props) {
  return `<div class="job-nav-rail">${esc(props.jobNumber)}</div>`;
}
```

This matters even while every screen still runs on hand-written mock data: an escaping gap is
invisible with today's fixtures and becomes a real bug the first time a real value contains `&`
or `<` — by which point it's live data, not a screen you're iterating on.

## Don't copy-paste a sibling's internal helpers

If two components need the same internal shape (e.g. a label/value row), share one utility —
in a small local module both import, or lifted into `theme.css` as a class both use — rather than
copying the helper into each component and letting the two drift. A copy is exactly where an
escaping fix like the one above stops being applied consistently: it lives in the original, not
in the copy nobody remembered was a copy.

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
the bundled Script resource, so a pasted Block renders a real-looking layout in Service Studio
before any aggregate is wired up. Without a `demo.js`, `block:build` still bundles the component —
it just warns and falls back to `{}`, which usually means an empty-looking Block until real props
are wired.

## When something should *not* be a component

A component ports into OutSystems by injecting its rendered HTML string into an empty container
(`el.innerHTML = render(props)`). That only carries **read-only, presentational** markup. Anything
that needs an OutSystems binding or event — a dropdown, a form input, a button wired to a screen
action — cannot be ported this way: `innerHTML` injection has no mechanism for OutSystems to
attach a binding to what it didn't render itself. For that content, build it directly in the
screen as native OutSystems widgets once you're wiring the real screen — a business component
under this convention is only ever a read-only shortcut for markup that's genuinely the same
everywhere it's used.
