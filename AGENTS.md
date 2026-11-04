# Project guide

The production homepage is `index.html`, using the selected Screening room design from `mockups/`; other design proposals also live there.
All proposals consume the root `apps-data.js`, which remains the single editable app directory.
Preserve the existing categories and old `name`, `url`, and `description` fields when extending the data.
Use stable app IDs for frequently-used preferences, and handle unavailable browser storage without breaking browsing.
Project screenshots live in `images/apps/`; learning notes marked as drafts and unverified stacks require owner review before publication.
Keep the homepage and mockups usable by opening their HTML files directly, without a build step.
The selected Screening room concept combines a category sidebar with a manually navigated hero and three persistent appearance choices, styled in `mockups/cinema.css`.
