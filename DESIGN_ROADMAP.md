# UNB design roadmap

Updated 2026-11-23. All new designs are developed on a new branch and committed locally using the user's configured Git identity. Only the user pushes to the repository. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Current revision: station arrivals and motion trial

The user requested removal of the competing hero background tracks, stronger About and Team station headings, and a restrained transition experiment. They confirmed that the departure board and ticket cards should stay in the next iteration.

- Remove the old hero rail layer and its unused SVG; retain the continuous central railway.
- Give About and Team platform-style heading panels with station labels and small connecting lines on desktop.
- Reveal heading content once from scale 0.97 and opacity 0. Keep the panel and page layout steady, with no looping entrances.
- Trial one 24px bend near About and a maximum 1.12 train close-up. The text and controls never zoom, and the train remains within the 144px lane. Scroll remains native and reversible.
- Disable the bend/zoom on smaller screens and when reduced motion is requested. Park the train and immediately reveal headings for reduced motion.
- Keep the trial easy to remove: `RAILWAY_TRIAL` in `src/utils/journeyMotion.ts` controls the experiment. Set `enabled` to `false` to disable the bend, zoom, and heading entrance effects without undoing the cleanup or platform design.

Implementation order: cleanup, station heading design, then one bounded motion trial. Status: implemented and verified on `design/station-arrivals`; local commit only, no push.

Validation: the production build passes (42 modules). Browser checks pass for the removed hero layer, heading entrances, bounded bend/zoom, central lane clearance, expanding About content, reduced-motion reset, six responsive widths, team pinning and profile return position, profile focus/history, and link data. Independent review found no material issues. Desktop arrival and mobile heading captures were inspected. The smallest mobile heading was compacted after a regression test caught insufficient room for pinning. Safari and physical touch devices were not tested.

## Previous revision: central railway

Approved direction: make the train journey the main visual feature while preserving the professional IT identity and giving it more whitespace.

- Reserve a 144px central lane on desktop, with balanced content columns on either side. The track and larger train stay inside that lane.
- Alternate the composition: hero introduction left/network right, About narrative left/heading right, Team index left/cards right, Contact form left/details right.
- Refine the original vector train with a cab, windshield, carriage coupling, roof details, bogies, and lights. Keep the existing green and neutral palette.
- Highlight the active station and corresponding nameplate as visitors navigate the sections. Motion follows scrolling and stops when the visitor stops; do not introduce timed scroll locks or autoplay.
- Keep the narrow edge railway on viewports 1100px and below. Preserve reduced-motion parking and the existing team-scroll accessibility fallbacks.
- Keep headings, text, cards, form fields, and footer content out of the central railway lane.

### Implementation plan

1. Add and run a browser regression for central alignment, clear lane space, alternating columns, larger train, active stations, and mobile fallback.
2. Implement the train illustration and responsive layout; connect station highlights to the existing active-section state.
3. Verify build, data policy, journey motion, profile interactions, team scrolling, and representative desktop/mobile screenshots.
4. Review the complete change and commit locally on `design/central-railway`. Do not push.

Status: implemented and verified on 2026-11-23; local design branch `design/central-railway`.

## Planned next: departure-board project listing

Use a station departure-board treatment to make project work easy to scan. Possible fields are project title, member, technical discipline/stack, and a real destination such as a demo or repository. Grouping or filtering can follow the actual project data.

Before implementation, confirm which existing project entries are real and ready to share. Do not invent delivery dates, completion statuses, metrics, clients, or working links to fill the board. Keep text readable and keyboard navigation straightforward; a decorative split-flap animation is optional and must respect reduced motion.

Status: recorded for the next design iteration; explicitly deferred while the railway and station transitions are refined.

## Planned next: ticket-style project cards

Explore project cards inspired by transit tickets: a restrained perforation/cutout detail, clear project title, short summary, member attribution, and stack labels. Show View project, Repository, or Live demo actions only when their real destinations exist.

These can complement the departure board as a detailed view of selected projects. Keep the familiar project action labels and accessible focus states. The ticket treatment is visual; it should not imply a purchase or require visitors to understand transit terminology.

Status: recorded for the next design iteration; explicitly deferred while the railway and station transitions are refined.

## Evidence and remaining work

The production build passes (40 modules). Browser regressions pass for central lane clearance, alternating content, the larger train, active stations, About expansion, desktop/mobile breakpoints, train motion and reduced-motion parking, team scrolling, profile focus/history, and website link handling. Desktop/mobile captures were inspected; an independent source/browser review found no material issues. Browser checks used headless Edge; Safari and physical touch devices were not tested.

The new train is 56px wide on desktop and scales down in the mobile gutter. The rail remains decorative and cannot block controls. Local review screenshots and verification scripts remain excluded from commits according to the user's `.gitignore`.

Real project content and destination URLs are required before building the two planned project presentations. They remain roadmap items rather than shipped features in this revision.
