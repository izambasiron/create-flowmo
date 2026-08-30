# Architectural Idiosyncrasies — OutSystems UI

Deep technical guide for automated agents interfacing with the OutSystems UI DOM and CSS engines.

## 1. CSS Load Hierarchy & Scope

**ODC (Developer Cloud), confirmed empirically** by reading `document.styleSheets` on a live
deployed app (source: `flowmo/reviews/2026-08-29-efm-cargo-retro.md` §2 — corrects this section's
previous claim, which was written at initial release with no live verification and had the order
backwards):

1.  **Web Block CSS** — loads *first*. Counter to what you'd expect: a Block's stylesheet is
    bundled module-wide (not scoped to the block) and it is evaluated *before* the platform's own
    OSUI rules.
2.  **`outsystems-ui.css` (Base Theme)** — OSUI's own rules load next and win any specificity tie
    against a Block rule.
3.  **Application Theme CSS / Theme Editor CSS** — safe: always loads after OSUI.
4.  **Screen CSS** — safe: loads last.

> [!WARNING]
> **Load order does not favor the Block.** Because Block CSS loads *before* OSUI, a Block rule
> that merely *ties* an OSUI rule's specificity (e.g. a bare `.card` selector against OSUI's own
> `.card`) wins in a naive local preview — where component CSS is typically loaded last — but
> **loses live**, since OSUI's same-specificity rule loads after it there. Do not rely on load
> order to make a Block rule win. Qualify the selector with a class the element already carries
> instead (`.card.my-block__card`, not `.card`). This cost three confirmed live bugs in one
> project (wrong card background, lost OSUI padding on two containers) before the local preview
> was corrected to mirror this exact order — verify Block CSS overrides against a harness that
> loads Block → OSUI → Theme → Screen, not one that loads OSUI first.
>
> **Namespace Web Block styles regardless** — a unique parent class per block is still the
> baseline hygiene that makes the qualifying-selector fix above possible in the first place.
>
> **The qualifying class has to be *compounded* onto the same selector, not written as its own
> independent rule.** Confirmed live, 2026-08-30, on a second app: a Block CSS rule like
> `.my-block { border: ...; }`, applied to an element that also carries `.card`, **still loses** to
> OSUI's own `.card { border: ...; }` — even though `.my-block` is uniquely named and doesn't
> collide with OSUI's own vocabulary. Equal-specificity cascade resolves per CSS *property*, by
> whichever rule loads later, across *every* rule that matches the element — it doesn't care
> whether the winning rule's selector happens to share a name with yours. The fix is the compound
> form from the example above (`.card.my-block__card`), which raises specificity above the plain
> `.card` rule; a same-specificity rule on a separate class, however uniquely named, does not.
>
> *If a project targets O11 rather than ODC and observes a different order there, that needs its
> own live verification before this section is split by platform — the claim above is ODC-only.*

---

## 2. Platform DOM Wrappers

The OutSystems compiler injects proprietary wrappers that can disrupt Flexbox and Grid layouts.

### .OSInline
- **Trigger**: Applied to containers with no defined width.
- **Effect**: Forces `display: inline-block; vertical-align: top;`.
- **Heuristic**: Do not override globally. Use chained selectors: `.my-container.OSInline { display: flex; }`.

### .OSBlockWidget
- **Trigger**: Wraps Web Blocks and Placeholders.
- **Effect**: Intercepts Flex/Grid rules between a parent and its intended children.
- **Heuristic**: Apply `display: contents;` to the wrapper to bypass its box model and promote children to the parent formatting context.
- **Caveat — scope this, don't apply it globally.** `.OSBlockWidget` is a platform-generic class,
  and per §1, Block CSS (where you'd naturally reach for this rule) is bundled **module-wide** —
  an unscoped `.OSBlockWidget { display: contents; }` reaches every Block in the module, not just
  the one you're fixing. Where the goal is specifically re-establishing a broken flex/grid height
  chain (a Block's content not stretching to fill a fixed-height flex parent), confirmed live
  fix scoped it to the parent context instead: `.right-panel *:has(.my-block) { display: flex;
  flex-direction: column; flex: 1; min-height: 0; }` — `:has()` reaches through however many
  wrapper layers the platform actually inserts (it may be more than one), rather than assuming
  exactly one `.OSBlockWidget` layer. Prefer this scoped-and-`:has()`-qualified form when the fix
  is for one block's layout, not a project-wide rule.

---

## 3. Sibling Margin Paradox

### Button Spacing
OSUI uses `.btn + .btn { margin-left: var(--space-m); }` to separate buttons.
- **Gotcha**: Composite components (like `ButtonLoading`) are wrapped in `[data-block]` nodes and do not trigger this sibling rule.
- **Heuristic**: Use attribute-based sibling selectors to bridge the gap:
  ```css
  .btn + [data-block],
  [data-block] + .btn,
  [data-block] + [data-block] {
      margin-left: var(--space-m);
  }
  ```

---

## 4. List Widgets & Reactivity

### Virtualization
- **Gotcha**: Lists used for structural patterns (Tabs, Carousels, Galleries) will unmount "off-screen" items, destroying the layout physics.
- **Heuristic**: Set `disable-virtualization = True` for any List used as a structural container.

### Hidden Script Injection (Flexbox Gap)
- **Gotcha**: Lists inject hidden `<script>` tags for telemetry. Modern `gap` properties in Flexbox will apply spacing to these invisible nodes.
- **Heuristic**: Hide the scripts from the render tree:
  ```css
  .script-hidden script {
      display: none !important;
  }
  ```

---

## 5. Form Validation & Stacking

### Validation Message Positioning
- **Default**: `.validation-message` is `position: absolute; bottom: -32px;`.
- **Gotcha**: In dense grids or Flexbox rows, error messages overlap the elements below.
- **Heuristic**: Force validation messages into the natural DOM flow:
  ```css
  .form span.validation-message {
      position: static !important;
      white-space: pre-wrap !important;
      height: auto;
  }
  ```

### ButtonGroup Validation Disconnect
- **Gotcha**: The ButtonGroup widget wrapper lacks `position: relative;`. Since `.validation-message` uses `position: absolute;`, the browser walks up the DOM tree and anchors the error text to the nearest positioned ancestor — often the page content container. The error appears pinned to the bottom of the screen, completely disconnected from the ButtonGroup.
- **Heuristic**: Inject `position: relative;` on the parent container of any validated ButtonGroup:
  ```css
  .button-group-wrapper {
      position: relative;
  }
  ```

### Z-Index & Overflow
- **List Clipping**: `.list.list-group` has `overflow: hidden`. Tooltips inside lists will be clipped. Use `.list-group { overflow: visible; }`.
- **Popup/DatePicker Collision**: DatePickers in Popups may render behind the modal. Use AdvancedFormat JSON: `{"appendTo": document.body}`.

---

## 6. DOM Wrapper Quick Reference

| Wrapper | Trigger | Layout Disruption | Heuristic Override |
|---------|---------|-------------------|--------------------|
| `.OSInline` | Container without explicit width | Forces `display: inline-block`, breaks flex/grid | Chained selector: `.custom-class.OSInline { display: flex; }` |
| `.OSBlockWidget` | Wraps Web Blocks & Placeholders | Intercepts parent flex/grid child targeting | `display: contents;` to bypass box model — scope it (see §2), it's module-wide |
| `.list.list-group` | List widget container | `overflow: hidden` clips tooltips/popovers | `overflow: visible;` via chained class |
| `.validation-message` | Form validation error | `position: absolute` overlaps dense layouts | `position: static !important;` |

---

## 7. Dropdown Dimensional Constraints

### Width Truncation
- **Default**: Dropdown content list assumes `width: 100%` of its parent.
- **Gotcha**: Compact inline dropdowns (e.g., currency selector next to an input) truncate option text with ellipsis when the parent is narrow.
- **Heuristic**: Allow the options menu to size based on content:
  ```css
  .dropdown-content-list a {
      white-space: nowrap;
  }
  .dropdown.dropdown-content.dropdown-content-list {
      width: unset;
  }
  ```

### Chevron Icon Alignment
- The dropdown chevron is anchored inside `.content-middle`. Width adjustments must target this node, not the outer wrapper.

---

## 8. ODC vs O11 Paradigms

| Feature | OutSystems 11 (O11) | OutSystems Developer Cloud (ODC) |
|---------|---------------------|----------------------------------|
| Architecture | Monolithic/Deeply Nested | Containerized/Flattened DOM |
| Reusability | Modules (Dependency Hell) | Libraries (Isolated Containers) |
| Legacy | Supports Traditional Web | Reactive Only (Strict) |
| CSS Isolation | Shared across tenant | Isolated per Application |

---

## 9. Native `[hidden]` Loses to OSUI's Own Display Rules

- **Trigger**: An element toggled with the native `hidden` attribute (or `el.hidden = true`) sits
  inside a pattern OSUI itself gives a `display` value — the Accordion content panel is the
  confirmed case (`.osui-accordion-item__content { display: block; }`).
- **Effect**: `hidden` sets `display: none` via the UA stylesheet, which carries **no CSS
  specificity** — any author rule with a real selector beats it on the cascade, `!important` or
  not. OSUI's own `display: block` on the same element wins, and a "collapsed" panel renders
  visibly open with no error anywhere.
- **Heuristic**: Add one global override rather than fighting this per-component:
  ```css
  [hidden] {
      display: none !important;
  }
  ```
  This is one of the few cases where a global `!important` on a plain attribute selector is the
  right call — it restores the UA behavior `hidden` is supposed to have, rather than overriding
  a specific OSUI class.
