# Business Components

Reference for authoring reusable components under `components/business/` — the layer between a
one-off screen and a full OutSystems Block. This convention exists so a component can later be
bundled into a real OutSystems module by `npx flowmo block:build` (see that command's README
section in the `flowmo` package) without any rewrite. Every rule below is a precondition for that
command working, not just a style preference.

**"Interactive = must be rebuilt as a native OutSystems widget" is gone.** A component owns its own
UI state, client-side validation, and interaction handling; OutSystems owns data mutation, auth,
and server-side validation, and receives clean events from the component to act on. See "OutSystems
integration mapping" below for exactly how that boundary works.

## Directory convention

```
components/business/<kebab-case-name>/
  index.js     ← required — exports a class extending Component
  index.css    ← optional — styles scoped to this component
  demo.js      ← optional — demo props for previewing before real data is wired
components/shared/
  Component.js ← the base class every component extends (ships in the template)
  <name>.js    ← optional — other reusable code any component may import (e.g. esc.js)
```

`<kebab-case-name>` (e.g. `order-rail`) becomes a PascalCase component name (`OrderRail`) when
bundled. A screen imports and mounts a component the normal ES-module way:

```js
import { OrderRail } from '../../components/business/order-rail/index.js';
new OrderRail({ target: contentSlot, props: { orderNumber: '12345', tabs: ORDER_TABS } }).mount();
```

`flowmo block:build` bundles each component into its **own** folder under `dist/outsystems/` —
`dist/outsystems/OrderRail/OrderRail.js` + `OrderRail.css` — pasted as that component's own
Script resource and Style Sheet. This is deliberate: Service Studio doesn't diff or merge a pasted
Script resource, so keeping one file per component means two developers working on different
components never touch the same generated file. See that command's README section in the `flowmo`
package for the full paste workflow.

## The `Component` contract

`index.js` exports a class extending the shared `Component` base:

```js
import { Component } from '../../shared/Component.js';

export class OrderRail extends Component {
  render() {
    this.target.innerHTML = `<div class="order-rail">${this.esc(this.props.orderNumber)}</div>`;
  }
}
```

That's the whole contract for a purely presentational component — not meaningfully more ceremony
than a plain function, and it gets `update()`/`destroy()` for free. An interactive component just
overrides more of the base class:

```js
export class Component {
  constructor({ target, props = {}, onEvent = () => {} }) { /* stores target/props/onEvent */ }
  mount() { this.render(); this.attachEvents(); return this; }  // call once, right after `new`
  render() {}                          // set this.target.innerHTML here
  update(nextProps) { /* merges props, re-renders */ }
  validate() { return true; }          // override for real validation
  attachEvents() {}                    // override to wire DOM listeners
  destroy() { this.target.innerHTML = ''; }
  esc(s) { /* HTML-escape */ }         // this.esc(...) — free on every subclass
}
```

(The full, current source is `components/shared/Component.js` — read it directly rather than
trusting this copy to stay byte-for-byte in sync.)

- **One contract, two levels of ceremony — not two contracts.** There's no "which kind of component
  is this" decision for an author to make. A component that needs nothing but presentation
  overrides `render()`; one that needs validation and events overrides more of the base class. Same
  shape, same mental model, always.
- **`mount()` is deliberately separate from the constructor.** A subclass's own field initializers
  and constructor body haven't run yet while `super()` is still executing — `render()` called from
  inside the base constructor would see `undefined` for any state the subclass declares. Call
  `.mount()` once, immediately after `new` (the generated `OnReady` snippet — see below — already
  does this).
- **Rule: UI state that isn't purely derived from `props` lives in instance fields; `render()`
  reads only from `this.props`/instance fields, never back out of the live DOM.** `update()` can
  fire for reasons that have nothing to do with whatever the user is doing in this component right
  now (an unrelated `OnParametersChanged`), and `render()` does a wholesale `innerHTML` replacement.
  If render's output depends on something that only lives in the DOM — an accordion panel's
  open/closed class, an input's current value, focus/caret position — an unrelated `update()`
  silently destroys it: a snapped-shut accordion or a wiped partially-typed message, not a crash, so
  it reads as a flaky bug rather than an obvious one. Concretely: an accordion tracks
  `this.state = { open: false }` and toggles it in its own click handler before calling
  `this.render()`; a text input mirrors its own `input` event into an instance field so a re-render
  restores what the user typed instead of reverting to stale props. This is the rule that makes
  `update()` idempotent instead of destructive.
- **Cross-imports are allowed from `components/shared/`, never from another component.** A
  component's `index.js` may `import` a named export from a file under `components/shared/` (e.g.
  `import { esc } from '../../shared/esc.js';`), but must not import another business component.
  Each component file needs to stand alone relative to its siblings. Files under
  `components/shared/` may import each other with a relative named import (`import { esc } from
  './esc.js';`) and nothing else: `block:build` concatenates them into one script, drops those
  imports, and orders each file after the ones it imports. Don't use `export default` in a
  component, and don't name a component folder `shared` or `component`; `block:build` skips those.
- **Why this is a hard rule, not a style preference:** OutSystems can't host ES modules.
  `flowmo block:build` bundles each component by stripping its `export` keyword and wrapping the
  rest in an IIFE — a cross-component import would break silently or not at all under that
  transform, with nothing to resolve it. A `components/shared/` import is the one exception, and
  it works because `block:build` specifically rewrites it: `import { esc } from
  '../../shared/esc.js';` becomes `const { esc } = window.<Namespace>.Shared;` in the bundled
  output. **`Component` itself is a further exception within that exception**: it's exposed as
  `window.<Namespace>.Component` directly, not `window.<Namespace>.Shared.Component` — because
  `class X extends Component` evaluates the `extends` expression at **parse time**, and that load
  order is genuinely load-bearing (confirmed against a live ODC app, 2026-08-30 — see the components
  plan §2.4): if the shared script hasn't finished loading when a component script parses, it
  throws `Cannot extend undefined` immediately, in every browser, every time. `flowmo block:build`
  always emits `<Namespace>-Shared.js` as a single Script resource pasted before any component's —
  keep it that way if you ever reorder resources by hand.

**A plain `export function render(props) { return '...'; }` (no class) is still accepted** by
`flowmo block:build` for components not yet migrated to the `Component` contract — nothing forces
migrating all of them at once. But it's a legacy path, not an ongoing second option: new components
should use the class contract from the start.

## Escape untrusted values — even with static mock data

Use `this.esc(...)` — it's on the base class, so the safe path costs nothing extra to reach for:

```js
export class OrderRail extends Component {
  render() {
    this.target.innerHTML = `<div class="order-rail">${this.esc(this.props.orderNumber)}</div>`;
  }
}
```

This matters even while every screen still runs on hand-written mock data: an escaping gap is
invisible with today's fixtures and becomes a real bug the first time a real value contains `&`
or `<` — by which point it's live data, not a screen you're iterating on.

## Don't copy-paste a sibling's internal helpers

If two components need the same internal shape (e.g. a label/value row) beyond what `this.esc()`
already covers, put it under `components/shared/` and have both import it, rather than copying the
helper into each component and letting the two drift. A copy is exactly where a fix like the one
above stops being applied consistently: it lives in the original, not in the copy nobody remembered
was a copy — this happened for real (`table-status-card`'s copy of `order-summary-card`'s field helper
dropped its escaping call). A style shared
across components that isn't JS at all still belongs in `theme.css` as a class both use.

## CSS: one file, one destination

`index.css`, if present, targets **this component's own Block Style Sheet** once ported — nothing
else. See `architectural-heuristics.md` §1 for why this specifically means a bare selector that
merely *ties* an `outsystems-ui.css` rule's specificity will lose live even though it may look
fine in a local preview; qualify the selector with a class the component's own root element
carries, and make it a **compound selector** (`.card.my-component`), not a same-specificity rule on
a separate, uniquely-named class applied to the same element — a same-specificity rule loses to
whichever rule loads later regardless of whether the two selectors share a name, confirmed live
2026-08-30.

## `demo.js`: props for previewing before data is wired

```js
// components/business/order-rail/demo.js
export default {
  orderNumber: '12345',
  tabs: [{ label: 'General Details', href: '#', active: true }],
};
```

`flowmo block:build` reads this (default export, or a named `demoData` export) and bakes it into
`window.<Namespace>.demoData.<ComponentName>`. The generated `OnReady` snippet (see each component's
own generated `<Name>.js` header) falls back to it when no real prop value is wired yet:
`props: $parameters.InitialValue || window.<Namespace>.demoData.<ComponentName>` — so a pasted
Block renders a real-looking layout in Service Studio before any aggregate is wired up. Without a
`demo.js`, `block:build` still bundles the component — it just warns and falls back to `{}`, which
usually means an empty-looking Block until real props are wired.

## OutSystems integration mapping

Each component pairs with one Block. The Block's three JavaScript lifecycle nodes are the entire
bridge — see each component's own generated `<Name>.js` header for its exact, ready-to-paste calls:

- **`OnReady`** → `window.<Namespace>.instances[$parameters.ContainerId] = new
  window.<Namespace>.<Name>({ target, props, onEvent }).mount();`
- **`OnParametersChanged`** → `window.<Namespace>.instances[$parameters.ContainerId]?.update({ ...changed props });`
- **`OnDestroy`** → `window.<Namespace>.instances[$parameters.ContainerId]?.destroy();` then delete
  the registry entry.

**Why a `window.<Namespace>.instances` registry, not something OutSystems itself holds**: there is
no `$block` (or any other) object giving a JavaScript node direct access to a Block's Local
Variables — confirmed live, 2026-08-30. A JS node only ever sees its own declared input/output
parameters; even a correctly-wired Local Variable can't hold a live JS object reference with
methods and DOM ties, since it's part of OutSystems' own reactive data model, not a place designed
for that. Keeping the instance in `window.<Namespace>.instances`, keyed by the container's element
id (an input parameter every lifecycle action already receives), sidesteps this entirely — the
instance lives purely in JS-land.

**The `onEvent(name, payload)` bridge**: wire one generic Client Action per Block
(`HandleJsEvent(eventName, payloadJson)` or similar) that deserializes the JSON and dispatches to
whatever OutSystems-side logic that event should trigger. A component calls
`this.onEvent('onChange', { value })` from inside its own `attachEvents()`/`validate()` — it never
needs to know what OutSystems does with that event. The division of responsibility: the component
owns UI state and client-side validation; OutSystems owns data mutation, auth, and server-side
validation. Nothing here asks OutSystems to bind directly into a component's internals, and nothing
here asks a component to know about entities, security, or server actions.
