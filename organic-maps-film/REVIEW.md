# REVIEW — Organic Maps, 37 s Apple-style 3D concept film (unofficial)

## What was built
Storyline A ("No signal, no problem"): hook type → a low flight down a 3D valley styled like the app's outdoor map (meadow and forest greens, brown contour lines) while the app's navy dashed hiking route draws ahead and red pins pop → the phone descends and lands between "Organic | Maps" → four real screens with captions (trail planner, Astronomical Clock place page with a push-in on Wikipedia and opening hours, 3D night navigation entered through a 360° spin, city map detail with a push-in) → pull-back over the completed route, "No ads. No tracking. 100% free." → mark, name, tagline, organicmaps.app and credits.

## Sources (all reachable from this session, nothing invented)
- Screens and mark: github.com/organicmaps/organicmaps (store listing screenshots at 1440×3040, `logo.svg`), Apache-2.0. Cropped 19 px each side to the phone's aspect.
- Every claim is from the app's own listing: works 100% offline incl. search and navigation; hiking and cycling routes worldwide; opening hours, Wikipedia, wheelchair accessibility; voice-guided turn-by-turn; building labels, benches, hiking paths; refreshed twice a month; no data collected, ad-free, 100% free; built on OpenStreetMap.
- Map data in the screenshots © OpenStreetMap contributors (credited on the end card).
- Music: "Familiar Roads" by Tanner Helland, CC BY 4.0 (credited on the end card), from 145.535 s so beats land on "No problem." (0.05 s), the phone landing (exact), the last pin (0.03 s) and the logo (0.01 s).
- The 3D landscape is procedural (seeded noise), not a real place, and is never labelled as one.

## Measured
- `check`: 0 errors. Warnings kept: `stage.html` is one large file (the whole 3D choreography); the 2-line credits are shorter on screen than a full read needs (they are credits, held 3 s).
- Fixed after review: pins rendered pastel (tone mapping bypassed), the flight route invisible then oversized (now draws 28 units ahead, finer dashes), sub-lines low-contrast over the hills (darker, weight 500, soft sky-coloured halo), mix too quiet at −18.8 LUFS (volumes ×1.33).

## Not checked / limits
- Sound measured, not heard. Music chosen by tempo, regularity and brightness, not by ear.
- The screens are Android screenshots inside an iPhone-shaped body (recoloured forest green, maker's logo hidden).
- Unofficial: not made or endorsed by the Organic Maps project; don't publish it as theirs.
