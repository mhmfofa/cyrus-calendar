# Publishing `ng-cyrus-calendar` to npm

Complete step-by-step guide for building and publishing the library.

---

## Prerequisites

- Node.js ≥ 18 and npm ≥ 9 installed
- An npm account at https://www.npmjs.com (username: `mhmfofa` or your account)
- You must be logged in: `npm whoami` should return your username

---

## 1 — Verify npm login

```bash
npm whoami
```

If not logged in:

```bash
npm login
```

Follow the prompts (username, password, OTP if 2FA is enabled).

---

## 2 — Update the version in `libs/cyrus-calendar/package.json`

Follow [Semantic Versioning](https://semver.org):

| Change type | Version bump | Example |
|---|---|---|
| Breaking change | Major | `1.x.x` → `2.0.0` |
| New feature (backwards-compatible) | Minor | `1.0.x` → `1.1.0` |
| Bug fix | Patch | `1.1.x` → `1.1.1` |

Edit `libs/cyrus-calendar/package.json`:

```json
{
  "version": "1.1.0"
}
```

---

## 3 — Build the library

From the **workspace root** (`D:\PersonalApps\mhmCalendar-master`):

```bash
npm run build:lib
```

This outputs the distributable to `dist/cyrus-calendar/`.

Verify the output exists:

```bash
ls dist/cyrus-calendar/
```

Expected files: `package.json`, `README.md`, `esm2022/`, `fesm2022/`, `*.d.ts`, `index.d.ts`

---

## 4 — Inspect the package before publishing (optional but recommended)

```bash
cd dist/cyrus-calendar
npm pack --dry-run
```

This lists every file that will be included without actually publishing.
Check there are no secrets, test files, or large unneeded assets.

---

## 5 — Publish to npm

```bash
cd dist/cyrus-calendar
npm publish --access public
```

> `--access public` is required for **scoped packages** (e.g. `@mhmfofa/ng-cyrus-calendar`).
> For an **unscoped** package like `ng-cyrus-calendar` it is optional but safe to include.

---

## 6 — Verify the published package

```bash
npm view ng-cyrus-calendar
```

Or visit: https://www.npmjs.com/package/ng-cyrus-calendar

---

## 7 — Tag the release in git

```bash
git add .
git commit -m "chore: release v1.1.0 — add Hijri calendar support"
git tag v1.1.0
git push origin main --tags
```

---

## Releasing a pre-release (beta / RC)

```bash
# In libs/cyrus-calendar/package.json: "version": "1.1.0-beta.1"
npm run build:lib
cd dist/cyrus-calendar
npm publish --access public --tag beta
```

Users install it with: `npm install ng-cyrus-calendar@beta`

---

## Deprecating an old version

```bash
npm deprecate ng-cyrus-calendar@"<1.0.0" "Upgrade to 1.1.0 for Hijri support"
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `403 Forbidden` on publish | Run `npm login` again; check 2FA token |
| `You do not have permission to publish "ng-cyrus-calendar"` | The package name is taken; check npm ownership or rename |
| Old files appear in dist | Delete `dist/` and re-run `npm run build:lib` |
| `ENEEDAUTH` error | `npm login` or check `.npmrc` for correct registry |

---

## Local testing before publish

Install the built package into another project without publishing:

```bash
# Option A: npm link
cd dist/cyrus-calendar
npm link
cd /path/to/your-project
npm link ng-cyrus-calendar

# Option B: pack + install
cd dist/cyrus-calendar
npm pack
# Creates ng-cyrus-calendar-1.1.0.tgz
cd /path/to/your-project
npm install /path/to/dist/cyrus-calendar/ng-cyrus-calendar-1.1.0.tgz
```

---

## Quick reference: full release workflow

```bash
# 1. Update version in libs/cyrus-calendar/package.json
# 2. Build
npm run build:lib
# 3. Publish
cd dist/cyrus-calendar && npm publish --access public
# 4. Tag
cd ../..
git add . && git commit -m "chore: release vX.Y.Z" && git tag vX.Y.Z && git push origin main --tags
```

---

## Changelog

### v1.1.0 — Hijri Calendar + Dependency Overhaul

#### 🆕 New Features
- **Hijri (Islamic) calendar** support via `moment-hijri` (Umm al-Qura tables)
  - New `DatePickerType.Hijri = 'hijri'`
  - New `HDate` class for Hijri date representation
  - `DateTime.toHDate(date)` — Gregorian → Hijri
  - `DateTime.parseHDate(str)` — parse Hijri string
  - `HDate.toDate()` — Hijri → Gregorian
  - Arabic month names, Sunday-first week, Friday & Saturday weekends

#### ⚠️ Breaking Changes
- **`jalali-moment` removed** as a dependency.
  If you were installing `jalali-moment` as a peer dependency, replace it with `jalaali-js`:
  ```bash
  # Remove
  npm uninstall jalali-moment
  # Add
  npm install jalaali-js
  ```
- `jalaali-js` is now the peer dependency for Shamsi and Imperial calendar support.
  It is a smaller, zero-dependency, ES-module-compatible library with the same algorithm.

#### 🐛 Bug Fixes
- Fixed Jalali ↔ Gregorian conversion failures that occurred when both `jalali-moment`
  and `moment-hijri` were loaded simultaneously (prototype conflict).
- Fixed Imperial calendar conversion (affected by same root cause).
- Fixed `getStartDayOfWeek` off-by-one for months starting on Saturday (was returning 7 instead of 0).
- Fixed Hijri popup rendering blank (was calling `iDaysInMonth()` which returned `NaN`; fixed to use `daysInMonth()`).

#### 📦 Peer Dependencies (updated)
| Package | Version | Required for |
|---|---|---|
| `jalaali-js` | `^2.x` | Shamsi (Jalali) + Imperial calendars |
| `moment-hijri` | `^2.x` | Hijri (Islamic) calendar |
