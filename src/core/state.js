/**
 * CalVerse Pro - Central Application State
 * Single source of truth for calculator states, memory registers & active views
 */

import { StorageEngine } from './storage.js';

export const state = {
    currentMode: 'standard',
    angleMode: 'DEG', // DEG or RAD
    memory: { std: 0, sci: 0 },
    std: { expr: '', current: '0', waitingForNewNumber: false },
    sci: { expr: '', current: '0', waitingForNewNumber: false },
    prog: {
        radix: 'HEX',
        wordSize: 32, // 8, 16, 32, 64
        val: 0n,
        currentInput: '0',
        pendingOp: null,
        storedVal: null,
        waitingForNew: false
    },
    health: { unit: 'metric' },
    history: StorageEngine.loadHistory()
};
