/**
 * esc(s) — HTML-escape a value before interpolating it into a component's
 * render() output. Import this instead of writing a local copy: a copy is
 * exactly where an escaping fix stops being applied consistently once one
 * component's copy diverges from another's (see
 * flowmo/reviews/2026-08-29-efm-cargo-retro.md §4 for a real instance of
 * this happening).
 *
 * `flowmo block:build` rewrites this import into a global reference when
 * bundling for OutSystems — see
 * create-flowmo/skills/outsystems-ui/references/business-components.md.
 */
export function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
