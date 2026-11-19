# REVIEW — Test365, 35 s landscape

## What was built

Storyline A from `STORYLINES.md`: an exam slot hook, the student's four needs, the Test365 mark slamming in and flying into the homepage's own nav, the homepage window becoming a stage that swaps through six real features, and an end card where a cursor clicks the `test365.in` button.

Every product screen is a still from the person's own walkthrough recording (`2050ddcd-VIDEO-2026-11-19-23-11-46.mp4`), cropped and upscaled 2x (Lanczos). Every line of copy is Test365's own wording from that video. Chapter-wise progress (feature 05 in the original) was dropped to keep the film at 35 s.

Registry pieces this follows by design (hand-built to fit, not installed): `kinetic-type-swap` (hook slot), `grid-card-assemble` (need checklist, as a list), `logo-sting` (reveal), `browser-device-stage` + `ui-focus-zoom` (homepage push), `sticky-mock-swap` (feature stage), `cta-lockup` + `press-ripple` (end card, without the ripple ring).

## Measured

- `hyperframes check`: 0 errors, 0 warnings (lint, runtime, layout, motion, contrast, craft, audio). Remaining layout infos are the slot words crossing during their 0.12 s roll and the homepage camera extending past its clipped window, both intended.
- Render: `renders/test365-35s.mp4`, 1920x1080, 30 fps, 35.000 s (ffprobe), 9.0 MB; decoded frames match the snapshots. Audio −15.7 LUFS integrated, true peak −6.8 dBTP, no clipping; effect onsets land at 8.46 (logo), 28.78 (XP), 31.22 (CTA), 32.26 (click), 32.81 s (chips).
- Snapshots: beat sheet, every seam, the phone-width sheet, and the punch-ins at 11.0–30.05 s were read frame by frame.
- Fixed after review: homepage push-in cut the nav and then the headline (now anchored bottom-left at 1.6x); homepage→feature morph double-exposed for ~0.3 s (now a 0.2 s crossfade with blur); PYQ punch-in landed on empty card space (now on the 2021 badge and paper title); end chips held 1.8 s (now 2.3 s).

## Not checked / known limits

- **Sound was measured, not heard.** The original soundtrack carries a voice over music (curved pitch glides in the spectrogram), so it was not reused under a re-cut picture, and no music bed was available (no HeyGen sign-in, model downloads blocked). The film has five Pixabay effects only: riser into impact on the logo, whooshes on the morph and the two whips, pops on the XP chip, CTA and exam chips, and a click on the CTA.
- **Screens are soft** because the source recording is 1024x576; punch-ins are kept at 1.3–1.8x for that reason.
- **Baked cursors**: four stills carry the recording's own cursor; no second cursor was added on them.
- test365.in could not be captured from this environment (network policy), so higher-resolution screens were not available.

## Weakest shot

Leaderboards (27.4–30.2 s): the recording never shows a leaderboard, only the Friends / Feedback / 16 XP bar, so the punch-in is on that bar under Test365's own "Compete with fellow students" caption. A real leaderboard screen would fix it.

## With more time

A music bed (the person's own track without the voice, or a catalog track after `hyperframes auth login`), a fresh 1080p+ screen recording of each feature, and a real leaderboard screen.
