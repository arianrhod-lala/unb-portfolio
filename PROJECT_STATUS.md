# Project status for assessment

Updated: 2026-11-25 (Asia/Manila).

## Current task

Prepare Markdown references and establish the current project state before the user assigns a non-coding assessment of the digital interface. No scores or new design changes have been requested in this preparation step.

Read this file alongside [ASSESSMENT_CRITERIA.md](ASSESSMENT_CRITERIA.md). The older [WORK_STATUS.md](WORK_STATUS.md) records the approved design baseline from November 23; [DESIGN_ROADMAP.md](DESIGN_ROADMAP.md) preserves design history and deferred ideas.

## Project and approved baseline

UNB (United Nation Boys) is a five-member TUP-Manila IT student collective. Its portfolio connects individual interests through the shared experience of commuting via the United Nations LRT station.

Source inspection confirms Home, About, Team, and Contact sections, member profile dialogs, and five configured personal website destinations. The hero reads “Different routes. Shared direction.” About explains the station's relationship to the group's name and shared identity.

The existing handoff records approval of the transit identity: a continuous railway, station headings and announcements, scroll-driven team browsing, and member-pass profiles. `src/utils/journeyMotion.ts` currently defines the shared 1.35 train zoom peak and three station bends. Visual quality and runtime behavior have not been reassessed during this preparation.

## Actual repository snapshot

- Branch inspected: `design/uniform-train-zoom`.
- HEAD inspected: `0b57bcd` — Use consistent 35 percent zoom at every station bend.
- Pre-existing modified tracked files: `DESIGN_ROADMAP.md`, `README.md`, and `src/data/team.ts`.
- Pre-existing untracked file: `WORK_STATUS.md`.
- The member-data diff changes Ian's biography from placeholder text to `dostngaw`. It is preserved as found.

This snapshot was taken before adding these assessment references. The previous handoff says it was committed, but the actual Git status shows otherwise; use the inspected Git state for repository status. Existing edits are outside this documentation task and must not be bundled into its commit.

## Content and submission evidence

| Area | Current evidence | Limit or pending review |
| --- | --- | --- |
| Collective narrative | Home and About connect IT interests, Manila, and shared commuting | Assess how clearly visitors perceive that story in the rendered interface |
| Members | Five entries and personal website URLs in `src/data/team.ts` | Three biographies contain lorem ipsum; Ian's current biography needs content review; external destinations were not opened |
| Work showcase | Project titles/descriptions inside member profiles | Authenticity and destinations need confirmation; the source retains a replacement-content TODO |
| Social destinations | Shared generic Facebook, Instagram, and GitHub homepages | Actual member/group accounts are not established by these links |
| Contact | `src/pages/Contact.tsx` opens a mailto link and explains the email-app handoff | This is not server-delivered email; actual email-app behavior was not checked |
| Public project presentation | Departure board and public ticket cards appear in the roadmap | Deferred ideas, not completed features or explicit rubric requirements |
| Interface link | Local application source is available | Final deployed/submission URL was not established in this preparation |
| Written analysis | Existing technical/design handoffs are available | A final 1–2 page course write-up was not identified among inspected materials |
| Photo documentation | Local `docs/screenshots/` contains earlier captures | Captures were not visually inspected now; a final captioned submission PDF was not identified |
| Group presentation | Five members are represented in data | Assigned roles, contribution evidence, slides, and rehearsal readiness were not established |

“Not identified” describes the inspected repository materials; it does not mean the group has not prepared these elsewhere.

## Verification and assessment boundaries

This preparation checked repository instructions, Git state, relevant source files, existing handoffs, and text from both pages of the supplied assessment PDF. No application source was changed. No build, browser session, screenshot inspection, or external-link test was performed.

The November 23 handoff reports successful build and desktop/mobile browser checks. Those are historical claims, not fresh verification of the current working tree. Safari, physical touch devices, and real email delivery remain outside that historical verification.

The later assessment should use current desktop/mobile views and distinguish observed interface evidence, source-only findings, historical checks, and missing submission evidence. It should cover all four criteria in the PDF and avoid treating absent write-up or presentation materials as proven failures. Preserve the approved design unless the user requests changes.

## Resume instructions

Read this file, the rubric reference, `AGENTS.md`, and `CONTRIBUTING.md`; check current Git status again. Await the user's specific assessment task before assigning scores or implementing recommendations. Only the user may push commits.
