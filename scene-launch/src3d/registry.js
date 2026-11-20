// Name -> builder table. Order here is the public SCENE3D.OBJECTS order.
import kart from './objects/kart.js';
import bowling from './objects/bowling.js';
import vr from './objects/vr.js';
import trampoline from './objects/trampoline.js';
import claw from './objects/claw.js';
import controller from './objects/controller.js';
import padlock from './objects/padlock.js';
import cricket from './objects/cricket.js';
import coin from './objects/coin.js';

export const BUILDERS = { kart, bowling, vr, trampoline, claw, controller, padlock, cricket, coin };
export const OBJECTS = Object.keys(BUILDERS);
