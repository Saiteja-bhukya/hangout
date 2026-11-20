// Generic group-chat screen (393 x 852) for the Pain (grey) and Payoff (colour) sections.
// Not a real messaging brand. Ids are prefixed so the screen can be mounted more than once.

const AV = { Rohan: 'av-rohan', Meera: 'av-meera', You: 'av-you' };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const ico = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6.5" width="12.5" height="11" rx="3"/><path d="M15.5 10.5l5-3v9l-5-3"/></svg>',
  call: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4.5h3.2l1.6 4-2.1 1.3a11 11 0 0 0 6.5 6.5l1.3-2.1 4 1.6V19a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5"/></svg>',
  check2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12.5l4 4 8-9M10.5 16.5l1 0 8-9"/></svg>',
};

/**
 * messages: [{ from:'Rohan'|'Meera'|'You', text } | { divider:'2 hours later' } | { seen:'Seen by Meera' } | { card:true }]
 * opts: { p: id prefix, variant: 'grey'|'colour' }
 */
export function chatScreen(messages, { p, variant = 'colour' } = {}) {
  let prev = null;
  const items = messages.map((m, i) => {
    const id = `${p}-m${i}`;
    if (m.divider) { prev = null; return `<div class="ch-item ch-divider" id="${id}"><span>${esc(m.divider)}</span></div>`; }
    if (m.seen) return `<div class="ch-item ch-seen" id="${id}">${ico.check2}<span>${esc(m.seen)}</span></div>`;
    const mine = m.from === 'You';
    const showName = !mine && prev !== m.from;
    prev = m.from;
    const body = m.card ? bookingCard() : `<div class="ch-bub">${esc(m.text)}</div>`;
    if (mine) return `<div class="ch-item ch-msg ch-mine" id="${id}"><div class="ch-col">${body}</div></div>`;
    return `<div class="ch-item ch-msg ch-theirs" id="${id}"><div class="ch-av ${AV[m.from]}">${m.from[0]}</div><div class="ch-col">${showName ? `<div class="ch-name ch-name--${m.from.toLowerCase()}">${m.from}</div>` : ''}${body}</div></div>`;
  }).join('');
  return `<div class="app-screen chat chat--${variant}">
  <div class="ch-status"><span>9:41</span><span class="ch-sb"><i></i><i></i><i></i><i></i><b></b></span></div>
  <div class="ch-head">
    <span class="ch-back">${ico.back}</span>
    <div class="ch-stack"><span class="ch-av av-rohan">R</span><span class="ch-av av-meera">M</span><span class="ch-av av-you">Y</span></div>
    <div class="ch-title"><div class="ch-t1">Sunday plan</div><div class="ch-t2">Rohan, Meera, You</div></div>
    <span class="ch-hi">${ico.video}</span><span class="ch-hi">${ico.call}</span>
  </div>
  <div class="ch-body"><div class="ch-list" id="${p}-list">${items}</div></div>
  <div class="ch-input"><span class="ch-plus">${ico.plus}</span><div class="ch-field">Message</div><span class="ch-mic">${ico.mic}</span></div>
</div>`;
}

function bookingCard() {
  return `<div class="ch-card">
  <div class="ch-card-top"><span class="ch-card-logo">S</span><span>BOOKED VIA SCENE</span></div>
  <div class="ch-card-body">
    <div class="ch-card-title">Holodeck VR</div>
    <div class="ch-card-row">Sun, 22 Nov · 6:00 pm</div>
    <div class="ch-card-row">3 players · Rohan, Meera, You</div>
    <div class="ch-card-btn">View ticket</div>
  </div>
</div>`;
}
