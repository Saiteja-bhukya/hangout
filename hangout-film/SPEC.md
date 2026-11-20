# SPEC — Hangout, 40 s, Apple-style 3D launch film

GOAL:    a student or young professional in Hyderabad sees their weekend problem, then sees Hangout solve it on real screens, and remembers "Plan. Book. Play. Earn Rewards."
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps
TIME:    40 s x 30 = 1200 frames. No music bed (none available in this environment); five effects.

LOOK:    ground #04070A (near-black), one radial teal pool behind the subject (#02D8CC at ≤17% over the ground), never a linear gradient.
         ink #FFFFFF; secondary ink #8FA1A8; accent Hangout teal #02D8CC on one word per line; Coins gold #FF8F0A.
         display: Space Grotesk 700 (the deck's headline face), -3% tracking; hook 132 px, stat 300 px, feature titles 120 px, end line 64 px.
         body: Inter 400, 38 px. Small facts: Inter 500, 30 px, +2% tracking.
         medium: a studio product shot. Real iPhone 15 Pro Max model recoloured graphite, screen = real app screens (unlit, not tone-mapped).
         objects: glossy teal clearcoat (VR headset, bowling ball, game controller) and gold Coins, after the app's own 3D icon set.
         light: warm key upper-left, teal rim from behind right, cool fill low-left; ACES tone mapping, exposure 1.1.
OBJECTS: the phone (with its camera plateau and titanium edge), a VR headset (two dark lenses, strap), a bowling ball (three finger holes),
         a game controller (d-pad, four buttons, grips), a Hangout Coin (rimmed gold disc).
MOTION:  type: per-word blur 6px -> 0 in 0.13 s, 0.067 s apart; lines out with an 8px blur in 0.18 s.
         3D: arrivals cubic(0.16,1,0.3,1); camera and big moves cubic(0.65,0,0.35,1); the flip cubic(0.76,0,0.18,1); exits ease-in.
         The phone never stops: yaw drifts 0.08 rad per beat; every push-in lands on a real label.
SHOTS:
  0.0-7.0   open    "It's Saturday." / "40 messages later, still no plan." / 68% count-up + "missed a good venue because they never heard of it."
  7.0-11.4  dive    teal VR, ball, controller and Coins drift out of the dark toward camera; they part; the phone flies in back-first and flips to the welcome screen.
  11.4-13.4 hero    phone centre, "Meet" | "Hangout." either side of it. Riser into impact on the landing.
  13.4-30.0 tour    lens shift puts the phone right of centre; captions left:
                    Find it (Explore list -> map) · Know the crowd (venue page, push-in on "Typical for Sunday 8 pm") ·
                    Book in one screen (push-in on "Hold slot & pay") · Walk right in (phone spins 360°, QR -> green tick) ·
                    Level up (missions; Coins burst out of the screen).
  30.0-35.0 payoff  phone centre, Coins orbit it, Home screen with Lv.20 and 2,296 Coins; "Make every outing count."; fade to black.
  35.0-40.0 end     logo performed in on a teal glow; "Plan. Book. Play. Earn Rewards."; "Alpha test · Elan & nVision 2027 · IIT Hyderabad · 8–10 Jan".
BANNED:  invented UI or numbers; product UI tilted while being read; the logo docked in a corner; floating particles as decoration;
         three cards in a row; a title over a dimmed screenshot; text that moves while it is read; linear gradients on the dark ground.
         (Centred type is allowed: it is the reference style the person asked for.)
QA:      t=0.1, 3.0, 5.6, 8.8, 10.4, 12.4, 15.0, 18.2, 21.6, 23.4, 25.2, 28.6, 31.5, 34.2, 37.0, 39.8.
