# HANGOUT 60 s launch film — changes from the spec, and what was checked

Deliverables: `renders/hangout_launch_60s_1080p.mp4`, `renders/hangout_launch_contact_sheet.jpg` (2, 6, 10, 14, 18, 21, 26, 31, 36, 39, 42, 45, 50, 53, 57 s, decoded from the final MP4).

## Changes from the spec, and why
1. **Stock images.** The seven PNGs arrived unnamed; I named them by content: kart, bowling (ball and pins), VR headset, trampoline, claw machine, gaming-café building (used as `06_gamepad`: it is the gaming-café image you sent, with a gamepad sign) and combination lock. All seven are true transparent PNGs; none was edited.
2. **Downscaled working copies** in `assets/derived/` (resized only, no other change): 4K backgrounds and layers to 1920×1080, large light/burst/logo PNGs to 1024 px, stock PNGs to 1100 px max. At 1080p output this is invisible and keeps the render fast. Originals are untouched.
3. **Particle H.** The H in `particle_convergence_H.json` is about 1.9× larger than the H inside `logo_symbol_glow`. I scaled the end positions by 0.53 around the logo centre so the particles collapse onto the logo's H; start positions are used at 1:1 around the same centre.
4. **Two headlines split over two lines** ("CHALLENGE / COMPLETE", "UNLOCK / MORE.") so they stay at least 40 px from the frame edge at a readable size; "COMPLETE" and "MORE." are cyan.
5. **Carousel timing.** S07 holds 1.4 s after the 0.45 s entry; steps at 24.7, 26.5, 28.3, 30.1 and 31.9 s (0.4 s moves, 1.4 s holds); S12 Confirmed holds 1.5 s. The single ring pulses from its check mark at 32.35 s; `09_challenge_complete` plays at 32.3 s. No other effect on booking or payment screens.
6. **Portal whoosh** (19.0–21.0): two quiet whooshes at 19.0 and 20.0 s (55% and 45% of the normal whoosh level).
7. **Level ring** is drawn as an SVG stroke so it can fill 47% → 100% exactly; the library's `level_ring.svg` was not needed.
8. **Not used:** `lens_flare_anamorphic.png` (listed among the light assets; no beat called for it). Easy to add if you want it.
9. **Headline font** follows your spec (Urbanist 800, labels Rajdhani 700); the library's text-style CSS suggests Rajdhani for headlines.
10. **Brand fade** runs 59.3 → 60.0 s; the music fades over the last 0.4 s.
11. **Not supplied:** the `HANGOUT_Backgrounds_4K_9x16` zip. Not needed for this 16:9 film.

## Audio
- Music bed full length from 0 s. Effects placed at the spec's times; each gain set from its measured loudness so it sits about 8 dB under the bed (clicks set by peak).
- Master: two-pass loudnorm on the rendered mix. **Measured: −14.0 LUFS integrated, peak −5.4 dBFS** (limit −1 dBTP). Measured, not listened to.

## What was checked (actually run)
- `hyperframes lint`: **0 errors**, 10 warnings, all `duplicate_media_discovery_risk` (the same phone-frame SVG, ring, orb and coin images used several times on purpose).
- `hyperframes check`: **ok**, 0 errors and 0 warnings in runtime, layout, motion, contrast, craft and audio.
- Snapshots read at about 40 moments, including every transition and the 15 contact-sheet times; fixes made after review: rings and the logo shockwave showing before their cue, coins flying over "MORE.", two overlapping tweens.
- Final file (ffprobe): H.264 1920×1080, 30 fps, **1800 video frames (60.0 s)**, AAC 48 kHz; container reads 60.01 s because of the AAC encoder's standard priming delay. **Size 19.9 MB** (CRF 20).
- Numbers on screen come only from the real screens (₹249, ₹747, 270 Coins, ₹720, 3,330 XP, Level 9 → 10, 250 Coins); the XP counter runs 3,230 → 3,330 (+60 +40) as specified. No real venue names or logos were added beyond what the app screens themselves show; the word "wallet" is not used.

## Not checked
- Nobody has listened to the mix.
- The "never overlap a phone screen" rule was verified on the sampled frames, not on every frame.
