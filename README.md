# ng-cyrus-calendar

A lightweight, multi-calendar Angular date picker supporting **Gregorian**, **Shamsi (Jalali / Persian)**, **Imperial**, and **Hijri (Islamic)** calendars — with a modern UI, inline year-grid picker, and an optional time picker.

---

## Features

- **Four calendar systems**: Gregorian · Shamsi (Jalali) · Imperial · Hijri (Islamic / Umm al-Qura)
- **Year-grid picker**: click the year to browse and select from a 12-year grid
- **Month-grid picker**: full month overlay
- **Disable rules**: past days, weekends, specific dates, or a custom list
- **Date ranges & multi-select**
- **Optional time picker** (hours · minutes · seconds)
- **RTL ready** — Persian and Arabic month/weekday names built-in; Hijri uses Sunday-first week with Friday/Saturday weekends
- **Separate display vs. value format** — show slashes to the user, store hyphens for APIs
- **No jQuery** — pure Angular + Bootstrap 5
- Signal-based state, Angular control-flow syntax (`@if`, `@for`)

---

## Live Demo

**[http://calendar.molayemi.com](http://calendar.molayemi.com)**

Interactive examples with all calendar types, time picker, date restrictions and calendar switcher.

---

## Requirements

| Peer dependency | Minimum | Notes |
|---|---|---|
| `@angular/core` | **17.0.0** | |
| `@angular/common` | 17.0.0 | |
| `@angular/forms` | 17.0.0 | |
| `jalaali-js` | 2.0.0 | Required for Shamsi & Imperial calendars |
| `moment-hijri` | 3.0.0 | Required for Hijri calendar only |

> Angular 17 introduced signal inputs, `input<>()`, `computed()`, `effect()`, and the `@if`/`@for` control-flow syntax that this library depends on.

---

## Installation

```bash
npm install ng-cyrus-calendar jalaali-js
# For Hijri calendar support, also install:
npm install moment-hijri
```

---

## Setup

### Standalone component

```typescript
import { CalendarPopupComponent, CyrusCalendarDirective } from 'ng-cyrus-calendar';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarPopupComponent, CyrusCalendarDirective],
})
export class MyComponent {}
```

### NgModule-based app

```typescript
import { CalendarPopupComponent, CyrusCalendarDirective } from 'ng-cyrus-calendar';

@NgModule({
  imports: [CommonModule, FormsModule, CalendarPopupComponent, CyrusCalendarDirective]
})
export class AppModule {}
```

---

## Usage

Add the `cyrus-calendar` directive to any `<input>` and place a `<calendar-popup>` next to it.
Export the directive as a template reference (`#cal="cyrusCalendar"`) and pass it to the popup via `[directive]`.

### Shamsi (Jalali / Persian)

```html
<input type="text" #myInput #cal="cyrusCalendar"
  cyrus-calendar [calendar-type]="'shamsi'"
  autocomplete="off" inputmode="none" />
<calendar-popup [input]="myInput" [directive]="cal" [(ngModel)]="selectedDate">
</calendar-popup>
```

### Gregorian

```html
<input type="text" #myInput #cal="cyrusCalendar"
  cyrus-calendar [calendar-type]="'gregorian'"
  autocomplete="off" inputmode="none" />
<calendar-popup [input]="myInput" [directive]="cal" [(ngModel)]="selectedDate">
</calendar-popup>
```

### Imperial

```html
<input type="text" #myInput #cal="cyrusCalendar"
  cyrus-calendar [calendar-type]="'imperial'"
  autocomplete="off" inputmode="none" />
<calendar-popup [input]="myInput" [directive]="cal" [(ngModel)]="selectedDate">
</calendar-popup>
```

### Hijri (Islamic)

> Requires `moment-hijri` to be installed.

```html
<input type="text" #myInput #cal="cyrusCalendar"
  cyrus-calendar [calendar-type]="'hijri'"
  autocomplete="off" inputmode="none" />
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

### Calendar switcher (value preserved on type change)

```typescript
calendarType = signal<DatePickerType>(DatePickerType.Imperial);
```

```html
<input type="text" #myInput #cal="cyrusCalendar"
  cyrus-calendar [calendar-type]="calendarType()"
  autocomplete="off" inputmode="none" />
<calendar-popup [input]="myInput" [directive]="cal" [(ngModel)]="value">
</calendar-popup>
```

> ⚠️ **The emitted value is always in the Gregorian calendar**, regardless of the calendar type displayed. A Shamsi date `1404/12/17` and an Imperial date `2584/12/17` both emit `2026-03-08`. This makes the value safe to send directly to REST APIs and databases without any conversion.

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
| `[directive]` | `CyrusCalendarDirective` | `null` | Directive reference — inherits `calendar-type` and disable rules |
| `[calendar-type]` | `DatePickerType` | `'shamsi'` | Calendar system (ignored when `[directive]` provided) |
| `[format]` | `string` | `'yyyy/MM/dd'` | Display format shown in the input |
| `[value-format]` | `string` | `'yyyy-MM-dd'` | Format of the emitted Gregorian date string |
| `[time]` | `boolean` | `false` | Show time picker panel |
| `[time-format]` | `string` | `'hh:mm:ss'` | Format for the time part |
| `[date]` | `boolean` | `true` | Show date picker panel |
| `[min]` | `string` | `null` | Minimum selectable date |
| `[max]` | `string` | `null` | Maximum selectable date |
| `[disable-past-days]` | `boolean` | `false` | Disable past dates |
| `[from-tomorow]` | `boolean` | `false` | Only allow tomorrow onwards |
| `[disable-weekends]` | `boolean` | `false` | Disable weekend days |
| `[multiple]` | `boolean` | `false` | Multi-date selection |
| `[range]` | `boolean` | `false` | Date-range selection |
| `[options]` | `DatePickerOptions` | — | Advanced configuration object |

> ⚠️ **The emitted value is always in the Gregorian calendar**, regardless of the calendar type displayed. A Shamsi date `1404/12/17` and an Imperial date `2584/12/17` both emit `2026-03-08`.

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

| System | Typical year | Layout | Week start | Weekends |
|---|---|---|---|---|
| Gregorian | 2025 | LTR | Monday | Sat + Sun |
| Shamsi (Jalali) | 1403 | RTL | Saturday | Friday |
| Imperial | 2584 | RTL | Saturday | Friday |
| Hijri (Islamic) | 1446 | RTL | Sunday | Fri + Sat |

---

## Development

```bash
git clone https://github.com/mhmfofa/cyrus-calendar.git
cd cyrus-calendar
npm install
npm start          # dev server → http://localhost:4200
npm run build:lib  # build the distributable library → dist/cyrus-calendar/
```

---

## Publishing to npm

```bash
# 1. Build the library
npm run build:lib

# 2. Publish from the dist folder (NOT the root)
cd dist/cyrus-calendar
npm publish --access public
```

See [NPM-PUBLISH.md](./NPM-PUBLISH.md) for the full publishing guide.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the full version history.

---

## License

MIT © [mhmfofa](https://github.com/mhmfofa)

| `[disable-past-days]` | `boolean` | `false` | Disable past dates |
| `[from-tomorow]` | `boolean` | `false` | Only allow tomorrow onwards |
| `[disable-weekends]` | `boolean` | `false` | Disable weekend days |
| `[multiple]` | `boolean` | `false` | Multi-date selection |
| `[range]` | `boolean` | `false` | Date-range selection |
| `[options]` | `DatePickerOptions` | — | Advanced configuration object |

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

| System | Typical year | Layout | Week start | Weekends |
|---|---|---|---|---|
| Gregorian | 2025 | LTR | Monday | Sat + Sun |
| Shamsi (Jalali) | 1403 | RTL | Saturday | Friday |
| Imperial | 2584 | RTL | Saturday | Friday |
| Hijri (Islamic) | 1446 | RTL | Sunday | Fri + Sat |

---

## Development

```bash
git clone https://github.com/mhmfofa/cyrus-calendar.git
cd cyrus-calendar
npm install
npm start          # dev server → http://localhost:4200
npm run build:lib  # build the distributable library → dist/cyrus-calendar/
```

---

## Publishing to npm

```bash
# 1. Build the library
npm run build:lib

# 2. Publish from the dist folder (NOT the root)
cd dist/cyrus-calendar
npm publish --access public
```

See [NPM-PUBLISH.md](./NPM-PUBLISH.md) for the full publishing guide.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the full version history.

---

## License

MIT © [mhmfofa](https://github.com/mhmfofa)

