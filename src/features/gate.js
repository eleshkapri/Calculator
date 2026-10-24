/**
 * ============================================================================
 * CalVerse Pro - GATE Virtual Calculator (TCS iON Examination Engine)
 * File: src/features/gate.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Official replication of the TCS iON Scientific Calculator used in the Graduate
 * Aptitude Test in Engineering (GATE) examination.
 * 
 * FEATURES:
 * 1. 1:1 Authentic Visual Layout:
 *    - Blue window header with "Scientific Calculator", Help pill, and window controls.
 *    - Dual displays: Upper formula/expression line & Lower active result screen.
 *    - 11-column scientific keypad (6-col scientific functions + 5-col numpad).
 * 2. Complete Scientific Capabilities:
 *    - Hyperbolics: sinh, cosh, tanh, sinh⁻¹, cosh⁻¹, tanh⁻¹
 *    - Trigonometry: sin, cos, tan, sin⁻¹, cos⁻¹, tan⁻¹ with DEG/RAD toggles
 *    - Logarithms: ln, log (base 10), log₂x (base 2), logyx (base y)
 *    - Exponentials: eˣ, 10ˣ, Exp (scientific notation)
 *    - Powers & Roots: x², x³, xʸ, √x, ³√x, ʸ√x
 *    - Operators & Constants: n!, |x|, 1/x, mod, π, e, (), +, -, *, /, %
 * 3. Memory Registers:
 *    - MC (Clear), MR (Recall), MS (Store), M+ (Add), M- (Subtract).
 * 4. Cross-Platform Responsiveness:
 *    - Desktop / Laptop: Exact 11-column TCS iON replica.
 *    - Phone / Tablet: Adaptive touch-friendly layout with quick mode toggles.
 * ============================================================================
 */

import { BaseCalculator } from './base.js';
import { state } from '../core/state.js';
import { evaluateMath, factorial } from '../core/math.js';
import { showToast } from '../core/dom.js';

export class GateCalculator extends BaseCalculator {
    constructor(id = 'gate') {
        super(id);
    }

    /**
     * Updates dual display boxes, memory indicator, and angle radio buttons.
     */
    updateDisplay() {
        const data = state.gate;
        if (!data || typeof document === 'undefined') return;

        const exprElem = document.getElementById('gateExpr');
        const dispElem = document.getElementById('gateDisplay');
        const memElem = document.getElementById('gateMemoryIndicator');
        const degRadio = document.getElementById('gateRadioDeg');
        const radRadio = document.getElementById('gateRadioRad');

        if (exprElem) exprElem.value = data.expr || '';
        if (dispElem) dispElem.value = data.current || '0';

        const hasMem = (state.memory && state.memory.gate !== 0);
        if (memElem) {
            memElem.textContent = hasMem ? `M (${state.memory.gate})` : '';
            memElem.classList.toggle('active', hasMem);
        }

        const isDeg = (data.angleMode || 'DEG') === 'DEG';
        if (degRadio) degRadio.checked = isDeg;
        if (radRadio) radRadio.checked = !isDeg;
    }

    /**
     * Sets the trigonometric angle mode ('DEG' or 'RAD').
     * @param {'DEG'|'RAD'} mode 
     */
    setAngleMode(mode) {
        this.playFeedback(550);
        if (!state.gate) return;
        state.gate.angleMode = mode;
        this.updateDisplay();
        showToast(`GATE Calculator Angle Mode: ${mode}`);
    }

    /**
     * Inputs a digit, decimal point, basic operator, parenthesis, or constant.
     * @param {string} val 
     */
    inputVal(val) {
        this.playFeedback(500);
        const data = state.gate;
        if (!data) return;

        // If expression was just evaluated (contains '='):
        if (data.expr && data.expr.includes('=')) {
            if (['+', '-', '*', '/', '%', '^'].includes(val)) {
                if (data.current === 'Error') data.current = '0';
                data.expr = `${data.current} ${val} `;
                data.waitingForNewNumber = true;
                this.updateDisplay();
                return;
            } else {
                data.expr = '';
                if (val === '.') {
                    data.current = '0.';
                    data.waitingForNewNumber = false;
                    this.updateDisplay();
                    return;
                }
            }
        }

        // Basic arithmetic operators (+, -, *, /, %)
        if (['+', '-', '*', '/', '%'].includes(val)) {
            if (data.current === 'Error') data.current = '0';
            if (data.waitingForNewNumber && data.expr.trim().endsWith(')')) {
                data.expr = data.expr.trim() + ` ${val} `;
            } else {
                data.expr += `${data.current} ${val} `;
                data.current = '0';
            }
            data.waitingForNewNumber = true;
        } else if (val === 'mod') {
            if (data.current === 'Error') data.current = '0';
            data.expr += `${data.current} mod `;
            data.current = '0';
            data.waitingForNewNumber = true;
        } else if (val === 'Exp') {
            // Scientific exponent notation
            if (!data.current.includes('e+') && !data.current.includes('e-')) {
                data.current += 'e+';
                data.waitingForNewNumber = false;
            }
        } else if (val === '(' || val === ')') {
            if (val === '(') {
                const expr = data.expr || '';
                data.expr += (expr && !expr.endsWith(' ') ? ' ' : '') + '(';
                data.waitingForNewNumber = true;
            } else {
                data.expr += `${data.current}) `;
                data.current = '0';
                data.waitingForNewNumber = true;
            }
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

        this.updateDisplay();
    }

    /**
     * Executes scientific unary and binary operations matching the TCS iON GATE layout.
     * @param {string} fn 
     */
    inputFunc(fn) {
        this.playFeedback(550);
        const data = state.gate;
        if (!data) return;

        const cur = data.current;
        const num = parseFloat(cur);
        const angleMode = data.angleMode || 'DEG';

        // Binary functions that require a second operand:
        if (fn === 'pow') {
            // xʸ
            data.expr += `${cur} ^ `;
            data.current = '0';
            data.waitingForNewNumber = true;
            this.updateDisplay();
            return;
        }

        if (fn === 'logyx') {
            // log_y(x) -> in TCS iON, inputs log(base, value)
            data.expr += `log(${cur}, `;
            data.current = '0';
            data.waitingForNewNumber = true;
            this.updateDisplay();
            return;
        }

        if (fn === 'yroot') {
            // ʸ√x -> x ** (1/y)
            data.expr += `${cur} ^ (1 / `;
            data.current = '0';
            data.waitingForNewNumber = true;
            this.updateDisplay();
            return;
        }

        // Unary functions applied immediately to the active operand or prefix formula:
        const isFreshOrZero = (cur === '0' || cur === 'Error' || data.waitingForNewNumber) && (!data.expr || !data.expr.endsWith('='));

        if (isFreshOrZero) {
            const prefixMap = {
                'sin': 'sin', 'cos': 'cos', 'tan': 'tan',
                'asin': 'asin', 'acos': 'acos', 'atan': 'atan',
                'sinh': 'sinh', 'cosh': 'cosh', 'tanh': 'tanh',
                'asinh': 'asinh', 'acosh': 'acosh', 'atanh': 'atanh',
                'ln': 'ln', 'log': 'log', 'log2': 'log2',
                'sqrt': 'sqrt', 'cbrt': 'cbrt', 'abs': 'abs'
            };
            const p = prefixMap[fn] || fn;
            data.expr = (data.expr ? data.expr.trim() + ' ' : '') + `${p}(`;
            data.current = '0';
            data.waitingForNewNumber = false;
            this.updateDisplay();
            return;
        }

        // Postfix immediate evaluation on active number:
        let res;
        let exprLabel = '';

        switch (fn) {
            case 'sinh':
                res = Math.sinh(num);
                exprLabel = `sinh(${cur})`;
                break;
            case 'cosh':
                res = Math.cosh(num);
                exprLabel = `cosh(${cur})`;
                break;
            case 'tanh':
                res = Math.tanh(num);
                exprLabel = `tanh(${cur})`;
                break;
            case 'asinh':
                res = Math.asinh(num);
                exprLabel = `sinh⁻¹(${cur})`;
                break;
            case 'acosh':
                if (num < 1) {
                    this.#showGateError(`cosh⁻¹(${cur}) requires x ≥ 1`);
                    return;
                }
                res = Math.acosh(num);
                exprLabel = `cosh⁻¹(${cur})`;
                break;
            case 'atanh':
                if (Math.abs(num) >= 1) {
                    this.#showGateError(`tanh⁻¹(${cur}) requires |x| < 1`);
                    return;
                }
                res = Math.atanh(num);
                exprLabel = `tanh⁻¹(${cur})`;
                break;
            case 'sin':
                res = (angleMode === 'DEG') ? Math.sin(num * Math.PI / 180) : Math.sin(num);
                exprLabel = `sin(${cur})`;
                break;
            case 'cos':
                res = (angleMode === 'DEG') ? Math.cos(num * Math.PI / 180) : Math.cos(num);
                exprLabel = `cos(${cur})`;
                break;
            case 'tan':
                res = (angleMode === 'DEG') ? Math.tan(num * Math.PI / 180) : Math.tan(num);
                exprLabel = `tan(${cur})`;
                break;
            case 'asin':
                if (num < -1 || num > 1) {
                    this.#showGateError(`sin⁻¹(${cur}) requires -1 ≤ x ≤ 1`);
                    return;
                }
                res = (angleMode === 'DEG') ? Math.asin(num) * 180 / Math.PI : Math.asin(num);
                exprLabel = `sin⁻¹(${cur})`;
                break;
            case 'acos':
                if (num < -1 || num > 1) {
                    this.#showGateError(`cos⁻¹(${cur}) requires -1 ≤ x ≤ 1`);
                    return;
                }
                res = (angleMode === 'DEG') ? Math.acos(num) * 180 / Math.PI : Math.acos(num);
                exprLabel = `cos⁻¹(${cur})`;
                break;
            case 'atan':
                res = (angleMode === 'DEG') ? Math.atan(num) * 180 / Math.PI : Math.atan(num);
                exprLabel = `tan⁻¹(${cur})`;
                break;
            case 'ln':
                if (num <= 0) {
                    this.#showGateError(`ln(${cur}) requires x > 0`);
                    return;
                }
                res = Math.log(num);
                exprLabel = `ln(${cur})`;
                break;
            case 'log':
                if (num <= 0) {
                    this.#showGateError(`log(${cur}) requires x > 0`);
                    return;
                }
                res = Math.log10(num);
                exprLabel = `log(${cur})`;
                break;
            case 'log2':
                if (num <= 0) {
                    this.#showGateError(`log₂(${cur}) requires x > 0`);
                    return;
                }
                res = Math.log2(num);
                exprLabel = `log₂(${cur})`;
                break;
            case 'exp':
                res = Math.exp(num);
                exprLabel = `e^(${cur})`;
                break;
            case 'tenPow':
                res = Math.pow(10, num);
                exprLabel = `10^(${cur})`;
                break;
            case 'sqr':
                res = num * num;
                exprLabel = `sqr(${cur})`;
                break;
            case 'cube':
                res = num * num * num;
                exprLabel = `cube(${cur})`;
                break;
            case 'sqrt':
                if (num < 0) {
                    this.#showGateError(`√(${cur}) requires x ≥ 0`);
                    return;
                }
                res = Math.sqrt(num);
                exprLabel = `√(${cur})`;
                break;
            case 'cbrt':
                res = Math.cbrt(num);
                exprLabel = `³√(${cur})`;
                break;
            case 'fact':
                if (num < 0 || !Number.isInteger(num)) {
                    this.#showGateError(`n! requires non-negative integer`);
                    return;
                }
                res = factorial(num);
                exprLabel = `${cur}!`;
                break;
            case 'inv':
                if (num === 0) {
                    this.#showGateError(`Cannot divide by zero`);
                    return;
                }
                res = 1 / num;
                exprLabel = `1/(${cur})`;
                break;
            case 'abs':
                res = Math.abs(num);
                exprLabel = `|${cur}|`;
                break;
            default:
                return;
        }

        if (Number.isFinite(res)) {
            // Clean IEEE-754 precision to 10 decimal digits
            const formatted = Math.abs(res) < 1e-12 ? '0' : String(parseFloat(res.toPrecision(12)));
            data.current = formatted;
            data.expr = `${exprLabel} =`;
            data.waitingForNewNumber = true;
        } else {
            data.current = 'Error';
            data.waitingForNewNumber = true;
        }

        this.updateDisplay();
    }

    #showGateError(msg) {
        if (!state.gate) return;
        state.gate.current = 'Error';
        state.gate.expr = msg;
        state.gate.waitingForNewNumber = true;
        this.updateDisplay();
        showToast(msg);
    }

    /**
     * Toggles negative sign on the current operand.
     */
    toggleSign() {
        this.playFeedback(500);
        const data = state.gate;
        if (!data) return;

        if (data.current === '0' || data.current === 'Error') return;
        if (data.current.startsWith('-')) {
            data.current = data.current.substring(1);
        } else {
            data.current = '-' + data.current;
        }
        this.updateDisplay();
    }

    /**
     * Clears all inputs and resets displays back to initial state.
     */
    clear() {
        this.playFeedback(450);
        if (!state.gate) return;
        state.gate.expr = '';
        state.gate.current = '0';
        state.gate.waitingForNewNumber = false;
        this.updateDisplay();
    }

    /**
     * Deletes the trailing character from the current input box.
     */
    backspace() {
        this.playFeedback(480);
        const data = state.gate;
        if (!data) return;

        if (data.expr && data.expr.includes('=')) {
            data.expr = '';
            data.current = '0';
            this.updateDisplay();
            return;
        }

        if (data.current.length > 1 && data.current !== 'Error') {
            data.current = data.current.slice(0, -1);
        } else {
            data.current = '0';
        }
        this.updateDisplay();
    }

    /**
     * Evaluates the full mathematical expression entered in the GATE calculator.
     */
    calculate() {
        this.playFeedback(700);
        const data = state.gate;
        if (!data) return;

        let fullExpression = data.expr || '';

        // If expression is empty or already evaluated, nothing to evaluate
        if (!fullExpression && data.current) {
            return;
        }

        if (fullExpression.includes('=')) {
            return;
        }

        // Auto-close open parentheses
        const openParens = (fullExpression.match(/\(/g) || []).length;
        const closeParens = (fullExpression.match(/\)/g) || []).length;
        if (openParens > closeParens) {
            fullExpression += data.current + ')'.repeat(openParens - closeParens);
        } else if (!data.waitingForNewNumber) {
            fullExpression += data.current;
        }

        const angleMode = data.angleMode || 'DEG';
        const result = evaluateMath(fullExpression, angleMode);

        data.expr = `${fullExpression} =`;
        data.current = result;
        data.waitingForNewNumber = true;

        this.updateDisplay();
    }

    // --- Memory Key Handlers ---
    memClear() {
        this.playFeedback(500);
        if (state.memory) state.memory.gate = 0;
        this.updateDisplay();
        showToast('GATE Memory Cleared (MC)');
    }

    memRecall() {
        this.playFeedback(500);
        const mem = (state.memory && state.memory.gate) ? state.memory.gate : 0;
        if (state.gate) {
            state.gate.current = String(mem);
            state.gate.waitingForNewNumber = true;
            this.updateDisplay();
        }
        showToast(`GATE Memory Recalled: ${mem}`);
    }

    memStore() {
        this.playFeedback(500);
        const val = parseFloat(state.gate?.current || '0');
        if (!Number.isNaN(val) && state.memory) {
            state.memory.gate = val;
            this.updateDisplay();
            showToast(`Stored in Memory (MS): ${val}`);
        }
    }

    memAdd() {
        this.playFeedback(500);
        const val = parseFloat(state.gate?.current || '0');
        if (!Number.isNaN(val) && state.memory) {
            state.memory.gate = (state.memory.gate || 0) + val;
            this.updateDisplay();
            showToast(`Added to Memory (M+): ${state.memory.gate}`);
        }
    }

    memSub() {
        this.playFeedback(500);
        const val = parseFloat(state.gate?.current || '0');
        if (!Number.isNaN(val) && state.memory) {
            state.memory.gate = (state.memory.gate || 0) - val;
            this.updateDisplay();
            showToast(`Subtracted from Memory (M-): ${state.memory.gate}`);
        }
    }

    /**
     * Opens the official GATE Virtual Calculator Instructions modal.
     */
    openHelp() {
        this.playFeedback(600);
        const modal = document.getElementById('gateHelpModal');
        if (modal) modal.classList.add('open');
    }

    /**
     * Closes the official GATE Virtual Calculator Instructions modal.
     */
    closeHelp() {
        this.playFeedback(450);
        const modal = document.getElementById('gateHelpModal');
        if (modal) modal.classList.remove('open');
    }
    /**
     * Toggles between mobile stacked layout and 11-column exam replica layout on phones.
     * @param {'adaptive'|'exam'} mode 
     */
    setMobileLayout(mode) {
        this.playFeedback(500);
        const container = document.getElementById('gateKeypadContainer');
        const pillAdaptive = document.getElementById('gateModeAdaptive');
        const pillExam = document.getElementById('gateModeExam');

        if (container) {
            container.classList.toggle('gate-exam-view', mode === 'exam');
            container.classList.toggle('gate-adaptive-view', mode === 'adaptive');
        }
        if (pillAdaptive) pillAdaptive.classList.toggle('active', mode === 'adaptive');
        if (pillExam) pillExam.classList.toggle('active', mode === 'exam');
    }
}

export const GateEngine = new GateCalculator();
