# OutSystems UI — Screen Templates

Common enterprise screen layouts. Use these as starting points for `.visual.html` prototypes.

**IMPORTANT**: Every template below shows only the **content** that goes inside the layout's `.content-middle` area. You MUST wrap these in a proper OutSystems layout (LayoutTopMenu, LayoutSideMenu, or LayoutBase). See the layout template files in `assets/` for the full page shell.

The general page structure is:
```
.active-screen > .layout.layout-{top|side|native} > .main >
  header.header > ...
  .content > .main-content.ThemeGrid_Container >
    .content-top > .content-top-title + .content-top-actions
    .content-middle > (TEMPLATE CONTENT GOES HERE)
  footer.content-bottom > ...
```

## Dashboard Screen

KPI cards on top, chart area in the middle, recent activity list at the bottom.

```html
<!-- Goes inside .content-middle -->
<div class="main-content padding-base">
    <!-- KPI Row -->
    <div class="columns columns4 gutter-base tablet-break-middle phone-break-all margin-bottom-l">
      <div class="columns-item">
        <div class="card padding-base">
          <div class="counter">
            <div class="counter-value font-size-display text-primary">{{kpi-1-value}}</div>
            <div class="counter-label font-size-s text-neutral-7">{{kpi-1-label}}</div>
          </div>
        </div>
      </div>
      <div class="columns-item">
        <div class="card padding-base">
          <div class="counter">
            <div class="counter-value font-size-display text-success">{{kpi-2-value}}</div>
            <div class="counter-label font-size-s text-neutral-7">{{kpi-2-label}}</div>
          </div>
        </div>
      </div>
      <div class="columns-item">
        <div class="card padding-base">
          <div class="counter">
            <div class="counter-value font-size-display text-warning">{{kpi-3-value}}</div>
            <div class="counter-label font-size-s text-neutral-7">{{kpi-3-label}}</div>
          </div>
        </div>
      </div>
      <div class="columns-item">
        <div class="card padding-base">
          <div class="counter">
            <div class="counter-value font-size-display text-error">{{kpi-4-value}}</div>
            <div class="counter-label font-size-s text-neutral-7">{{kpi-4-label}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Area -->
    <div class="columns columns2 gutter-base phone-break-all margin-bottom-l">
      <div class="columns-item">
        <div class="card">
          <div class="card-header padding-base">
            <h5 class="margin-bottom-none">{{chart-1-title}}</h5>
          </div>
          <div class="card-content padding-base">{{chart-1-placeholder}}</div>
        </div>
      </div>
      <div class="columns-item">
        <div class="card">
          <div class="card-header padding-base">
            <h5 class="margin-bottom-none">{{chart-2-title}}</h5>
          </div>
          <div class="card-content padding-base">{{chart-2-placeholder}}</div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <div class="card-header padding-base">
        <h5 class="margin-bottom-none">Recent Activity</h5>
      </div>
      <div class="card-content">
        <div class="list list--dividers">
          <div class="list-item padding-base">{{activity-item-1}}</div>
          <div class="list-item padding-base">{{activity-item-2}}</div>
          <div class="list-item padding-base">{{activity-item-3}}</div>
        </div>
      </div>
    </div>
  </main>
</div>
```

## List Screen

Searchable table with pagination. The standard CRUD list view.

```html
<div class="layout active-screen">
  <header class="header">
    <div class="columns columns2 gutter-base phone-break-all">
      <div class="columns-item">
        <h1 class="font-size-h2 margin-bottom-none">{{entity-name-plural}}</h1>
      </div>
      <div class="columns-item" style="text-align: right;">
        <button class="btn btn-primary">Create New</button>
      </div>
    </div>
  </header>

  <main class="main-content padding-base">
    <!-- Search & Filters -->
    <div class="margin-bottom-base">
      <div class="osui-search">
        <div class="osui-search__input">
          <input type="text" class="form-control" placeholder="Search {{entity-name-plural}}..." />
          <span class="osui-search__icon"></span>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="card">
      <table class="table table--hover">
        <thead>
          <tr>
            <th>{{column-1}}</th>
            <th>{{column-2}}</th>
            <th>{{column-3}}</th>
            <th>{{column-4}}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{value-1}}</td>
            <td>{{value-2}}</td>
            <td>{{value-3}}</td>
            <td>{{value-4}}</td>
            <td>
              <a class="link" href="#">Edit</a>
              <a class="link" href="#">Delete</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="margin-top-base">
      <div class="pagination">
        <a class="pagination-item pagination-prev" href="#">&laquo;</a>
        <a class="pagination-item active" href="#">1</a>
        <a class="pagination-item" href="#">2</a>
        <a class="pagination-item" href="#">3</a>
        <a class="pagination-item pagination-next" href="#">&raquo;</a>
      </div>
    </div>
  </main>
</div>
```

## Detail Screen

Read-only view of a single record with sections.

```html
<div class="layout active-screen">
  <header class="header">
    <div class="breadcrumbs margin-bottom-s">
      <a class="breadcrumb-item" href="#">{{entity-name-plural}}</a>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item active">{{record-name}}</span>
    </div>
    <div class="columns columns2 gutter-base phone-break-all">
      <div class="columns-item">
        <h1 class="font-size-h2 margin-bottom-none">{{record-name}}</h1>
      </div>
      <div class="columns-item" style="text-align: right;">
        <button class="btn">Edit</button>
        <button class="btn btn-error">Delete</button>
      </div>
    </div>
  </header>

  <main class="main-content padding-base">
    <div class="section-group">
      <div class="section">
        <div class="section-header">
          <h5 class="section-title">General Information</h5>
        </div>
        <div class="section-content">
          <div class="columns columns2 gutter-base phone-break-all">
            <div class="columns-item">
              <div class="margin-bottom-base">
                <div class="font-size-s text-neutral-6">{{field-1-label}}</div>
                <div>{{field-1-value}}</div>
              </div>
              <div class="margin-bottom-base">
                <div class="font-size-s text-neutral-6">{{field-2-label}}</div>
                <div>{{field-2-value}}</div>
              </div>
            </div>
            <div class="columns-item">
              <div class="margin-bottom-base">
                <div class="font-size-s text-neutral-6">{{field-3-label}}</div>
                <div>{{field-3-value}}</div>
              </div>
              <div class="margin-bottom-base">
                <div class="font-size-s text-neutral-6">{{field-4-label}}</div>
                <div>{{field-4-value}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h5 class="section-title">Related Items</h5>
        </div>
        <div class="section-content">
          <table class="table table--striped">
            <thead>
              <tr>
                <th>{{related-col-1}}</th>
                <th>{{related-col-2}}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{related-val-1}}</td>
                <td>{{related-val-2}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</div>
```

## Form Screen

Create/edit form for a single record.

```html
<div class="layout active-screen">
  <header class="header">
    <div class="breadcrumbs margin-bottom-s">
      <a class="breadcrumb-item" href="#">{{entity-name-plural}}</a>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item active">{{create-or-edit}}</span>
    </div>
    <h1 class="font-size-h2 margin-bottom-none">{{create-or-edit}} {{entity-name}}</h1>
  </header>

  <main class="main-content padding-base">
    <div class="card padding-l">
      <form class="form">
        <div class="columns columns2 gutter-base phone-break-all">
          <div class="columns-item">
            <div class="form-group">
              <label class="form-label">{{field-1-label}}</label>
              <input type="text" class="form-control" placeholder="{{field-1-placeholder}}" />
            </div>
            <div class="form-group">
              <label class="form-label">{{field-2-label}}</label>
              <input type="text" class="form-control" placeholder="{{field-2-placeholder}}" />
            </div>
          </div>
          <div class="columns-item">
            <div class="form-group">
              <label class="form-label">{{field-3-label}}</label>
              <div class="dropdown">
                <select class="dropdown-select">
                  <option value="">Select...</option>
                  <option value="1">{{option-1}}</option>
                  <option value="2">{{option-2}}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">{{field-4-label}}</label>
              <input type="date" class="form-control" />
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">{{description-label}}</label>
          <textarea class="form-control" rows="4" placeholder="{{description-placeholder}}"></textarea>
        </div>
        <hr class="separator" />
        <div class="form-actions">
          <button class="btn">Cancel</button>
          <button class="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  </main>
</div>
```

## Login Screen

Centered login form using LayoutBlank (no header, no footer).

```html
<div class="active-screen">
  <div data-block="Layouts.LayoutBlank" class="layout blank">
    <div class="content" role="main">
      <div class="main-content display-flex align-items-center justify-content-center" style="min-height: 100vh;">
        <div class="card padding-xl shadow-l" style="max-width: 400px; width: 100%;">
          <div class="margin-bottom-l text-align-center">
            <h2 class="font-size-h2 margin-bottom-xs">{{app-name}}</h2>
            <p class="font-size-s text-neutral-6">Sign in to continue</p>
          </div>
          <form class="form">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" placeholder="you@company.com" />
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" placeholder="Enter password" />
            </div>
            <div class="form-group">
              <div class="checkbox">
                <input type="checkbox" id="remember" />
                <label for="remember">Remember me</label>
              </div>
            </div>
            <button class="btn btn-primary btn-large OSFillParent">Sign In</button>
          </form>
          <div class="margin-top-base text-align-center">
            <a class="link font-size-s" href="#">Forgot password?</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Master-Detail Screen

Split view with a list on the left and detail on the right.

```html
<div class="layout active-screen">
  <header class="header">
    <h1 class="font-size-h2 margin-bottom-none">{{entity-name-plural}}</h1>
  </header>

  <main class="main-content">
    <div class="master-detail" style="--master-detail-height: calc(100vh - 80px); --left-percentage: 40;">
      <div class="master-detail-list">
        <div class="padding-base">
          <div class="osui-search">
            <div class="osui-search__input">
              <input type="text" class="form-control" placeholder="Search..." />
            </div>
          </div>
        </div>
        <div class="list list--dividers">
          <div class="list-item padding-base">
            <div class="list-item-content">
              <div class="list-item-content-center">
                <div class="list-item-content-title">{{item-1-name}}</div>
                <div class="list-item-content-description font-size-s text-neutral-6">{{item-1-subtitle}}</div>
              </div>
            </div>
          </div>
          <div class="list-item padding-base">
            <div class="list-item-content">
              <div class="list-item-content-center">
                <div class="list-item-content-title">{{item-2-name}}</div>
                <div class="list-item-content-description font-size-s text-neutral-6">{{item-2-subtitle}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="master-detail-detail padding-l">
        <h3 class="margin-bottom-base">{{selected-item-name}}</h3>
        <div class="section-group">
          <div class="section">
            <div class="section-header">
              <h5 class="section-title">Details</h5>
            </div>
            <div class="section-content">{{detail-content}}</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
```

## Banking Home Screen (Full Example with LayoutTopMenu)

A complete banking dashboard using LayoutTopMenu layout. Shows account cards in a gallery, a transactions table with filters, and pagination. This is extracted from a real OutSystems application.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Home</title>
  <link rel="stylesheet" href="../theme/outsystems-ui.css" />
  <link rel="stylesheet" href="../theme/theme.css" />
</head>
<body class="desktop">
  <div class="active-screen">
    <div data-block="Layouts.LayoutTopMenu" class="layout layout-top fixed-header">
      <div class="main">

        <!-- HEADER with top navigation -->
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
                      <span class="heading6 text-neutral-8">MyBank</span>
                    </div>
                  </div>
                  <div class="app-menu-links" role="menubar">
                    <a class="active" role="menuitem" href="#">Home</a>
                    <a class="ThemeGrid_MarginGutter" role="menuitem" href="#">Contact us</a>
                    <a class="ThemeGrid_MarginGutter" role="menuitem" href="#">Branch finder</a>
                  </div>
                  <div class="app-login-info">
                    <div class="user-info">
                      <div class="padding-y-base display-flex align-items-center">
                        <span>Andrea McKenzie</span>
                      </div>
                    </div>
                  </div>
                </nav>
                <div class="app-menu-overlay" role="button" aria-label="Close Menu"></div>
              </div>
            </div>
          </div>
        </header>

        <!-- CONTENT -->
        <div class="content">
          <div class="main-content ThemeGrid_Container" role="main">

            <!-- Title + Action Button -->
            <div class="content-top display-flex align-items-center">
              <div class="content-top-title heading1">Hello, Andrea McKenzie</div>
              <div class="content-top-actions">
                <button class="btn btn-primary">Send money</button>
              </div>
            </div>

            <!-- Account Cards Gallery -->
            <div class="content-middle">
              <div class="margin-bottom-l">
                <div class="osui-gallery" style="--grid-desktop: 3; --grid-tablet: 3; --grid-phone: 1; --grid-gap: var(--space-base);">
                  <!-- Account Card 1 -->
                  <div class="card card-content padding-none">
                    <div class="display-flex padding-y-base align-items-center padding-x-m border-size-s text-primary">
                      <div class="display-flex flex1 align-items-center">
                        <div class="margin-left-base">
                          <div class="font-size-base font-semi-bold text-neutral-9">Current Account</div>
                          <div class="text-neutral-7 font-size-xs">7890</div>
                        </div>
                      </div>
                      <div class="padding-x-base font-size-base text-neutral-9">$7,845.67</div>
                      <i class="icon text-neutral-7 padding-s fa fa-info-circle"></i>
                    </div>
                  </div>
                  <!-- Account Card 2 -->
                  <div class="card card-content padding-none">
                    <div class="display-flex padding-y-base align-items-center padding-x-m">
                      <div class="display-flex flex1 align-items-center">
                        <div class="margin-left-base">
                          <div class="font-size-base font-semi-bold text-neutral-9">Savings Account</div>
                          <div class="text-neutral-7 font-size-xs">7891</div>
                        </div>
                      </div>
                      <div class="padding-x-base font-size-base text-neutral-9">$10,281.77</div>
                      <i class="icon text-neutral-7 padding-s fa fa-info-circle"></i>
                    </div>
                  </div>
                  <!-- Account Card 3 -->
                  <div class="card card-content padding-none">
                    <div class="display-flex padding-y-base align-items-center padding-x-m">
                      <div class="display-flex flex1 align-items-center">
                        <div class="margin-left-base">
                          <div class="font-size-base font-semi-bold text-neutral-9">Credit Account</div>
                          <div class="text-neutral-7 font-size-xs">7892</div>
                        </div>
                      </div>
                      <div class="padding-x-base font-size-base text-neutral-9">$500.00</div>
                      <i class="icon text-neutral-7 padding-s fa fa-info-circle"></i>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Transactions Section -->
              <div class="heading4 margin-bottom-m">Transactions</div>

              <!-- Filters Row -->
              <div class="display-flex margin-bottom-base align-items-end">
                <div class="flex1 margin-right-base">
                  <div class="search">
                    <div class="search-input">
                      <input class="form-control" type="search" placeholder="Search by description" />
                    </div>
                  </div>
                </div>
                <div class="display-flex flex2 align-items-end">
                  <div class="flex1 margin-right-base">
                    <div class="input-with-icon">
                      <div class="input-with-icon-content-icon center">
                        <i class="icon fa fa-calendar"></i>
                      </div>
                      <div class="input-with-icon-input">
                        <input class="form-control" type="text" placeholder="Posting date from" readonly />
                      </div>
                    </div>
                  </div>
                  <div class="flex1 margin-right-base">
                    <div class="input-with-icon">
                      <div class="input-with-icon-content-icon center">
                        <i class="icon fa fa-calendar"></i>
                      </div>
                      <div class="input-with-icon-input">
                        <input class="form-control" type="text" placeholder="Posting date to" readonly />
                      </div>
                    </div>
                  </div>
                  <div class="flex1 margin-right-base">
                    <div class="display-flex padding-bottom-xs">
                      <span class="padding-right-s">Amount</span>
                      <span class="font-semi-bold">$-5,100 - $5,100</span>
                    </div>
                  </div>
                  <button class="btn" disabled>Reset</button>
                </div>
              </div>

              <!-- Transactions Table -->
              <table class="table" role="grid">
                <thead>
                  <tr class="table-header">
                    <th class="sortable">Posting date</th>
                    <th>Transaction date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="table-row">
                    <td>04 / 05 / 2026</td>
                    <td>04 / 05 / 2026</td>
                    <td><div class="line-clamp">Savings for a new car</div></td>
                    <td class="text-align-right"><span class="text-neutral-9 white-space-nowrap">- $5,000.00</span></td>
                    <td class="text-align-right">$7,845.67</td>
                  </tr>
                  <tr class="table-row">
                    <td>04 / 04 / 2026</td>
                    <td>04 / 04 / 2026</td>
                    <td><div class="line-clamp">My cut of Joanna's bridal shower gift</div></td>
                    <td class="text-align-right"><span class="text-green white-space-nowrap">+ $100.00</span></td>
                    <td class="text-align-right">$12,845.67</td>
                  </tr>
                  <tr class="table-row">
                    <td>03 / 27 / 2026</td>
                    <td>03 / 27 / 2026</td>
                    <td><div class="line-clamp">Paycheck</div></td>
                    <td class="text-align-right"><span class="text-green white-space-nowrap">+ $2,000.00</span></td>
                    <td class="text-align-right">$13,745.67</td>
                  </tr>
                </tbody>
              </table>

              <!-- Pagination -->
              <div class="pagination">
                <div class="pagination-counter">
                  <span>1</span> to <span>7</span> of <span>7</span> items
                </div>
              </div>
            </div>

          </div>

          <!-- FOOTER -->
          <footer role="contentinfo" class="content-bottom">
            <div class="footer ThemeGrid_Container"></div>
          </footer>
        </div>

      </div>
    </div>
  </div>
</body>
</html>
```
