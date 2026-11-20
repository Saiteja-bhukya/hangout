# toli — 60 s launch film · REVIEW

**toli** (टोली — Hindi for *your crew, your gang of friends*) is my startup: an app that plans, books and rewards real-world outings for a whole group, so the plan doesn't die in the group chat.

Deliverable: `deliverables/toli-launch-60s.mp4` — 1920×1080, 30 fps, 60.000 s, H.264 + AAC.

## The film
| Time | Beat | What happens |
|---|---|---|
| 0–4 | Open | "we should hang out" from everyone at once → **Said every group chat. Ever.** |
| 4–8.2 | So many plans | Seven 3D outings pop in, faster and faster, ring the frame: **So many plans.** — then everything drops out of frame |
| 8.2–12 | Plans die | The crew chat fizzles ("who's booking?" "not me" … "Seen by 4"): **Plans die in the group chat.** Black. |
| 12–15 | Reveal | Three circles — three friends — fly in from three sides and collide on the drop: the mark. **toli · Plans that actually happen.** |
| 15–19 | Range | **Every way to hang out.** (36 activities) → **One app. Whole crew.** |
| 19–35 | How it works | **01 Pick a vibe** (3/4 hero) · **02 Find it nearby** (split screen) · **03 Pay once. For everyone.** (close-up pan) · **04 Everyone's in.** (top-down tilt) |
| 35–46 | Rewards | **Every outing levels you up.** → Level 9 → 10 · **Challenge complete.** · **Unlock more.** (coins) |
| 46–51 | Payoff | The same chat, alive: "wait, it's booked already??" — **Less planning. More hanging out.** |
| 51–60 | Finale | Every outing lands on a turning stage under falling marigold & pink petals — **Your crew. Your city. Your Sunday.** → lockup, **Get the toli out.**, the name's meaning, **Download free · Live in Hyderabad**, fade to black |

## Brand (my choices)
- Night `#0F0A1C`, marigold `#FFB627`, rani pink `#FF3D81`, teal `#20C9B5`, cream `#FFF3E2`. No glow; solid colour.
- Bricolage Grotesque 800 (sentence-case headlines), Inter (UI). Logo: three overlapping circles in screen blend + "toli" wordmark built from glyph paths with a marigold dot.
- 3D objects and the 12 app screens re-skinned to the palette; a new diorama stage object for the finale.
- Score: 120 BPM D major (D–Bm–G–A), synthesised — marimba open, B-minor "plans die" bed, a dhol (dagga + tihli) bhangra groove from the drop, shehnai-style lead at the peak, strings + bells finale and a long D-major resolve.

## Checked (measured)
- `hyperframes lint` 0 errors (1 warning kept: `rewards.html` is long — it carries three inline app screens). `hyperframes check` ok: runtime, layout, motion, audio clean; warnings kept on purpose: `line_unread` on the deliberately fast chatter and object labels, `text_below_floor` on phone UI text, contrast on the faded background chatter and tiny avatar initials.
- File: 1800 frames, 60.000 s, 1920×1080 @ 30/1. Audio: about −14 LUFS integrated, true peak about −1.3 dBTP; SFX 8 dB under the score.
- QA stills from the render at every section boundary (`review/qa/`). Found and fixed: the reveal circles were clipped by their SVG while flying in, a 0.1 s empty gap at the 4.0 s cut, and the falling headline shuffling. Only those ranges were re-rendered (4.0–8.2, 12.0–12.6 s) and spliced frame-accurately; the mix was regenerated for the shifted hook hits and muxed onto the spliced picture.
- Petals fall behind the type (checked at full resolution).

## Not checked
- **The score was measured, not heard.** Loudness, onsets and a spectrogram only.
- Real-device playback. "Live in Hyderabad" and "Download free" are launch-copy claims for a fictional startup; venue names and prices are illustrative.

## Weakest moments / next
- The diorama objects overlap a little at the back of the stage; a hand-placed layout per object would read cleaner.
- The open's chatter could use a few more voices for the "everyone, always" feeling.

## Rebuild
`node tools/build-logo.mjs` · `node tools/build-3d.mjs` · `node tools/make-audio.mjs && tools/master-audio.sh` · `node src/build.mjs` · `npx hyperframes check` · `npx hyperframes render --quality delivery --crf 20 -o renders/toli-launch.mp4`
