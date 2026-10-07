/**
 * ============================================================================
 * CalVerse Pro - Programmer Calculator Engine
 * File: src/features/programmer.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Powers computing and hardware-level arithmetic:
 * 1. Multi-Radix Simultaneous Display: Synchronously renders Hexadecimal (HEX),
 *    Decimal (DEC), Octal (OCT), and Binary (BIN) representations using arbitrary
 *    precision JavaScript BigInt arithmetic.
 * 2. Word Size Masking: Enforces 8-bit (Byte), 16-bit (Word), 32-bit (DWord),
 *    and 64-bit (QWord) hardware integer limits.
 * 3. Bitwise & Logical Operations: AND, OR, XOR, NOT, left-shift (<<), right-shift (>>),
 *    arithmetic (+, -, *, /, %), and sign negation.
 * 4. Dynamic Keypad Validation: Disables keys ineligible for the active radix
 *    (e.g., A-F disabled outside HEX, digits 2-9 disabled in BIN, 8-9 disabled in OCT).
 * 
 * OBJECTS & METHODS PRESENT IN THIS FILE:
 * ProgrammerEngine:
 * 1. setRadix(radix): Sets primary radix ('HEX', 'DEC', 'OCT', 'BIN') and disables invalid keys.
 * 2. setWordSize(bits): Updates bit width (8, 16, 32, 64) and masks the stored BigInt value.
 * 3. getMask(): Returns the bitmask BigInt for the current word size.
 * 4. maskValue(): Clamps the current value according to getMask().
 * 5. inputDigit(d): Parses incoming character according to the current radix and updates state.
 * 6. inputBitwise(op): Buffers binary operator (AND, OR, XOR, <<, >>) or immediately calculates unary NOT (~).
 * 7. inputOp(op): Alias for inputBitwise to handle general arithmetic operators.
 * 8. calculate(): Evaluates pending bitwise or arithmetic operation on stored and current BigInt operands.
 * 9. clear(): Clears accumulator, inputs, and pending operators to 0.
 * 10. backspace(): Removes the last digit typed in the active radix.
 * 11. toggleSign(): Negates the current BigInt value and applies word-size bitmask.
 * 12. updateDisplay(): Updates HEX, DEC, OCT, and formatted 4-bit nibble spaced BIN display labels.
 * 13. updateKeypadState(): Toggles .disabled styling on keypad buttons based on the active base.
 * ============================================================================
 */

import { state } from '../core/state.js';
import { SoundFx } from '../core/sound.js';

export const ProgrammerEngine = {
    /**
     * Sets active radix base ('HEX', 'DEC', 'OCT', or 'BIN') and updates keypad states.
     * 
     * @param {'HEX'|'DEC'|'OCT'|'BIN'} radix - Selected radix numeral base.
     */
    setRadix(radix) {
        SoundFx.playClick(600);
        state.prog.radix = radix;
        document.querySelectorAll('.radix-row').forEach(row => {
            row.classList.toggle('active', row.dataset.radix === radix);
        });
        this.updateKeypadState();
    },

    /**
     * Sets the active integer word size bit width (8, 16, 32, or 64 bits).
     * 
     * @param {8|16|32|64} bits - Bit width limit.
     */
    setWordSize(bits) {
        SoundFx.playClick(600);
        state.prog.wordSize = bits;
        document.querySelectorAll('.word-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.bits, 10) === bits);
        });
        this.maskValue();
        this.updateDisplay();
    },

    /**
     * Computes the BigInt bitmask for the currently active word size.
     * 
     * @returns {bigint} Bitmask representation (e.g. 0xFFFFFFFFn for 32-bit).
     */
    getMask() {
        const bits = state.prog.wordSize;
        if (bits === 8) return 0xFFn;
        if (bits === 16) return 0xFFFFn;
        if (bits === 32) return 0xFFFFFFFFn;
        return 0xFFFFFFFFFFFFFFFFn;
    },

    /**
     * Clamps the active value to stay strictly within word-size bit limits.
     */
    maskValue() {
        state.prog.val = state.prog.val & this.getMask();
    },

    /**
     * Handles keypad digit entry in the current radix base.
     * 
     * @param {string} d - Digit character ('0'-'9', 'A'-'F').
     */
    inputDigit(d) {
        SoundFx.playClick(500);
        const p = state.prog;
        let curStr = p.waitingForNew ? '' : p.currentInput;

        if (curStr === '0') curStr = '';
        curStr += d;

        try {
            let radixBase = 16;
            if (p.radix === 'DEC') radixBase = 10;
            if (p.radix === 'OCT') radixBase = 8;
            if (p.radix === 'BIN') radixBase = 2;

            p.val = BigInt(parseInt(curStr, radixBase) || 0);
            this.maskValue();
            p.currentInput = curStr;
            p.waitingForNew = false;
            this.updateDisplay();
        } catch (e) {
            // Silently ignore digits invalid for current base
        }
    },

    /**
     * Handles bitwise operations (AND, OR, XOR, NOT, <<, >>).
     * 
     * @param {string} op - Bitwise operator string.
     */
    inputBitwise(op) {
        SoundFx.playClick(550);
        const p = state.prog;
        // Unary NOT immediately inverts bits and reapplies mask
        if (op === 'NOT') {
            p.val = (~p.val) & this.getMask();
            this.updateDisplay();
            return;
        }

        p.storedVal = p.val;
        p.pendingOp = op;
        p.waitingForNew = true;
    },

    /**
     * Alias for inputBitwise to handle binary operations.
     * 
     * @param {string} op - Operator symbol.
     */
    inputOp(op) {
        this.inputBitwise(op);
    },

    /**
     * Calculates the pending bitwise or arithmetic operation on stored operands.
     */
    calculate() {
        SoundFx.playClick(850);
        const p = state.prog;
        if (p.storedVal === null || !p.pendingOp) return;

        let a = p.storedVal;
        let b = p.val;
        let res = 0n;

        switch (p.pendingOp) {
            case 'AND': res = a & b; break;
            case 'OR':  res = a | b; break;
            case 'XOR': res = a ^ b; break;
            case '<<':  res = a << b; break;
            case '>>':  res = a >> b; break;
            case '+':   res = a + b; break;
            case '−':   res = a - b; break;
            case '×':   res = a * b; break;
            case '÷':   res = b !== 0n ? a / b : 0n; break;
            case '%':   res = b !== 0n ? a % b : 0n; break;
        }

        p.val = res;
        this.maskValue();
        p.storedVal = null;
        p.pendingOp = null;
        p.waitingForNew = true;
        this.updateDisplay();
    },

    /**
     * Clears all programmer calculator registers to zero.
     */
    clear() {
        state.prog.val = 0n;
        state.prog.currentInput = '0';
        state.prog.storedVal = null;
        state.prog.pendingOp = null;
        this.updateDisplay();
    },

    /**
     * Removes the rightmost digit from the active input.
     */
    backspace() {
        const p = state.prog;
        let str = p.val.toString(p.radix === 'HEX' ? 16 : p.radix === 'DEC' ? 10 : p.radix === 'OCT' ? 8 : 2);
        str = str.slice(0, -1);
        p.val = str ? BigInt(parseInt(str, p.radix === 'HEX' ? 16 : p.radix === 'DEC' ? 10 : p.radix === 'OCT' ? 8 : 2)) : 0n;
        this.updateDisplay();
    },

    /**
     * Negates value using two's complement and applies active word size mask.
     */
    toggleSign() {
        state.prog.val = (-state.prog.val) & this.getMask();
        this.updateDisplay();
    },

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
        // Format binary output into neat 4-bit nibble groupings (e.g. "0000 1111")
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
    },

    /**
     * Disables keypad keys that are mathematically illegal in the current radix base.
     */
    updateKeypadState() {
        const radix = state.prog.radix;
        const hexBtns = document.querySelectorAll('.btn-hex');
        const numBtns = document.querySelectorAll('.programmer-keypad .btn-num');

        // Hexadecimal A-F only allowed in HEX mode
        hexBtns.forEach(b => b.classList.toggle('disabled', radix !== 'HEX'));

        // Restrict numeric buttons according to base
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
};
