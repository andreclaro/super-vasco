/**
 * Looping background melody: Super Mario Bros. Overworld (Ground) theme,
 * synthesized with Web Audio API (no audio files). Starts on first user
 * interaction to satisfy browser autoplay policy.
 */

const NOTE_FREQ = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  Bb4: 466.16,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
};

// Super Mario Bros. Overworld (Ground) theme – melody loop (synth only, no audio files)
const MELODY = [
  ['E5', 0.5], ['E5', 0.25], ['E5', 0.25], ['C5', 0.5], ['E5', 0.5], ['G5', 1],
  ['G4', 1],
  ['C5', 0.5], ['G4', 0.5], ['E4', 0.5], ['A4', 0.5], ['B4', 0.25], ['Bb4', 0.25], ['A4', 0.5], ['G4', 1],
  ['E5', 0.5], ['G5', 0.25], ['G5', 0.25], ['A5', 0.5], ['F5', 0.25], ['G5', 0.25], ['E5', 0.5], ['C5', 0.25], ['D5', 0.25], ['B4', 1],
  ['G4', 0.5], ['E5', 0.5], ['G5', 0.5], ['A5', 0.5], ['F5', 0.25], ['G5', 0.25], ['E5', 0.5], ['C5', 0.25], ['D5', 0.25], ['B4', 1],
  ['G4', 0.5], ['E5', 0.5], ['G5', 0.5], ['A5', 0.5], ['F5', 0.25], ['G5', 0.25], ['E5', 0.5], ['C5', 0.25], ['D5', 0.25], ['B4', 1],
  ['C5', 0.5], ['C4', 0.5], ['C4', 0.5], ['E4', 0.5], ['G4', 0.5], ['G4', 0.25], ['C4', 0.5], ['E4', 0.5], ['G5', 0.5], ['G4', 0.5], ['G4', 0.5],
];

const BPM = 100;
const BEAT_DURATION = 60 / BPM;

let audioContext = null;
let masterGain = null;
let nextNoteTime = 0;
let scheduledUntil = 0;
let isRunning = false;
let soundMuted = false;

export function getContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(audioContext.destination);
  }
  return audioContext;
}

/** Destino de áudio para música e efeitos – ao mutar, tudo silencia de imediato */
export function getDestination() {
  getContext();
  return masterGain;
}

function playNote(freq, startTime, duration) {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(getDestination());
  osc.frequency.value = freq;
  osc.type = 'square';
  gain.gain.setValueAtTime(0.12, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function scheduleSegment() {
  const ctx = getContext();
  const now = ctx.currentTime;
  if (nextNoteTime < now) nextNoteTime = now;

  for (let i = 0; i < MELODY.length; i += 1) {
    const [note, beats] = MELODY[i];
    const freq = NOTE_FREQ[note] || NOTE_FREQ.C4;
    const duration = beats * BEAT_DURATION * 0.9;
    playNote(freq, nextNoteTime, duration);
    nextNoteTime += beats * BEAT_DURATION;
  }
  scheduledUntil = nextNoteTime;
}

function tick() {
  if (!isRunning || !audioContext) return;
  const ctx = audioContext;
  if (ctx.currentTime > scheduledUntil - 0.5) {
    scheduleSegment();
  }
  window.requestAnimationFrame(tick);
}

export function startBackgroundMusic() {
  if (isRunning) return;
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  if (masterGain) {
    masterGain.gain.setValueAtTime(1, ctx.currentTime);
  }
  isRunning = true;
  soundMuted = false;
  nextNoteTime = ctx.currentTime;
  scheduleSegment();
  tick();
}

export function stopBackgroundMusic() {
  isRunning = false;
  soundMuted = true;
  const ctx = audioContext;
  if (ctx && masterGain) {
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
  }
}

export function isMusicRunning() {
  return isRunning;
}

export function isSoundMuted() {
  return soundMuted;
}

export function setSoundMuted(muted) {
  soundMuted = muted;
}
