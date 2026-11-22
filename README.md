# UNB Portfolio (React + TypeScript + Vite)

    npm install
    npm run dev

- Edit members in `src/data/team.ts`. Profiles open at `/#/team/<id>` and support refresh and browser history.
- Add an optional `website: "https://your-real-domain.example"` field to a member to show their personal website button. Replace this example with the actual address; absent or invalid destinations produce no button.
- Put images in `public/images`. The hero is a photo-free interactive route; About and member profiles retain their images. Work Sans and Open Sans load from Google Fonts in `index.html`.
- Colours and fonts are CSS variables at the top of `src/styles.css`.

For a walkthrough of each member's website link and portrait, see [Editing members](docs/EDITING_MEMBERS.md). Team browsing follows vertical page scrolling, with vertically stacked cards for reduced motion and short screens.

## Review and design workspace

Start with [the review guide](docs/README.md). It links the codebase findings, visual map, design worksheet, asset inventory, and decision log for the next website review.

The approved transit revision is implemented. The review documents record verification, screenshots, and remaining content decisions.

## Verification

Run `npm.cmd run build` and `node scripts/verify-data.cjs` on Windows. The latter checks website URL handling and skill-route membership without new dependencies.

For browser checks, set `UNB_PLAYWRIGHT_MODULE` to an available Playwright module path and run `node scripts/verify-transit.cjs` while the development server runs at `http://127.0.0.1:5173`. The script uses installed Microsoft Edge in headless mode and writes review screenshots. Playwright is verification tooling, not a project dependency.
