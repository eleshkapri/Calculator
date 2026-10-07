/**
 * ============================================================================
 * CalVerse Pro - Keyboard Shortcuts & Hotkey Router
 * File: src/ui/keyboard.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Listens for hardware keyboard keydown events and routes them intelligently
 * to the appropriate calculator subsystem based on the active view mode:
 * 1. Standard & Scientific Modes:
 *    - Maps numeric keys (0-9) and '.' to display entries.
 *    - Maps arithmetic keys (+, -, *, /, %) to visual mathematical glyphs (+, −, ×, ÷, %).
 *    - Maps 'Enter' or '=' to evaluate the expression.
 *    - Maps 'Backspace' to delete the last character.
 *    - Maps 'Escape', 'c', or 'C' to clear.
 * 2. Programmer Mode:
 *    - Maps hex/dec/bin digits (0-9, A-F).
 *    - Maps Enter to calculate bitwise operation, Backspace to delete, Escape to clear.
 * 3. Focus Guard:
 *    - Automatically ignores hotkeys when the user is actively focused in an <input>,
 *      <select>, or <textarea> element (e.g., typing inside the graphing formula input).
 * 
 * FUNCTIONS PRESENT IN THIS FILE:
 * 1. initKeyboard():
 *    - Registers the global window 'keydown' event listener and routes key presses.
 * ============================================================================
 */

import { state } from '../core/state.js';
import { inputVal, calculate, backspace, clear } from '../features/standard.js';
import { GraphEngine } from '../features/graphing.js';
import { ProgrammerEngine } from '../features/programmer.js';

/**
 * Initializes global hardware keyboard hotkey routing.
 */
export function initKeyboard() {
    window.addEventListener('keydown', (e) => {
        // Prevent hotkeys from interfering when the user is typing in form inputs
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            if (e.key === 'Enter' && state.currentMode === 'graphing') {
                GraphEngine.render();
            }
            return;
        }

        const key = e.key;

        // Route Standard and Scientific calculator keystrokes
        if (state.currentMode === 'standard' || state.currentMode === 'scientific') {
            const mode = state.currentMode;
            if (!isNaN(key) && key !== ' ') {
                inputVal(mode, key);
            } else if (key === '.') {
                inputVal(mode, '.');
            } else if (key === '+' || key === '-') {
                inputVal(mode, key === '-' ? '−' : '+');
            } else if (key === '*') {
                inputVal(mode, '×');
            } else if (key === '/') {
                inputVal(mode, '÷');
            } else if (key === '(' || key === ')') {
                inputVal(mode, key);
            } else if (key === '%') {
                inputVal(mode, '%');
            } else if (key === 'Enter' || key === '=') {
                e.preventDefault();
                calculate(mode);
            } else if (key === 'Backspace') {
                backspace(mode);
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                clear(mode);
            }
        } 
        // Route Programmer calculator keystrokes
        else if (state.currentMode === 'programmer') {
            if (/^[0-9A-Fa-f]$/.test(key)) {
                ProgrammerEngine.inputDigit(key.toUpperCase());
            } else if (key === 'Enter' || key === '=') {
                e.preventDefault();
                ProgrammerEngine.calculate();
            } else if (key === 'Backspace') {
                ProgrammerEngine.backspace();
            } else if (key === 'Escape') {
                ProgrammerEngine.clear();
            }
        }
    });
}
