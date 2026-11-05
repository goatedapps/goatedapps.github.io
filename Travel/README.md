# JB + KL itinerary previews

Open `2026JB-KL.html` directly to use the Brickbound driver’s cab.
The page is linked from the homepage's Travel category, and `index.html` remains the original test file.
The three earlier concepts remain available at `?concept=compare`.

## Driver’s cab

`driver-cab.js` and `driver-cab.css` provide the current travel homepage.
Push the lever upward, click it, or use Enter/Space to drive to the next day.
Switch to Reverse to revisit previous days; the Up and Down arrow keys on the lever also select forward and reverse travel.
The seven date buttons on the console provide direct express travel to any station and show its main highlight.
30 November–2 December share one Legoland station with a single combined itinerary card.
Each arrival automatically opens a simple, scrollable activity table with the original times, notes, booking status and price options.
Use the itinerary button to reopen the current day’s card without travelling.
Reduced-motion mode arrives without the ride animation; the controls and itinerary also work without GSAP.

Six panoramic scenes were generated with the built-in image-generation tool and saved as WebP files in `images/`.
`images/generation-prompts.json` records every final prompt and saved filename.
The imagined toy-brick scenes illustrate the day’s activity rather than reproduce the real venues.
30 November–2 December reuse the Legoland base scene; detailed daily activities have not been added.
`verify-driver.cjs` checks lever dragging, touch, keyboard control, all seven stations, reverse travel, arrival dialogs, scenery loading and responsive layouts.

### Food map

The cab header's Food map button opens KL Food Compass, a generated toy-brick illustration of five KL areas.
The built-in image-generation tool created `images/kl-food-compass.webp`; its complete prompt is recorded in `images/food-compass-generation.json`.
Clickable place labels sit over the artwork, with food options and photos in the side panel.
The map deliberately omits helper blurbs, descriptive captions and photo-count labels.
Berjaya Times Square is labelled Home, and all fourteen requested food options are listed in their areas.
Selecting an area reveals its restaurants; selecting a restaurant reveals its supplied photos or a placeholder for future photos.
The photo viewer shows original images and provides large arrows beside the image, arrow keys and horizontal touch swipes.
Navigation wraps within the selected eatery's gallery.
Music continues while browsing the map, and its header has a mute button.

`food-map-data.js` is the single editable food directory, including the exact original image filenames.
All thirty-two owner-supplied images are preserved in `images/itinerary-images/`; smaller WebP copies in `images/food-thumbs/` keep the map quick to browse.
Photos currently cover Tangkak Beef Noodle, Tea Garden, Palates & Bagels, Sukiya, ParaThai, LeTen Dim Sum, Dolly Dim Sum, Fei Fei Crab and Tang Fei Dessert.
When adding photos later, extend the restaurant's `images` array and create matching lowercase WebP previews.
Do not substitute generated food photos for missing owner photos.
`verify-food-map.cjs` checks express travel, the grouped Legoland card, all food areas and every supplied full-resolution photo.

Area placement uses broad relative positions, with [Berjaya Times Square](https://berjayatimessquarekl.com/contact-us/), [LalaPort BBCC](https://mitsui-shopping-park.com.my/LaLaportBBCC/About/aboutMall?dian_id=1&id=10&name=FAQ), and [Nu Sentral](https://www.nusentral.com/contact/) as location references.
The illustration does not encode travel times or measured distances.

### Journey sound and motion

The ride has separate departure, cruising and approach phases, with moving sleepers, passing scenery, acceleration and braking.
`driver-audio.js` uses the owner's original `audio/background-waltz.mp3`, `audio/train-running.mp3`, and `audio/train-arrive-station.mp3` files without modifying them.
The waltz loops after the first deliberate interaction and continues through itinerary dialogs.
The running effect loops during motion, then fades into the arrival cue as the train brakes.
Background music ducks under train effects and recovers after the arrival cue ends.
Sound settings in the header provide master mute and separate music/effects volumes, saved locally when storage is available.
The itinerary card also has a mute button.
Audio and ride animations pause when the page is hidden; returning resumes the current journey rather than replaying old cues.
`verify-driver-audio.cjs` checks actual browser MP3 decoding and playback state, sound timing, saved controls and missing-asset fallback.
These browser checks do not replace listening on physical phone speakers or headphones.

## Design directions

- **Brickbound:** sky `#e8f3f3`, deep teal `#254c50`, brick yellow `#f7c638`, coral `#ef6348`, and leaf `#8abc63`.
  Rounded Trebuchet typography, an original isometric toy city, studded day buttons, and a mission panel.
- **Platform 26:** indigo `#303464`, parchment `#faf2df`, peach `#f4b1a2`, gold `#ffcb66`, and lavender `#55578c`.
  Courier typography, a pixel skyline, a rail platform, and numbered day levels.
- **Build the Journey:** pale green `#e8eddf`, forest `#285346`, paper `#f8f8eb`, yellow `#f7c638`, and red `#ef6348`.
  Trebuchet typography, an exploded train illustration, instruction-page numbering, and a restrained booklet layout.

## Content and interaction

All three original concepts use the same nine-day itinerary from `trip-data.js`.
30 November–2 December remain unplanned, and only the Breakout Escape Room is labelled booked.
The checklist saves to browser storage when available and works for the current visit when storage is blocked.
Prices and the unspecified dollar currency remain as supplied rather than researched quotes.

GSAP 3.13.0 is stored locally in `vendor/gsap.min.js`, with its distribution license header retained.
The source distribution is <https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js>.
Animations use GSAP timelines and respect the operating system's reduced-motion setting.
The itinerary remains usable if the animation library is unavailable.

`verify.cjs` uses Playwright with Microsoft Edge to check day navigation, itinerary content, checklist persistence, reduced motion, blocked storage, and responsive layout.
It also refreshes the screenshots in `previews/`.

## 25 November railway prototype

The archived railway prototype is available at `?concept=brickbound&preview=railway`, with the nine-station route and only its first station active.
Click the golden station to replay the train arrival, then click a carriage, use the arrows, or swipe to explore six toy-brick scenes.
Each scene has a ticket with the activity details and an optional memory stamp saved on this browser.
`railway-day.js` and `railway-day.css` contain this prototype; `verify-railway.cjs` checks its interactions and responsive layout.
The original Brickbound concept remains available with `?concept=brickbound&thumbnail=1`.
