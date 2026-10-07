/**
 * ============================================================================
 * CalVerse Pro - Unit Converter Engine
 * File: src/features/converter.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Powers the real-time bidirectional unit conversion system across 7 physical
 * and digital categories: Length, Mass, Temperature, Area, Speed, Digital, and Time.
 * Handles linear scaling via SI base multipliers as well as affine transformations
 * for temperature units (Celsius, Fahrenheit, Kelvin).
 * 
 * OBJECTS & METHODS PRESENT IN THIS FILE:
 * ConverterEngine:
 * 1. init():
 *    - Binds category switcher tab buttons, bidirectional input listeners,
 *      dropdown selectors, and unit swap button.
 * 
 * 2. populateUnits():
 *    - Populates the "From" and "To" <select> dropdowns based on the currently
 *      selected measurement category.
 * 
 * 3. convert(source):
 *    - Performs bidirectional real-time unit calculation (from -> to, or to -> from).
 *    - Normalizes values to SI base unit before converting to the target unit.
 *    - Updates the human-readable formula summary indicator.
 * 
 * 4. convertTemp(val, from, to):
 *    - Specialized non-linear converter for temperature (scales between °C, °F, and K).
 * ============================================================================
 */

import { CONVERTER_UNITS } from '../core/constants.js';
import { SoundFx } from '../core/sound.js';
import { getFloatVal } from '../core/dom.js';

export const ConverterEngine = {
    /** Currently selected unit category (defaults to 'length') */
    currentCategory: 'length',
    /** Reference map of conversion coefficients */
    units: CONVERTER_UNITS,

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
        document.getElementById('convertValFrom').addEventListener('input', () => this.convert('from'));
        document.getElementById('convertValTo').addEventListener('input', () => this.convert('to'));
        document.getElementById('convertUnitFrom').addEventListener('change', () => this.convert('from'));
        document.getElementById('convertUnitTo').addEventListener('change', () => this.convert('from'));

        // Swap units button
        document.getElementById('swapUnitsBtn').addEventListener('click', () => {
            SoundFx.playClick(600);
            const fromUnit = document.getElementById('convertUnitFrom');
            const toUnit = document.getElementById('convertUnitTo');
            const temp = fromUnit.value;
            fromUnit.value = toUnit.value;
            toUnit.value = temp;
            this.convert('from');
        });

        // Initial setup
        this.populateUnits();
        this.convert('from');
    },

    /**
     * Rebuilds <option> elements in source and target dropdowns when the active category changes.
     */
    populateUnits() {
        const uList = Object.keys(this.units[this.currentCategory]);
        const fromSelect = document.getElementById('convertUnitFrom');
        const toSelect = document.getElementById('convertUnitTo');

        fromSelect.innerHTML = uList.map(u => `<option value="${u}">${u}</option>`).join('');
        toSelect.innerHTML = uList.map(u => `<option value="${u}">${u}</option>`).join('');

        fromSelect.selectedIndex = 0;
        toSelect.selectedIndex = Math.min(1, uList.length - 1);
    },

    /**
     * Executes bidirectional unit conversion.
     * 
     * @param {'from'|'to'} source - Identifies which input field triggered the conversion.
     */
    convert(source) {
        const cat = this.currentCategory;
        const fromUnit = document.getElementById('convertUnitFrom').value;
        const toUnit = document.getElementById('convertUnitTo').value;

        // Temperature uses affine shift/scale formulas
        if (cat === 'temperature') {
            if (source === 'from') {
                const val = getFloatVal('convertValFrom');
                const res = this.convertTemp(val, fromUnit, toUnit);
                document.getElementById('convertValTo').value = res.toFixed(3);
            } else {
                const val = getFloatVal('convertValTo');
                const res = this.convertTemp(val, toUnit, fromUnit);
                document.getElementById('convertValFrom').value = res.toFixed(3);
            }
        } else {
            // Standard SI linear multiplier conversion
            const uMap = this.units[cat];
            const fromFactor = uMap[fromUnit];
            const toFactor = uMap[toUnit];

            if (source === 'from') {
                const val = parseFloat(document.getElementById('convertValFrom').value) || 0;
                const baseVal = val * fromFactor;
                const res = baseVal / toFactor;
                document.getElementById('convertValTo').value = parseFloat(res.toFixed(6));
            } else {
                const val = parseFloat(document.getElementById('convertValTo').value) || 0;
                const baseVal = val * toFactor;
                const res = baseVal / fromFactor;
                document.getElementById('convertValFrom').value = parseFloat(res.toFixed(6));
            }
        }

        // Update the formula summary label (e.g. "1 Meter = 3.28084 Foot")
        const fromVal = document.getElementById('convertValFrom').value;
        const toVal = document.getElementById('convertValTo').value;
        document.getElementById('conversionFormula').textContent = `${fromVal} ${fromUnit} = ${toVal} ${toUnit}`;
    },

    /**
     * Converts temperature values between Celsius, Fahrenheit, and Kelvin.
     * 
     * @param {number} val - Input temperature reading.
     * @param {string} from - Source unit name ('Celsius', 'Fahrenheit', 'Kelvin').
     * @param {string} to - Destination unit name ('Celsius', 'Fahrenheit', 'Kelvin').
     * @returns {number} Converted temperature reading.
     */
    convertTemp(val, from, to) {
        if (from === to) return val;
        // Step 1: Normalize input to Celsius
        let c = val;
        if (from === 'Fahrenheit') c = (val - 32) * (5 / 9);
        if (from === 'Kelvin') c = val - 273.15;

        // Step 2: Convert Celsius to target unit
        if (to === 'Celsius') return c;
        if (to === 'Fahrenheit') return c * (9 / 5) + 32;
        if (to === 'Kelvin') return c + 273.15;
        return c;
    }
};
