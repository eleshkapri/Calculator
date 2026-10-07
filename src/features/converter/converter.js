/**
 * CalVerse Pro - Unit Converter Feature
 * Instant multi-category conversions: length, mass, temperature, area, speed, digital, time
 */

import { CONVERTER_UNITS } from '../../core/constants.js';
import { SoundFx } from '../../core/sound.js';
import { getFloatVal } from '../../core/dom.js';

export const ConverterEngine = {
    currentCategory: 'length',
    units: CONVERTER_UNITS,

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

        document.getElementById('convertValFrom').addEventListener('input', () => this.convert('from'));
        document.getElementById('convertValTo').addEventListener('input', () => this.convert('to'));
        document.getElementById('convertUnitFrom').addEventListener('change', () => this.convert('from'));
        document.getElementById('convertUnitTo').addEventListener('change', () => this.convert('from'));

        document.getElementById('swapUnitsBtn').addEventListener('click', () => {
            SoundFx.playClick(600);
            const fromUnit = document.getElementById('convertUnitFrom');
            const toUnit = document.getElementById('convertUnitTo');
            const temp = fromUnit.value;
            fromUnit.value = toUnit.value;
            toUnit.value = temp;
            this.convert('from');
        });

        this.populateUnits();
        this.convert('from');
    },

    populateUnits() {
        const uList = Object.keys(this.units[this.currentCategory]);
        const fromSelect = document.getElementById('convertUnitFrom');
        const toSelect = document.getElementById('convertUnitTo');

        fromSelect.innerHTML = uList.map(u => `<option value="${u}">${u}</option>`).join('');
        toSelect.innerHTML = uList.map(u => `<option value="${u}">${u}</option>`).join('');

        fromSelect.selectedIndex = 0;
        toSelect.selectedIndex = Math.min(1, uList.length - 1);
    },

    convert(source) {
        const cat = this.currentCategory;
        const fromUnit = document.getElementById('convertUnitFrom').value;
        const toUnit = document.getElementById('convertUnitTo').value;

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

        const fromVal = document.getElementById('convertValFrom').value;
        const toVal = document.getElementById('convertValTo').value;
        document.getElementById('conversionFormula').textContent = `${fromVal} ${fromUnit} = ${toVal} ${toUnit}`;
    },

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
};
