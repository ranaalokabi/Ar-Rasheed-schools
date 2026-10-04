// High-quality, subtle, calm, and pleasant Web Audio notification chime
// Designed specifically for reception AI message delivery (gentle harmonic two-tone)

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    try {
      sharedAudioCtx = new AudioCtx();
    } catch {
      return null;
    }
  }

  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }

  return sharedAudioCtx;
}

/**
 * Plays a calm, gentle, warm two-tone chime when the assistant sends a message.
 * Pure sine wave with smooth attack and exponential decay. Very soft and non-intrusive.
 */
export function playMessageChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Master volume limiter to keep it subtle and calm
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.045, now);
    masterGain.connect(ctx.destination);

    // Tone 1: Gentle warm fundamental (587.33 Hz - D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.7, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Tone 2: Harmonic pleasant shimmer (880 Hz - A5), offset slightly
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.06);

    gain2.gain.setValueAtTime(0.001, now + 0.06);
    gain2.gain.linearRampToValueAtTime(0.85, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.38);
  } catch {
    // Graceful silent fallback if browser audio policy prevents autoplay
  }
}
