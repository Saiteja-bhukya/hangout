// toli — 60 s launch film. Scene order and timing (absolute seconds).
import bg from './bg.mjs';
import open from './open.mjs';
import hook from './hook.mjs';
import pain from './pain.mjs';
import reveal from './reveal.mjs';
import range from './range.mjs';
import steps from './steps.mjs';
import rewards from './rewards.mjs';
import payoff from './payoff.mjs';
import finale from './finale.mjs';
import overlay from './overlay.mjs';

export const DURATION = 60;
export const SCENES = [bg, open, hook, pain, reveal, range, ...steps, rewards, payoff, finale, overlay];
// One mastered mix (score + SFX), built by tools/make-audio.mjs + tools/master-audio.sh.
export const AUDIO = [{ id: 'toli-mix', src: 'assets/audio/scene-mix.wav', start: 0, duration: 60, track: 3, volume: 1 }];
