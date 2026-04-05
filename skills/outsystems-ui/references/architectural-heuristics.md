# Architectural Idiosyncrasies — OutSystems UI

Deep technical guide for automated agents interfacing with the OutSystems UI DOM and CSS engines.

## 1. CSS Load Hierarchy & Scope

OutSystems injects style sheets into the head in a deterministic sequence:
1.  **Base Theme CSS**: Foundational OSUI styles.
2.  **Application Theme CSS**: Global custom styles.
3.  **Screen CSS**: Screen-specific logic.
4.  **Web Block CSS**: Reusable component styles (evaluated *after* Screen CSS).
5.  **Theme Editor CSS**: Dynamically generated styles.
6.  **Inline CSS**: Widget-level attribute panel styles.

> [!WARNING]
> **Scope Bleeding**: Because Web Block CSS is loaded *after* Screen CSS, un-namespaced rules in a block will override identical classes on the parent Screen. **Always namespace Web Block styles** in a unique parent class.

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
| `.OSBlockWidget` | Wraps Web Blocks & Placeholders | Intercepts parent flex/grid child targeting | `display: contents;` to bypass box model |
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
