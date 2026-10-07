/**
 * ============================================================================
 * CalVerse Pro - Programmer Calculator Engine (OOP Architecture)
 * File: src/features/programmer.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Object-oriented computing and hardware-level integer calculator:
 * 1. Multi-Radix Simultaneous Display: Synchronously renders Hexadecimal (HEX),
 *    Decimal (DEC), Octal (OCT), and Binary (BIN) representations using arbitrary
 *    precision JavaScript BigInt arithmetic.
 * 2. Word Size Masking: Enforces 8-bit (Byte), 16-bit (Word), 32-bit (DWord),
 *    and 64-bit (QWord) hardware integer limits.
 * 3. Bitwise & Logical Operations: AND, OR, XOR, NOT, left-shift (<<), right-shift (>>),
 *    arithmetic (+, -, *, /, %), and sign negation.
 * 4. Dynamic Keypad Validation: Disables keys ineligible for the active radix.
 * 
 * OOP PRINCIPLES:
 * 1. Inheritance: Extends BaseCalculator.
 * 2. Encapsulation: BigInt states, bitmask computations, and radix constraints are
 *    encapsulated in ProgrammerCalculator methods.
 * ============================================================================
 */

import { BaseCalculator } from './base.js';
import { state } from '../core/state.js';
import { SoundFx } from '../core/sound.js';

export class ProgrammerCalculator extends BaseCalculator {
    constructor(id = 'programmer') {
        super(id);
    }

    /**
     * Sets active radix base ('HEX', 'DEC', 'OCT', or 'BIN') and updates keypad states.
     * @param {'HEX'|'DEC'|'OCT'|'BIN'} radix
     */
    setRadix(radix) {
        this.playFeedback(600);
        state.prog.radix = radix;
        document.querySelectorAll('.radix-row').forEach(row => {
            row.classList.toggle('active', row.dataset.radix === radix);
        });
        this.updateKeypadState();
    }

    /**
     * Sets the active integer word size bit width (8, 16, 32, or 64 bits).
     * @param {8|16|32|64} bits
     */
    setWordSize(bits) {
        this.playFeedback(600);
        state.prog.wordSize = bits;
        document.querySelectorAll('.word-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.bits, 10) === bits);
        });
        this.maskValue();
        this.updateDisplay();
    }

    /**
     * Computes the BigInt bitmask for the currently active word size.
     * @returns {bigint}
     */
    getMask() {
        const bits = state.prog.wordSize;
        if (bits === 8) return 0xFFn;
        if (bits === 16) return 0xFFFFn;
        if (bits === 32) return 0xFFFFFFFFn;
        return 0xFFFFFFFFFFFFFFFFn;
    }

    /**
     * Clamps the active value to stay strictly within word-size bit limits.
     */
    maskValue() {
        state.prog.val = state.prog.val & this.getMask();
    }

    /**
     * Handles keypad digit entry in the current radix base.
     * @param {string} d
     */
    inputDigit(d) {
        this.playFeedback(500);
        const p = state.prog;
        let curStr = p.waitingForNew ? '' : p.currentInput;

        if (curStr === '0') curStr = '';
        curStr += d;

        // Parse according to current radix base
        const rad = p.radix;
        let base = 10;
        if (rad === 'HEX') base = 16;
        if (rad === 'OCT') base = 8;
        if (rad === 'BIN') base = 2;

        try {
            // Validate and parse string to BigInt
            let parsed = 0n;
            if (base === 16) parsed = BigInt(`0x${curStr}`);
            else if (base === 8) parsed = BigInt(`0o${curStr}`);
            else if (base === 2) parsed = BigInt(`0b${curStr}`);
            else parsed = BigInt(curStr);

            p.val = parsed & this.getMask();
            p.currentInput = curStr;
            p.waitingForNew = false;
        } catch (e) {
            // Keep previous value if invalid character was entered
        }
        this.updateDisplay();
    }

    /**
     * Handles bitwise operators (AND, OR, XOR, NOT, LSH, RSH) and binary arithmetic.
     * @param {string} op
     */
    inputBitwise(op) {
        this.playFeedback(550);
        const p = state.prog;

        if (op === 'NOT') {
            // Unary NOT (Bitwise Inversion)
            p.val = (~p.val) & this.getMask();
            p.currentInput = p.val.toString(p.radix === 'HEX' ? 16 : p.radix === 'OCT' ? 8 : p.radix === 'BIN' ? 2 : 10).toUpperCase();
            p.waitingForNew = true;
            this.updateDisplay();
            return;
        }

        p.storedVal = p.val;
        p.pendingOp = op;
        p.waitingForNew = true;
    }

    /**
     * Alias for inputBitwise to handle general arithmetic operators (+, -, *, /, %).
     * @param {string} op
     */
    inputOp(op) {
        this.inputBitwise(op);
    }

    /**
     * Evaluates buffered bitwise or binary arithmetic operation.
     */
    calculate() {
        this.playFeedback(850, 'triangle', 0.05);
        const p = state.prog;
        if (p.pendingOp === null || p.storedVal === null) return;

        const a = p.storedVal;
        const b = p.val;
        let res = 0n;

        try {
            switch (p.pendingOp) {
                case 'AND': res = a & b; break;
                case 'OR':  res = a | b; break;
                case 'XOR': res = a ^ b; break;
                case 'LSH': res = a << (b & 63n); break;
                case 'RSH': res = a >> (b & 63n); break;
                case '+':   res = a + b; break;
                case '−':
                case '-':   res = a - b; break;
                case '×':
                case '*':   res = a * b; break;
                case '÷':
                case '/':   res = b === 0n ? 0n : a / b; break;
                case '%':   res = b === 0n ? 0n : a % b; break;
                default:    res = b; break;
            }
        } catch (e) {
            res = 0n;
        }

        p.val = res & this.getMask();
        p.currentInput = p.val.toString(p.radix === 'HEX' ? 16 : p.radix === 'OCT' ? 8 : p.radix === 'BIN' ? 2 : 10).toUpperCase();
        p.pendingOp = null;
        p.storedVal = null;
        p.waitingForNew = true;
        this.updateDisplay();
    }

    /**
     * Resets the programmer calculator to zero.
     */
    clear() {
        this.playFeedback(450);
        state.prog.val = 0n;
        state.prog.currentInput = '0';
        state.prog.storedVal = null;
        state.prog.pendingOp = null;
        state.prog.waitingForNew = false;
        this.updateDisplay();
    }

    /**
     * Removes the last digit typed in the active radix.
     */
    backspace() {
        this.playFeedback(480);
        const p = state.prog;
        if (p.currentInput.length > 1) {
            p.currentInput = p.currentInput.slice(0, -1);
            try {
                const base = p.radix === 'HEX' ? 16 : p.radix === 'OCT' ? 8 : p.radix === 'BIN' ? 2 : 10;
                let parsed = 0n;
                if (base === 16) parsed = BigInt(`0x${p.currentInput}`);
                else if (base === 8) parsed = BigInt(`0o${p.currentInput}`);
                else if (base === 2) parsed = BigInt(`0b${p.currentInput}`);
                else parsed = BigInt(p.currentInput);
                p.val = parsed & this.getMask();
            } catch (e) {}
        } else {
            p.currentInput = '0';
            p.val = 0n;
        }
        this.updateDisplay();
    }

    /**
     * Negates value using two's complement and applies active word size mask.
     */
    toggleSign() {
        this.playFeedback(500);
        state.prog.val = (-state.prog.val) & this.getMask();
        this.updateDisplay();
    }

    /**
     * Renders synchronized representations in HEX, DEC, OCT, and nibble-separated BIN.
     */
    updateDisplay() {
        const p = state.prog;
        const val = p.val;
        const hex = val.toString(16).toUpperCase();
        const dec = val.toString(10);
        const oct = val.toString(8);
        
        let bin = val.toString(2);
        const padLen = state.prog.wordSize;
        bin = bin.padStart(padLen, '0');
        bin = bin.match(/.{1,4}/g)?.join(' ') || bin;

        const hexEl = document.getElementById('progHex');
        const decEl = document.getElementById('progDec');
        const octEl = document.getElementById('progOct');
        const binEl = document.getElementById('progBin');

        if (hexEl) hexEl.textContent = hex || '0';
        if (decEl) decEl.textContent = dec || '0';
        if (octEl) octEl.textContent = oct || '0';
        if (binEl) binEl.textContent = bin;
    }

    /**
     * Disables keypad keys that are mathematically illegal in the current radix base.
     */
    updateKeypadState() {
        const radix = state.prog.radix;
        const hexBtns = document.querySelectorAll('.btn-hex');
        const numBtns = document.querySelectorAll('.programmer-keypad .btn-num');

        hexBtns.forEach(b => b.classList.toggle('disabled', radix !== 'HEX'));

        numBtns.forEach(b => {
            const digit = parseInt(b.textContent, 10);
            if (radix === 'BIN') {
                b.classList.toggle('disabled', digit > 1);
            } else if (radix === 'OCT') {
                b.classList.toggle('disabled', digit > 7);
            } else {
                b.classList.remove('disabled');
            }
        });
    }
}

/** Default singleton instance of ProgrammerCalculator */
export const ProgrammerEngine = new ProgrammerCalculator();

// Backward-compatible method exports
export const setRadix = (r) => ProgrammerEngine.setRadix(r);
export const setWordSize = (b) => ProgrammerEngine.setWordSize(b);
export const inputDigit = (d) => ProgrammerEngine.inputDigit(d);
export const inputBitwise = (op) => ProgrammerEngine.inputBitwise(op);
export const inputOp = (op) => ProgrammerEngine.inputOp(op);
export const calculateProg = () => ProgrammerEngine.calculate();
export const toggleSignProg = () => ProgrammerEngine.toggleSign();
