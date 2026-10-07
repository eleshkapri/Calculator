/**
 * ============================================================================
 * CalVerse Pro - Standard Arithmetic & Memory Engine (OOP Architecture)
 * File: src/features/standard.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Object-oriented arithmetic engine providing standard mathematical calculation,
 * keypad input processing, memory register manipulation (MC, MR, MS, M+, M-),
 * and XSS-hardened calculation history management.
 * 
 * OOP PRINCIPLES:
 * 1. Inheritance: StandardCalculator inherits from BaseCalculator.
 * 2. Encapsulation: Input handling, memory state, and history synchronization
 *    are encapsulated within methods of StandardCalculator.
 * 3. Polymorphism: Implements standard BaseCalculator lifecycle hooks.
 * 4. Security: Employs escapeHtml() on all rendered history entries to prevent XSS.
 * ============================================================================
 */

import { BaseCalculator } from './base.js';
import { state } from '../core/state.js';
import { SoundFx } from '../core/sound.js';
import { evaluateMath } from '../core/math.js';
import { StorageEngine } from '../core/storage.js';
import { copyToClipboard, escapeHtml } from '../core/dom.js';

export class StandardCalculator extends BaseCalculator {
    constructor(id = 'standard') {
        super(id);
    }

    /**
     * Synchronizes DOM display inputs and expression labels with state values.
     * @param {'std'|'sci'} [type='std']
     */
    updateDisplay(type = 'std') {
        const data = state[type];
        if (!data) return;

        const dispElem = document.getElementById(`${type}Display`);
        const exprElem = document.getElementById(`${type}Expression`);
        const memElem = document.getElementById(`${type}MemoryIndicator`);

        if (dispElem) dispElem.value = data.current;
        if (exprElem) exprElem.textContent = data.expr;
        if (memElem) memElem.textContent = state.memory[type] !== 0 ? `M (${state.memory[type]})` : '';
    }

    /**
     * Handles numeric digit, arithmetic operator, parenthesis, and constant entries.
     * @param {'std'|'sci'} type 
     * @param {string} val 
     */
    inputVal(type, val) {
        this.playFeedback(500);
        const data = state[type];
        if (!data) return;

        // If the expression was just evaluated (contains '='):
        if (data.expr && data.expr.includes('=')) {
            if (['+', '−', '×', '÷', '^', '%'].includes(val)) {
                // Operator after equals: chain forward using previous computed answer
                if (data.current === 'Error') data.current = '0';
                data.expr = `${data.current} ${val} `;
                data.waitingForNewNumber = true;
                this.updateDisplay(type);
                return;
            } else {
                // New digit or constant after equals: reset expression line
                data.expr = '';
                if (val === '.') {
                    data.current = '0.';
                    data.waitingForNewNumber = false;
                    this.updateDisplay(type);
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
        this.updateDisplay(type);
    }

    /**
     * Resets expression buffer and active display value back to 0.
     * @param {'std'|'sci'} [type='std']
     */
    clear(type = 'std') {
        this.playFeedback(450);
        if (state[type]) {
            state[type].expr = '';
            state[type].current = '0';
            state[type].waitingForNewNumber = false;
            this.updateDisplay(type);
        }
    }

    /**
     * Removes trailing character from the current display value.
     * @param {'std'|'sci'} [type='std']
     */
    backspace(type = 'std') {
        this.playFeedback(480);
        const data = state[type];
        if (!data) return;

        if (data.expr && data.expr.includes('=')) {
            data.expr = '';
        }
        if (data.current.length > 1 && data.current !== 'Error') {
            data.current = data.current.slice(0, -1);
        } else {
            data.current = '0';
        }
        this.updateDisplay(type);
    }

    /**
     * Toggles algebraic sign (+/-) of current accumulator value.
     * @param {'std'|'sci'} [type='std']
     */
    toggleSign(type = 'std') {
        this.playFeedback(500);
        const data = state[type];
        if (!data) return;

        if (data.current !== '0' && data.current !== 'Error') {
            data.current = (parseFloat(data.current) * -1).toString();
            this.updateDisplay(type);
        }
    }

    /**
     * Evaluates the complete accumulated mathematical expression and records history.
     * @param {'std'|'sci'} [type='std']
     */
    calculate(type = 'std') {
        this.playFeedback(850, 'triangle', 0.05);
        const data = state[type];
        if (!data) return;

        // Avoid duplicate evaluation if already computed
        if (!data.expr && (data.current === '0' || data.current === 'Error' || data.current === '')) return;
        if (data.expr.endsWith('=')) return;

        const fullExpr = (data.expr + data.current).trim();
        const res = evaluateMath(fullExpr, state.angleMode);

        if (res !== 'Error') {
            this.addHistory(fullExpr, res);
            data.expr = `${fullExpr} =`;
            data.current = res;
            data.waitingForNewNumber = true;
        } else {
            data.current = 'Error';
            data.waitingForNewNumber = true;
        }
        this.updateDisplay(type);
    }

    // --- Memory Register Operations ---
    memClear(type = 'std') {
        if (state.memory) state.memory[type] = 0;
        this.updateDisplay(type);
    }

    memRecall(type = 'std') {
        if (state.memory && state[type]) {
            state[type].current = state.memory[type].toString();
            state[type].waitingForNewNumber = true;
            this.updateDisplay(type);
        }
    }

    memStore(type = 'std') {
        if (state.memory && state[type]) {
            state.memory[type] = parseFloat(state[type].current) || 0;
            this.updateDisplay(type);
        }
    }

    memAdd(type = 'std') {
        if (state.memory && state[type]) {
            state.memory[type] += parseFloat(state[type].current) || 0;
            this.updateDisplay(type);
        }
    }

    memSub(type = 'std') {
        if (state.memory && state[type]) {
            state.memory[type] -= parseFloat(state[type].current) || 0;
            this.updateDisplay(type);
        }
    }

    // --- History Management (XSS Protected) ---
    addHistory(expr, result) {
        state.history.unshift({
            expr,
            result,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        if (state.history.length > 50) state.history.pop();
        StorageEngine.saveHistory(state.history);
        this.renderHistoryList();
    }

    renderHistoryList() {
        const list = document.getElementById('historyList');
        const count = document.getElementById('historyCount');
        if (!list) return;

        if (count) count.textContent = state.history.length;
        if (state.history.length === 0) {
            list.innerHTML = '<div class="empty-history">No calculations recorded yet</div>';
            return;
        }

        // Hardened rendering with escapeHtml to prevent DOM XSS injection
        list.innerHTML = state.history.map((item, idx) => `
            <div class="history-item" data-index="${idx}">
                <div class="hist-exp">${escapeHtml(item.expr)} =</div>
                <div class="hist-res">${escapeHtml(item.result)}</div>
            </div>
        `).join('');

        list.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.dataset.index, 10);
                const record = state.history[idx];
                if (record && state[state.currentMode]) {
                    state[state.currentMode].current = record.result;
                    this.updateDisplay(state.currentMode);
                    copyToClipboard(record.result);
                }
            });
        });
    }

    clearHistory() {
        state.history = [];
        StorageEngine.clearHistory();
        this.renderHistoryList();
    }
}

/** Default singleton instance of StandardCalculator */
export const StandardEngine = new StandardCalculator();

// Backward-compatible method exports
export const updateDisplay = (type) => StandardEngine.updateDisplay(type);
export const inputVal = (type, val) => StandardEngine.inputVal(type, val);
export const clear = (type) => StandardEngine.clear(type);
export const backspace = (type) => StandardEngine.backspace(type);
export const toggleSign = (type) => StandardEngine.toggleSign(type);
export const calculate = (type) => StandardEngine.calculate(type);
export const memClear = (type) => StandardEngine.memClear(type);
export const memRecall = (type) => StandardEngine.memRecall(type);
export const memStore = (type) => StandardEngine.memStore(type);
export const memAdd = (type) => StandardEngine.memAdd(type);
export const memSub = (type) => StandardEngine.memSub(type);
export const addHistory = (expr, res) => StandardEngine.addHistory(expr, res);
export const renderHistoryList = () => StandardEngine.renderHistoryList();
export const clearHistory = () => StandardEngine.clearHistory();
