# ng-cyrus-calendar

A lightweight, multi-calendar Angular date picker component supporting **Gregorian**, **Shamsi (Jalali / Persian)**, and **Imperial** calendars — with a modern, fully redesigned UI and inline year-grid picker.

---

## Features

- **Three calendar systems**: Gregorian · Shamsi (Jalali) · Imperial
- **Year-grid picker**: click the year to browse and select from a 12-year grid instead of a raw input field
- **Month-grid picker**: full month overlay
- **Disable rules**: past days, weekends, specific dates, or a custom list
- **Date ranges & multi-select**
- **Optional time picker** (hours · minutes · seconds)
- **RTL ready** — Persian month/weekday names built-in
- **No jQuery dependency** — pure Angular + Bootstrap 5
- Angular 21 · TypeScript 5.9 · RxJS 7
- Refactored with signal-based state and Angular control-flow syntax (`@if`, `@for`)

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
