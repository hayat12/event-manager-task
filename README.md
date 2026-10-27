# Event Management

Angular web app for a corporate marketing team to manage events:

- Trade fairs
- Conferences
- Customer events
- Internal events

## Tech Stack

### 1. Framework and language

- Angular 19.2
- TypeScript 5.8 (strict mode, strict templates)
- Standalone components
- Signals
- OnPush change detection
- Zoneless change detection (`provideExperimentalZonelessChangeDetection`)

### 2. UI components

- Angular Material 3: I use it because Angular Material integrates seamlessly also its reliable and maintainable along side each angular versions.

### 3. State management

- NgRx SignalStore 19: lightweight, functional and built natively on Angular Signals.

### 4. Testing

- Karma with Jasmine, the default test setup for Angular 19.

## Setup

Requires Node 22, pnpm.

- `pnpm install`
- `pnpm start` or  `ng serve -o` : Starts the dev server on `http://localhost:4200` 
- `pnpm test`                    : Runs the unit tests in Chrome via Karma (watch mode)
- `pnpm build`                   : Creates a production build in `dist/event-management`
- `pnpm extract-i18n`            : Extracts the translation texts to `dist/i18n`


## Features

- 5,000 mock events, each with 3–10 participants
- Statistics for the current search and filters
- Server-side-style pagination (25 events per page), sorting and filtering
- Filter by status, location and date range
- Global search with a 300 ms debounce, searching by location, status, participant role, name and email
- Group events by location or status
- Create events in a modal dialog with Reactive Forms validation
- Edit status and location inline in the table
- Delete events after a confirmation dialog
- Expand an event to manage its participants: add, edit and delete
- Export matching events to CSV (semicolon-separated, German date format)
- Switch between table and card layouts
- German and English translations
- Filters, sorting, grouping and layout are remembered in localStorage

The mock backend simulates network delays of 300 ms.

## Project Structure

- `core/` – shared types and constants
- `shared/` – reusable components, global search state and utilities
- `features/events/` – event components, models, services and state
- `locale/` – German and English translations

## Technical Decisions

- **Angular 19:** Angular features, including Signals, standalone components, OnPush and zoneless change detection.
- **NgRx SignalStore:** Separates query settings (search, filters, sorting and pagination) from event data and loading states. The page index resets to the first page whenever search, filters, sorting or grouping change.
- **RxJS:** Handles asynchronous data requests and cancels outdated queries when the user changes filters or sorting.
- **Angular Material:** Provides accessible UI components, dialogs, date pickers and German date handling.
- **Mock backend:** Keeps data operations separate from the UI, making it easier to replace the mock service with a real API.
- **Routing:** Uses lazy-loaded event routes and a resolver that loads the location filter options before the page opens.
- **Localization:** Uses `@angular/localize` and loads German or English translations at runtime based on the first URL segment.

## Tests

Unit tests cover:

- Sorting
- Pagination
- Filtering
- Searching
- Grouping
- CSV export
- Date formatting
- Creating the app shell

## Known Limitations

- Create, edit and delete changes are stored in memory and are lost after reloading.
- Sorting is only available in the table layout.
- Group headings can repeat across pages.
- Switching languages reloads the page.
- CSV export runs in the browser, and values are not quoted, so a value containing `;` splits into two columns.
