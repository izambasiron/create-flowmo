# OutSystems UI Patterns Reference

Verified HTML structures scraped from the official [OutSystems UI Style Guide](https://outsystemsui.outsystems.com/StyleGuidePreview/Patterns).

Notation: `tag.class1.class2` for elements, `[Block.Name]` for OutSystems block wrappers (use `data-block` attribute or just omit in visual HTML). Indentation = nesting. Content after `:` = text content.

---

## Adaptive

### Columns 2

```html
<div class="columns columns2 gutter-base phone-break-all">
  <div class="columns-item">Column 1</div>
  <div class="columns-item">Column 2</div>
</div>
```

### Columns 3

```html
<div class="columns columns3 gutter-base phone-break-all">
  <div class="columns-item">Column 1</div>
  <div class="columns-item">Column 2</div>
  <div class="columns-item">Column 3</div>
</div>
```

### Columns 4

```html
<div class="columns columns4 gutter-base tablet-break-middle phone-break-all">
  <div class="columns-item">Column 1</div>
  <div class="columns-item">Column 2</div>
  <div class="columns-item">Column 3</div>
  <div class="columns-item">Column 4</div>
</div>
```

### Columns 5

```html
<div class="columns columns5 gutter-base tablet-break-middle phone-break-all">
  <div class="columns-item">...</div>
  <!-- 5 columns-item -->
</div>
```

### Columns 6

```html
<div class="columns columns6 gutter-base tablet-break-middle phone-break-all">
  <div class="columns-item">...</div>
  <!-- 6 columns-item -->
</div>
```

### Columns Medium Left

```html
<div class="columns columns-medium-left gutter-base phone-break-all">
  <div class="columns-item">Wider left</div>
  <div class="columns-item">Narrower right</div>
</div>
```

### Columns Medium Right

```html
<div class="columns columns-medium-right gutter-base phone-break-all">
  <div class="columns-item">Narrower left</div>
  <div class="columns-item">Wider right</div>
</div>
```

### Columns Small Left

```html
<div class="columns columns-small-left gutter-base phone-break-all">
  <div class="columns-item">Small left</div>
  <div class="columns-item">Large right</div>
</div>
```

### Columns Small Right

```html
<div class="columns columns-small-right gutter-base phone-break-all">
  <div class="columns-item">Large left</div>
  <div class="columns-item">Small right</div>
</div>
```

### Column Break Variants

Combine `tablet-break-*` and `phone-break-*` independently:

```html
<!-- First column breaks on phone, all stay on tablet -->
<div class="columns columns3 gutter-base phone-break-first">
  <div class="columns-item">Sidebar (full-width on phone)</div>
  <div class="columns-item">Main</div>
  <div class="columns-item">Aside</div>
</div>

<!-- 4-column grid: 2×2 on tablet, full-stack on phone -->
<div class="columns columns4 gutter-base tablet-break-middle phone-break-all">
  <div class="columns-item">Card 1</div>
  <div class="columns-item">Card 2</div>
  <div class="columns-item">Card 3</div>
  <div class="columns-item">Card 4</div>
</div>

<!-- Last column breaks on both tablet and phone -->
<div class="columns columns3 gutter-m tablet-break-last phone-break-all">
  <div class="columns-item">Main</div>
  <div class="columns-item">Secondary</div>
  <div class="columns-item">Full-width footer row</div>
</div>
```

### Display On Device

Show/hide content per breakpoint.

```html
<div class="display-on-device-desktop">Desktop only content</div>
<div class="display-on-device-tablet">Tablet only content</div>
<div class="display-on-device-phone">Phone only content</div>
```

### Gallery

Grid gallery with auto-flowing items.

```html
<div class="osui-gallery">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <!-- ... -->
</div>
```

### Master Detail

Split-screen list + detail layout.

```html
<div class="split-screen-wrapper is--full-height">
  <div class="split-left">
    <div class="list list-group">
      <div class="list-item list-item-selected">
        <!-- ListItemContent -->
      </div>
      <div class="list-item">
        <!-- ListItemContent -->
      </div>
    </div>
  </div>
  <div class="split-right">
    <div class="split-right-close">
      <a><i class="icon fa fa-angle-left fa-2x"></i></a>
    </div>
    <div class="split-right-content">
      <!-- Detail content -->
    </div>
  </div>
</div>
```

---

## Content

### Accordion

```html
<div class="osui-accordion">
  <div class="osui-accordion-item osui-accordion-item--is-open">
    <div class="osui-accordion-item__title">Title</div>
    <div class="osui-accordion-item__content osui-accordion-item__content--is-expanded">
      Content
    </div>
  </div>
  <div class="osui-accordion-item">
    <div class="osui-accordion-item__title">Title 2</div>
    <div class="osui-accordion-item__content">Content 2</div>
  </div>
</div>
```

### Alert

```html
<div class="alert alert-error" role="alert">
  <div class="alert-icon">
    <i class="icon fa fa-times-circle"></i>
  </div>
  <div class="alert-message">Something went wrong.</div>
</div>
```

Variants: `alert-success`, `alert-warning`, `alert-info`, `alert-error`.

### Blank Slate

Empty state placeholder.

```html
<div class="blank-slate large">
  <div class="blank-slate-icon">
    <img src="placeholder.png">
  </div>
  <div class="blank-slate-description">No records have been added yet</div>
  <div class="blank-slate-actions">
    <!-- Optional action buttons -->
  </div>
</div>
```

### Card

```html
<div class="card card-content">
  Content goes here
</div>
```

### Card Background

```html
<div class="card-background" style="min-height: 350px;">
  <div class="card-background-content">
    <!-- Overlay content -->
  </div>
  <div class="card-background-image">
    <img class="img-cover" src="image.jpg" alt="">
  </div>
  <div class="card-background-color background-primary"></div>
</div>
```

### Card Item

Horizontal card with left/center/right zones.

```html
<div class="card card-detail">
  <div class="card-detail-left">
    <img src="avatar.jpg">
  </div>
  <div class="card-detail-center">
    <div class="card-detail-title">Title</div>
    <div class="card-detail-text text-grey">Subtitle</div>
  </div>
  <div class="card-detail-right">
    <i class="icon fa fa-angle-right"></i>
  </div>
</div>
```

### Card Sectioned

```html
<div class="card card-sectioned flex-direction-column">
  <div class="card-image">
    <img src="image.jpg">
  </div>
  <div class="card-sectioned-top flex-direction-column">
    <div class="card-title">Title</div>
    <div class="card-content">Description</div>
    <div class="card-bottom">
      <!-- Footer actions -->
    </div>
  </div>
</div>
```

### Chat Message

```html
<div class="chat left">
  <div class="chat-photo">
    <div class="avatar border-radius-rounded background-primary" role="img">
      <span>SR</span>
    </div>
  </div>
  <div class="chat-message-wrapper">
    <div class="chat-message padding">
      <span class="font-semi-bold">Scott Richie</span>
      <div class="margin-top-s">Message text here</div>
    </div>
  </div>
</div>
```

Use `chat right` for the other speaker. Add `.margin-top-m` for spacing between messages.

### Flip Content

```html
<div class="osui-flip-content">
  <div class="osui-flip-content__container osui-flip-content--flip-self">
    <div class="osui-flip-content__container__front">
      <!-- Front content -->
    </div>
    <!-- __back for reverse side -->
  </div>
</div>
```

### Floating Content

Overlay content positioned over an image/container.

```html
<div style="position: relative;">
  <img class="img-cover" src="background.jpg">
  <div class="floating-content floating-content-bottom floating-content-margin">
    <!-- Floating content here -->
  </div>
</div>
```

Positions: `floating-content-top`, `floating-content-bottom`.

### List Item Content

```html
<div class="list-item-content">
  <div class="list-item-content-left text-primary-color">
    <img src="avatar.jpg">
  </div>
  <div class="list-item-content-center">
    <div class="list-item-content-title">Title</div>
    <div class="list-item-content-text">Subtitle</div>
  </div>
  <div class="list-item-content-right">
    <i class="icon fa fa-angle-right fa-2x"></i>
  </div>
</div>
```

### Section

```html
<div class="section" role="region">
  <div class="section-title dividers">Section Title</div>
  <div class="section-content">Content here</div>
</div>
```

### Section Group

Groups multiple sections with sticky scrolling.

```html
<div class="section-group is--sticky">
  <div class="sticky">
    <div class="section">
      <div class="section-title dividers">Summary</div>
      <div class="section-content">...</div>
    </div>
    <div class="section margin-top-base">
      <div class="section-title dividers">Details</div>
      <div class="section-content">...</div>
    </div>
  </div>
</div>
```

### Tag

```html
<div class="tag border-radius- background-primary">Label</div>
```

Variants: `background-primary`, `background-red`, `background-teal`, `background-green`. Shape: `border-radius-rounded` for pill shape.

### Tooltip

```html
<div class="osui-tooltip osui-tooltip--is-hover">
  <div class="osui-tooltip__content" role="button" tabindex="0">
    Hover me
  </div>
  <div class="osui-tooltip__balloon-wrapper osui-balloon" role="tooltip" aria-hidden="true">
    <div class="osui-tooltip__balloon-wrapper__balloon">Tooltip text</div>
    <div class="osui-tooltip__balloon-arrow"></div>
  </div>
</div>
```

### User Avatar

```html
<div class="avatar border-radius- background-primary" role="img" aria-label="user initials, JD">
  <span>JD</span>
</div>
```

Shape: `border-radius-rounded` for circle.

---

## Interaction

### Action Sheet

Bottom sheet with action buttons (mobile pattern).

```html
<div class="action-sheet-container">
  <div class="action-sheet-background"></div>
  <div class="action-sheet">
    <div class="action-sheet-buttons">
      <div class="action-sheet-actions">
        <button class="btn text-primary">Flag</button>
      </div>
      <div class="action-sheet-actions">
        <button class="btn text-primary">Mark as Unread</button>
      </div>
      <div class="action-sheet-actions">
        <button class="btn text-red"><span class="text-red">Delete</span></button>
      </div>
    </div>
    <div class="action-sheet-cancel">
      <button class="btn background-white">Cancel</button>
    </div>
  </div>
</div>
```

### Animate

Entrance animations.

```html
<div class="animate bottom-to-top">
  Content that animates in
</div>
```

Variants: `bottom-to-top`, `top-to-bottom`, `left-to-right`, `right-to-left`, `fade-in`, `scale-up`.

### Animated Label

Label that floats up when input is focused.

```html
<div class="animated-label">
  <div class="animated-label-text">
    <label>First Name</label>
  </div>
  <div class="animated-label-input">
    <span class="input-text">
      <input class="form-control">
    </span>
  </div>
</div>
```

### Carousel

Image carousel (uses Splide library).

```html
<div class="osui-carousel splide">
  <div class="osui-carousel__track splide__track">
    <div class="osui-carousel__content splide__list">
      <img class="splide__slide is-active is-visible" src="slide1.jpg">
      <img class="splide__slide" src="slide2.jpg">
      <img class="splide__slide" src="slide3.jpg">
    </div>
  </div>
  <ul class="splide__pagination">
    <li><button class="splide__pagination__page is-active"></button></li>
    <li><button class="splide__pagination__page"></button></li>
  </ul>
</div>
```

### Date Picker

```html
<div class="osui-datepicker">
  <span class="input-text">
    <input class="form-control flatpickr-input" type="text">
  </span>
</div>
```

### Dropdown Search

Searchable dropdown (uses VirtualSelect library).

```html
<div class="osui-dropdown-search">
  <div class="vscomp-wrapper has-clear-button has-search-input">
    <input class="vscomp-hidden-input">
    <div class="vscomp-toggle-button">
      <div class="vscomp-value">Select...</div>
      <div class="vscomp-arrow"></div>
      <div class="vscomp-clear-button toggle-button-child">
        <i class="vscomp-clear-icon"></i>
      </div>
    </div>
  </div>
</div>
```

### Dropdown Tags

Multi-select with tag chips.

```html
<div class="osui-dropdown-tags">
  <div class="vscomp-wrapper multiple has-select-all has-clear-button has-search-input show-value-as-tags">
    <input class="vscomp-hidden-input">
    <div class="vscomp-toggle-button">
      <div class="vscomp-value">Select...</div>
      <div class="vscomp-arrow"></div>
      <div class="vscomp-clear-button toggle-button-child">
        <i class="vscomp-clear-icon"></i>
      </div>
    </div>
  </div>
</div>
```

### Floating Actions

FAB (Floating Action Button) with expandable items.

```html
<div class="floating-actions-wrapper is--open">
  <div class="floating-items">
    <div class="floating-actions-item">
      <div class="floating-actions-item-label">Member</div>
      <div class="floating-actions-item-button">
        <i class="icon fa fa-user"></i>
      </div>
    </div>
    <div class="floating-actions-item">
      <div class="floating-actions-item-label">Note</div>
      <div class="floating-actions-item-button">
        <i class="icon fa fa-file"></i>
      </div>
    </div>
  </div>
  <div class="floating-button">
    <i class="icon fa fa-plus"></i>
  </div>
</div>
```

### Input With Icon

```html
<div class="input-with-icon input-with-icon-right">
  <div class="input-with-icon-content-icon center">
    <i class="icon fa fa-user"></i>
  </div>
  <div class="input-with-icon-input">
    <span class="input-text">
      <input class="form-control" type="text">
    </span>
  </div>
</div>
```

Icon position: `input-with-icon-right` (icon left, default) or `input-with-icon-left`.

### Lightbox Image

Clickable thumbnail that opens full-size overlay.

```html
<div class="lightbox-item">
  <figure>
    <a>
      <div class="lightbox-content-thumbnail">
        <img src="thumb.jpg">
      </div>
    </a>
    <figcaption><span>Caption</span></figcaption>
  </figure>
</div>
```

### Notification

Toast notification banner.

```html
<div class="osui-notification osui-notification--is-top">
  <div class="margin-right-base">
    <i class="icon text-white fa fa-comments-o fa-2x"></i>
  </div>
  <div>
    <span class="text-white">You have a new message</span>
  </div>
</div>
```

Position: `osui-notification--is-top`, `osui-notification--is-bottom`.

### Range Slider

```html
<div class="osui-range-slider osui-range-slider--has-ticks">
  <div class="osui-range-slider__provider noUi-target noUi-horizontal">
    <div class="noUi-base">
      <div class="noUi-connects"><div class="noUi-connect"></div></div>
      <div class="noUi-origin">
        <div class="noUi-handle noUi-handle-lower">
          <div class="noUi-touch-area"></div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Range Slider Interval

Same as Range Slider but with two handles:

```html
<div class="osui-range-slider osui-range-slider--is-interval osui-range-slider--has-ticks">
  <!-- Same structure but with noUi-handle-lower AND noUi-handle-upper -->
</div>
```

### Scrollable Area

Horizontal or vertical scrollable content.

```html
<div class="scrollable-area-content horizontal-scroll">
  <img src="img1.jpg">
  <img src="img2.jpg">
  <img src="img3.jpg">
</div>
```

### Search

```html
<div class="osui-search">
  <div class="osui-search__input">
    <span class="input-text">
      <input class="form-control" type="search">
    </span>
  </div>
</div>
```

### Sidebar

Slide-in panel overlay.

```html
<aside class="osui-sidebar osui-sidebar--is-right">
  <div class="osui-sidebar__header">
    <a><i class="icon fa fa-remove"></i></a>
  </div>
  <div class="osui-sidebar__content">
    <!-- Sidebar content -->
  </div>
</aside>
```

Direction: `osui-sidebar--is-right`, `osui-sidebar--is-left`.

### Stacked Cards

Swipeable card stack.

```html
<div class="stackedcards stackedcards--animatable">
  <div class="stackedcards-container">
    <div class="list list-group">
      <div class="card stackedcards-active stackedcards-bottom">
        <span class="heading5">Card Title</span>
        <div class="margin-top-m"><span>Card description...</span></div>
        <div class="margin-top-m">
          <div class="tag border-radius-rounded background-red">Urgent</div>
        </div>
      </div>
      <!-- More cards... -->
    </div>
  </div>
</div>
```

### Video

```html
<video class="osui-video">
  <source class="osui-video-source" src="video.mp4">
</video>
```

---

## Navigation

### Bottom Bar Item

Mobile bottom navigation.

```html
<div class="bottom-bar-wrapper">
  <div class="bottom-bar">
    <a class="active">
      <div class="bottom-bar-item">
        <div class="bottom-bar-item-icon">
          <i class="icon fa fa-clock-o"></i>
        </div>
        <div class="bottom-bar-item-text">Recents</div>
      </div>
    </a>
    <a>
      <div class="bottom-bar-item">
        <div class="bottom-bar-item-icon">
          <i class="icon fa fa-file-text-o"></i>
        </div>
        <div class="bottom-bar-item-text">Files</div>
      </div>
    </a>
  </div>
</div>
```

### Breadcrumbs

```html
<nav class="breadcrumbs">
  <div class="breadcrumbs-content">
    <div class="breadcrumbs-item">
      <div class="title"><a>Dashboard</a></div>
      <div><i class="icon fa fa-angle-right"></i></div>
    </div>
    <div class="breadcrumbs-item">
      <div class="title"><a>List</a></div>
      <div><i class="icon fa fa-angle-right"></i></div>
    </div>
    <div class="breadcrumbs-item">
      <div class="title">Detail</div>
      <div></div>
    </div>
  </div>
</nav>
```

### Overflow Menu

Contextual dropdown menu triggered by ellipsis button.

```html
<div class="osui-overflow-menu">
  <div class="osui-overflow-menu__balloon osui-balloon">
    <nav class="display-flex flex-direction-column">
      <span class="text-uppercase text-neutral-7 font-semi-bold padding-x-base padding-top-base font-size-xs margin-bottom-s">Title</span>
      <a><i class="icon fa fa-eye"></i><span class="margin-left-s">Item 1</span></a>
      <a><i class="icon fa fa-file-text-o"></i><span class="margin-left-s">Item 2</span></a>
      <a><i class="icon fa fa-pencil"></i><span class="margin-left-s">Item 3</span></a>
      <div class="separator separator-horizontal background-neutral-4"></div>
      <a><i class="icon fa fa-user"></i><span class="margin-left-s">Item 4</span></a>
    </nav>
  </div>
  <button class="btn btn-small osui-overflow-menu__trigger">
    <div><i class="icon fa fa-ellipsis-v"></i></div>
  </button>
</div>
```

### Pagination

```html
<div class="pagination">
  <div class="pagination-counter">
    <span>1</span><span> to </span><span>3</span><span> of </span><span>55</span><span> items</span>
  </div>
  <nav class="pagination-container" aria-label="Pagination">
    <button class="pagination-button" disabled aria-label="go to previous page">
      <div class="pagination-previous"><i class="icon fa fa-angle-left"></i></div>
    </button>
    <div class="display-flex">
      <button class="pagination-button is--active" aria-current="true"><span>1</span></button>
      <div class="list list-group">
        <button class="pagination-button"><span>2</span></button>
        <button class="pagination-button"><span>3</span></button>
      </div>
      <div class="pagination-button is--ellipsis">...</div>
      <button class="pagination-button"><span>19</span></button>
    </div>
    <button class="pagination-button" aria-label="go to next page">
      <div class="pagination-next"><i class="icon fa fa-angle-right"></i></div>
    </button>
  </nav>
</div>
```

### Section Index

Anchor navigation for page sections.

```html
<div class="section-index">
  <a class="section-index-item is--active"><span>Personal Details</span></a>
  <a class="section-index-item"><span>Job Details</span></a>
  <a class="section-index-item"><span>Team Details</span></a>
</div>
```

### Submenu

```html
<div class="osui-submenu osui-submenu--is-dropdown">
  <div class="osui-submenu__header">
    <div class="osui-submenu__header__item">
      <i class="icon fa fa-folder-o"></i>
      <span class="margin-left-s">Folders</span>
    </div>
    <div class="osui-submenu__header__icon"></div>
  </div>
  <div class="osui-submenu__items">
    <a><i class="icon fa fa-envelope"></i><span class="margin-left-s">All mail</span></a>
    <a><i class="icon fa fa-trash"></i><span class="margin-left-s">Trash</span></a>
  </div>
</div>
```

### Tabs

```html
<section class="osui-tabs osui-tabs--is-horizontal osui-tabs--is-left">
  <header class="osui-tabs__header">
    <div class="display-contents">
      <button class="osui-tabs__header-item osui-tabs--is-active">
        <div class="display-contents">Personal</div>
      </button>
      <button class="osui-tabs__header-item">
        <div class="display-contents">Job</div>
      </button>
      <button class="osui-tabs__header-item">
        <div class="display-contents">Salary</div>
      </button>
    </div>
    <div class="osui-tabs__header__indicator"></div>
  </header>
  <section class="osui-tabs__content">
    <div class="display-contents">
      <article class="osui-tabs__content-item osui-tabs--is-active">
        Tab 1 content
      </article>
      <article class="osui-tabs__content-item">
        Tab 2 content
      </article>
      <article class="osui-tabs__content-item">
        Tab 3 content
      </article>
    </div>
  </section>
</section>
```

### Timeline Item

```html
<div class="timeline-item">
  <div class="timeline-left">2019</div>
  <div class="timeline-icon">
    <div class="timeline-icon-line"></div>
    <div class="timeline-icon-container background-primary">
      <i class="icon fa fa-archive"></i>
    </div>
  </div>
  <div class="timeline-content">
    <div>Pending Approval</div>
    <div class="timeline-content-inner">This request requires your approval.</div>
  </div>
  <div class="timeline-right"></div>
</div>
```

### Wizard

```html
<div class="wizard-wrapper display-flex flex-direction-row">
  <div class="wizard-wrapper-item past label-bottom">
    <div class="wizard-item-icon-wrapper">
      <div class="wizard-item-icon">1</div>
    </div>
    <div class="wizard-item-label">Personal Details</div>
  </div>
  <div class="wizard-wrapper-item active label-bottom">
    <div class="wizard-item-icon-wrapper">
      <div class="wizard-item-icon">2</div>
    </div>
    <div class="wizard-item-label">Address Details</div>
  </div>
  <div class="wizard-wrapper-item next label-bottom">
    <div class="wizard-item-icon-wrapper">
      <div class="wizard-item-icon">3</div>
    </div>
    <div class="wizard-item-label">Review Account</div>
  </div>
</div>
```

States: `past` (completed), `active` (current), `next` (upcoming).

---

## Numbers

### Badge

```html
<div class="badge border-radius- background-primary">
  <span>1</span>
</div>
```

### Counter

```html
<div class="counter card background-primary text-neutral-0">
  <div class="center-align flex-direction-row">
    <div class="font-size-display text-neutral-0">26</div>
    <div>Completed Requests</div>
    <div><i class="icon fa fa-check fa-3x"></i></div>
  </div>
</div>
```

### Icon Badge

Icon with notification badge.

```html
<div class="icon-badge">
  <div><i class="icon fa fa-comment-o fa-2x"></i></div>
  <div class="badge border-radius-rounded background-primary">
    <span>1</span>
  </div>
</div>
```

### Progress Bar

```html
<div class="osui-progress-bar">
  <div class="osui-progress-bar__container animate-entrance">
    <div class="osui-progress-bar__value"></div>
    <div class="osui-progress-bar__content"><span></span></div>
  </div>
</div>
```

### Progress Circle

```html
<div class="osui-progress-circle">
  <div class="osui-progress-circle__container">
    <div class="osui-inline-svg svg-wrapper">
      <svg>
        <circle></circle>
        <circle></circle>
      </svg>
    </div>
  </div>
  <div class="osui-progress-circle__content">
    <span class="font-size-display">50</span>
  </div>
</div>
```

### Rating

```html
<div class="rating is-edit">
  <fieldset>
    <legend class="wcag-hide-text">Rating</legend>
    <!-- For each star (1-5): -->
    <input class="rating-input wcag-hide-text" type="radio">
    <label class="rating-item">
      <span class="wcag-hide-text">Rating 1</span>
      <div class="rating-item-filled"><i class="icon text-primary fa fa-star"></i></div>
      <div class="rating-item-half"><i class="icon text-primary fa fa-star-half"></i></div>
      <div class="rating-item-empty"><i class="icon text-neutral-5 fa fa-star"></i></div>
    </label>
    <!-- Repeat for each star -->
  </fieldset>
</div>
```

---

## Utilities

### Align Center

Vertically aligns children.

```html
<div class="vertical-align flex-direction-row">
  <div class="avatar avatar-medium border-radius-rounded background-primary">
    <span>SR</span>
  </div>
  <div class="margin-left-base">Scott Ritchie</div>
</div>
```

### Button Loading

```html
<div class="osui-btn-loading osui-btn-loading--is-loading osui-btn-loading-show-spinner">
  <button class="btn btn-primary">
    <div class="osui-btn-loading__spinner-animation"></div>
  </button>
</div>
```

### Center Content

Vertically centers content with optional header/footer.

```html
<div class="center-content">
  <div class="center-content-header"></div>
  <div class="center-content-container">
    <!-- Main centered content -->
  </div>
  <div class="center-content-bottom"></div>
</div>
```

### Inline SVG

```html
<div class="osui-inline-svg svg-wrapper">
  <svg><!-- SVG content --></svg>
</div>
```

### Margin Container

Adds horizontal margins to constrain content width.

```html
<div class="margin-container">
  <!-- Content with horizontal margins -->
</div>
```

### Separator

```html
<div class="separator separator-horizontal background-neutral-4"></div>
```

Vertical: `separator-vertical`.

---

## Widgets

### Button

```html
<button class="btn btn-primary">
  <span>Button</span>
</button>
```

Variants: `btn-primary`, `btn-secondary`, `btn-success`, `btn-error`. Add icon: `<i class="icon fa fa-check"></i>` before text.

### Button Group

```html
<div class="button-group">
  <button class="button-group-item button-group-selected-item">All</button>
  <button class="button-group-item">Active</button>
  <button class="button-group-item">Disabled</button>
</div>
```

### Checkbox

```html
<span>
  <input type="checkbox" class="checkbox">
</span>
```

### Dropdown

```html
<div class="dropdown-container dropdown">
  <div class="dropdown-display">
    <div class="dropdown-display-content">
      <span>Selected value</span>
    </div>
  </div>
</div>
```

### Feedback Message

Triggered by button clicks, styled as toast notifications.

```html
<button class="btn btn-success">
  <i class="icon fa fa-check"></i>
  <span class="margin-left-s">Success</span>
</button>
<button class="btn btn-error ThemeGrid_MarginGutter">
  <i class="icon fa fa-remove"></i>
  <span class="margin-left-s">Error</span>
</button>
```

### Form

```html
<form class="form card">
  <div class="columns columns2 gutter-base">
    <div class="columns-item">
      <label class="mandatory" for="firstName">First Name</label>
      <span class="input-text">
        <input class="form-control" type="text" required id="firstName">
      </span>
    </div>
    <div class="columns-item">
      <label for="lastName">Last Name</label>
      <span class="input-text">
        <input class="form-control" type="text" id="lastName">
      </span>
    </div>
  </div>
  <div>
    <label for="email">Email</label>
    <span class="input-email">
      <input class="form-control" type="email" id="email">
    </span>
  </div>
  <div>
    <button class="btn btn-primary" type="submit">Save</button>
  </div>
</form>
```

### Input

```html
<span class="input-text">
  <input class="form-control" type="text">
</span>
```

Input type wrappers: `input-text`, `input-email`, `input-password`, `input-search`.

### Link

```html
<a class="heading6 text-primary">Link text</a>
```

### List

```html
<div class="list list-group">
  <div class="list-item">
    <!-- ListItemContent or custom content -->
  </div>
  <div class="list-item">
    <!-- ... -->
  </div>
</div>
```

### Popover

Contextual overlay triggered by user action.

```html
<div class="popover popover-top">
  <!-- Popover content -->
</div>
```

### Popup

Modal dialog.

```html
<button class="btn" onclick="showPopup()">Show Popup</button>
<!-- Popup content rendered dynamically -->
```

### Radio Group

```html
<div class="radio-group">
  <div>
    <input type="radio" class="radio-button" name="group1">
    <label>Option A</label>
  </div>
  <div>
    <input type="radio" class="radio-button" name="group1">
    <label>Option B</label>
  </div>
</div>
```

### Switch

```html
<span>
  <input type="checkbox" class="switch">
</span>
```

### Table

```html
<table class="table">
  <thead>
    <tr class="table-header">
      <th class="sortable">
        <div>Name</div>
        <div class="sortable-icon"></div>
      </th>
      <th class="sortable">
        <div>Job Position</div>
        <div class="sortable-icon"></div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr class="table-row">
      <td><span>Patricia Wesley</span></td>
      <td><span>Sales Manager</span></td>
    </tr>
  </tbody>
</table>
```

### TextArea

```html
<span>
  <textarea class="form-control"></textarea>
</span>
```

### Upload

```html
<span class="upload-file">
  <label class="upload">
    <input type="file">
    <i class="icon fa fa-paperclip"></i>
    <span class="ThemeGrid_MarginGutter">Select file</span>
  </label>
</span>
```

---

## Advanced

### DropdownServerSide

Server-side rendered dropdown — no preview available (requires server interaction).
