// Scene order and timing for the 60 s film. Times are absolute seconds.
import bg from './bg.mjs';
import hook from './hook.mjs';
import pain from './pain.mjs';
import relief from './relief.mjs';
import range from './range.mjs';
import payoff from './payoff.mjs';
import end from './end.mjs';
import overlay from './overlay.mjs';

let answers = [], rewards = [];
try { answers = (await import('./answers.mjs')).default; } catch (e) { if (!String(e).includes('Cannot find module')) throw e; }
try { rewards = [(await import('./rewards.mjs')).default]; } catch (e) { if (!String(e).includes('Cannot find module')) throw e; }

export const DURATION = 60;
export const SCENES = [bg, hook, pain, relief, range, ...answers, ...rewards, payoff, end, overlay];
// One mastered mix (music + SFX, -14 LUFS / -1 dBTP), built by tools/make-audio.mjs + tools/master-audio.sh.
// The stems (assets/audio/music.wav, sfx.wav) stay in the project for re-mixing.
export const AUDIO = [{ id: 'scene-mix', src: 'assets/audio/scene-mix.wav', start: 0, duration: 60, track: 3, volume: 1 }];
