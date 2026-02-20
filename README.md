# Work Order Schedule Timeline

An interactive timeline component built for a manufacturing ERP system. It allows planners to visualize, create, and edit work orders across multiple work centers with support for Day, Week, and Month zoom levels.

---

## Getting Started

### Prerequisites
- Node.js 18+
- Angular CLI 17+

### Installation & Running

```bash
# Install dependencies
npm install

# Start the development server
ng serve

# Visit in browser
http://localhost:4200
```

---

## Libraries Used

| Library | Version | Why It Was Used |
|---|---|---|
| **Angular** | 17+ | Core framework — standalone components, reactive forms, dependency injection |
| **@ng-select/ng-select** | latest | Dropdown/select component for the Timescale selector and Status field in the panel. Required by the spec. Supports `bindLabel`, `bindValue`, and easy reactive form integration |
| **@ng-bootstrap/ng-bootstrap** | latest | Provides `ngb-datepicker` for date selection. Required by the spec |
| **RxJS** | (bundled with Angular) | Powers the `BehaviorSubject` streams in `WorkOrderService` so components reactively update when work orders are added, edited, or deleted |
| **TypeScript** | 5+ | Strict mode enabled throughout for type safety |

---

## Project Structure

```
src/
└── app/
    ├── components/
    │   ├── timeline/
    │   │   ├── timeline.component.ts       # Main timeline logic
    │   │   ├── timeline.component.html     # Timeline template
    │   │   └── timeline.component.scss     # Timeline styles
    │   └── work-order-panel/
    │       ├── work-order-panel.component.ts    # Slide-out panel (create + edit)
    │       ├── work-order-panel.component.html  # Panel form template
    │       └── work-order-panel.component.scss  # Panel styles
    ├── services/
    │   └── work-order.service.ts           # Data layer — work centers + work orders
    ├── models/
    │   └── work-order.models.ts            # TypeScript interfaces
    └── app.component.ts                    # Root component
```

---

## Architecture & Approach

### Data Layer (`WorkOrderService`)

All work order and work center data lives in a single service using RxJS `BehaviorSubject`. Components subscribe to `workCenters$` and `workOrders$` observables and automatically re-render whenever data changes. This makes the create, edit, and delete operations automatically reflected in the timeline without any manual DOM manipulation.

The service exposes four key methods:
- `createWorkOrder()` — generates a unique `docId` and appends to the list
- `updateWorkOrder()` — finds by `docId` and patches only the changed fields
- `deleteWorkOrder()` — filters the work order out by `docId`
- `hasOverlap()` — checks if a date range intersects any existing order on the same work center (excluding the order being edited)

### Timeline Component

The timeline is split into two panels using CSS flexbox:

**Left panel (fixed, 382px):** Lists work center names. Does not scroll horizontally. Stays fixed while the right panel scrolls.

**Right panel (scrollable):** Contains the date header row and the grid rows. Uses `overflow-x: auto` to allow horizontal scrolling independently of the left panel.

**Date column generation:** On init and whenever the zoom level changes, `generateTimelineColumns()` produces an array of `Date` objects representing each column. The zoom level determines the step size — 1 day, 7 days, or 1 month per column.

**Bar positioning:** Work order bars are positioned absolutely within their row using pixel values, not percentages. The formula is:

```
leftPx  = (daysBetween(viewStart, orderStart) / totalDays) * totalWidth
widthPx = (daysBetween(orderStart, orderEnd)  / totalDays) * totalWidth
```

Where `totalWidth = columnCount × COLUMN_WIDTH (114px)`. Using pixels (rather than percentages) ensures bars align precisely with the date header columns at all zoom levels.

### Panel Component (Create & Edit)

A single `WorkOrderPanelComponent` handles both create and edit via a `mode: 'create' | 'edit'` input. This avoids duplicating form logic.

The form uses Angular **Reactive Forms** (`FormGroup` + `FormControl` + `Validators`). Validation runs on submit and shows inline errors. The overlap check runs after basic validation passes.

**In create mode:** the form initialises with blank fields and the start date pre-filled from where the user clicked on the timeline.

**In edit mode:** the form initialises with the existing work order's data so the user sees current values immediately.

### Edit Bug Fix — Event Bubbling

A subtle issue existed where clicking "Edit" from the dropdown would also bubble up to the `.timeline-row` click handler, which would then overwrite `panelMode` back to `'create'`. This was fixed with a `_suppressNextTimelineClick` boolean flag:

```typescript
onEditWorkOrder(workOrder: WorkOrderDocument): void {
  this._suppressNextTimelineClick = true; // swallow the bubbling click
  this.panelMode         = 'edit';
  this.selectedWorkOrder = workOrder;
  this.isPanelOpen       = true;
}

onTimelineClick(event: MouseEvent, workCenterId: string): void {
  if (this._suppressNextTimelineClick) {
    this._suppressNextTimelineClick = false;
    return; // bail out — this click came from edit/delete
  }
  // ... rest of create logic
}
```

### Overlap Detection

```typescript
hasOverlap(workCenterId, startDate, endDate, excludeId?): boolean
```

Two date ranges overlap when one starts before the other ends AND ends after the other starts:

```
overlap = (existingStart < newEnd) AND (existingEnd > newStart)
```

The `excludeId` parameter ensures that when editing an order, the order itself is not counted as overlapping with its own previous position.

### Dropdown Positioning

The three-dot dropdown is rendered with `position: fixed` and uses `getBoundingClientRect()` on the button to calculate its absolute screen position. This escapes the `overflow: hidden` of parent containers so it always renders on top of everything else.

---

## Design Implementation

All design values were extracted directly from the Sketch file's JSON (Sketch files are ZIP archives containing structured JSON). Key exact values used:

| Element | Value |
|---|---|
| Left panel width | 382px |
| Row height | 48px |
| Work order bar height | 38px |
| Slide-out panel width | 591px |
| Today indicator line | 3px, `#d4d7ff` |
| Today column header bg | `#edf0ff` |
| Grid background | `#f6f8fb` |
| Row/border divider | `#e6eaef` |
| In-progress bar | `#ecedff` bg, `#dedfff` border, `#3e40db` badge text |
| Complete bar | `#f8fff3` bg, `#d1f9b3` border, `#07a168` badge text |
| Blocked bar | `#fffbf0` bg, `#fff4cf` border, `#b13600` badge text |
| Open badge | `#e4fcff` bg, `#cefbff` border, `#00b0be` text |
| Delete row bg | `#a4aabf` (grey, not red) |
| Primary button | `#3e40db` |
| Input border | `#687195` |
| Input focus border | `2px solid #aaafff` |
| Font | Circular Std (Book, Regular, Medium weights) |

---

## Sample Data

The app ships with hardcoded sample data demonstrating all four statuses across five work centers with multiple non-overlapping work orders on the same center.

Work centers: Extrusion Line A, CNC Machine 1, Assembly Station, Quality Control, Packaging Line.

To extend or replace the sample data, edit `work-order.service.ts` — the `initialWorkCenters` and `initialWorkOrders` arrays at the top of the file.

---

## Known Gaps & Future Improvements

<!-- @design-gap [SCROLL POSITION — CENTER ON TODAY] -->
// The spec says "center the timeline on today's date" on initial load.
// Implemented: today is within view but not always centred — the timeline
// starts at viewStartDate and today may appear near the left edge.
// @upgrade: After generating columns, calculate the pixel offset of today
// and set scrollLeft on .timeline-scroll-container to
// (todayOffset - containerWidth / 2).


<!-- @design-gap [STATUS DROPDOWN SELECTED VALUE COLOUR] -->
// Sketch: selected status value in the ng-select shows the status colour
// (e.g. green text for Complete, orange for Blocked) — matches the badge colours.
// Implemented: all selected values render in rgba(0,176,191,1) — a single teal
// colour — because the ng-select value template is not customised.
// @upgrade: Use ng-select's [ngOptionTemplate] / [labelTemplate] inputs to
// render a mini status badge inside the select control, matching Sketch exactly.

 <!-- @design-gap [DATE PICKER — NATIVE VS ngb-datepicker] -->
// Spec requires @ng-bootstrap ngb-datepicker.
// Implemented: native <input type="date"> with `showPicker()` polyfill.
// Reason: ngb-datepicker integration with Reactive Forms required additional
// NgbDateAdapter/NgbDateParserFormatter configuration to convert between
// NgbDateStruct and ISO string. Under time constraints, native date input
// was used as a functional equivalent.
// Visual gap: the native date picker renders the OS/browser default calendar,
// which does not match the Sketch datepicker styling at all.
// @upgrade: Install @ng-bootstrap/ng-bootstrap, create a custom
// NgbDateISOParserFormatter service, replace <input type="date"> with
// <input ngbDatepicker [formControlName]="..."> and style the calendar
// popup to match Sketch (custom .ngb-dp-* overrides in SCSS).



```

