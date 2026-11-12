/**
 * Component — the base class every business component under
 * components/business/<name>/index.js extends. One contract, two levels of
 * ceremony: a purely presentational component overrides only render(); an
 * interactive one also overrides validate()/attachEvents()/update() and
 * tracks its own UI state in instance fields.
 *
 * See create-flowmo/skills/outsystems-ui/references/business-components.md
 * for the full contract, the state-preservation rule, and how this maps to
 * an OutSystems Block's OnReady/OnParametersChanged/OnDestroy.
 */
export class Component {
  constructor({ target, props = {}, onEvent = () => {} }) {
    this.target = target;
    this.props = props;
    this.onEvent = onEvent;
    this.errors = [];
    // Deliberately does NOT call render()/attachEvents() here. A subclass's
    // own field initializers and constructor body haven't run yet while
    // super() is still executing — render() called from inside this
    // constructor would see undefined for any state the subclass declares.
    // Call mount() once, right after construction, instead.
  }

  // Runs the initial render + wires events. Call this once, immediately
  // after `new` — never override; override render()/attachEvents() instead.
  mount() {
    this.render();
    this.attachEvents();
    return this;
  }

  // Subclasses set this.target.innerHTML here. Read only from this.props
  // and instance fields — never read a live value back out of the DOM.
  // update() can fire for reasons unrelated to what this component is
  // doing right now; if render() depends on something that only lives in
  // the DOM (an accordion's open/closed class, an input's current value),
  // an unrelated update() silently destroys it.
  render() {}

  update(nextProps) {
    this.props = { ...this.props, ...nextProps };
    this.render();
  }

  // No-op default — override for real validation. Return true/false (or
  // populate this.errors and return accordingly).
  validate() {
    return true;
  }

  // No-op default — override to wire DOM listeners on this.target.
  attachEvents() {}

  destroy() {
    this.target.innerHTML = '';
  }

  // Available to every subclass as this.esc(...) so the safe path costs
  // nothing extra to reach for.
  esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
