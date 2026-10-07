/**
 * ============================================================================
 * CalVerse Pro - Unit Converter Engine (OOP Architecture)
 * File: src/features/converter.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Object-oriented unit conversion engine across 7 physical dimensions:
 * Length, Mass, Temperature, Area, Speed, Digital, and Time.
 * 
 * OOP PRINCIPLES:
 * 1. Inheritance: Extends BaseCalculator.
 * 2. Encapsulation: Unit matrices, category selection, and conversion logic
 *    are encapsulated in UnitConverter methods.
 * ============================================================================
 */

import { BaseCalculator } from './base.js';
import { CONVERTER_UNITS } from '../core/constants.js';
import { SoundFx } from '../core/sound.js';
import { getFloatVal } from '../core/dom.js';

export class UnitConverter extends BaseCalculator {
    constructor(id = 'converter') {
        super(id);
        this.currentCategory = 'length';
        this.units = CONVERTER_UNITS;
    }

    /**
     * Initializes UI event listeners for categories, input synchronization, and unit swapping.
     */
    init() {
        const catBtns = document.querySelectorAll('.cat-btn');
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                catBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.cat;
                this.populateUnits();
                this.convert('from');
            });
        });

        // Live bidirectional typing listeners
        document.getElementById('convertValFrom')?.addEventListener('input', () => this.convert('from'));
        document.getElementById('convertValTo')?.addEventListener('input', () => this.convert('to'));
        document.getElementById('convertUnitFrom')?.addEventListener('change', () => this.convert('from'));
        document.getElementById('convertUnitTo')?.addEventListener('change', () => this.convert('from'));

        // Swap units button
        document.getElementById('swapUnitsBtn')?.addEventListener('click', () => {
            SoundFx.playClick(600);
            const fromUnit = document.getElementById('convertUnitFrom');
            const toUnit = document.getElementById('convertUnitTo');
            if (fromUnit && toUnit) {
                const temp = fromUnit.value;
                fromUnit.value = toUnit.value;
                toUnit.value = temp;
                this.convert('from');
            }
        });

        // Initial setup
        this.populateUnits();
        this.convert('from');
    }

    /**
     * Rebuilds <option> elements in source and target dropdowns when the active category changes.
     */
    populateUnits() {
        const uList = Object.keys(this.units[this.currentCategory] || {});
        const fromSelect = document.getElementById('convertUnitFrom');
        const toSelect = document.getElementById('convertUnitTo');

        if (fromSelect && toSelect) {
            fromSelect.innerHTML = uList.map(u => `<option value="${u}">${u}</option>`).join('');
            toSelect.innerHTML = uList.map(u => `<option value="${u}">${u}</option>`).join('');

            fromSelect.selectedIndex = 0;
            toSelect.selectedIndex = Math.min(1, uList.length - 1);
        }
    }

    /**
     * Executes bidirectional unit conversion.
     * @param {'from'|'to'} source - Identifies which input field triggered conversion.
     */
    convert(source) {
        const cat = this.currentCategory;
        const fromSelect = document.getElementById('convertUnitFrom');
        const toSelect = document.getElementById('convertUnitTo');
        if (!fromSelect || !toSelect) return;

        const fromUnit = fromSelect.value;
        const toUnit = toSelect.value;

        // Temperature uses affine shift/scale formulas
        if (cat === 'temperature') {
            if (source === 'from') {
                const val = getFloatVal('convertValFrom');
                const res = this.convertTemp(val, fromUnit, toUnit);
                const toInput = document.getElementById('convertValTo');
                if (toInput) toInput.value = res.toFixed(3);
            } else {
                const val = getFloatVal('convertValTo');
                const res = this.convertTemp(val, toUnit, fromUnit);
                const fromInput = document.getElementById('convertValFrom');
                if (fromInput) fromInput.value = res.toFixed(3);
            }
        } else {
            // Standard SI linear multiplier conversion
            const uMap = this.units[cat] || {};
            const fromFactor = uMap[fromUnit] || 1;
            const toFactor = uMap[toUnit] || 1;

            if (source === 'from') {
                const val = parseFloat(document.getElementById('convertValFrom')?.value) || 0;
                const baseVal = val * fromFactor;
                const res = baseVal / toFactor;
                const toInput = document.getElementById('convertValTo');
                if (toInput) toInput.value = parseFloat(res.toFixed(6));
            } else {
                const val = parseFloat(document.getElementById('convertValTo')?.value) || 0;
                const baseVal = val * toFactor;
                const res = baseVal / fromFactor;
                const fromInput = document.getElementById('convertValFrom');
                if (fromInput) fromInput.value = parseFloat(res.toFixed(6));
            }
        }

        // Update formula summary label
        const fromVal = document.getElementById('convertValFrom')?.value || '0';
        const toVal = document.getElementById('convertValTo')?.value || '0';
        const formEl = document.getElementById('conversionFormula');
        if (formEl) formEl.textContent = `${fromVal} ${fromUnit} = ${toVal} ${toUnit}`;
    }

    /**
     * Converts temperature values between Celsius, Fahrenheit, and Kelvin.
     * @param {number} val
     * @param {string} from
     * @param {string} to
     * @returns {number}
     */
    convertTemp(val, from, to) {
        if (from === to) return val;
        let c = val;
        if (from === 'Fahrenheit') c = (val - 32) * (5 / 9);
        if (from === 'Kelvin') c = val - 273.15;

        if (to === 'Celsius') return c;
        if (to === 'Fahrenheit') return c * (9 / 5) + 32;
        if (to === 'Kelvin') return c + 273.15;
        return c;
    }
}

/** Default singleton instance of UnitConverter */
export const ConverterEngine = new UnitConverter();
