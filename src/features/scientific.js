/**
 * ============================================================================
 * CalVerse Pro - Scientific Calculator Feature (OOP Architecture)
 * File: src/features/scientific.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Object-oriented extension of StandardCalculator providing scientific, trigonometric,
 * and transcendental function operations:
 * 1. Scientific Operations: Square (x²), Square Root (√x), Factorial (n!),
 *    Multiplicative Inverse (1/x), and Absolute Value (|x|).
 * 2. Trigonometry & Logarithms: sin, cos, tan, asin, acos, atan, ln, log₁₀, exp.
 * 3. Angular Mode Toggle: Switches trigonometric calculations dynamically between
 *    Degrees (DEG) and Radians (RAD).
 * 
 * OOP PRINCIPLES:
 * 1. Inheritance: ScientificCalculator extends StandardCalculator, reusing arithmetic
 *    and memory registers while adding specialized functions.
 * 2. Polymorphism: Handles 'sci' state buffer and overrides keypad targets.
 * ============================================================================
 */

import { StandardCalculator } from './standard.js';
import { state } from '../core/state.js';
import { evaluateMath, factorial } from '../core/math.js';

export class ScientificCalculator extends StandardCalculator {
    constructor(id = 'scientific') {
        super(id);
        this.is2ndActive = false;
    }

    /**
     * Toggles 2nd alternate function keys (sin⁻¹, cos⁻¹, tan⁻¹, eˣ, 10ˣ, 2ˣ, ∛x, x³).
     */
    toggle2nd() {
        this.playFeedback(600);
        this.is2ndActive = !this.is2ndActive;

        const btn2nd = document.getElementById('sci2ndBtn');
        if (btn2nd) btn2nd.classList.toggle('active', this.is2ndActive);

        const btnSin = document.getElementById('btnSin');
        const btnCos = document.getElementById('btnCos');
        const btnTan = document.getElementById('btnTan');
        const btnLn = document.getElementById('btnLn');
        const btnLog = document.getElementById('btnLog');
        const btnLog2 = document.getElementById('btnLog2');
        const btnSqrt = document.getElementById('btnSqrt');
        const btnSqr = document.getElementById('btnSqr');
        const btnCeil = document.getElementById('btnCeil');
        const btnFloor = document.getElementById('btnFloor');
        const btnFrac = document.getElementById('btnFrac');
        const btnRound = document.getElementById('btnRound');

        if (this.is2ndActive) {
            if (btnSin) { btnSin.textContent = 'sin⁻¹'; btnSin.onclick = () => this.inputFunc('asin'); }
            if (btnCos) { btnCos.textContent = 'cos⁻¹'; btnCos.onclick = () => this.inputFunc('acos'); }
            if (btnTan) { btnTan.textContent = 'tan⁻¹'; btnTan.onclick = () => this.inputFunc('atan'); }
            if (btnLn) { btnLn.textContent = 'eˣ'; btnLn.onclick = () => this.inputFunc('exp'); }
            if (btnLog) { btnLog.textContent = '10ˣ'; btnLog.onclick = () => this.inputFunc('tenPow'); }
            if (btnLog2) { btnLog2.textContent = '2ˣ'; btnLog2.onclick = () => this.inputFunc('twoPow'); }
            if (btnSqrt) { btnSqrt.textContent = '∛x'; btnSqrt.onclick = () => this.inputFunc('cbrt'); }
            if (btnSqr) { btnSqr.textContent = 'x³'; btnSqr.onclick = () => this.inputFunc('cube'); }
            if (btnCeil) { btnCeil.textContent = '⌈x⌉'; btnCeil.title = 'Ceiling ⌈x⌉'; }
            if (btnFloor) { btnFloor.textContent = '⌊x⌋'; btnFloor.title = 'Floor ⌊x⌋'; }
            if (btnFrac) { btnFrac.textContent = 'dec'; btnFrac.title = 'Decimal Value (dec)'; }
            if (btnRound) { btnRound.textContent = 'trunc'; btnRound.title = 'Truncate (Integer Part)'; btnRound.onclick = () => this.inputFunc('trunc'); }
        } else {
            if (btnSin) { btnSin.textContent = 'sin'; btnSin.onclick = () => this.inputFunc('sin'); }
            if (btnCos) { btnCos.textContent = 'cos'; btnCos.onclick = () => this.inputFunc('cos'); }
            if (btnTan) { btnTan.textContent = 'tan'; btnTan.onclick = () => this.inputFunc('tan'); }
            if (btnLn) { btnLn.textContent = 'ln'; btnLn.onclick = () => this.inputFunc('ln'); }
            if (btnLog) { btnLog.textContent = 'log₁₀'; btnLog.onclick = () => this.inputFunc('log10'); }
            if (btnLog2) { btnLog2.textContent = 'log₂'; btnLog2.onclick = () => this.inputFunc('log2'); }
            if (btnSqrt) { btnSqrt.textContent = '√x'; btnSqrt.onclick = () => this.inputFunc('sqrt'); }
            if (btnSqr) { btnSqr.textContent = 'x²'; btnSqr.onclick = () => this.inputFunc('sqr'); }
            if (btnCeil) { btnCeil.textContent = 'ceil'; btnCeil.title = 'Ceiling Value (Smallest integer ≥ x)'; }
            if (btnFloor) { btnFloor.textContent = 'floor'; btnFloor.title = 'Floor Value (Greatest integer ≤ x)'; }
            if (btnFrac) { btnFrac.textContent = 'frac'; btnFrac.title = 'Decimal / Fractional Part (frac(x))'; }
            if (btnRound) { btnRound.textContent = 'round'; btnRound.title = 'Round to nearest integer'; btnRound.onclick = () => this.inputFunc('round'); }
        }
    }

    /**
     * Executes a scientific unary function or prepends prefix function into formula.
     * @param {string} fn - Function identifier ('ln', 'log10', 'log2', 'sin', 'cos', 'tan', 'sqrt', etc.).
     */
    inputFunc(fn) {
        this.playFeedback(550);
        const data = state.sci;
        if (!data) return;
        const cur = data.current;
        const num = parseFloat(cur);

        const symbols = {
            'ln': 'ln',
            'log': 'log₁₀',
            'log10': 'log₁₀',
            'log2': 'log₂',
            'sin': 'sin',
            'cos': 'cos',
            'tan': 'tan',
            'asin': 'sin⁻¹',
            'acos': 'cos⁻¹',
            'atan': 'tan⁻¹',
            'sqrt': '√',
            'cbrt': '∛',
            'sqr': 'sqr',
            'cube': 'cube',
            'fact': 'fact',
            'inv': '1/',
            'abs': 'abs',
            'exp': 'e^',
            'tenPow': '10^',
            'twoPow': '2^',
            'ceil': 'ceil',
            'floor': 'floor',
            'round': 'round',
            'frac': 'frac',
            'trunc': 'trunc'
        };

        const sym = symbols[fn] || fn;

        // If current display is 0 or waiting for a new number (or user has uncompleted open expression),
        // entering a function inserts it as a prefix function into the expression line:
        const isFreshOrZero = (cur === '0' || cur === 'Error' || data.waitingForNewNumber) && (!data.expr || !data.expr.endsWith('='));

        if (isFreshOrZero) {
            const prefix = (fn === 'log10') ? 'log' : fn;
            data.expr = (data.expr ? data.expr.trim() + ' ' : '') + `${prefix}(`;
            data.current = '0';
            data.waitingForNewNumber = false;
            this.updateDisplay('sci');
            return;
        }

        // Postfix mode: apply directly to active accumulator value
        let res;
        let exprLabel = `${sym}(${cur}) =`;

        if (fn === 'ln') {
            if (num <= 0) {
                data.current = 'Error';
                data.expr = `ln(${cur}) [x > 0]`;
                data.waitingForNewNumber = true;
                this.updateDisplay('sci');
                return;
            }
            res = Math.log(num);
        } else if (fn === 'log' || fn === 'log10') {
            if (num <= 0) {
                data.current = 'Error';
                data.expr = `log₁₀(${cur}) [x > 0]`;
                data.waitingForNewNumber = true;
                this.updateDisplay('sci');
                return;
            }
            res = Math.log10(num);
        } else if (fn === 'log2') {
            if (num <= 0) {
                data.current = 'Error';
                data.expr = `log₂(${cur}) [x > 0]`;
                data.waitingForNewNumber = true;
                this.updateDisplay('sci');
                return;
            }
            res = Math.log2(num);
        } else if (fn === 'sqr') {
            res = num * num;
            exprLabel = `sqr(${cur}) =`;
        } else if (fn === 'cube') {
            res = num * num * num;
            exprLabel = `cube(${cur}) =`;
        } else if (fn === 'sqrt') {
            if (num < 0) {
                data.current = 'Error';
                data.expr = `√(${cur}) [x ≥ 0]`;
                data.waitingForNewNumber = true;
                this.updateDisplay('sci');
                return;
            }
            res = Math.sqrt(num);
            exprLabel = `√(${cur}) =`;
        } else if (fn === 'cbrt') {
            res = Math.cbrt(num);
            exprLabel = `∛(${cur}) =`;
        } else if (fn === 'fact') {
            res = factorial(parseInt(cur, 10));
            exprLabel = `${cur}! =`;
        } else if (fn === 'inv') {
            if (num === 0) {
                data.current = 'Error';
                data.expr = `1/0 [Divide by 0]`;
                data.waitingForNewNumber = true;
                this.updateDisplay('sci');
                return;
            }
            res = 1 / num;
            exprLabel = `1/(${cur}) =`;
        } else if (fn === 'abs') {
            res = Math.abs(num);
            exprLabel = `|${cur}| =`;
        } else if (fn === 'exp') {
            res = Math.exp(num);
            exprLabel = `e^(${cur}) =`;
        } else if (fn === 'tenPow') {
            res = Math.pow(10, num);
            exprLabel = `10^(${cur}) =`;
        } else if (fn === 'twoPow') {
            res = Math.pow(2, num);
            exprLabel = `2^(${cur}) =`;
        } else if (fn === 'ceil') {
            res = Math.ceil(num);
            exprLabel = `ceil(${cur}) =`;
        } else if (fn === 'floor') {
            res = Math.floor(num);
            exprLabel = `floor(${cur}) =`;
        } else if (fn === 'round') {
            res = Math.round(num);
            exprLabel = `round(${cur}) =`;
        } else if (fn === 'frac') {
            // Decimal / Fractional Part (preserves precision without IEEE-754 floating point tails)
            const dec = num - Math.trunc(num);
            res = parseFloat(dec.toFixed(10));
            exprLabel = `frac(${cur}) =`;
        } else if (fn === 'trunc') {
            res = Math.trunc(num);
            exprLabel = `trunc(${cur}) =`;
        } else {
            // Trigonometry using evaluateMath for proper DEG/RAD handling
            const evalResult = evaluateMath(`${fn}(${cur})`, state.angleMode);
            if (evalResult === 'Error') {
                data.current = 'Error';
            } else {
                data.current = evalResult;
                data.expr = `${sym}(${cur}) =`;
                this.addHistory(`${sym}(${cur})`, evalResult);
            }
            data.waitingForNewNumber = true;
            this.updateDisplay('sci');
            return;
        }

        if (typeof res === 'number' && Number.isFinite(res)) {
            const formatted = parseFloat(res.toFixed(10)).toString();
            data.current = formatted;
            data.expr = exprLabel;
            this.addHistory(`${sym}(${cur})`, formatted);
            data.waitingForNewNumber = true;
        } else {
            data.current = 'Error';
            data.waitingForNewNumber = true;
        }

        this.updateDisplay('sci');
    }

    /**
     * Toggles trigonometric angle evaluation unit between Degrees (DEG) and Radians (RAD).
     */
    toggleAngleMode() {
        this.playFeedback(600);
        state.angleMode = state.angleMode === 'DEG' ? 'RAD' : 'DEG';
        const pill = document.getElementById('sciAngleMode');
        if (pill) pill.textContent = state.angleMode;
    }
}

/** Default singleton instance of ScientificCalculator */
export const ScientificEngine = new ScientificCalculator();

// Backward-compatible method exports
export const inputFunc = (fn) => ScientificEngine.inputFunc(fn);
export const toggleAngleMode = () => ScientificEngine.toggleAngleMode();
export const toggle2nd = () => ScientificEngine.toggle2nd();
