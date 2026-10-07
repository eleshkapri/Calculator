/**
 * CalVerse Pro - Scientific Calculator Feature
 * High-precision scientific functions, trigonometry, logarithms & powers
 */

import { state } from '../core/state.js';
import { SoundFx } from '../core/sound.js';
import { evaluateMath, factorial } from '../core/math.js';
import { updateDisplay } from './standard.js';

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
        // Trigonometry / Log
        data.current = evaluateMath(`${fn}(${cur})`, state.angleMode);
        data.expr = `${fn}(${cur}) =`;
    }
    data.waitingForNewNumber = true;
    updateDisplay('sci');
}

export function toggleAngleMode() {
    SoundFx.playClick(600);
    state.angleMode = state.angleMode === 'DEG' ? 'RAD' : 'DEG';
    const pill = document.getElementById('sciAngleMode');
    if (pill) pill.textContent = state.angleMode;
}
