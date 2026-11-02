# Handover

Started in Sprint 1; completed at final handover (PRD section 12). Setup, run, build, test and data-editing
instructions are in the [README](../README.md).

## Runtime and tooling

- Node.js 20.19+ (developed on 26.13), npm 11.20. Install with `npm ci` to use the exact locked versions.
- No environment variables, credentials or external services. The app is a static site; `npm run build` writes it to `dist/`.

## Dependencies and licences

Runtime (shipped to the browser):

| Package | Version | Licence | Use |
| --- | --- | --- | --- |
| react, react-dom | 19.3 | MIT | UI framework |
| react-router | 8.5 | MIT | Pages and URLs |
| tailwindcss, @tailwindcss/vite | 4.3 | MIT | Styling |
| tw-animate-css | 1.4 | MIT | Panel animation |
| @base-ui/react | 1.9 | MIT | Accessible dialog (filter panel) and button primitives |
| class-variance-authority | 0.7 | Apache-2.0 | Button variants |
| cn | 0.5 | MIT | Class-name merging (shadcn/ui) |
| lucide-react | 1.66 | ISC | Icon in the shadcn/ui sheet component |
| @fontsource-variable/inter | 5.3 | OFL-1.1 (font) | Inter typeface, self-hosted |

Development only: vite 8.3, vitest 5.0, jsdom 30.1, @testing-library/react 16.3, @testing-library/jest-dom 7.0,
@testing-library/user-event 14.6, typescript 7.0 (Apache-2.0), oxlint 1.89, shadcn 4.23 (CLI), @vitejs/plugin-react 6.1,
@types/* — all MIT unless stated.

Assets: NHWZ mark (`public/nhwz-mark.svg`) supplied by the team; navigation icons (`src/assets/nav-*.svg`)
exported from the team's Figma file.

`npm audit` (2 Nov 2026): 6 low/moderate advisories, all inside the `shadcn` command-line tool (a development
dependency, not shipped to visitors).

## Release and rollback

To be completed at final handover. Outline: build with `npm run build`, upload `dist/` to the chosen static host
with an `index.html` fallback for unknown paths; roll back by re-uploading the previous `dist/` (or redeploying
the previous commit). Hosting is not part of the agreed package.

## Known limitations (Sprint 1)

- Save/remove and My Week are Sprint 2; the My Week page shows a notice.
- Desktop layout deliberately differs from the Figma desktop references (D01–D02) for a cleaner large-screen
  design; mobile follows Figma. See [progress.md](progress.md).
- Event data is the 8-event acceptance dataset; the full programme awaits the team's decision
  ([event-data-review.md](event-data-review.md)).
- Manual, keyboard, contrast and real-device testing are still open ([ACCEPTANCE.md](ACCEPTANCE.md)).
