/**
 * layout-base — LayoutBase for landing pages and public screens.
 * Full-width sections, same header/nav as layout-top.
 */

export function mount(root, props = {}) {
  const { appName = 'App', menuLinks = [], user = { name: 'User' },
          title = '', actions = [] } = props;

  root.innerHTML = `
    <div class="active-screen">
      <div data-block="Layouts.LayoutBase" class="layout layout-blank fixed-header">
        <div class="main">

          <header role="banner" class="header">
            <div class="header-top ThemeGrid_Container">
              <div class="header-content display-flex">
                <div class="menu-icon" role="button" aria-label="Toggle the Menu">
                  <div class="menu-icon-line" aria-hidden="true"></div>
                  <div class="menu-icon-line" aria-hidden="true"></div>
                  <div class="menu-icon-line" aria-hidden="true"></div>
                </div>
                <div class="header-navigation">
                  <nav class="app-menu-content display-flex" role="navigation">
                    <div class="header-logo">
                      <div class="application-name display-flex align-items-center full-height">
                        <span class="heading6 text-neutral-8">${esc(appName)}</span>
                      </div>
                    </div>
                    <div class="app-menu-links" role="menubar">
                      ${menuLinks.map((link, i) => `
                        <a class="${link.active ? 'active' : ''}${i > 0 ? ' ThemeGrid_MarginGutter' : ''}"
                           role="menuitem" href="${esc(link.href || '#')}">${esc(link.label)}</a>
                      `).join('')}
                    </div>
                    <div class="app-login-info">
                      <div class="user-info"><span>${esc(user.name)}</span></div>
                    </div>
                  </nav>
                  <div class="app-menu-overlay" role="button" aria-label="Close Menu"></div>
                </div>
              </div>
            </div>
          </header>

          <div class="content">
            <div class="main-content" role="main">
              ${title ? `
              <div class="content-top display-flex align-items-center">
                <div class="content-top-title heading1">${esc(title)}</div>
                ${actions.length ? `
                <div class="content-top-actions">
                  ${actions.map(a => `<button class="btn ${a.primary ? 'btn-primary' : ''}">${esc(a.label)}</button>`).join('')}
                </div>` : ''}
              </div>` : ''}

              <div class="content-middle" id="content-slot"></div>
            </div>

            <footer role="contentinfo" class="content-bottom">
              <div class="footer ThemeGrid_Container"></div>
            </footer>
          </div>

        </div>
      </div>
    </div>
  `;

  return {
    getContentSlot() { return root.querySelector('#content-slot'); },
    destroy() { root.innerHTML = ''; },
  };
}
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
