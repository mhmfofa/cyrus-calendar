# ng-cyrus-calendar

A lightweight, multi-calendar Angular date picker supporting **Gregorian**, **Shamsi (Jalali / Persian)**, and **Imperial** calendars — with a modern UI, inline year-grid picker, and an optional time picker.

---

## Features

- **Three calendar systems**: Gregorian · Shamsi (Jalali) · Imperial
- **Year-grid picker**: click the year to browse and select from a 12-year grid
- **Month-grid picker**: full month overlay
- **Disable rules**: past days, weekends, specific dates, or a custom list
- **Date ranges & multi-select**
- **Optional time picker** (hours · minutes · seconds)
- **RTL ready** — Persian month/weekday names built-in
- **Separate display vs. value format** — show slashes to the user, store hyphens for APIs
- **No jQuery** — pure Angular + Bootstrap 5
- Signal-based state, Angular control-flow syntax (`@if`, `@for`)

---

## Live Demo

**[http://calendar.molayemi.com](http://calendar.molayemi.com)**

Interactive examples with all calendar types, time picker, date restrictions and calendar switcher.

---

## Requirements

| Peer dependency | Minimum |
|---|---|
| `@angular/core` | **17.0.0** |
| `@angular/common` | 17.0.0 |
| `@angular/forms` | 17.0.0 |
| `jalali-moment` | 3.0.0 |

> Angular 17 introduced signal inputs, `input<>()`, `computed()`, `effect()`, and the `@if`/`@for` control-flow syntax that this library depends on.

---

## Installation

```bash
npm install ng-cyrus-calendar jalali-moment
```

---

## Setup

### NgModule-based app

```typescript
import { CalendarPopupComponent, CyrusCalendarDirective } from 'ng-cyrus-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,          // or ReactiveFormsModule
    CalendarPopupComponent,
    CyrusCalendarDirective,
  ]
})
export class AppModule {}
```

### Standalone component

```typescript
import { CalendarPopupComponent, CyrusCalendarDirective } from 'ng-cyrus-calendar';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarPopupComponent, CyrusCalendarDirective],
})
export class MyComponent {}
```

---

## Usage

Add the `cyrus-calendar` directive to any `<input>` and place a `<calendar-popup>` next to it.
Export the directive as a template reference (`#cal="cyrusCalendar"`) and pass it to the popup via `[directive]`.

### Shamsi (Jalali / Persian)

```html
<input
  type="text"
  #myInput
  #cal="cyrusCalendar"
  cyrus-calendar
  [calendar-type]="'shamsi'"
  autocomplete="off"
  inputmode="none"
/>
<calendar-popup
  [input]="myInput"
  [directive]="cal"
  [(ngModel)]="selectedDate">
</calendar-popup>
```

### Gregorian

```html
<input type="text" #myInput #cal="cyrusCalendar" cyrus-calendar
  [calendar-type]="'gregorian'" autocomplete="off" inputmode="none" />
<calendar-popup [input]="myInput" [directive]="cal" [(ngModel)]="selectedDate">
</calendar-popup>
```

### With time picker

```html
<calendar-popup
  [input]="myInput"
  [directive]="cal"
  [time]="true"
  [(ngModel)]="selectedDateTime">
</calendar-popup>

<!-- Value emitted : 1403-06-15T14:30:00  -->
<!-- Input displays: 1403/06/15 - 14:30:00 -->
```

### Disable restrictions

```html
<input cyrus-calendar [calendar-type]="'shamsi'"
  [disable-past-days]="true" [disable-weekends]="true" ... />
```

---

## API Reference

### Directive: `cyrus-calendar`

Apply to `<input>`. Export as `#ref="cyrusCalendar"` to pass to `<calendar-popup [directive]="ref">`.

| Input | Type | Default | Description |
|---|---|---|---|
| `[calendar-type]` | `DatePickerType` | `'imperial'` | Active calendar system |
| `[disable-weekends]` | `boolean` | `false` | Disable weekend days |
| `[disable-past-days]` | `boolean` | `false` | Disable dates before today |
| `[placeholder]` | `string` | auto | Custom placeholder text |

### Component: `<calendar-popup>`

Implements `ControlValueAccessor` — works with `ngModel` and reactive forms.

| Input | Type | Default | Description |
|---|---|---|---|
| `[input]` | `HTMLInputElement` | **required** | Template reference of the attached input |
| `[directive]` | `CyrusCalendarDirective` | `null` | Directive reference — inherits `calendar-type`, `disable-weekends`, `disable-past-days` |
| `[calendar-type]` | `DatePickerType` | `'shamsi'` | Calendar system (ignored when `[directive]` provided) |
| `[format]` | `string` | `'yyyy/MM/dd'` | Display format shown in the input (slashes) |
| `[value-format]` | `string` | `'yyyy-MM-dd'` | Structure of the emitted Gregorian date string (e.g. `yyyy-MM-dd`). Only affects separator/order — the date is **always Gregorian** regardless of the displayed calendar. |
| `[time]` | `boolean` | `false` | Show time picker panel |
| `[time-format]` | `string` | `'hh:mm:ss'` | Format for the time part (only when `[time]="true"`) |
| `[date]` | `boolean` | `true` | Show date picker panel |
| `[min]` | `string` | `null` | Minimum selectable date |
| `[max]` | `string` | `null` | Maximum selectable date |
| `[disable-past-days]` | `boolean` | `false` | Disable past dates |
| `[from-tomorow]` | `boolean` | `false` | Only allow tomorrow onwards |
| `[disable-weekends]` | `boolean` | `false` | Disable weekend days |
| `[multiple]` | `boolean` | `false` | Multi-date selection |
| `[range]` | `boolean` | `false` | Date-range selection |
| `[options]` | `DatePickerOptions` | — | Advanced configuration object |

> ⚠️ **The emitted value is always in the Gregorian calendar**, regardless of the calendar type displayed to the user. A Shamsi date `1404/12/17` and an Imperial date `2584/12/17` both emit `2026-03-08`. This makes the value safe to send directly to REST APIs and databases without any conversion on your side.

---

## Format Tokens

| Token | Meaning | Example |
|---|---|---|
| `yyyy` | 4-digit year | `1403`, `2025` |
| `MM` | 2-digit month (zero-padded) | `07` |
| `dd` | 2-digit day (zero-padded) | `05` |
| `hh` | Hour 0–23 (zero-padded) | `14` |
| `mm` | Minute (zero-padded) | `30` |
| `ss` | Second (zero-padded) | `00` |

---

## Calendar System Notes

| System | Typical year | Layout | Week start |
|---|---|---|---|
| Gregorian | 2025 | LTR | Monday |
| Shamsi (Jalali) | 1403 | RTL | Saturday |
| Imperial | 2584 | RTL | Saturday |

---

## Development

```bash
git clone https://github.com/mhmfofa/cyrus-calendar.git
cd cyrus-calendar
npm install
npm start          # dev server → http://localhost:4200
npm run build      # production build
npm run build:lib  # build the distributable library → dist/cyrus-calendar/
```

---

## Publishing to npm

```bash
# 1. Build
npm run build:lib

# 2. Publish from the dist folder
cd dist/cyrus-calendar
npm publish --access public
```

---

## License

MIT © mhmfofa


---

## Installation

```bash
npm install ng-cyrus-calendar
```

> **Angular peer requirement:** `>=21.0.0`

---

## Setup

### 1. Import the module

```typescript
// app.module.ts
import { DatepickerModule } from 'ng-cyrus-calendar';

@NgModule({
  imports: [DatepickerModule],
})
export class AppModule {}
```

### 2. Add Bootstrap 5 (optional but recommended)

```bash
npm install bootstrap
```

```scss
// styles.scss
@import 'bootstrap/dist/css/bootstrap.min.css';
```

---

## Usage

### Basic (Gregorian)

```html
<input type="text" #myInput [(ngModel)]="selectedDate" />
<calendar-popup
  calendar-type="gregorian"
  [(ngModel)]="selectedDate"
  [input]="myInput">
</calendar-popup>
```

### Shamsi (Jalali / Persian)

```html
<input type="text" #myInput [(ngModel)]="selectedDate" />
<calendar-popup
  calendar-type="shamsi"
  [(ngModel)]="selectedDate"
  [input]="myInput">
</calendar-popup>
```

### Imperial

```html
<input type="text" #myInput [(ngModel)]="selectedDate" />
<calendar-popup
  calendar-type="imperial"
  [(ngModel)]="selectedDate"
  [input]="myInput"
  [disable-weekends]="true"
  [disable-past-days]="true">
</calendar-popup>
```

### With time picker

```html
<calendar-popup
  calendar-type="gregorian"
  [(ngModel)]="selectedDateTime"
  [input]="myInput"
  [date]="true"
  [time]="true">
</calendar-popup>
```

---

## API Reference

### `<calendar-popup>` inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `calendar-type` | `'gregorian'` \| `'shamsi'` \| `'imperial'` | `'shamsi'` | Calendar system to use |
| `input` | `HTMLInputElement` | — | The text input to attach to |
| `format` | `string` | `'yyyy/MM/dd'` | Date format string |
| `date` | `boolean` | `true` | Show the date picker |
| `time` | `boolean` | `false` | Show the time picker |
| `min` | `string` | — | Minimum selectable date (same format) |
| `max` | `string` | — | Maximum selectable date (same format) |
| `disable-past-days` | `boolean` | `false` | Disables all past dates |
| `from-tomorow` | `boolean` | `false` | Disables today and past dates |
| `disable-weekends` | `boolean` | `false` | Disables weekend days |
| `disables` | `(number\|string)[]` | — | Array of day-of-week indexes or date strings to disable |
| `multiple` | `boolean` | `false` | Allow multi-date selection |
| `range` | `boolean` | `false` | Allow date-range selection |
| `options` | `DatePickerOptions` | auto | Override globalization options |

---

## Format Tokens

| Token | Meaning | Example |
|---|---|---|
| `yyyy` | 4-digit year | `1403` |
| `MM` | 2-digit month | `07` |
| `dd` | 2-digit day | `05` |
| `hh` | 2-digit hour (24 h) | `14` |
| `mm` | 2-digit minute | `30` |
| `ss` | 2-digit second | `00` |

---

## Year-Grid Picker

Clicking the **year label** in the header opens a 12-year grid overlay.
Use **›** / **‹** to navigate decades. Click any year to select it instantly.

---

## Development

```bash
# Clone
git clone https://github.com/mhm/ng-cyrus-calendar.git
cd ng-cyrus-calendar

# Install dependencies
npm install

# Start dev server  →  http://localhost:4200
npm start

# Production build
npm run build
```

---

## Publishing to npm

```bash
# Builds first (via prepublishOnly script), then publishes
npm publish
```

---

## Calendar System Notes

| System | Year offset | Leap year rule |
|---|---|---|
| Gregorian | — | Standard Gregorian leap year |
| Shamsi (Jalali) | −621 from Gregorian | Iranian solar leap year algorithm |
| Imperial | +1180 from Shamsi | Same as Shamsi |

---

## License

MIT © mhm
