/**
 * CalVerse Pro - Programmer Calculator Feature
 * Multi-radix conversion (HEX, DEC, OCT, BIN), bitwise operations & word-size bit masking
 */

import { state } from '../core/state.js';
import { SoundFx } from '../core/sound.js';

export const ProgrammerEngine = {
    setRadix(radix) {
        SoundFx.playClick(600);
        state.prog.radix = radix;
        document.querySelectorAll('.radix-row').forEach(row => {
            row.classList.toggle('active', row.dataset.radix === radix);
        });
        this.updateKeypadState();
    },

    setWordSize(bits) {
        SoundFx.playClick(600);
        state.prog.wordSize = bits;
        document.querySelectorAll('.word-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.bits, 10) === bits);
        });
        this.maskValue();
        this.updateDisplay();
    },

    getMask() {
        const bits = state.prog.wordSize;
        if (bits === 8) return 0xFFn;
        if (bits === 16) return 0xFFFFn;
        if (bits === 32) return 0xFFFFFFFFn;
        return 0xFFFFFFFFFFFFFFFFn;
    },

    maskValue() {
        state.prog.val = state.prog.val & this.getMask();
    },

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
            // invalid digit for base
        }
    },

    inputBitwise(op) {
        SoundFx.playClick(550);
        const p = state.prog;
        if (op === 'NOT') {
            p.val = (~p.val) & this.getMask();
            this.updateDisplay();
            return;
        }

        p.storedVal = p.val;
        p.pendingOp = op;
        p.waitingForNew = true;
    },

    inputOp(op) {
        this.inputBitwise(op);
    },

    calculate() {
        SoundFx.playClick(850);
        const p = state.prog;
        if (p.storedVal === null || !p.pendingOp) return;

        let a = p.storedVal;
        let b = p.val;
        let res = 0n;

        switch (p.pendingOp) {
            case 'AND': res = a & b; break;
            case 'OR': res = a | b; break;
            case 'XOR': res = a ^ b; break;
            case '<<': res = a << b; break;
            case '>>': res = a >> b; break;
            case '+': res = a + b; break;
            case '−': res = a - b; break;
            case '×': res = a * b; break;
            case '÷': res = b !== 0n ? a / b : 0n; break;
            case '%': res = b !== 0n ? a % b : 0n; break;
        }

        p.val = res;
        this.maskValue();
        p.storedVal = null;
        p.pendingOp = null;
        p.waitingForNew = true;
        this.updateDisplay();
    },

    clear() {
        state.prog.val = 0n;
        state.prog.currentInput = '0';
        state.prog.storedVal = null;
        state.prog.pendingOp = null;
        this.updateDisplay();
    },

    backspace() {
        const p = state.prog;
        let str = p.val.toString(p.radix === 'HEX' ? 16 : p.radix === 'DEC' ? 10 : p.radix === 'OCT' ? 8 : 2);
        str = str.slice(0, -1);
        p.val = str ? BigInt(parseInt(str, p.radix === 'HEX' ? 16 : p.radix === 'DEC' ? 10 : p.radix === 'OCT' ? 8 : 2)) : 0n;
        this.updateDisplay();
    },

    toggleSign() {
        state.prog.val = (-state.prog.val) & this.getMask();
        this.updateDisplay();
    },

    updateDisplay() {
        const p = state.prog;
        const val = p.val;
        const hex = val.toString(16).toUpperCase();
        const dec = val.toString(10);
        const oct = val.toString(8);
        
        let bin = val.toString(2);
        // Pad binary with spacing
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
};
