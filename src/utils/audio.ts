// High-fidelity Cyberpunk Web Audio Synthesizer
// Clean, non-invasive, lightweight audio micro-interactions designed for mobile & desktop

let audioCtx: AudioContext | null = null;
let soundEnabled = true;
let ambientGainNode: GainNode | null = null;
let ambientOsc1: OscillatorNode | null = null;
let ambientOsc2: OscillatorNode | null = null;
let lastHoverTime = 0;

/**
 * Safely retrieve or lazily initialize the Web Audio context.
 * Automatically handles cross-browser prefixes and suspended state.
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Mobile-friendly unlock: Resumes AudioContext on the first touch/click event.
 * Critical for iOS Safari and Android Chrome audio autoplay policy.
 */
export function unlockAudioContext(): void {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

if (typeof window !== 'undefined') {
  const unlockEvents = ['touchstart', 'touchend', 'pointerdown', 'keydown'];
  const handleUnlock = () => {
    unlockAudioContext();
    unlockEvents.forEach((evt) => window.removeEventListener(evt, handleUnlock));
  };
  unlockEvents.forEach((evt) => window.addEventListener(evt, handleUnlock, { passive: true, once: true }));
}

/**
 * Global sound toggle (stored in localStorage)
 */
export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('metanoia_sound_enabled', enabled ? 'true' : 'false');
    } catch {
      // Ignore
    }
  }
  if (!enabled) {
    stopAmbientDrone();
  }
}

export function isSoundEnabled(): boolean {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('metanoia_sound_enabled');
      if (saved !== null) {
        soundEnabled = saved === 'true';
      }
    } catch {
      // Ignore
    }
  }
  return soundEnabled;
}

/* -------------------------------------------------------------------------- */
/* NON-INVASIVE CYBERPUNK UI MICRO-SOUNDS                                      */
/* -------------------------------------------------------------------------- */

/**
 * Cyber Hover: Ultra-soft, silky resonant harmonic tick.
 * Throttled to 50ms so rapid cursor sweeping doesn't saturate ears.
 */
export function playCyberHover(intensity: 'subtle' | 'crisp' = 'subtle'): void {
  if (!soundEnabled) return;
  const nowMs = Date.now();
  if (nowMs - lastHoverTime < 50) return; // Non-invasive throttling
  lastHoverTime = nowMs;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Gentle sine / triangle mix for a smooth cyberpunk HUD feedback
    osc.type = intensity === 'crisp' ? 'triangle' : 'sine';
    const startFreq = intensity === 'crisp' ? 1760 : 1320; // A6 or E6
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 1.25, now + 0.025);

    // Filter out harsh top end
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);

    // Non-invasive gain curve (< 0.04 peak)
    const peakGain = intensity === 'crisp' ? 0.038 : 0.026;
    gain.gain.setValueAtTime(peakGain, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  } catch {
    // Graceful fallback
  }
}

/**
 * Cyber Click: Clean, tactile digital-optical switch click.
 * Gives instant feedback without being jarring or loud.
 */
export function playCyberClick(flavor: 'default' | 'soft' | 'confirm' = 'default'): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Dual oscillator: body + transient snap
    const oscBody = ctx.createOscillator();
    const oscSnap = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.Q.setValueAtTime(1.8, now);

    if (flavor === 'confirm') {
      // Ascending pleasant major interval
      oscBody.type = 'sine';
      oscBody.frequency.setValueAtTime(659.25, now); // E5
      oscBody.frequency.exponentialRampToValueAtTime(880, now + 0.04); // A5

      oscSnap.type = 'triangle';
      oscSnap.frequency.setValueAtTime(1760, now);
      oscSnap.frequency.exponentialRampToValueAtTime(1320, now + 0.03);

      filter.frequency.setValueAtTime(2200, now);
      gain.gain.setValueAtTime(0.065, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);
    } else {
      // Crisp mechanical cyber pulse
      oscBody.type = 'triangle';
      oscBody.frequency.setValueAtTime(900, now);
      oscBody.frequency.exponentialRampToValueAtTime(380, now + 0.035);

      oscSnap.type = 'sine';
      oscSnap.frequency.setValueAtTime(2400, now);
      oscSnap.frequency.exponentialRampToValueAtTime(700, now + 0.025);

      filter.frequency.setValueAtTime(1800, now);
      const peak = flavor === 'soft' ? 0.04 : 0.065;
      gain.gain.setValueAtTime(peak, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    }

    oscBody.connect(filter);
    oscSnap.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    oscBody.start(now);
    oscSnap.start(now);
    oscBody.stop(now + 0.07);
    oscSnap.stop(now + 0.07);
  } catch {
    // Graceful fallback
  }
}

/**
 * Cyber Transition: Smooth, atmospheric digital sweep for section/tab transitions.
 * Soft filtered whoosh with gentle resonant tail.
 */
export function playCyberTransition(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.16);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.08);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.18);

    // Subtle gain envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.19);
  } catch {
    // Graceful fallback
  }
}

/**
 * Neon Chime: Uplifting celestial arpeggio for confirmations and praise decision.
 */
export function playNeonChime(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const freqs = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6 (Praise Chord)

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.001, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.46);
    });
  } catch {
    // Graceful fallback
  }
}

/**
 * Camera Shutter effect for Photo Booth
 */
export function playCameraShutter(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Dual mechanical snap
    const snap1 = ctx.createOscillator();
    const snap2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    snap1.type = 'triangle';
    snap1.frequency.setValueAtTime(800, now);
    snap1.frequency.exponentialRampToValueAtTime(120, now + 0.03);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    snap1.connect(gain1);
    gain1.connect(ctx.destination);
    snap1.start(now);
    snap1.stop(now + 0.045);

    snap2.type = 'sine';
    snap2.frequency.setValueAtTime(1400, now + 0.08);
    snap2.frequency.exponentialRampToValueAtTime(250, now + 0.14);
    gain2.gain.setValueAtTime(0.1, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    snap2.connect(gain2);
    gain2.connect(ctx.destination);
    snap2.start(now + 0.08);
    snap2.stop(now + 0.155);
  } catch {
    // Graceful fallback
  }
}

/**
 * Countdown timer audio beep
 */
export function playCountdownBeep(isFinal = false): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isFinal ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(isFinal ? 1320 : 880, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isFinal ? 0.25 : 0.1));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + (isFinal ? 0.26 : 0.11));
  } catch {
    // Graceful fallback
  }
}

/**
 * Game Audio: Correct answer chime
 */
export function playGameCorrect(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(523.25, now);
    osc1.frequency.setValueAtTime(659.25, now + 0.07);
    osc1.frequency.setValueAtTime(783.99, now + 0.14);
    osc1.frequency.setValueAtTime(1046.5, now + 0.21);

    osc2.frequency.setValueAtTime(1046.5, now + 0.21);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.21);
    osc1.stop(now + 0.46);
    osc2.stop(now + 0.46);
  } catch {
    // Graceful fallback
  }
}

/**
 * Game Audio: Wrong answer soft pulse
 */
export function playGameWrong(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.24);
  } catch {
    // Graceful fallback
  }
}

/**
 * Game Audio: Item caught tick
 */
export function playGameCatch(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.06);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.085);
  } catch {
    // Graceful fallback
  }
}

/**
 * Ambient Drone Controller (Very low volume sub-drone for atmosphere)
 */
export function startAmbientDrone(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ambientOsc1) return;

    ambientOsc1 = ctx.createOscillator();
    ambientOsc2 = ctx.createOscillator();
    ambientGainNode = ctx.createGain();

    ambientOsc1.type = 'sine';
    ambientOsc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 bass

    ambientOsc2.type = 'triangle';
    ambientOsc2.frequency.setValueAtTime(110, ctx.currentTime); // A2 harmonic

    ambientGainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
    ambientGainNode.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 3);

    ambientOsc1.connect(ambientGainNode);
    ambientOsc2.connect(ambientGainNode);
    ambientGainNode.connect(ctx.destination);

    ambientOsc1.start();
    ambientOsc2.start();
  } catch {
    // Graceful fallback
  }
}

export function stopAmbientDrone(): void {
  try {
    if (ambientGainNode && audioCtx) {
      ambientGainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
      setTimeout(() => {
        ambientOsc1?.stop();
        ambientOsc2?.stop();
        ambientOsc1 = null;
        ambientOsc2 = null;
        ambientGainNode = null;
      }, 1000);
    }
  } catch {
    // Graceful fallback
  }
}

export function toggleAmbientDrone(enabled: boolean): void {
  if (enabled) {
    startAmbientDrone();
  } else {
    stopAmbientDrone();
  }
}
