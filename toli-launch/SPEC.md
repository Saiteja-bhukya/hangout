# SCENE — 60 s launch ad · SPEC

GOAL:    The viewer recognises the group-chat planning mess, then sees SCENE plan, book and reward a whole outing in one place, and remembers the mark.
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps, exactly 60.0 s (1800 frames), MP4 crf ~20, < 30 MB.
TIME:    120 BPM, A minor, Am–F–C–G one bar each = 2.0 s/bar, 0.5 s/beat = 15 frames/beat.

LOOK
- Ground: #EEF3FA with three large soft blobs (#C9DBFF, #BFF1FA, #D9CCFF; radial gradients ~1100–1400 px), drifting 40–120 px over the film. Pain section: blobs crossfade to cool greys (#DADFE6 / #E3E6EB / #D5D9E0) over 0.4 s at 5.0 s; colour floods back over 0.4 s power2.inOut at 12.5 s.
- Glass: rgba(255,255,255,.55), backdrop blur 22 px saturate 160%, 1.5 px inner white border, shadow 0 24 60 rgba(30,60,120,.16). Radius 28 px cards, pills full.
- Ink: navy #0B1A2E, muted #5A6B80. Accent gradient #2F6BFF → #12B3DA on one word or one pill per shot. Lilac #B7A9FF sparingly; gold #E9CB7E only for level-up / rewards; mint #6FE3B5 for success ticks. No orange anywhere; red avoided.
- Type: Urbanist 800 uppercase headlines, tracking 0.05 em, 96–150 px (9–14% of frame height) for hero lines, 56–72 px for secondary; Inter 400–600 UI/body (chat bubbles ≥ 22 px at final scale); Rajdhani 700 numbers & labels, tracking 0.12–0.18 em.
- Devices: dark phones (#0D1624 bezel, 44 px screen radius) against the light world. Screens are dark UI (#080D16, cards #142235 @ 80%, cyan #36D6F2 / blue #397BFF).
- 3D: premium-toy objects (navy #14223A / white #F4F8FC clearcoat bodies, cyan #36D6F2 emissive strips), RoomEnvironment reflections, ACES, transparent canvases.
- Finish: animated grain 3% (stepped per frame from a fixed tile), soft vignette 10% navy at the corners.
- Safe area: all text ≥ 60 px from frame edges (inside 1800 x 960); headlines never overlap a phone.

MOTION
- Arrivals expo.out / power4.out 0.35–0.55 s; exits power3.in, 40–50% shorter than entrances; camera moves power2.inOut 0.4–0.6 s; springs as back.out(1.4) on position/scale only, never opacity.
- 3D pop-in: scale 0.6 → 1.05 → 1 over 0.32 s (0.18 s back.out to 1.05, 0.14 s settle); turntable 20°/s.
- Headlines word by word: blur 8 px → 0 and opacity 0 → 1 in 0.16 s, 0.12 s apart, no translate; landed titles hold dead still.
- Holds: every screen meant to be read ≥ 1.2 s fully settled; chat lines held long enough for the gist (they arrive fast on purpose).
- Transitions 0.3–0.6 s, each with a cause: object pops (cuts), colour flood (relief), phone rise (range → app), push-ins/pans on one phone (answers), carry-across (rewards), particles converging (end).

SHOTS (absolute seconds)
- 0.00–5.00 HOOK. Seven 3D objects pop into centre, each replaced by the next; slot lengths 0.40 → 0.25 s (0.40, 0.375, 0.35, 0.325, 0.30, 0.275, 0.25 = 2.275 s from 0.12 s). Label under each in Rajdhani 700 (GO-KARTING, BOWLING, VR ARENAS, TRAMPOLINE PARKS, ARCADES, GAMING CAFÉS, ESCAPE ROOMS). At 2.40 the seven fly out to a ring around the frame centre (0.45 s expo.out) and keep turning; "PLANNING / TO / CHILL?" lands word by word at 2.55 / 2.85 / 3.20, CHILL? in the accent gradient; hold to 4.85; everything snaps off at 5.00 (riser cut).
- 5.00–12.50 PAIN. Grey world. Phone (scale 1.55, chat pushed in on the newest line) shows "Sunday plan" (Rohan, Meera, You). Ten messages 5.45 → 8.45 (0.33 s apart), notification badge 1 → 99+, four grey glass chips float in with buzzes (6.6, 7.1, 7.6, 8.1). "2 hours later" divider 8.85, "let's just stay home" 9.30, "Seen by Meera" 9.75. Phone slides left 10.15; "SOUND FAMILIAR?" right side 10.25. Glitch 11.25–11.35. White silence 11.35–12.50 with "THERE'S AN EASIER WAY." (navy, small caps, centred) from 11.55.
- 12.50–15.00 RELIEF. Colour floods back (blobs + a radial cyan-blue flash 0.35 s). Icon bursts in at 12.55 (scale 0.4 → 1.08 → 1, light ring), wordmark wipes in 13.15, "PLAN IT. BOOK IT. PLAY IT." 13.75 / 14.05 / 14.35, PLAY IT. in gradient.
- 15.00–19.00 RANGE. "EVERY WAY TO PLAY." top; four rows of glass chips (36 activities, icon + label) scroll in alternating directions at 60–90 px/s; three 3D objects (box cricket, trampoline, controller) turn in front. 17.35 rows blur back, "ALL IN ONE APP." left, Home phone rises right (0.55 s expo.out), held 1.2 s+.
- 19.00–37.00 ANSWERS, five beats. Question = glass chat bubble left (sender avatar + name), phone right; key UI parts lift out (z +90 px, 1.05 scale, shadow) with glass tags on thin lines; "✓ SORTED" gradient pill stamps (scale 1.6 → 1, 0.22 s) after the answer is read.
  - 19.00–22.40 "So what's the plan this Sunday?" → Explore · 3/4 hero (rotY −18°) · tags What you feel like / When you're free / Who's coming.
  - 22.40–26.00 "Which one is even near us?" → Results + Map side by side (split screen, two phones) · tags "Holodeck VR · 6.2 km" / "₹249 pin".
  - 26.00–29.40 "How much per person?" → Venue (1.2 s, VR headset hero) then Packages, close-up pan down the phone · tag "₹747 for 3 · ₹249 each".
  - 29.40–32.80 "Is it even open Sunday evening?" → Date & time · top-down tilt (rotX 28°) · tags Sunday 22 / 6:00 pm / All 3 of us.
  - 32.80–37.00 "Who's booking?" → Summary (pop-outs, tag "One total for all 3") → Ticket (tag "Booked. Ticket's ready."). No celebration on booking/payment.
- 37.00–48.00 REWARDS. "AND EVERY OUTING PAYS YOU BACK." (37.0–39.3); XP screen: 3,230 → 3,330 count with "+60 XP NEW VENUE", "+40 XP CHECK-IN" chips, ring fills, 9 flips to 10, gold badge LEVEL 10 · THE REGULAR (39.3–42.8). "CHALLENGE COMPLETE." with mission stamp (42.8–45.0). "UNLOCK MORE." Rewards screen, VR +5 min perk selected, coins tumble (3D), reward burst, balance 275 → 25 (45.0–48.0).
- 48.00–54.00 PAYOFF. Same chat, bright and colourful. You share booking card (48.5), replies 49.6 / 50.4 / 51.2. "LESS PLANNING. MORE SCENES." right side from 50.0.
- 54.00–60.00 END. 140 particles converge into the S (54.0–55.2), icon resolves 55.0 (impact), wordmark 55.6, "MAKE EVERY OUTING AN EXPERIENCE." 56.3, light streak 57.6–58.3, fade to white 59.2–60.0.

SOUND (built in step 5): see brief §6. Clock = music, 120 BPM; drop at 12.5, logo hits at 12.5 and 55.

BANNED: dark void ground; confetti on booking/payment; the word "wallet"; orange; real venue names/brands; titles drifting after they land; every element fading + sliding up; logo docked in a corner; "fastest/cheapest/#1" claims or venue/user counts.

QA frames: 3, 9, 14, 24, 42, 51 (style frames); every section boundary (5, 12.5, 15, 19, 37, 48, 54) ± 0.2 s; chat readability at 7, 8.5, 9.5, 49, 51.5.
