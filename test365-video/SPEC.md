# SPEC — Test365, 35 s landscape

GOAL:    a JEE / NEET / GATE / IIT JAM aspirant sees their exam named, sees six real Test365 tools, and remembers "test365.in".
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps
TIME:    35 s x 30 = 1050 frames. No music bed (source track carries a voice); effects only.

LOOK:    ground = Test365's own pastel blob field from their walkthrough: base #FEF8F3, blobs peach #FEC8B4,
         lavender #D7CDFA, mint #B0E9DB, blue #BECFFC, each a radial gradient 900-1300 px, drifting 3-5 px/s.
         ink #0E162A; secondary ink #4A5568; accent brand blue #0040FF on one word per shot (the exam, "Test365", "today!").
         display: Inter 900, -2.5% tracking; hook line 96 px, slot word 124 px, feature title 76 px, end line 84 px.
         body: Inter 400 34 px. Labels: Inter 700 26 px, +32% tracking.
         product UI: real stills from the person's recording, in a browser window 980 x 682 (radius 18 px,
         shadow 0 40px 80px rgba(14,22,42,.18) + 0 6px 18px rgba(14,22,42,.08)).
OBJECTS: the Test365 lockup (cropped from the recording, never redrawn) on a white chip, radius 22 px;
         browser windows showing real test365.in URLs; the exam chips in Test365's own pastel colours.
MOTION:  enter expo.out / power4.out; camera power2.inOut 0.5-0.6 s; exits power3.in, 40-50% of the entrance;
         title words blur 6 px -> 0 in 0.13 s, 0.067 s apart; slot roll 0.18 s in, 0.12 s out; springs back.out(1.4) on the CTA only.
SHOTS:
  0.00-4.20  hook   "Are you preparing for" + slot rolls JEE Main / NEET / GATE CS / GATE Biotechnology / IIT JAM Biotechnology. Exit: blur swap.
  4.20-8.00  need   "Looking for a platform where you can…" grey->ink per word; 4 verbs land with drawn checks. Exit: vertical whip + whoosh.
  8.00-9.90  reveal "INTRODUCING" label, lockup slams 1.35 -> 1 with blur 10 -> 0; riser into impact.
  9.90-13.40 tour/home  lockup carries into the homepage nav; homepage window; push-in 1.15 on "Start your preparation with Test365."
  13.40-30.20 tour/features  window morphs to the right-hand stage; 6 features x 2.8 s; each: blur swap screen,
             caption lands, 0.5 s punch-in to the component, hold. Analytics zooms dashboard -> progress card.
  30.20-35.00 end   window whips out; lockup performed in, "VISIT", URL button springs, cursor clicks it,
             "Start preparing today!" lands, exam chips; hold 2.3 s.
BANNED:  dark void; glow/bloom/particles; glass cards; numbered "01 / 07" labels; three cards in a row;
         a title over a dimmed screenshot; the logo docked in a corner; invented UI or numbers; product UI tilted in 3D;
         everything fading and sliding up; titles that drift after they land.
         (Pastel blobs and pill chips are allowed only because they are Test365's own material.)
QA:      t=0.1 (thumbnail not empty), 3.5, 6.8, 8.8, 10.4, 12.0, 14.5, 17.5, 20.3, 22.5, 23.5, 25.8, 28.6, 31.5, 33.5, 34.8.
