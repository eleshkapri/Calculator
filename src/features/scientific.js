/**
 * ============================================================================
 * CalVerse Pro - Scientific Calculator Feature
 * File: src/features/scientific.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Extends basic arithmetic with scientific and transcendental functions:
 * 1. Scientific Operations: Square (x²), Square Root (√x), Factorial (n!),
 *    Multiplicative Inverse (1/x), and Absolute Value (|x|).
 * 2. Trigonometry & Logarithms: sin, cos, tan, asin, acos, atan, ln, log₁₀, exp.
 * 3. Angular Mode Toggle: Switches trigonometric calculations dynamically between
 *    Degrees (DEG) and Radians (RAD).
 * 
 * FUNCTIONS PRESENT IN THIS FILE:
 * 1. inputFunc(fn):
 *    - Applies a unary scientific function to the currently buffered display value.
 *    - Immediately evaluates result, sets the mathematical expression preview,
 *      and sets waitingForNewNumber to true.
 * 
 * 2. toggleAngleMode():
 *    - Switches global angle mode state between 'DEG' and 'RAD'.
 *    - Updates UI angle pill badge text and plays click feedback sound.
 * ============================================================================
 */

import { state } from '../core/state.js';
import { SoundFx } from '../core/sound.js';
import { evaluateMath, factorial } from '../core/math.js';
import { updateDisplay } from './standard.js';

/**
 * Executes a unary scientific function (e.g. sin, cos, tan, sqrt, sqr, fact, inv, abs)
 * on the current accumulator value and updates the scientific display.
 * 
 * @param {string} fn - Function identifier ('sqr', 'sqrt', 'fact', 'inv', 'abs', 'sin', 'cos', etc.).
 */
export function inputFunc(fn) {
    SoundFx.playClick(550);
    const data = state.sci;
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
    updateDisplay('sci');
}

/**
 * Toggles trigonometric angle evaluation unit between Degrees (DEG) and Radians (RAD).
 */
export function toggleAngleMode() {
    SoundFx.playClick(600);
    state.angleMode = state.angleMode === 'DEG' ? 'RAD' : 'DEG';
    const pill = document.getElementById('sciAngleMode');
    if (pill) pill.textContent = state.angleMode;
}
