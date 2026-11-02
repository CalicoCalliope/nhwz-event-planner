# NHWZ Event Planner

A responsive, attendee-facing website for Sustainability Week Zurich: browse the programme by day, filter by
campus, category and language, open event details with Google Maps and registration links, and (Sprint 2) save
events to a personal week. Built to the NHWZ Reduced-Scope PRD v1.1 (25 October 2026).

There is no backend, account or database: the programme is one editable JSON file, and saved events (Sprint 2)
stay in the visitor's browser.

**Status:** Sprint 1 (Programme, filters, event details) complete; Sprint 2 (save events, My Week) not started.
See [docs/progress.md](docs/progress.md).

## Run it

Requires [Node.js](https://nodejs.org/) 20.19 or newer (developed and tested on Node 26.13, npm 11.20).

```bash
npm ci            # install the exact dependency versions from package-lock.json
npm run dev       # development server with live reload, at the URL it prints
npm test          # all unit and component tests (Vitest), once
npm run lint      # code checks (oxlint)
npm run build     # type-check and build the static site into dist/
npm run preview   # serve the built dist/ locally to check the production build
```

`dist/` is a plain static site (HTML, CSS, JS, fonts). Any static host can serve it; because the app uses
client-side routes such as `/events/e01`, configure the host to serve `index.html` for unknown paths.

## Folder structure

| Path | Purpose |
| --- | --- |
| `data/events.json` | **The programme.** Edition dates and every event; the only file to edit for content |
| `src/pages/` | Screens: Programme, Event details, My Week, Not found |
| `src/components/` | Reusable parts: event card, day selector, filter panel, navigation (`ui/` = shadcn/ui base components) |
| `src/services/events.ts` | Loads and validates `data/events.json`; the only code that reads it, so it can later be replaced by an API |
| `src/utils/` | Rules: date formatting (Europe/Zurich), filtering and ordering, Maps/registration links, data validation |
| `src/types/event.ts` | Event data model and the allowed campus, category and language values |
| `src/**/*.test.ts(x)` | Tests, kept next to the code they test (Vitest convention) |
| `public/` | Static files served as-is (NHWZ mark, favicon) |
| `docs/` | Project documentation, listed below |

| Document | Contents |
| --- | --- |
| [docs/SPECIFICATION.md](docs/SPECIFICATION.md) | Original developer specification (previous README, 17 Oct 2026) |
| [docs/progress.md](docs/progress.md) | Checklist per sprint, design deviations, open items |
| [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md) | Acceptance cases and test results |
| [docs/event-data-review.md](docs/event-data-review.md) | Event records for the team to confirm |
| [docs/AI_USAGE.md](docs/AI_USAGE.md) | Generative AI disclosure |
| [docs/HANDOVER.md](docs/HANDOVER.md) | Dependencies, licences, release and known limitations |
| `docs/reference/` | The 2026 programme image and its full transcription |

## Edit an event

1. Open `data/events.json` and find the event by its `id` (or copy an existing event to add one).
2. Change the fields you need (see the table below). Keep each `id` unchanged: saved events refer to it.
3. Run `npm test`. It checks every record and tells you which field is wrong if one is invalid.
4. Run `npm run dev` and open the event to check it.

| Field | What to enter |
| --- | --- |
| `id` | Unique, stable text, e.g. `"e09"`. Never reuse or change an existing ID |
| `title` | Event title as approved |
| `description` | Text, or `null` if none has been published (the app then says so) |
| `start`, `end` | Date and time with Zurich offset, e.g. `"2026-04-13T12:15:00+02:00"` (`+01:00` in winter). End must be after start |
| `campus` | One of `UZH Irchel`, `ETH Zentrum`, `PHZH`, `ZHdK`, `ZHAW`, `Other` |
| `venue` | Venue or room as shown to visitors |
| `address` | Street address, or `null` if unknown |
| `locationConfirmed` | `true` if venue and address are confirmed; `false` hides the Maps link and says directions are unavailable |
| `mapUrl` | A Google Maps link, or `null` (the app then searches Google Maps for the venue and address) |
| `category` | One of `Workshop`, `Panel`, `Exhibition`, `Info event`, `Food`, `Game`, `Tour`, `Music & Film` |
| `languages` | `["en"]`, `["de"]` or `["de", "en"]` for bilingual events |
| `registration` | `{ "required": false, "url": null }`, or `required: true` with an `https://` link (no link shows "Contact the organiser to register") |
| `status` | `"scheduled"` or `"cancelled"` |
| `dataFlags` | Optional review notes, not shown as event copy: `demoDescription`, `missing`, `note`, `testVariant` |

The edition (`edition` at the top of the file) sets the event days, the time zone (`Europe/Zurich`) and the
notice shown under the dates.

**Current data:** the 8-event historical acceptance dataset (13–17 April 2026) defined in the project
repository README, checked against the printed programme (`docs/reference/programme-2026.png`). The full
programme is transcribed in `docs/reference/programme-2026-transcription.json`; copying it over
`data/events.json` loads the whole week (it changes the AC01 acceptance results). These are historical
demonstration records, not a confirmed future programme.

## How it works

- **Filters:** OR within a group, AND across groups and the selected day. English matches English-only events;
  German matches German-only and bilingual events. Edits in the panel apply only on **Show results**.
- **Shareable state:** the selected day and applied filters live in the URL
  (`/?day=2026-04-14&campus=UZH+Irchel&language=en`), so Back, reload and shared links keep them.
- **External links:** only absolute `http(s)` links are used, opened in a new tab with `noopener noreferrer`.
  Unconfirmed venues never get a guessed map destination.
