/**
 * High-fidelity procedural keystroke sound synthesizer using Web Audio API.
 * Produces crisp, tactile, low-latency mechanical keystrokes, deep thocks, and distinct error audio.
 */

import { SoundEffect } from '../types';

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private hasInitializedListeners = false;

  constructor() {
    this.setupAutoUnlock();
  }

  private setupAutoUnlock() {
    if (typeof window === 'undefined' || this.hasInitializedListeners) return;
    this.hasInitializedListeners = true;

    const unlock = () => {
      this.initContext();
      if (this.ctx && this.ctx.state === 'running') {
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('touchstart', unlock);
      }
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
  }

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public resume() {
    this.initContext();
  }

  /**
   * Plays tactile keyboard click upon keystroke.
   */
  public playKey(profile: SoundEffect, volume = 0.5) {
    if (profile === 'off' || volume <= 0) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      // Scaled master volume with comfortable curve
      masterGain.gain.setValueAtTime(Math.min(1.0, Math.max(0.01, volume * 0.9)), now);
      masterGain.connect(this.ctx.destination);

      // Pitch micro-jitter for organic human variation
      const jitter = (Math.random() - 0.5) * 0.14;

      if (profile === 'mechanical') {
        // Authentic Mechanical Switch (Tactile snap + bottom-out)
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'triangle';
        const baseFreq = 1850 * (1 + jitter);
        clickOsc.frequency.setValueAtTime(baseFreq, now);
        clickOsc.frequency.exponentialRampToValueAtTime(360, now + 0.024);

        clickGain.gain.setValueAtTime(0.7, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

        clickOsc.connect(clickGain);
        clickGain.connect(masterGain);
        clickOsc.start(now);
        clickOsc.stop(now + 0.03);

        // Keycap & plate bottom-out noise
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.02);
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          noiseData[i] = Math.random() * 2 - 1;
        }

        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(2600 * (1 + jitter), now);
        noiseFilter.Q.setValueAtTime(2.0, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.45, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        noiseSrc.start(now);
        noiseSrc.stop(now + 0.024);

      } else if (profile === 'thock') {
        // Deep Lubed Custom Mechanical Switch (Warm deep "thock")
        const thockOsc = this.ctx.createOscillator();
        const thockGain = this.ctx.createGain();
        thockOsc.type = 'sine';
        const baseFreq = 420 * (1 + jitter);
        thockOsc.frequency.setValueAtTime(baseFreq, now);
        thockOsc.frequency.exponentialRampToValueAtTime(80, now + 0.045);

        thockGain.gain.setValueAtTime(0.85, now);
        thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        thockOsc.connect(thockGain);
        thockGain.connect(masterGain);
        thockOsc.start(now);
        thockOsc.stop(now + 0.055);

        // Low-frequency wooden keycap resonance
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.025);
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          noiseData[i] = Math.random() * 2 - 1;
        }

        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;
        const lowPass = this.ctx.createBiquadFilter();
        lowPass.type = 'lowpass';
        lowPass.frequency.setValueAtTime(650, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.4, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        noiseSrc.connect(lowPass);
        lowPass.connect(noiseGain);
        noiseGain.connect(masterGain);

        noiseSrc.start(now);
        noiseSrc.stop(now + 0.03);

      } else if (profile === 'clicky') {
        // Crisp Blue Switch clicky snap
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2800 * (1 + jitter), now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.02);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1500, now);

        oscGain.gain.setValueAtTime(0.55, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.024);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.026);

      } else if (profile === 'typewriter') {
        // Vintage Typewriter strike with metal punch
        const strikeOsc = this.ctx.createOscillator();
        const strikeGain = this.ctx.createGain();
        strikeOsc.type = 'triangle';
        strikeOsc.frequency.setValueAtTime(1200 * (1 + jitter), now);
        strikeOsc.frequency.exponentialRampToValueAtTime(220, now + 0.035);

        strikeGain.gain.setValueAtTime(0.8, now);
        strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        strikeOsc.connect(strikeGain);
        strikeGain.connect(masterGain);
        strikeOsc.start(now);
        strikeOsc.stop(now + 0.045);

        // Metallic clack
        const clackOsc = this.ctx.createOscillator();
        const clackGain = this.ctx.createGain();
        clackOsc.type = 'square';
        clackOsc.frequency.setValueAtTime(3200 * (1 + jitter), now);
        clackGain.gain.setValueAtTime(0.35, now);
        clackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

        clackOsc.connect(clackGain);
        clackGain.connect(masterGain);
        clackOsc.start(now);
        clackOsc.stop(now + 0.02);

      } else if (profile === 'soft') {
        // Apple Chiclet / Scissor Switch key tap
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520 * (1 + jitter), now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

        oscGain.gain.setValueAtTime(0.65, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.042);

      } else if (profile === 'bubble') {
        // Poppy Bubble sound
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650 * (1 + jitter), now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.032);

        oscGain.gain.setValueAtTime(0.6, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.042);
      }
    } catch {
      // AudioContext failure recovery
    }
  }

  /**
   * Plays distinct, tactile error feedback audio on mistyped character.
   */
  public playError(volume = 0.5) {
    if (volume <= 0) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(Math.min(1.0, volume * 0.85), now);
      masterGain.connect(this.ctx.destination);

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const toneGain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(200, now);
      osc1.frequency.linearRampToValueAtTime(120, now + 0.08);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(145, now);
      osc2.frequency.linearRampToValueAtTime(90, now + 0.08);

      const lowPass = this.ctx.createBiquadFilter();
      lowPass.type = 'lowpass';
      lowPass.frequency.setValueAtTime(580, now);

      toneGain.gain.setValueAtTime(0.65, now);
      toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc1.connect(lowPass);
      osc2.connect(lowPass);
      lowPass.connect(toneGain);
      toneGain.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.095);
      osc2.stop(now + 0.095);
    } catch {
      // AudioContext error handling
    }
  }

  /**
   * Success chime on test completion.
   */
  public playComplete(volume = 0.5) {
    if (volume <= 0) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.075;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gainNode.gain.setValueAtTime(volume * 0.35, noteTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.27);
      });
    } catch {
      // AudioContext error handling
    }
  }
}

export const soundManager = new SoundSynthesizer();
