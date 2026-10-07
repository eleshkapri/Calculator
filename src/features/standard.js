/**
 * CalVerse Pro - Standard Calculator Feature
 * Core 4-operation arithmetic, memory registers & calculation history
 */

import { state } from '../core/state.js';
import { SoundFx } from '../core/sound.js';
import { evaluateMath } from '../core/math.js';
import { StorageEngine } from '../core/storage.js';
import { copyToClipboard } from '../core/dom.js';

export function updateDisplay(type) {
    const data = state[type];
    const dispElem = document.getElementById(`${type}Display`);
    const exprElem = document.getElementById(`${type}Expression`);
    const memElem = document.getElementById(`${type}MemoryIndicator`);

    if (dispElem) dispElem.value = data.current;
    if (exprElem) exprElem.textContent = data.expr;
    if (memElem) memElem.textContent = state.memory[type] !== 0 ? `M (${state.memory[type]})` : '';
}

export function inputVal(type, val) {
    SoundFx.playClick(500);
    const data = state[type];

    // If the expression was just evaluated (contains '='):
    if (data.expr && data.expr.includes('=')) {
        if (['+', '−', '×', '÷', '^', '%'].includes(val)) {
            // Operator after equals: chain on previous answer
            if (data.current === 'Error') data.current = '0';
            data.expr = `${data.current} ${val} `;
            data.waitingForNewNumber = true;
            updateDisplay(type);
            return;
        } else {
            // New digit or function after equals: clear expression line
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
        // Number
        if (data.current === '0' || data.waitingForNewNumber) {
            data.current = val;
            data.waitingForNewNumber = false;
        } else {
            data.current += val;
        }
    }
    updateDisplay(type);
}

export function clear(type) {
    SoundFx.playClick(450);
    state[type].expr = '';
    state[type].current = '0';
    state[type].waitingForNewNumber = false;
    updateDisplay(type);
}

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

export function toggleSign(type) {
    SoundFx.playClick(500);
    const data = state[type];
    if (data.current !== '0' && data.current !== 'Error') {
        data.current = (parseFloat(data.current) * -1).toString();
        updateDisplay(type);
    }
}

export function calculate(type) {
    SoundFx.playClick(850, 'triangle', 0.05);
    const data = state[type];

    // If empty or already calculated with '=', prevent repeating
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

// Memory registers
export function memClear(type) { state.memory[type] = 0; updateDisplay(type); }
export function memRecall(type) { state[type].current = state.memory[type].toString(); state[type].waitingForNewNumber = true; updateDisplay(type); }
export function memStore(type) { state.memory[type] = parseFloat(state[type].current) || 0; updateDisplay(type); }
export function memAdd(type) { state.memory[type] += parseFloat(state[type].current) || 0; updateDisplay(type); }
export function memSub(type) { state.memory[type] -= parseFloat(state[type].current) || 0; updateDisplay(type); }

// History storage & rendering
export function addHistory(expr, result) {
    state.history.unshift({ expr, result, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    if (state.history.length > 50) state.history.pop();
    StorageEngine.saveHistory(state.history);
    renderHistoryList();
}

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

export function clearHistory() {
    state.history = [];
    StorageEngine.clearHistory();
    renderHistoryList();
}
