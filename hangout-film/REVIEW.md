# REVIEW — Hangout, 40 s Apple-style 3D launch film

## What was built

Storyline A from `STORYLINES.md`, "Saturday, solved": black type sets up the problem, glossy teal VR, bowling and controller objects plus gold Coins dive out of the dark, a real iPhone 15 Pro Max model flies in back-first and flips to Hangout's welcome screen ("Meet | Hangout."), then walks through five verbs on real screens (Find it → Know the crowd → Book in one screen → Walk right in → Level up), Coins burst out of the missions screen and orbit the phone ("Make every outing count."), and the logo lands with "Plan. Book. Play. Earn Rewards." and the Elan & nVision 2027 alpha date.

## Sources (nothing invented)

- **Screens**: cropped from the 4K slides in *Progress Review 2* (welcome, explore, map, venue, booking, ticket QR, green tick, missions, home). They are the test build's real screens, so they show sample venues and say Bengaluru and "Sandbox".
- **Numbers and copy**: "68% missed a good venue they never heard of" (Concept Note survey), "40 WhatsApp messages" (Review 2, IA slide), "Typical for Sunday 8 pm", "slot held 8 minutes", "UPI", "works offline", "green tick", "XP and Coins", "Make every outing count", "Plan. Book. Play. Earn Rewards." (the app itself), alpha test dates (Review 2).
- **Logo**: keyed out of the welcome screen (only ~100 px in the source, so it is soft at the end card).
- **3D**: the iPhone GLB from the HyperFrames registry (`vfx-iphone-device`), recoloured graphite with the maker's logo hidden; all other objects are procedural three.js r147 (vendored in `lib/three`, MIT).
- **Fonts**: Space Grotesk (the deck's headline face, OFL, in `assets/fonts`) and Inter (bundled).

## Measured

- `hyperframes check`: 0 errors. One warning kept on purpose: `stage.html` is one large file because the whole 3D choreography lives in one `render(t)`.
- Fixed after review: background glow too flat and bright; objects milky and Coins olive (materials deepened); phone back orange (recoloured); captions crowded by push-ins (lens shift keeps the phone right of centre); the screen did not fade with the scene (own fade multiplier); the phone unwound a full turn after the ticket spin (rotation keys offset by 2π); four sub-lines too long to read (cut to 7–9 words).
- Render: `renders/hangout-40s.mp4`, 1920x1080, 30 fps, 40.000 s, 20.6 MB (8 min 53 s on software GL); decoded frames match the snapshots. Audio −15.8 LUFS, true peak −4.4 dBTP, no clipping.
- Snapshots read at 0.3, 3.5, 5.6, 7.3, 8.8, 10.2, 11.2–11.5, 12.25, 13.7, 15, 16, 17.8, 18.4, 21, 21.4, 23.45–25.6, 27, 28.4, 29.6–30.8, 32, 34.3, 34.85, 35.0–35.3, 37.5, 39.75 s.

## Not checked / known limits

- **Music**: "Familiar Roads" by Tanner Helland (CC BY 4.0, credit required where published; see `assets/music/CREDITS.md`), chosen by measurement (115 BPM, steady, bright arpeggios), not by ear. It starts 52.155 s in, so a beat lands exactly on the phone reveal; Coins burst and logo sit within 0.11 s of beats. Mix measured −16 LUFS, true peak −1.5 dBTP, no clipping (the delivered file was lifted 2.1 dB after render; the project volumes were raised to match).
- No lifestyle photography: stock-image hosts are blocked in this environment, so every image is a real app screen or a 3D object.
- Screens show "Bengaluru" and "Sandbox" badges, as the test build does.

## Weakest shot

The opening 7 s are type only. A real photo of Palace or Bounsee on a busy weekend (or empty weekday) under "It's Saturday." would land the problem harder.
