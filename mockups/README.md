# App showcase mockups

Open `index.html` in this folder to compare the three concepts, or serve the repository root with a static web server and visit `/mockups/`.
The repository root `index.html` publishes the selected Screening room design.

- `gallery.html`: a light product gallery in navy, blue and white.
- `workspace.html`: a compact teal workspace with category navigation.
- `cinema.html`: a product stage with a category sidebar, previous/next arrows, and Mineral, Coral or Mulberry appearance choices.

All three read `../apps-data.js`, currently holding 14 apps across five categories.
The app names, links, categories and descriptions were reconciled with [GitHub `main` at commit `6015717`](https://github.com/goatedapps/goatedapps.github.io/blob/6015717763f9ded49e7fe7fc577a310b40515d83/apps-data.js) on 5 October 2026.
Guangzhou is deliberately kept in the local Archives category at the owner's request.
Expense Tracker was added directly to Utilities at the owner's request.
Add an app by copying an entry in that file and supplying a unique `id`, `name`, `url`, `description`, `screenshot`, `techStack` and `learning`.
Screenshot paths are relative to the repository root.
Keep IDs stable when renaming apps so saved preferences continue to work.
Missing optional details and screenshots display a fallback.

Frequently Used is personal to the visitor's browser and origin, using local storage rather than an account or server.
With a static server, preferences are shared across the three concepts.
Browsers may isolate storage by file when opening HTML directly.
If storage is unavailable, stars still work for the current visit.
Pinning adds a shortcut at the top while keeping the app in its original category.

Screenshots were captured from the public app pages on 5 October 2026.
The technology lists reflect visible site assets and, for Sudoku and Menu Planner, their local project documentation.
The P5 Chinese app's framework is unverified and labelled accordingly.
The learning paragraphs are suggested copy, not verified accounts of the author's experience.
Edit them and set `learningDraft: false` after review.

The concepts include responsive layouts, keyboard focus, native modal dialogs, reduced-motion support, search, category filters and persistent pins.
The `/` key focuses search; Escape closes project details.
In Screening room, Left and Right arrow keys cycle apps while focus is inside the hero.
The appearance selector saves its choice independently of Frequently Used preferences.
On smaller screens, category buttons replace the left sidebar.

## Validation

`verify.cjs` uses Playwright with Microsoft Edge against a static server at `http://127.0.0.1:4173` by default.
Set `PREVIEW_ORIGIN` to use another server.
Provide Playwright through the local Node environment or `NODE_PATH`, then run `node mockups/verify.cjs` from the repository root.
It checks filtering, search, pin persistence, shared preferences, corrupt or unavailable storage, project dialogs, mobile overflow, and screenshot loading, and writes previews into `mockups/previews/`.
`capture.cjs` refreshes the app screenshots and requires public internet access.
