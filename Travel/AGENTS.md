# Travel pages

`2026JB-KL.html` opens the Brickbound driver’s cab, linked from the homepage's Travel category; the earlier design comparison is available at `?concept=compare`.
Keep the original test `index.html` and preserve the stable `2026-JBKL-itinerary` directory entry in the root `apps-data.js`.
`trip-data.js` holds the shared itinerary; preserve empty days and distinguish booked activities from suggestions.
The local GSAP distribution in `vendor/` lets previews animate when opened directly and offline.
`driver-cab.js` and `driver-cab.css` provide seven labelled stations, direct express travel, lever travel, generated scenery, and scrollable itinerary dialogs.
30 November–2 December share one Legoland station; their detailed activities remain unscheduled.
Generated WebP scenes and their original prompts live in `images/`; blank itinerary days must remain unscheduled even when their scenery shows the Legoland base.
The earlier 25 November railway prototype remains at `?concept=brickbound&preview=railway`; `thumbnail` retains the first mockup.
`verify-driver.cjs` checks the driver’s cab; `verify-railway.cjs` checks the archived railway prototype.
`driver-audio.js` owns the three tracks in `audio/`, first-gesture playback, saved mute/category volumes and background-tab cleanup.
Departure, cruise and approach cues follow the GSAP journey phases; `verify-driver-audio.cjs` checks native playback and interruptions.
`food-map-data.js` holds the five food areas, fourteen restaurants, and exact source-image filenames, including filename case.
`food-map.js` and `food-map.css` provide the schematic map and full-size photo viewer; originals stay in `images/itinerary-images/`, with lightweight previews in `images/food-thumbs/`.
KL Food Compass uses `images/kl-food-compass.webp` as its generated artwork; keep place labels interactive and omit decorative helper text.
Photo arrows sit beside the full-size image and cycle within the selected eatery; preserve source filenames and case when adding photos.
`verify-food-map.cjs` checks direct station selection, all food areas, and every supplied photo.
