# Changelog

All notable changes to `ng-cyrus-calendar` are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] — 2026-05-16

### ⚠️ Breaking Changes
- **`jalali-moment` removed** as a peer dependency. Replace it with `jalaali-js` (see Migration below).

### Added
- **Hijri (Islamic / Umm al-Qura) calendar** support via `DatePickerType.Hijri`
  - Arabic month names, Sunday-first week, Friday & Saturday highlighted as weekends
  - Powered by `moment-hijri` (new peer dependency, optional)
- `HDate` class in `date-time.ts` for Hijri date arithmetic
- `HijriGlobalization` class in `models.ts`
- **Example 6** in the docs page demonstrating Hijri calendar usage
- **Hijri radio button** added to Example 5 (Calendar Switcher) — all 4 calendar types can now be tested side-by-side
- **"Date Utility API"** section added to docs with full conversion examples for all 4 calendars
- `NPM-PUBLISH.md` — step-by-step guide for publishing the package to npm

### Fixed
- **All calendar-to-calendar conversions** were broken when `moment-hijri` was imported alongside `jalali-moment` — `moment-hijri` modifies the shared `moment.js` prototype, corrupting Jalali string parsing. Fixed by replacing `jalali-moment` with the zero-dependency `jalaali-js` library.
- **Hijri popup showing no day numbers** — `HDate.getDaysInMonth()` was calling `m.iDaysInMonth()` which returns `NaN` in this version of `moment-hijri` for full date strings. Fixed to use `m.daysInMonth()` (overridden by `moment-hijri` to return the Islamic month length).
- **`getStartDayOfWeek` off-by-one** for Saturday-start months in `ImperialGlobalization` and `ShamsiGlobalization` — formula corrected to `(getDay() + 1) % 7`.
- **`HDate` format padding** — month/day tokens in `iYYYY/iMM/iDD` format strings were not zero-padded, causing `moment-hijri` to return invalid results.

### Changed
- `libs/cyrus-calendar/package.json` peer dependencies updated:
  - Removed: `jalali-moment`
  - Added: `jalaali-js >= 2.0.0` (optional)
  - Added: `moment-hijri >= 2.1.2` (optional — only required for Hijri calendar)

### Migration from 1.0.x

1. **Uninstall the old peer dep:**
   ```bash
   npm uninstall jalali-moment
   ```
2. **Install the new peer deps:**
   ```bash
   npm install jalaali-js
   npm install moment-hijri  # only if you use DatePickerType.Hijri
   ```
3. **No template or API changes** — `DatePickerType.Shamsi` and `DatePickerType.Imperial` continue to work exactly as before.

---

## [1.0.0] — Initial Release

- Imperial (Persian royal), Shamsi (Solar Hijri / Jalali), and Gregorian calendar support
- Angular CDK overlay-based popup
- `ngModel` / `FormControl` compatible
- `CyrusCalendarDirective` for attaching the picker to any `<input>`
- `CalendarPopupComponent` for the popup UI
- RTL support for Shamsi and Imperial calendars
