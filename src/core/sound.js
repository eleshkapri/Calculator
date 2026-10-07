/**
 * CalVerse Pro - Audio & Haptic Synthesizer
 * Zero-dependency Web Audio API tactile feedback system
 */

export const SoundFx = {
    enabled: localStorage.getItem('calverse_sound') === 'true',
    ctx: null,
    _unlocked: false,

    // Must be called from a user-gesture (touch/click) to unlock audio on mobile
    unlockAudio() {
        if (this._unlocked && this.ctx) return;
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            if (!this.ctx) this.ctx = new AC();
            // Resume if suspended (required by Chrome, Safari autoplay policy)
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            // iOS Safari fix: play a silent buffer to fully unlock audio pipeline
            const buf = this.ctx.createBuffer(1, 1, 22050);
            const src = this.ctx.createBufferSource();
            src.buffer = buf;
            src.connect(this.ctx.destination);
            src.start(0);
            this._unlocked = true;
        } catch (e) {
            // AudioContext not supported
        }
    },

    playClick(freq = 600, type = 'sine', duration = 0.03) {
        if (!this.enabled) return;
        try {
            // Ensure context exists and is running
            if (!this.ctx) this.unlockAudio();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // AudioContext not permitted or supported
        }
    }
};

// Unlock audio on first user interaction (required for mobile browsers)
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
