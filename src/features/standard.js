/**
 * ============================================================================
 * CalVerse Pro - Standard Arithmetic & Memory Engine
 * File: src/features/standard.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Powers everyday arithmetic, keypad input routing, memory register management
 * (MC, MR, MS, M+, M-), and calculation history for both Standard and Scientific
 * calculators.
 * 
 * FUNCTIONS PRESENT IN THIS FILE:
 * 1. updateDisplay(type):
 *    - Updates the primary output value, expression preview line, and memory badge indicator.
 * 
 * 2. inputVal(type, val):
 *    - Core keypad input processor. Handles chained operations, decimal points, constants (π, e),
 *      parentheses, and numbers.
 * 
 * 3. clear(type):
 *    - Resets expression and display buffer to '0'.
 * 
 * 4. backspace(type):
 *    - Deletes rightmost character from active display value.
 * 
 * 5. toggleSign(type):
 *    - Flips positive/negative sign of current accumulator value.
 * 
 * 6. calculate(type):
 *    - Evaluates complete arithmetic expression, records result in history, and updates UI.
 * 
 * 7. Memory Operations:
 *    - memClear(type): Resets memory register to 0.
 *    - memRecall(type): Recalls stored memory value into active display.
 *    - memStore(type): Stores current display value into memory register.
 *    - memAdd(type): Adds current display value to memory register.
 *    - memSub(type): Subtracts current display value from memory register.
 * 
 * 8. History Management:
 *    - addHistory(expr, result): Appends new calculation record to history list (max 50 records).
 *    - renderHistoryList(): Renders calculation history drawer DOM list with tap-to-reuse listeners.
 *    - clearHistory(): Purges calculation history from memory and persistent localStorage.
 * ============================================================================
 */

import { state } from '../core/state.js';
import { SoundFx } from '../core/sound.js';
import { evaluateMath } from '../core/math.js';
import { StorageEngine } from '../core/storage.js';
import { copyToClipboard } from '../core/dom.js';

/**
 * Synchronizes DOM display inputs and expression labels with state values.
 * 
 * @param {'std'|'sci'} type - Keypad type identifier ('std' for standard, 'sci' for scientific).
 */
export function updateDisplay(type) {
    const data = state[type];
    const dispElem = document.getElementById(`${type}Display`);
    const exprElem = document.getElementById(`${type}Expression`);
    const memElem = document.getElementById(`${type}MemoryIndicator`);

    if (dispElem) dispElem.value = data.current;
    if (exprElem) exprElem.textContent = data.expr;
    if (memElem) memElem.textContent = state.memory[type] !== 0 ? `M (${state.memory[type]})` : '';
}

/**
 * Handles numeric digit, arithmetic operator, parenthesis, and constant entries.
 * 
 * @param {'std'|'sci'} type - Calculator type ('std' or 'sci').
 * @param {string} val - Pressed key value (e.g. '7', '+', '.', 'π', 'e').
 */
export function inputVal(type, val) {
    SoundFx.playClick(500);
    const data = state[type];

    // If the expression was just evaluated (contains '='):
    if (data.expr && data.expr.includes('=')) {
        if (['+', '−', '×', '÷', '^', '%'].includes(val)) {
            // Operator after equals: chain forward using previous computed answer
            if (data.current === 'Error') data.current = '0';
            data.expr = `${data.current} ${val} `;
            data.waitingForNewNumber = true;
            updateDisplay(type);
            return;
        } else {
            // New digit or constant after equals: reset expression line
            data.expr = '';
            if (val === '.') {
                data.current = '0.';
                data.waitingForNewNumber = false;
                updateDisplay(type);
                return;
            }
        }
    }

    if (['+', '−', '×', '÷', '^', '%'].includes(val)) {
        if (data.current === 'Error') data.current = '0';
        data.expr += `${data.current} ${val} `;
        data.current = '0';
        data.waitingForNewNumber = true;
    } else if (val === '(' || val === ')') {
        data.expr += val;
    } else if (val === '.') {
        if (data.waitingForNewNumber) {
            data.current = '0.';
            data.waitingForNewNumber = false;
        } else if (!data.current.includes('.')) {
            data.current += '.';
        }
    } else if (val === 'π') {
        data.current = Math.PI.toString();
        data.waitingForNewNumber = true;
    } else if (val === 'e') {
        data.current = Math.E.toString();
        data.waitingForNewNumber = true;
    } else {
        // Numeric digit 0-9
        if (data.current === '0' || data.waitingForNewNumber) {
            data.current = val;
            data.waitingForNewNumber = false;
        } else {
            data.current += val;
        }
    }
    updateDisplay(type);
}

/**
 * Resets the calculator's expression buffer and active display value back to 0.
 * 
 * @param {'std'|'sci'} type - Calculator type identifier.
 */
export function clear(type) {
    SoundFx.playClick(450);
    state[type].expr = '';
    state[type].current = '0';
    state[type].waitingForNewNumber = false;
    updateDisplay(type);
}

/**
 * Removes the trailing character from the current display value.
 * 
 * @param {'std'|'sci'} type - Calculator type identifier.
 */
export function backspace(type) {
    SoundFx.playClick(480);
    const data = state[type];
    if (data.expr && data.expr.includes('=')) {
        data.expr = '';
    }
    if (data.current.length > 1 && data.current !== 'Error') {
        data.current = data.current.slice(0, -1);
    } else {
        data.current = '0';
    }
    updateDisplay(type);
}

/**
 * Toggles the negative/positive algebraic sign of the current active number.
 * 
 * @param {'std'|'sci'} type - Calculator type identifier.
 */
export function toggleSign(type) {
    SoundFx.playClick(500);
    const data = state[type];
    if (data.current !== '0' && data.current !== 'Error') {
        data.current = (parseFloat(data.current) * -1).toString();
        updateDisplay(type);
    }
}

/**
 * Evaluates the complete accumulated mathematical expression and stores the calculation in history.
 * 
 * @param {'std'|'sci'} type - Calculator type identifier.
 */
export function calculate(type) {
    SoundFx.playClick(850, 'triangle', 0.05);
    const data = state[type];

    // Avoid duplicate evaluation if already computed
    if (!data.expr && (data.current === '0' || data.current === 'Error' || data.current === '')) return;
    if (data.expr.endsWith('=')) return;

    const fullExpr = (data.expr + data.current).trim();
    const res = evaluateMath(fullExpr, state.angleMode);

    if (res !== 'Error') {
        addHistory(fullExpr, res);
        data.expr = `${fullExpr} =`;
        data.current = res;
        data.waitingForNewNumber = true;
    } else {
        data.current = 'Error';
        data.waitingForNewNumber = true;
    }
    updateDisplay(type);
}

// =============================================================================
// Memory Register Operations (MC, MR, MS, M+, M-)
// =============================================================================

/** Clears the memory register (MC) */
export function memClear(type) { state.memory[type] = 0; updateDisplay(type); }
/** Recalls the stored memory register value into the active display (MR) */
export function memRecall(type) { state[type].current = state.memory[type].toString(); state[type].waitingForNewNumber = true; updateDisplay(type); }
/** Stores current display value into memory register (MS) */
export function memStore(type) { state.memory[type] = parseFloat(state[type].current) || 0; updateDisplay(type); }
/** Adds current display value to memory register (M+) */
export function memAdd(type) { state.memory[type] += parseFloat(state[type].current) || 0; updateDisplay(type); }
/** Subtracts current display value from memory register (M-) */
export function memSub(type) { state.memory[type] -= parseFloat(state[type].current) || 0; updateDisplay(type); }

// =============================================================================
// Calculation History Management
// =============================================================================

/**
 * Appends a successful calculation entry to history and saves to localStorage.
 * 
 * @param {string} expr - Mathematical formula string.
 * @param {string} result - Calculated answer string.
 */
export function addHistory(expr, result) {
    state.history.unshift({ expr, result, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    if (state.history.length > 50) state.history.pop();
    StorageEngine.saveHistory(state.history);
    renderHistoryList();
}

/**
 * Renders calculation history list items inside the slide-out history drawer.
 * Attaches click-to-load listeners that populate the result back into the display.
 */
export function renderHistoryList() {
    const list = document.getElementById('historyList');
    const count = document.getElementById('historyCount');
    if (!list) return;

    if (count) count.textContent = state.history.length;
    if (state.history.length === 0) {
        list.innerHTML = '<div class="empty-history">No calculations recorded yet</div>';
        return;
    }

    list.innerHTML = state.history.map((item, idx) => `
        <div class="history-item" data-index="${idx}">
            <div class="hist-exp">${item.expr} =</div>
            <div class="hist-res">${item.result}</div>
        </div>
    `).join('');

    list.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.index, 10);
            const record = state.history[idx];
            if (record) {
                state[state.currentMode].current = record.result;
                updateDisplay(state.currentMode);
                copyToClipboard(record.result);
            }
        });
    });
}

/**
 * Purges all historical calculations from the drawer and persistent local storage.
 */
export function clearHistory() {
    state.history = [];
    StorageEngine.clearHistory();
    renderHistoryList();
}
