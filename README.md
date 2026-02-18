# WorkOrderTimeline

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


# Work Order Schedule Timeline

## Setup
npm install
ng serve

Visit http://localhost:4200

## Approach
Built as standalone Angular 17 components with a central DataService managing
work orders and work centers. Timeline positioning converts ISO dates to pixel
offsets relative to the visible date range.

## Libraries
- ng-select: dropdown with search, matches design requirements
- @ng-bootstrap/ng-bootstrap: ngb-datepicker for date selection
- Reactive Forms: FormGroup/FormControl for create/edit panel validation

## Key Decisions
- Single panel component with `mode: 'create' | 'edit'` flag avoids duplication
- Overlap detection compares date ranges using simple interval intersection logic
- Left panel fixed via flexbox (flex-shrink: 0) while right panel scrolls independently

## Known Gaps & @upgrade Notes
// @upgrade: Pixel-perfect spacing per Sketch file - currently using approximated values.
// Would use Sketch Measure plugin to extract exact padding/margin values per component.

// @upgrade: Work order bar tooltip on hover - would use Angular CDK Overlay
// to show full order details (name, status, date range) without truncation.

// @upgrade: localStorage persistence - data service already abstracted,
// would swap in-memory array for localStorage adapter implementing same interface.

// @upgrade: Infinite scroll - would use IntersectionObserver on sentinel elements
// at left/right edges to prepend/append date columns and adjust scrollLeft to maintain position.
