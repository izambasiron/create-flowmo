/**
 * layout-top — LayoutTopMenu for web apps with 3–6 top-level pages.
 *
 * Props:
 *   appName: string        — app name displayed in header
 *   menuLinks: Array<{label, href, active?}> — nav links
 *   user: { name, avatar? } — current user info
 *   breadcrumbs: string[]  — breadcrumb trail (optional)
 *   title: string          — page title
 *   actions: Array<{label, primary?, href?}> — action buttons (optional)
 *
 * Usage:
 *   import { mount } from '../../components/layouts/layout-top/index.js';
 *   const layout = mount(document.getElementById('app-root'), {
 *     appName: 'SSR',
 *     menuLinks: [
 *       { label: 'My Timesheet', href: '#' },
 *       { label: 'Approvals', href: '#' },
 *       { label: 'Projects', href: '#', active: true },
 *     ],
 *     user: { name: 'Izam' },
 *     breadcrumbs: ['Projects', 'SSR-90-9876'],
 *     title: 'Project Plan',
 *     actions: [{ label: 'Save Changes', primary: true }],
 *   });
 *   // Content slot: document.getElementById('content-slot')
 */

export function mount(root, props = {}) {
  const {
    appName = 'App',
    menuLinks = [],
    user = { name: 'User' },
    breadcrumbs = [],
    title = '',
    actions = [],
  } = props;

  root.innerHTML = `
    <div class="active-screen">
      <div data-block="Layouts.LayoutTopMenu" class="layout layout-top fixed-header">
        <div class="main">

          <header role="banner" class="header">
            <div class="header-top ThemeGrid_Container">
              <div class="header-content display-flex">

                <div class="menu-icon" role="button" aria-label="Toggle the Menu" aria-haspopup="true">
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
                      <div class="user-info">
                        <div class="padding-y-base display-flex align-items-center">
                          <span>${esc(user.name)}</span>
                        </div>
                      </div>
                    </div>
                  </nav>
                  <div class="app-menu-overlay" role="button" aria-label="Close Menu"></div>
                </div>

              </div>
            </div>
          </header>

          <div class="content">
            <div class="main-content ThemeGrid_Container" role="main">

              ${breadcrumbs.length ? `
              <div class="content-breadcrumbs" id="b1-Breadcrumbs">
                <nav aria-label="breadcrumb" class="breadcrumbs">
                  <div class="breadcrumbs-content">
                    ${breadcrumbs.map((crumb, i) => `
                      <div class="breadcrumbs-item">
                        <div class="title"><a href="#">${esc(crumb)}</a></div>
                        ${i < breadcrumbs.length - 1 ? '<div class="placeholder-empty" aria-hidden="true"><i class="icon fa fa-angle-right fa-1x"></i></div>' : ''}
                      </div>
                    `).join('')}
                  </div>
                </nav>
              </div>` : ''}

              <div class="content-top display-flex align-items-center">
                <div class="content-top-title heading1" id="b1-Title">${esc(title)}</div>
                ${actions.length ? `
                <div class="content-top-actions" id="b1-Actions">
                  ${actions.map(a => `
                    <button class="btn ${a.primary ? 'btn-primary' : ''} btn-small" type="button">${esc(a.label)}</button>
                  `).join('')}
                </div>` : ''}
              </div>

              <div class="content-middle" id="content-slot">
                <!-- Screen content mounts here -->
              </div>

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
    getContentSlot() {
      return root.querySelector('#content-slot');
    },
    destroy() {
      root.innerHTML = '';
    },
  };
}

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
