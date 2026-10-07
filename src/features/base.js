/**
 * ============================================================================
 * CalVerse Pro - Abstract Base Calculator Class (OOP Foundation)
 * File: src/features/base.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Defines the abstract base class `BaseCalculator` that establishes the core contract
 * and shared lifecycle for all feature calculation engines in CalVerse Pro.
 * 
 * OOP PRINCIPLES DEMONSTRATED:
 * 1. Abstraction: Defines the standard polymorphic interface (init, reset, updateDisplay).
 * 2. Encapsulation: Protects internal instance identity and initialization flags using
 *    private class fields (#id, #initialized).
 * 3. Inheritance: Serves as the superclass for StandardCalculator, ScientificCalculator,
 *    ProgrammerCalculator, FinancialCalculator, GraphingCalculator, etc.
 * ============================================================================
 */

import { SoundFx } from '../core/sound.js';
import { showToast, copyToClipboard } from '../core/dom.js';

export class BaseCalculator {
    /** @type {string} Unique engine identifier */
    #id;
    /** @type {boolean} Flag preventing redundant initialization */
    #initialized = false;

    /**
     * Constructs a base calculator instance.
     * Prevents direct instantiation of the abstract base class.
     * 
     * @param {string} id - Identifier of the specific calculator.
     */
    constructor(id) {
        if (new.target === BaseCalculator) {
            throw new TypeError('Cannot construct BaseCalculator instances directly. Please instantiate a concrete subclass.');
        }
        if (!id || typeof id !== 'string') {
            throw new Error('BaseCalculator requires a valid non-empty string identifier.');
        }
        this.#id = id;
    }

    /**
     * Gets the unique identifier for this calculator engine.
     * @returns {string}
     */
    get id() {
        return this.#id;
    }

    /**
     * Checks if this calculator has already completed boot initialization.
     * @returns {boolean}
     */
    get isInitialized() {
        return this.#initialized;
    }

    /**
     * Marks the engine as initialized.
     * @protected
     */
    markInitialized() {
        this.#initialized = true;
    }

    /**
     * Lifecycle method: Bootstraps DOM listeners, initial states, and data models.
     * Concrete subclasses should override this method.
     */
    init() {
        // Default lifecycle no-op
    }

    /**
     * Resets the active calculator state to default empty/initial conditions.
     */
    reset() {
        // Default lifecycle no-op
    }

    /**
     * Plays standard auditory click feedback for UI interactions.
     * @param {number} [freq=500] 
     * @param {string} [type='sine'] 
     * @param {number} [duration=0.035] 
     * @protected
     */
    playFeedback(freq = 500, type = 'sine', duration = 0.035) {
        SoundFx.playClick(freq, type, duration);
    }

    /**
     * Copies text to system clipboard with audio and toast confirmation.
     * @param {string} text 
     * @protected
     */
    copyText(text) {
        copyToClipboard(text);
    }

    /**
     * Triggers a transient toast message.
     * @param {string} message 
     * @protected
     */
    notify(message) {
        showToast(message);
    }
}
