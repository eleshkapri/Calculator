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
    }

    /**
     * Executes a unary scientific function on the active accumulator value.
     * @param {string} fn - Function identifier ('sqr', 'sqrt', 'fact', 'inv', 'abs', 'sin', 'cos', etc.).
     */
    inputFunc(fn) {
        this.playFeedback(550);
        const data = state.sci;
        if (!data) return;
        const cur = data.current;

        if (fn === 'sqr') {
            data.current = evaluateMath(`(${cur}) * (${cur})`, state.angleMode);
            data.expr = `sqr(${cur}) =`;
        } else if (fn === 'sqrt') {
            data.current = evaluateMath(`sqrt(${cur})`, state.angleMode);
            data.expr = `√(${cur}) =`;
        } else if (fn === 'fact') {
            data.current = factorial(parseInt(cur, 10)).toString();
            data.expr = `${cur}! =`;
        } else if (fn === 'inv') {
            data.current = evaluateMath(`1 / (${cur})`, state.angleMode);
            data.expr = `1/(${cur}) =`;
        } else if (fn === 'abs') {
            data.current = Math.abs(parseFloat(cur)).toString();
            data.expr = `|${cur}| =`;
        } else {
            // Trigonometric or Logarithmic function (sin, cos, tan, ln, log, exp)
            data.current = evaluateMath(`${fn}(${cur})`, state.angleMode);
            data.expr = `${fn}(${cur}) =`;
        }
        data.waitingForNewNumber = true;
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
