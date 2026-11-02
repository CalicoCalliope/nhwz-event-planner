# NHWZ Event Planner

**External developer specification and handover reference**  
Documentation baseline: 17 October 2026 · Implementation status: not delivered in this repository

A mobile-first web application to help Sustainability Week Zurich visitors discover events, find venues and plan their personal week.

This repository currently contains the project README only. A browser demonstration and partial clickable Figma design exist separately. Review them for reusable assets; do not assume application source is already present here. Implement the agreed work, preserve the behaviour below, and document any proposed deviation before starting it.

## Contents

- [Project and reference assets](#project-and-reference-assets)
- [Scope and responsibilities](#scope-and-responsibilities)
- [Two-sprint timeline](#two-sprint-timeline)
- [Screens and user journeys](#screens-and-user-journeys)
- [Functional requirements](#functional-requirements)
- [Event data and demonstration fixtures](#event-data-and-demonstration-fixtures)
- [Design and accessibility](#design-and-accessibility)
- [Acceptance checks](#acceptance-checks)
- [Delivery workflow and handover](#delivery-workflow-and-handover)
- [Generative AI transparency](#generative-ai-transparency)

## Project and reference assets

The project is coordinated by a three-person university team. The team retains requirements, priorities, content approval and final acceptance. The developer supplies the agreed implementation, testing and reproducible handover.

| Asset | Purpose and current status |
|---|---|
| [Browser prototype](https://nhwz-prototype.freedev.app/) | Demonstration/reference; availability and behaviour must be checked independently. It is not proof of acceptance or a live programme. |
| [Partial editable Figma design](https://www.figma.com/design/AYqEjkXEkl8V2DD8XW3Z5q?node-id=4-2329) | Visual reference and selected clickable flows. It is not a completed parity deliverable; any additional access is provided separately. |
| This README | External-facing requirements, timeline, acceptance and handover baseline. Written requirements take precedence over a defect or stale state in a reference prototype. |
| Approved sample data and reusable source | Provided separately where available. Identify missing assets and reuse assumptions before implementation. |

The existing NHWZ programme already includes event information, map and registration links. This project improves discovery and personal planning. Easier participation is the intended benefit; increased attendance is not a guaranteed outcome.

## Scope and responsibilities

### Included visitor experience

- One configured event-week edition, responsive on mobile and desktop.
- English interface, preserving original event titles and displaying event languages.
- Programme by day, title/description search and campus/category/language filters.
- Event details, external directions chooser and external registration links.
- Browser-local favourites, chronological My Week and time-overlap warnings.
- Now & Next, cancellation handling and useful empty/unavailable states.
- Maintainable source, executable delivery, test evidence and setup/handover instructions.

### Outside the base scope

Native applications, accounts/login, cloud or cross-device synchronisation, payments/ticketing, registration processing, organiser CMS, push reminders, live programme synchronisation, embedded maps, GPS, route/travel-time calculations, transport APIs, analytics, AI recommendations, chat/social features, automatic translation, offline support and a multi-year archive.

Production hosting/domain, ongoing operation/maintenance, full programme entry, operational clock/edition configuration and completion of the native Figma file require explicit inclusion in the agreed work package. A demonstration deployment does not imply these services are provided.

### Responsibilities

| Role | Responsibility |
|---|---|
| Project team | Supply available assets/sample data; prioritise backlog; clarify requirements; review increments; approve changes and acceptance. |
| Developer | Assess reuse/dependencies; implement selected tasks; test; report risks/blockers; maintain source; demonstrate and hand over working increments. |
| Content approver designated by team | Confirm event facts, descriptions, languages, venues, links and branding before operational publication. |
| Acceptance reviewer designated by team | Run agreed cases independently, record findings and decide whether deliverables satisfy the agreed scope. |

Identify named contacts, communication channel, working-time overlap and response expectations at kickoff. No additional services or scope changes are authorised by this README alone.

## Two-sprint timeline

**All dates are in 2026; timezone: Europe/Zurich.** The following is the requested schedule, to be confirmed at kickoff. It must be explicitly replanned if availability changes; do not silently move delivery checkpoints.

| Period / deadline | Expected outcome |
|---|---|
| Before 20 October | Review assets, confirm remaining implementation, responsibilities, acceptance cases, dependencies, Definition of Done and two sprint goals. |
| **Sprint 1: 20-24 October** | Working first increment for agreed Programme/search/filter/details/navigation tasks. Provide source changes, demonstration and relevant test evidence. |
| **First delivery: 24 October, by 23:59** | Runnable first increment available for independent review. A screenshot or mockup is insufficient. |
| 25-27 October | Team review, communication and feedback; agreed Sprint 1 corrections; team prepares check-up material. |
| **Team check-up submission: 27 October, 23:59** | Team submits its own check-up material. This is not the developer's first delivery date. |
| **Sprint 2: 25 October-7 November** | Complete the remaining agreed personal-planning/time/state work, integrate review feedback, correct defects and prepare reproducible handover. |
| **Course check-up: 29 October** | Relevant feedback can inform Sprint 2 through explicit backlog prioritisation and change control. |
| **Final delivery: 7 November, by 23:59** | Complete runnable application, maintainable source, instructions, tests, limitations and AI-use record. |
| 8-9 November | Independent acceptance, agreed defect corrections, retesting and handover questions; team prepares its submission. Confirm developer availability for this period at kickoff. |
| **Team final submission: 10 November, 23:59** | Team submits its own deliverables. |

Both delivery checkpoints precede the corresponding team submission by three calendar days. Each sprint has planning, a goal, a working increment, review and a short retrospective. Two source snapshots or two payments alone do not constitute two sprints. Source delivery is required at both checkpoints; final acceptance follows review of the agreed deliverables and evidence.

## Screens and user journeys

Primary navigation: **Programme**, **Now & Next**, **My Week**. Open details from any destination; Back restores the originating view, selected day, query, applied filters and scroll.

| Screen ID | Required state |
|---|---|
| P01-P04 | Default Programme, filter panel, filtered results and no-results recovery. |
| P05, P10 | Scheduled and cancelled event details. |
| P06-P07 | Saved My Week, overlap variant and empty schedule. |
| P08-P09 | Now & Next during the edition; before/after edition and empty states. |
| D01-D02 | Desktop Programme/details with equivalent functions. |
| N01 | Accessible navigation-choice overlay. |

Journeys to demonstrate:

1. **A - Discover:** choose day, filter, apply, open details, choose directions and return without losing context.
2. **B - Plan:** save, review My Week, open details, remove and reach the empty state.
3. **C - Resolve a clash:** save the labelled scheduled test pair, see the overlap and remove one to clear it.
4. **D - Recover:** combine search/filters to get no matches, then clear one constraint type without resetting others.
5. **E - Attend now:** inspect current/later events and before/after/empty time states.
6. **F - Recognise cancellation:** cancelled status is explicit; registration unavailable; saved item removable.
7. **G - Navigate accessibly:** traverse chooser links by keyboard, dismiss and regain trigger focus with state intact.

## Functional requirements

### Programme, search and filters - R02, R03, R07, R14

- Select exactly one edition day; initially select the first day rather than automatically today.
- Sort by start time, then title using English-locale ordering. Cancelled records stay visible in Programme results/counts.
- Exact search placeholder: **Search by key words**. Search while typing; trim surrounding whitespace and match case-insensitive substrings in title/description only. No fuzzy or venue/campus search is implied.
- Campus, category and event-language filters allow multiple values. Use OR within a group; AND between active groups, the day and search. An empty group adds no restriction.
- **English matches English-only events. German matches German-only and bilingual German/English events. Selecting both returns their union.** Event language does not change the interface language.
- Filter edits are drafts until **Show results**. Close, Escape or backdrop dismissal discards unapplied changes.
- Inside the panel, Clear filters resets its draft and requires application. Outside the panel, it immediately clears only campus/category/language. Clear search removes query only. Removing a chip removes only its value. Changing day preserves query and filters.
- Cards show time, title, venue/campus, language, category and labelled save state. Long titles wrap. Save must not also open details. Status cues use text as well as colour.

### Event details and registration - R01, R03, R08

Show title, full date/start/end time, venue, known address, description, language, category, status and save state. Keep venue/address prominent. Unknown facts remain unconfirmed rather than guessed.

| Condition | Presentation |
|---|---|
| Scheduled, registration required, valid supplied URL | **Register externally**, opening the supplied destination. |
| Scheduled, registration required, missing/invalid URL | **Contact the organiser to register.** |
| Scheduled, registration not required | **No registration needed.** |
| Cancelled | Disabled **Registration unavailable**, regardless of registration fields; save/remove still works. |

No in-app registration form, record, confirmation or processing is included. A historical link is not evidence that registration is currently open. Do not submit real forms during testing.

### Directions and navigation chooser - R08, R13

The address and directions button have different behaviour:

- A known address is a direct external link to its valid supplied map URL.
- **Open directions** opens a navigation chooser.

| Choice | Destination / condition |
|---|---|
| Google Maps | Preserve supplied URLs hosted at `maps.app.goo.gl`, `maps.google.com`, `www.google.com` or `google.com`; otherwise use an encoded venue/address Google Maps search. |
| Apple Maps | `https://maps.apple.com/search?query=` plus encoded venue/address. |
| Open in browser | Google Maps web search using `api=1` and encoded venue/address. The operating system can still hand the link to an associated app. |
| Other apps | Offer Web Share of the existing destination only where secure-context sharing support permits. Available targets are device-controlled and can include non-map apps. |

A valid supplied non-Google map URL remains the address-link destination; the Google-labelled choice uses its search fallback. Do not enumerate installed apps, save a preferred provider, force a browser, calculate routes or invent alternate-provider pins.

With missing/invalid supplied map URL, do not open the chooser or invent a destination. Retain known address text and explanation. For unresolved location use **Venue/address to be confirmed** and **Directions are unavailable while the venue is being confirmed.**

Chooser requirements: accessible name; initial focus on Close; Tab/Shift+Tab trapped including links; background inert; scroll locked. Close/Escape/backdrop restores trigger focus. Dismissal/provider selection/sharing preserves event, origin, query, filters, saves and scroll. Share cancellation leaves the chooser useful; errors show a fallback; success closes it; late results cannot modify an already closed dialog.

Accept absolute HTTP(S) external URLs only, reject invalid schemes, and use `noopener noreferrer` for new external tabs. Prefer HTTPS destinations where available; do not claim strict HTTPS-only input validation. Real map-app/share behaviour must be checked on the agreed devices.

### Favourites and My Week - R04, R05

- Save/remove updates all views immediately. Persist stable IDs in local storage under `nhwz.saved.v1`.
- Missing/malformed storage gives an empty saved set; ignore unknown IDs. If storage is unavailable, preserve current-session saves and show a persistence notice.
- Handle same-origin storage events where the browser supports them. This is not cloud or cross-device synchronisation. Clearing data or changing domain does not migrate saves.
- Explain **Saved on this device**. Group My Week by day; sort by start time, then title; include cancelled saved items with status/removal. Empty state offers **Browse programme**.
- Compare saved, non-cancelled events only:

```text
overlap = A.start < B.end AND B.start < A.end
```

Adjacent end/start times do not overlap. Warnings do not prevent saving or estimate travel-time clashes. Demonstration scenario saves must be isolated from normal favourites; resetting a scenario restores normal state rather than deleting it.

### Now & Next and edition time - R06, R07, R12

- Use **Europe/Zurich**, with offset-aware data and correct local date boundaries.
- Happening now: non-cancelled events where `start <= now < end`.
- Starting next: at most three non-cancelled later starts that same Zurich day; sort by start/title; never fill slots with next-day events.
- Ignore Programme query/filters in this view.
- Before edition: show its start date. After edition: **This edition has ended.** During edition: **No events happening right now.** / **No more events starting today**, with a browse action where appropriate.
- Demo clock: `2026-04-13T12:30:00+02:00`; edition: 13-17 April 2026. At 12:30, e02 is current and e03/e05 are next. After-edition begins at 18 April 2026 00:00 Zurich.
- Keep fixed demo time distinct from actual operational time. If an operational release is included, agree configurable edition boundaries and reevaluation frequency; do not hard-code UTC+02:00 for all dates. Time refresh does not imply live content synchronisation.

## Event data and demonstration fixtures

One dated occurrence per stable ID. Event information is maintained in a structured file outside the public visitor interface.

| Field | Type / rule |
|---|---|
| `id` | Unique stable string. |
| `title`, `description` | Required title and description strings; preserve approved title. |
| `startAt`, `endAt` | Parseable ISO 8601 timestamps with explicit offset; end after start. |
| `campus`, `venueName` | Approved campus value and venue/room information. |
| `address` | String or null for unconfirmed information. |
| `mapUrl`, `registrationUrl` | Absolute HTTP(S) URL or null; syntax validity does not establish venue accuracy or registration availability. |
| `category` | Controlled category. |
| `languages` | Event-language array, e.g. `["en"]`, `["de"]`, `["de","en"]`. |
| `registrationRequired` | Boolean. |
| `status` | `scheduled` or `cancelled`. |
| Provenance | Preserve supplied `descriptionIsDemo`, `sourceUrl`, `venueAddressNote` and optional `sourceDiscrepancy`. Keep editorial metadata outside ordinary visitor copy. |

Campus vocabulary: **UZH Irchel, ETH Zentrum, PHZH, ZHdK, ZHAW, Other**. Category vocabulary: **Workshop, Panel, Exhibition, Info event, Food, Game, Tour, Music & Film**. Confirm any changes with the team.

Validate IDs, required content, date order/edition boundaries, category/language values, URL schemes, cancellation and registration consistency. Content approval is required before operational publication. Never fabricate missing addresses, meeting points or room numbers.

### Historical acceptance dataset

These eight occurrences are a demonstration subset, not a future programme. Descriptions are demonstration copy. An empty Thursday does not mean the historical week had no Thursday events.

| ID | Event | Date/time, Zurich | Campus / language / status |
|---|---|---|---|
| e01 | Computer Maintenance and Repair | 13 Apr 2026, 10:00-12:00 | UZH Irchel / English / scheduled |
| e02 | Foodsave Lunch | 13 Apr 2026, 12:00-13:00 | UZH Irchel / English / scheduled |
| e03 | Making the Switch to Linux | 13 Apr 2026, 13:00-15:00 | UZH Irchel / English / scheduled |
| e04 | Walking Tour on ETH Zentrum Campus | 13 Apr 2026, 14:00-15:30 | ETH Zentrum / German & English / cancelled |
| e05 | Sustainable PubQuiz | 13 Apr 2026, 19:30-22:00 | ETH Zentrum / English / scheduled; registration required |
| e06 | From Waste Plastic to 3D Printing | 14 Apr 2026, 10:00-13:00 | UZH Irchel / English / scheduled |
| e07 | KEEP IT COOL Ausstellungsführung | 15 Apr 2026, 15:00-16:30 | UZH Irchel as historical fixture / English / scheduled; venue unresolved |
| e08 | Gender, Sustainability & Climate Change | 17 Apr 2026, 18:15-20:15 | ZHdK / English / scheduled |

Keep e07 address/map URL null pending content confirmation; do not silently replace its fixture with conflicting source information. Campus addresses do not establish a tent entrance, historic room or exact meeting point. Supplied fixture languages/rooms remain subject to content approval.

Base e04 is cancelled. Only a clearly labelled overlap scenario changes it to scheduled; e03/e04 then overlap 14:00-15:00. Do not change the default dataset to manufacture a clash.

## Design and accessibility

Follow the supplied visual direction, using reusable components and consistent states.

| Token | Value |
|---|---|
| Primary green | `#006B3C` |
| Accent yellow | `#F4D83A`, with dark text |
| Page / surface | `#F7F9F6` / `#FFFFFF` |
| Main / secondary text | `#17251D` / `#46564C` |
| Border | `#D6DED8` |
| Spacing | 4, 8, 12, 16, 24, 32px |

Use Inter or a freely available sans-serif, normally 16px body and at least 14px secondary text; interaction targets at least 44 by 44px. Reference mobile: 390 by 844px; desktop: 1440 by 1024px; support down to 320px without horizontal page overflow.

Long text wraps; sticky navigation must not cover content or focused controls. Use semantic headings, labelled controls, meaningful link text, visible focus, keyboard access and explicit text for cancellation/clashes. Verify WCAG AA contrast for relevant text/controls. These are acceptance targets, not a claim of audited compliance.

## Acceptance checks

For each applicable case, record release/commit, data setup, browser/device, expected/observed result, tester, pass/fail and evidence. Agree browser/device coverage before work starts, including real mobile map/share checks where contracted. State untested cases explicitly.

Unless specified: start on Monday 13 April with empty query/no filters and recorded saved state; e04 stays cancelled. The approved dataset/descriptions must accompany testing; do not alter fixtures just to obtain a pass.

| ID | Expected check |
|---|---|
| AC01 | Monday unfiltered: 5; English: 4 (e01/e02/e03/e05); German: 1 (e04); both: 5. |
| AC02 | ETH Zentrum + English gives e05; UZH Irchel + Workshop + English gives e01/e03. |
| AC03 | `rEpAiR` gives e01; `rescued ingredients` gives e02 on Monday and none on Tuesday. |
| AC04 | `repair` + German gives none; Clear filters restores e01 and preserves query/day. Clear search preserves filters/day. |
| AC05 | Unapplied filter edits discarded on dismissal; Show results applies them. |
| AC06 | Card save does not open details; all views update; removing final saved item gives empty My Week. |
| AC07 | Saved e02 persists after reload when storage works; malformed/unknown IDs are safe; unavailable storage shows notice. |
| AC08 | e03 + cancelled e04: no clash; scheduled test variant: one; removing either clears it; adjacent e01/e02/e03: none. |
| AC09 | 12:30 demo: e02 now, e03/e05 next. e01 ended at 12:00; e02 ended at 13:00. Next capped at three when enough valid events exist. |
| AC10 | Before/after edition, no current event and no later start each have explicit states. Programme filters do not affect this view. |
| AC11 | Cancelled e04 visible in Programme/saved views, absent from Now & Next, registration unavailable and removal possible. |
| AC12 | e05 registration opens supplied link externally; required-but-missing link gives organiser fallback; e07 has no invented destination. |
| AC13 | Direct address and directions chooser are distinct; Google preserves recognised supplied URLs, Apple/browser search venue/address. |
| AC14 | Keyboard reaches chooser links; focus stays inside; Close/Escape/backdrop restores focus and discovery/saved state. |
| AC15 | Supported sharing works; cancellation/failure is recoverable; unsupported option omitted; delayed results are safe. |
| AC16 | 320px, 390px and 1440px: readable wrapping, no overflow/covered controls, keyboard-accessible labelled actions. |
| AC17 | If deployment is included: public HTTPS loads intended release without admin access; exact search wording and chooser present. |
| AC18 | If native Figma completion is included: required screens/components/desktop/documentation/flows match the agreed specification. |
| AC19 | Details opened from each primary destination return to correct origin/scroll with day/query/applied filters preserved. |

**Definition of Done:** agreed functionality works; applicable acceptance cases pass with evidence; no blocking defects remain in accepted scope; maintainable source and executable output agree; run instructions work; limitations, dependencies and AI use are disclosed. The team must be able to run the delivered version independently. Record any explicit scope exception; a prototype screenshot alone is insufficient.

Requirement references: R01 screens/journeys; R02 discovery rules; R03 data consistency; R04 saves; R05 clashes; R06 time; R07 exceptional states; R08 external links/fallbacks; R09 accessibility/mobile; R10 desktop; R11 component consistency; R12 demo boundaries; R13 chooser; R14 exact wording; R15 public review access.

## Delivery workflow and handover

### Working process

1. Assess existing assets, missing dependencies and remaining work. Agree included requirements/cases and Sprint Goals.
2. Keep a prioritised backlog with requirement IDs and acceptance conditions. Use branches and pull requests for implementation changes where practical.
3. Each sprint: deliver a runnable increment, source changes and relevant test results; demonstrate it, review feedback and record a short retrospective.
4. Updates identify completed work/evidence, next tasks and blockers. Report risks promptly with impact and a recovery proposal. Confirm channel, cadence, overlap hours and response target at kickoff.
5. Record defects with reproducible steps, expected/observed behaviour and environment. Separate defects against agreed scope from new features.
6. A change request identifies affected requirements, reason, impact, delivery implications and acceptance checks. Obtain team approval before implementing a scope change.
7. After correction, rerun failed cases and relevant regression checks. Keep dated source/acceptance records and list known limitations.

### Required final handover

- Maintainable editable source in this repository; understandable commits or dated source snapshots at each sprint delivery.
- Runnable/deployable artifact and structured event data matching source.
- Exact setup, run, build and test instructions; runtime/dependency versions and configuration.
- Test cases/results with evidence and untested-device limitations.
- Dependency/third-party asset inventory, licence information and any restrictions; source rights to be agreed separately.
- AI-use overview maintained through both sprints.
- Known issues and short walkthrough so a teammate can run the app and edit a sample event without developer assistance.
- For contracted deployment: environment/configuration and release/rollback instructions. Keep credentials out of code, screenshots, issues and public documents.
- Agreed defect-correction period and handover availability; confirm 8-9 November availability before work begins.

### Suggested implementation structure

This is a proposed future layout, not a claim that these files already exist. Equivalent simple structures are acceptable if agreed and documented.

```text
README.md
src/ or static application files
data/events.json
tests/
docs/ACCEPTANCE.md
docs/AI_USAGE.md
docs/HANDOVER.md
```

Choose a simple compatible stack. New third-party services, trackers or major dependencies require approval. There is no setup command yet because application code has not been delivered; the developer must add accurate executable instructions rather than placeholder commands presented as working.

## Generative AI transparency

**100% transparent disclosure is required.** Record every generative AI tool used for this engagement, its tasks and affected files/deliverables, including approved subcontracted contributions. Update the record at each sprint and final delivery; state explicitly if none was used.

Explain human review and validation of generated code/tests. Disclose reused dependencies/assets and their licences separately. Do not upload non-public material to an external AI tool without team authorisation. AI assistance does not reduce responsibility for correctness, testing or source handover.

This initial README was prepared with AI assistance from the project team's supplied specifications. It documents intended behaviour; it is not evidence of tested application code.

---

**Document changes:** preserve requirement and acceptance IDs, record the reason and obtain team agreement for behavioural changes. Do not silently edit requirements to match a failing implementation. This repository is a university-team project reference and does not claim to be an official NHWZ production service.
