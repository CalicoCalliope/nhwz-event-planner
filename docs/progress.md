# Progress checklist

Requirements: NHWZ Reduced-Scope PRD v1.1 (25 Oct 2026), which supersedes the repository README (17 Oct) and the
Figma Read Me (22 Oct) where they conflict. Browser prototype: https://nhwz-prototype.freedev.app/ (pre-reduction design, reference only). Visual reference: NHWZ Figma file
"Prototype - Handoff", page "02 Mobile Flows · Desktop" (mobile P01–P10, filter states P02, desktop D01–D03),
read through the Figma MCP server.

## Sprint 1: Programme and details (target 2 Nov 2026)

- [x] Project setup: React, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, React Router, Vitest
- [x] Event data model, edition config and validation (required fields, end > start, offsets, http(s) links)
- [x] Europe/Zurich date and time formatting
- [x] Figma tokens: green #006B3C, softGreen #E8F1E9, border #D6DED8, cancel #972F28 on #FCECE8, radii 12/16, Inter
- [x] Layout: NHWZ mark, Programme / My Week navigation only (bottom bar on mobile, sticky top bar from tablet up)
- [x] Programme: headline, 62px day tiles (first day by default), chronological cards, cancelled pill, counts,
      empty day, desktop card grid
- [x] Filters: panel per P02 (draft until Show results; Close/Escape/backdrop discard; Clear filters resets draft),
      applied chips + "Clear all filters" (immediate), No matches message, language rule
- [x] Day and applied filters kept in the URL (survive Back and reload)
- [x] Event details per P05/P10: date, time, language, venue, address, campus, description, cancellation banner
- [x] Registration states: Register externally / Contact the organiser / No registration needed /
      Registration unavailable — event cancelled
- [x] Single "Google Maps ↗" link (supplied Google links kept; other providers replaced by a Google Maps search;
      unconfirmed venues say the link is unavailable)
- [x] Back returns to the originating list with day, filters and scroll position
- [x] App loads the 8-event historical acceptance dataset (README AC01/AC02), checked against the programme image
- [x] Full programme transcribed (49 events) to `docs/reference/programme-2026-transcription.json`, not loaded pending team decision
- [x] Ordering: start time, then title (README R02; also needed for My Week)
- [ ] Team review of `docs/event-data-review.md`, including whether to load the full programme
- [ ] Manual browser/device test evidence (coverage to be agreed with the client)

## Sprint 2: personal planning (in progress)

- [x] Save/remove on cards and details (`nhwz.saved.v1`), "Saved" label on cards, malformed data and unknown IDs
      ignored, session fallback with a notice when storage fails, cross-tab sync
- [x] My Week: grouped by day, start time then title, cancelled saved events removable, empty state with
      "Browse programme", "Saved on this device" note, Back from details returns to My Week
- [ ] Click-through of saved states in a real browser
- [ ] Final accessibility checks; handover documentation

## Figma deviations (deliberate)

| Figma | Implementation | Reason |
| --- | --- | --- |
| Save event / Remove from My Week buttons on cards and details | Built as designed, plus a "Saved" label on cards | PRD FR01 (saved state shown as text on cards) |
| D03 desktop My Week | Same sidebar layout as our desktop Programme (from 1024px) | Matches the desktop redesign above |
| No demonstration notice | One-line notice under the edition dates | PRD FR06: don't present historical data as a future programme |
| No campus line on details | "Campus: …" in "Where to go" | PRD FR03 lists campus |
| "Google Maps ↗" link is a 24px text line | Same look, 44px tall tap area | PRD FR07 (44 x 44px targets) |
| Day tiles fixed at 62px | Shrink to fit at 320px (5 tiles × 62px don't fit) | PRD FR07 (no overflow at 320px) |
| No desktop filter-panel frame | Panel opens as a 390px side sheet on desktop | No desktop design supplied |
| D01/D02 desktop layout references | Own desktop layout (from 1024px): sticky top bar with inline tabs; Programme sidebar with headline, day list with event counts and filters beside a 2-column card grid; details with a sticky date/venue panel | Requested by the developer for a sleeker large-screen design; mobile follows Figma |

## Data notes

`data/events.json` is the 8-event historical acceptance dataset from the repository README (e01–e08), with
the design's descriptions, Maps links, PubQuiz registration form and e04 cancellation. Its values were checked
against the programme image; differences (e01 spelling, e04 cancellation source, e08 room, e07 venue) are listed in
`docs/event-data-review.md` and kept as fixture values, as the README requires. The full programme (49 events, 4 more
left out for missing end times) is in `docs/reference/programme-2026-transcription.json`; replacing
`events.json` with it loads the whole week but changes the AC01 results.

## Client repository README (17 Oct): items still to apply

- Test evidence per case: started in `docs/ACCEPTANCE.md`; manual, keyboard and device runs still to record.
- Handover structure: done (app at the root, `data/events.json`, `docs/ACCEPTANCE.md`, `docs/AI_USAGE.md`,
  `docs/HANDOVER.md`); tests stay next to the code they test, as documented in the README.
- Work in the client repository with branches/pull requests; dated source snapshots at each delivery.
- The README's data field names (`startAt`, `venueName`, `registrationUrl`, ...) differ from ours; agree with the
  team whether they will supply data in that format.
- Superseded by the PRD: search, Now & Next, directions chooser, overlap warnings, and the old 20 Oct – 7 Nov timeline.

## Checks run so far

| Date | Check | Result |
| --- | --- | --- |
| 2 Nov 2026 | `npm test`: 56 unit and component tests, including AC01, AC02 and AC05 on the acceptance dataset | Pass |
| 2 Nov 2026 | `npm run build`, `npm run lint` | Pass (2 fast-refresh warnings in the test helper and shadcn's button) |
| 2 Nov 2026 | Edge (headless Chromium) at 320, 390, 1440 px across 10 screens: overflow, text < 14px, controls < 44px | No overflow, no small text, no small controls |
| 2 Nov 2026 | Visual comparison with Figma P01, P01-13/16 filtered, P02, P05, P10, D01, D02 | Matches, apart from the deviations above |
| 2 Nov 2026 | `npm audit` | 6 low/moderate findings, all in the `shadcn` CLI dev dependency (not shipped to browsers) |
