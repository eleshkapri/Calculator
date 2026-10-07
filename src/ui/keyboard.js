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
import { toggleHistory, closeHistory } from './navigation.js';

/**
 * Initializes global hardware keyboard hotkey routing.
 */
export function initKeyboard() {
    window.addEventListener('keydown', (e) => {
        // Prevent hotkeys from interfering when the user is typing in editable form inputs
        const activeTag = document.activeElement ? document.activeElement.tagName : '';
        const isEditable = ['INPUT', 'SELECT', 'TEXTAREA'].includes(activeTag) && !document.activeElement.readOnly;

        if (isEditable) {
            if (e.key === 'Enter' && state.currentMode === 'graphing') {
                GraphEngine.render();
            }
            return;
        }

        const key = e.key;

        // Escape closes open overlays (History Drawer or Install Modal)
        if (key === 'Escape') {
            const historyDrawer = document.getElementById('historyDrawer');
            if (historyDrawer && historyDrawer.classList.contains('open')) {
                e.preventDefault();
                closeHistory();
                return;
            }
            const installModal = document.getElementById('installModalBackdrop');
            if (installModal && installModal.classList.contains('open')) {
                e.preventDefault();
                if (window.CalVerse && window.CalVerse.closeInstallModal) {
                    window.CalVerse.closeInstallModal();
                }
                return;
            }
        }

        // 'h' or 'H' hotkey toggles History Drawer (without modifier combinations)
        if ((key === 'h' || key === 'H') && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            toggleHistory();
            return;
        }

        // Route Standard and Scientific calculator keystrokes
        if (state.currentMode === 'standard' || state.currentMode === 'scientific') {
            const mode = (state.currentMode === 'scientific') ? 'sci' : 'std';

            if (!isNaN(key) && key !== ' ') {
                e.preventDefault();
                inputVal(mode, key);
            } else if (key === '.' || key === ',') {
                e.preventDefault();
                inputVal(mode, '.');
            } else if (key === '+' || key === '-') {
                e.preventDefault();
                inputVal(mode, key === '-' ? '−' : '+');
            } else if (key === '*') {
                e.preventDefault();
                inputVal(mode, '×');
            } else if (key === '/') {
                e.preventDefault();
                inputVal(mode, '÷');
            } else if (key === '(' || key === ')') {
                e.preventDefault();
                inputVal(mode, key);
            } else if (key === '%') {
                e.preventDefault();
                inputVal(mode, '%');
            } else if (key === '^') {
                e.preventDefault();
                inputVal(mode, '^');
            } else if (key === 'Enter' || key === '=') {
                e.preventDefault();
                calculate(mode);
            } else if (key === 'Backspace') {
                e.preventDefault();
                backspace(mode);
            } else if (key === 'Escape' || key === 'Delete' || key === 'c' || key === 'C') {
                e.preventDefault();
                clear(mode);
            }
        } 
        // Route Programmer calculator keystrokes
        else if (state.currentMode === 'programmer') {
            if (/^[0-9A-Fa-f]$/.test(key)) {
                e.preventDefault();
                ProgrammerEngine.inputDigit(key.toUpperCase());
            } else if (key === 'Enter' || key === '=') {
                e.preventDefault();
                ProgrammerEngine.calculate();
            } else if (key === 'Backspace') {
                e.preventDefault();
                ProgrammerEngine.backspace();
            } else if (key === 'Escape' || key === 'Delete') {
                e.preventDefault();
                ProgrammerEngine.clear();
            }
        }
    });
}
