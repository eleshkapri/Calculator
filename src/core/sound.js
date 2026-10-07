/**
 * ============================================================================
 * CalVerse Pro - Audio & Haptic Feedback Synthesizer
 * File: src/core/sound.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Implements a zero-dependency audio synthesizer using the native HTML5
 * Web Audio API. Generates low-latency micro-tones (clicks/beeps) on user
 * button taps, providing pleasant tactile feedback. Resolves autoplay policy
 * constraints on mobile WebKit and Chrome.
 * 
 * OBJECTS & FUNCTIONS PRESENT IN THIS FILE:
 * 1. SoundFx:
 *    - Singleton object holding the AudioContext instance and sound preferences.
 *    - Methods:
 *      * unlockAudio(): Wakes suspended AudioContext and plays a silent buffer
 *        to satisfy iOS/Android autoplay restrictions.
 *      * playClick(freq, type, duration): Generates a custom frequency tone with
 *        exponential decay gain envelope.
 * 
 * 2. initSoundAutoUnlock():
 *    - Registers capture-phase event listeners on touchstart/touchend/click to
 *      transparently unlock the audio subsystem on the user's very first interaction.
 * ============================================================================
 */

export const SoundFx = {
    /** Whether sound feedback is enabled by user preference */
    enabled: typeof localStorage !== 'undefined' ? (localStorage.getItem('calverse_sound') === 'true') : true,
    /** Internal Web Audio API AudioContext instance */
    ctx: null,
    /** Guard flag preventing multiple unlock buffer allocations */
    _unlocked: false,

    /**
     * Initializes and unlocks the Web Audio API context.
     * Required to be invoked from a direct user gesture (click/touch) to satisfy
     * modern browser audio autoplay policies.
     */
    unlockAudio() {
        if (this._unlocked && this.ctx) return;
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            if (!this.ctx) this.ctx = new AC();

            // Resume context if suspended (common in Chromium background tabs)
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }

            // iOS Safari requirement: Play a 1-sample silent buffer to unlock the hardware pipeline
            const buf = this.ctx.createBuffer(1, 1, 22050);
            const src = this.ctx.createBufferSource();
            src.buffer = buf;
            src.connect(this.ctx.destination);
            src.start(0);
            this._unlocked = true;
        } catch (e) {
            // Web Audio API unavailable in this environment
        }
    },

    /**
     * Synthesizes a soft, pleasant mechanical click tone.
     * Uses an oscillator with an exponential decay gain ramp.
     * 
     * @param {number} [freq=600] - Tone frequency in Hertz (Hz).
     * @param {OscillatorType} [type='sine'] - Waveform ('sine', 'triangle', 'square', 'sawtooth').
     * @param {number} [duration=0.03] - Sound duration in seconds.
     */
    playClick(freq = 600, type = 'sine', duration = 0.03) {
        if (!this.enabled) return;
        try {
            // Lazy unlock if not already instantiated
            if (!this.ctx) this.unlockAudio();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            // Quick decay envelope: peak volume at 0.08, decay exponentially to 0.001
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Prevent audio errors from interfering with calculation logic
        }
    }
};

/**
 * Attaches one-time event listeners on document to unlock audio upon the user's
 * very first touch or click event, then removes listeners to prevent overhead.
 */
export function initSoundAutoUnlock() {
    function _onFirstInteraction() {
        SoundFx.unlockAudio();
        document.removeEventListener('touchstart', _onFirstInteraction, true);
        document.removeEventListener('touchend', _onFirstInteraction, true);
        document.removeEventListener('click', _onFirstInteraction, true);
    }
    document.addEventListener('touchstart', _onFirstInteraction, true);
    document.addEventListener('touchend', _onFirstInteraction, true);
    document.addEventListener('click', _onFirstInteraction, true);
}
