/**
 * CalVerse Pro - Keyboard Shortcuts Controller
 * Global physical and virtual keyboard event routing
 */

import { state } from '../core/state.js';
import { inputVal, calculate, backspace, clear } from '../features/standard/standard.js';
import { GraphEngine } from '../features/graphing/graphing.js';
import { ProgrammerEngine } from '../features/programmer/programmer.js';

export function initKeyboard() {
    window.addEventListener('keydown', (e) => {
        // Ignore when focused in text/number input
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            if (e.key === 'Enter' && state.currentMode === 'graphing') {
                GraphEngine.render();
            }
            return;
        }

        const key = e.key;

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
        } else if (state.currentMode === 'programmer') {
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
