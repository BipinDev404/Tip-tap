/**
 * Apple-grade procedural sound synthesizer using Web Audio API.
 * Produces crisp, tactile, low-latency mechanical keystrokes and distinct error audio.
 */

import { SoundEffect } from '../types';

class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
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
   * Plays a subtle mechanical keyboard click upon a correct keystroke.
   */
  public playKey(profile: SoundEffect, volume = 0.35) {
    if (profile === 'off' || volume <= 0) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const gainNode = this.ctx.createGain();
      gainNode.connect(this.ctx.destination);

      // Pitch micro-jitter for organic human feel
      const jitter = (Math.random() - 0.5) * 0.12;

      if (profile === 'mechanical') {
        // Authentic Mechanical Switch (Tactile leaf release + stem bottom-out)
        // 1. High-frequency click snap
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'triangle';
        const baseFreq = 1650 * (1 + jitter);
        clickOsc.frequency.setValueAtTime(baseFreq, now);
        clickOsc.frequency.exponentialRampToValueAtTime(320, now + 0.024);

        clickGain.gain.setValueAtTime(volume * 0.45, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

        clickOsc.connect(clickGain);
        clickGain.connect(gainNode);
        clickOsc.start(now);
        clickOsc.stop(now + 0.03);

        // 2. Resonant keycap & plate bottom-out noise
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.016);
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          noiseData[i] = Math.random() * 2 - 1;
        }

        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(2800 * (1 + jitter), now);
        noiseFilter.Q.setValueAtTime(2.2, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(volume * 0.28, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(gainNode);

        noiseSrc.start(now);
        noiseSrc.stop(now + 0.02);

      } else if (profile === 'thock') {
        // Deep Lubed Custom Mechanical Switch (Warm "thock")
        const thockOsc = this.ctx.createOscillator();
        const thockGain = this.ctx.createGain();
        thockOsc.type = 'sine';
        const baseFreq = 480 * (1 + jitter);
        thockOsc.frequency.setValueAtTime(baseFreq, now);
        thockOsc.frequency.exponentialRampToValueAtTime(95, now + 0.038);

        thockGain.gain.setValueAtTime(volume * 0.5, now);
        thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.042);

        thockOsc.connect(thockGain);
        thockGain.connect(gainNode);
        thockOsc.start(now);
        thockOsc.stop(now + 0.045);

        // Subdued low-pass acoustic body
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.02);
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          noiseData[i] = Math.random() * 2 - 1;
        }

        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;
        const lowPass = this.ctx.createBiquadFilter();
        lowPass.type = 'lowpass';
        lowPass.frequency.setValueAtTime(750, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(volume * 0.3, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        noiseSrc.connect(lowPass);
        lowPass.connect(noiseGain);
        noiseGain.connect(gainNode);

        noiseSrc.start(now);
        noiseSrc.stop(now + 0.025);

      } else if (profile === 'clicky') {
        // Crisp Blue Switch / Box White clicky snap
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2400 * (1 + jitter), now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.018);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1400, now);

        oscGain.gain.setValueAtTime(volume * 0.35, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.025);

      } else if (profile === 'soft') {
        // Apple Chiclet / Soft Dome Key tap
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(410 * (1 + jitter), now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);

        oscGain.gain.setValueAtTime(volume * 0.38, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(oscGain);
        oscGain.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.042);

      } else if (profile === 'bubble') {
        // Modern Soft Bubble Pop
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620 * (1 + jitter), now);
        osc.frequency.exponentialRampToValueAtTime(1250, now + 0.028);

        oscGain.gain.setValueAtTime(volume * 0.32, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(oscGain);
        oscGain.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // AudioContext could be blocked prior to first user interaction
    }
  }

  /**
   * Plays a distinct, subtle error audio feedback when an incorrect character is typed.
   */
  public playError(volume = 0.35) {
    if (volume <= 0) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const gainNode = this.ctx.createGain();
      gainNode.connect(this.ctx.destination);

      // Distinct, dampened dual-tone error thud: low-frequency buzz that cleanly communicates a mistake
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const toneGain = this.ctx.createGain();

      // Slightly detuned dissonant frequencies for intuitive error recognition
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(180, now);
      osc1.frequency.linearRampToValueAtTime(110, now + 0.07);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(135, now);
      osc2.frequency.linearRampToValueAtTime(80, now + 0.07);

      // Filter out harsh highs for an Apple-like polished feel
      const lowPass = this.ctx.createBiquadFilter();
      lowPass.type = 'lowpass';
      lowPass.frequency.setValueAtTime(550, now);

      toneGain.gain.setValueAtTime(volume * 0.45, now);
      toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc1.connect(lowPass);
      osc2.connect(lowPass);
      lowPass.connect(toneGain);
      toneGain.connect(gainNode);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.085);
      osc2.stop(now + 0.085);
    } catch {
      // AudioContext error handling
    }
  }

  /**
   * Success chime on test completion.
   */
  public playComplete(volume = 0.35) {
    if (volume <= 0) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.075;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gainNode.gain.setValueAtTime(volume * 0.22, noteTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22);

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.24);
      });
    } catch {
      // AudioContext error handling
    }
  }
}

export const soundManager = new SoundSynthesizer();
