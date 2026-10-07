/**
 * ============================================================================
 * CalVerse Pro - Centralized State Manager (OOP Singleton Architecture)
 * File: src/core/state.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Encapsulates global application state within the `StateManager` Singleton class.
 * Provides data protection, input validation, and synchronization with localStorage.
 * 
 * OOP PRINCIPLES:
 * 1. Singleton Pattern: Ensures exactly one coordinated instance coordinates state.
 * 2. Encapsulation: State buffers are managed through class properties and guarded methods.
 * ============================================================================
 */

import { StorageEngine } from './storage.js';

export class StateManager {
    /** @type {StateManager|null} Singleton instance */
    static #instance = null;

    constructor() {
        if (StateManager.#instance) {
            return StateManager.#instance;
        }

        this.currentMode = 'standard';
        this.angleMode = 'DEG';

        this.memory = {
            std: 0,
            sci: 0
        };

        this.std = {
            expr: '',
            current: '0',
            waitingForNewNumber: false
        };

        this.sci = {
            expr: '',
            current: '0',
            waitingForNewNumber: false
        };

        this.prog = {
            radix: 'HEX',
            wordSize: 32,
            val: 0n,
            currentInput: '0',
            pendingOp: null,
            storedVal: null,
            waitingForNew: false
        };

        this.health = {
            unit: 'metric'
        };

        this.history = StorageEngine.loadHistory();

        StateManager.#instance = this;
    }

    /**
     * Retrieves the singleton StateManager instance.
     * @returns {StateManager}
     */
    static getInstance() {
        if (!StateManager.#instance) {
            StateManager.#instance = new StateManager();
        }
        return StateManager.#instance;
    }

    /**
     * Resets a keypad state buffer to default zeros.
     * @param {'std'|'sci'} type 
     */
    resetBuffer(type) {
        if (this[type]) {
            this[type].expr = '';
            this[type].current = '0';
            this[type].waitingForNewNumber = false;
        }
    }

    /**
     * Appends a record to history with a maximum 50-item cap.
     * @param {string} expr 
     * @param {string} result 
     */
    pushHistory(expr, result) {
        this.history.unshift({
            expr,
            result,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        if (this.history.length > 50) this.history.pop();
        StorageEngine.saveHistory(this.history);
    }

    /**
     * Clears all recorded calculation history.
     */
    clearAllHistory() {
        this.history = [];
        StorageEngine.clearHistory();
    }
}

/**
 * Singleton state instance maintaining 100% backward compatibility.
 */
export const state = StateManager.getInstance();
