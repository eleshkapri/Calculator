/**
 * ============================================================================
 * CalVerse Pro - Centralized Global Application State
 * File: src/core/state.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Acts as the centralized state store for CalVerse. Tracks active application
 * view modes, trigonometric units, standard/scientific display buffers,
 * memory registers, programmer bitwise buffers, health unit preferences,
 * and calculation history.
 * 
 * EXPORTED STATE OBJECT:
 * - state.currentMode: Active calculator view identifier (e.g. 'standard', 'scientific').
 * - state.angleMode: Current trigonometric angle unit ('DEG' or 'RAD').
 * - state.memory: Independent memory registers for standard and scientific keypads.
 * - state.std: Expression, current display value, and entry flag for Standard mode.
 * - state.sci: Expression, current display value, and entry flag for Scientific mode.
 * - state.prog: Programmer calculator state (Radix, Bit width, BigInt accumulator, pending operation).
 * - state.health: Preferred units for BMI/health calculations ('metric' or 'imperial').
 * - state.history: In-memory array of historical calculations synced to localStorage.
 * ============================================================================
 */

import { StorageEngine } from './storage.js';

/**
 * Global reactive state object shared by all calculator features and UI components.
 */
export const state = {
    /** Currently active calculator view mode ('standard', 'scientific', 'graphing', etc.) */
    currentMode: 'standard',

    /** Active trigonometric angle mode: 'DEG' (degrees) or 'RAD' (radians) */
    angleMode: 'DEG',

    /** Memory registers for memory buttons (MC, MR, M+, M-, MS) */
    memory: {
        std: 0,
        sci: 0
    },

    /** Standard calculator operational buffer */
    std: {
        expr: '',
        current: '0',
        waitingForNewNumber: false
    },

    /** Scientific calculator operational buffer */
    sci: {
        expr: '',
        current: '0',
        waitingForNewNumber: false
    },

    /** Programmer calculator operational buffer supporting arbitrary precision BigInt */
    prog: {
        radix: 'HEX',         // 'HEX', 'DEC', 'OCT', or 'BIN'
        wordSize: 32,         // 8, 16, 32, or 64 bits
        val: 0n,              // Primary numeric value in BigInt format
        currentInput: '0',    // Raw string input in current radix
        pendingOp: null,      // Active binary operator ('+', '-', '&', '|', etc.)
        storedVal: null,      // Value buffered before operator was pressed
        waitingForNew: false  // Reset input buffer upon subsequent keypress
    },

    /** Health module unit system: 'metric' (kg, cm) or 'imperial' (lbs, ft/in) */
    health: {
        unit: 'metric'
    },

    /** Calculation history records loaded from persistent local storage */
    history: StorageEngine.loadHistory()
};
