/**
 * layout-blank — Minimal layout for login, error, and splash screens.
 * No header, no footer, no navigation. Just a centered content area.
 */

export function mount(root, props = {}) {
  root.innerHTML = `
    <div class="active-screen">
      <div class="layout blank">
        <div class="content" role="main">
          <div class="main-content" id="content-slot"></div>
        </div>
      </div>
    </div>
  `;

  return {
    getContentSlot() { return root.querySelector('#content-slot'); },
    destroy() { root.innerHTML = ''; },
  };
}
