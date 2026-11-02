# Acceptance cases and test results

Acceptance cases follow the project repository README (AC01–AC19), adjusted to the Reduced-Scope PRD v1.1:
cases for removed features (search, Now & Next, directions chooser, overlap warnings) are marked **Removed**.

**Data setup for all cases:** `data/events.json` = historical acceptance dataset (e01–e08), start on Monday
13 April with no filters and no saved events, e04 cancelled.

## Sprint 1 results

- **Version:** working copy of 2 November 2026 (no commit yet; to be replaced by the delivery commit ID)
- **Tester:** developer (automated checks); team acceptance reviewer still to run
- **Environments:**
  - *Automated:* Vitest 5 + jsdom on Node 26.13, Windows 11 (`npm test`, 56 tests)
  - *Layout:* Microsoft Edge (Chromium, headless) on Windows 11, emulated at 320×844, 390×844 and 1440×900:
    page overflow, text below 14px and controls below 44×44px measured on 10 screens

| ID | Case | Expected | Observed | Result | Evidence |
| --- | --- | --- | --- | --- | --- |
| AC01 | Monday: unfiltered / English / German / both | 5 / e01,e02,e03,e05 / e04 / 5 | As expected | Pass | `programme-page.test.tsx` "AC01" |
| AC02 | ETH Zentrum + English; UZH Irchel + Workshop + English | e05; e01,e03 | As expected | Pass | `programme-page.test.tsx` "AC02" |
| AC03 | Keyword search | — | — | Removed | PRD reduction 4 |
| AC04 | Clear filters keeps day (search part removed) | Outside panel clears applied filters at once, day kept; inside panel resets draft only | As expected | Pass | "Clear all filters acts immediately…", "Clear filters inside the panel…" |
| AC05 | Unapplied edits discarded on Close/Escape; Show results applies | Results unchanged until Show results | As expected | Pass | `programme-page.test.tsx` "AC05" (Close, Escape) |
| AC06 | Save from card, views update, empty My Week | — | — | Sprint 2 | |
| AC07 | Saved e02 persists; malformed/unavailable storage | — | — | Sprint 2 | |
| AC08 | Overlap warnings | — | — | Removed | PRD reduction 3 |
| AC09, AC10 | Now & Next and edition time states | — | — | Removed | PRD reduction 1 |
| AC11 | Cancelled e04 visible, registration unavailable | Shown with "Cancelled" in Programme and details; "Registration unavailable — event cancelled" | As expected | Pass (Programme/details); saved views Sprint 2 | `event-details-page.test.tsx` "shows cancellation…" |
| AC12 | e05 registration link; missing-link fallback; e07 no invented destination | External link opens in new tab; "Contact the organiser to register"; no Maps link for e07 | As expected | Pass | `event-details-page.test.tsx`, `data-edge-cases.test.tsx` |
| AC13 | Directions (chooser removed) | One "Google Maps" link; supplied Google links kept; other providers → Google Maps search | As expected | Pass | `links.test.ts`, `data-edge-cases.test.tsx` |
| AC14, AC15 | Chooser keyboard trap and sharing | — | — | Removed | PRD reduction 2 |
| AC16 | 320/390/1440px: wrapping, no overflow, labelled actions | No horizontal overflow, text ≥ 14px, targets ≥ 44px | As expected on all 10 screens | Pass (automated layout) | Headless Edge audit; keyboard check pending |
| AC17 | Public HTTPS deployment | — | — | Not in package | PRD section 9 (hosting not assumed) |
| AC18 | Native Figma completion | — | — | Not in package | PRD FR07 |
| AC19 | Details return to origin with day, filters and scroll | Back restores day and applied filters (Programme origin) | Day and filters restored | Pass (day/filters); scroll in a real browser pending; My Week origin Sprint 2 | `event-details-page.test.tsx` "Back returns…" |

### Not yet tested (Sprint 1)

- Keyboard-only walkthrough, visible focus and a screen reader.
- Measured WCAG AA contrast (colours were chosen against AA but not yet measured).
- Scroll restoration on Back in a real browser.
- Real devices and other browsers (Chrome, Firefox, Safari, iOS, Android): **the browser/device list still has
  to be agreed with the team** (PRD section 11).

## How to rerun

```bash
npm ci
npm test
```

For each new run, add a row group with the version (commit), environment, tester and results.
