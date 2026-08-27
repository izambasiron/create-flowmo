/**
 * layout-side — LayoutSideMenu for admin/backoffice with many pages.
 *
 * Same props as layout-top. Sidebar sits OUTSIDE .main as a sibling.
 */

export function mount(root, props = {}) {
  const { appName = 'App', menuLinks = [], user = { name: 'User' },
          breadcrumbs = [], title = '', actions = [] } = props;

  root.innerHTML = `
    <div class="active-screen">
      <div data-block="Layouts.LayoutSideMenu" class="layout layout-side fixed-header">

        <aside class="aside-navigation" role="complementary">
          <div class="app-menu-content">
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
              <div class="user-info">
                <span>${esc(user.name)}</span>
              </div>
            </div>
          </div>
          <div class="app-menu-overlay" role="button" aria-label="Close Menu"></div>
        </aside>

        <div class="main">

          <header role="banner" class="header">
            <div class="header-top ThemeGrid_Container">
              <div class="header-content display-flex">
                <div class="menu-icon" role="button" aria-label="Toggle the Menu">
                  <div class="menu-icon-line" aria-hidden="true"></div>
                  <div class="menu-icon-line" aria-hidden="true"></div>
                  <div class="menu-icon-line" aria-hidden="true"></div>
                </div>
                <div class="application-name">
                  <span class="heading6 text-neutral-8">${esc(appName)}</span>
                </div>
              </div>
            </div>
          </header>

          <div class="content">
            <div class="main-content ThemeGrid_Container" role="main">
              ${breadcrumbs.length ? `
              <div class="content-breadcrumbs">
                <nav aria-label="breadcrumb" class="breadcrumbs">
                  <div class="breadcrumbs-content">
                    ${breadcrumbs.map((c, i) => `
                      <div class="breadcrumbs-item">
                        <div class="title"><a href="#">${esc(c)}</a></div>
                        ${i < breadcrumbs.length - 1 ? '<div class="placeholder-empty"><i class="icon fa fa-angle-right fa-1x"></i></div>' : ''}
                      </div>
                    `).join('')}
                  </div>
                </nav>
              </div>` : ''}

              <div class="content-top display-flex align-items-center">
                <div class="content-top-title heading1">${esc(title)}</div>
                ${actions.length ? `
                <div class="content-top-actions">
                  ${actions.map(a => `<button class="btn ${a.primary ? 'btn-primary' : ''} btn-small">${esc(a.label)}</button>`).join('')}
                </div>` : ''}
              </div>

              <div class="content-middle" id="content-slot"></div>
            </div>
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
