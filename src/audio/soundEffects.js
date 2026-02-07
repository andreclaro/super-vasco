/**
 * Short sound effects using Web Audio API (no audio files).
 * Respects mute state from the sound button.
 */

import { getContext, getDestination, isSoundMuted } from './backgroundMusic.js';

function playTone(freq, duration, type = 'square', volume = 0.2) {
  if (isSoundMuted()) return;
  try {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(getDestination());
    osc.frequency.value = freq;
    osc.type = type;
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
    osc.start(t);
    osc.stop(t + duration);
  } catch (_) {}
}

/** Som ao apanhar uma moeda – tom curto e agudo */
export function playCoinSound() {
  if (isSoundMuted()) return;
  try {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(getDestination());
    osc.frequency.value = 988; // B5
    osc.type = 'square';
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    osc.start(t);
    osc.stop(t + 0.12);
  } catch (_) {}
}

/** Som ao matar inimigo saltando em cima (stomp) */
export function playStompSound() {
  if (isSoundMuted()) return;
  try {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(getDestination());
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(80, t + 0.08);
    osc.type = 'square';
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    osc.start(t);
    osc.stop(t + 0.08);
  } catch (_) {}
}

/** Som ao perder (Game Over) – tom descendente */
export function playLoseSound() {
  if (isSoundMuted()) return;
  try {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(getDestination());
    osc.type = 'sawtooth';
    const t = ctx.currentTime;
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.linearRampToValueAtTime(110, t + 0.35);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
    osc.start(t);
    osc.stop(t + 0.35);
  } catch (_) {}
}
