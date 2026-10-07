/**
 * CalVerse Pro - BMI & Health Feature
 * Body mass index, gauge visualizer, healthy weight range, BMR & TDEE
 */

import { state } from '../core/state.js';
import { SoundFx } from '../core/sound.js';
import { getFloatVal } from '../core/dom.js';

export const HealthEngine = {
    setUnit(unit) {
        state.health.unit = unit;
        document.getElementById('healthMetricBtn').classList.toggle('active', unit === 'metric');
        document.getElementById('healthImperialBtn').classList.toggle('active', unit === 'imperial');

        document.getElementById('heightMetricCard').style.display = unit === 'metric' ? 'flex' : 'none';
        document.getElementById('heightImperialCard').style.display = unit === 'imperial' ? 'flex' : 'none';
        document.getElementById('weightMetricCard').style.display = unit === 'metric' ? 'flex' : 'none';
        document.getElementById('weightImperialCard').style.display = unit === 'imperial' ? 'flex' : 'none';

        this.calculate();
    },

    calculate() {
        SoundFx.playClick(600);
        const unit = state.health.unit;
        let heightM = 0;
        let weightKg = 0;

        if (unit === 'metric') {
            const cm = getFloatVal('healthHeightCm') || 175;
            weightKg = getFloatVal('healthWeightKg') || 70;
            heightM = cm / 100;
        } else {
            const ft = getFloatVal('healthHeightFt') || 5;
            const inches = getFloatVal('healthHeightIn') || 9;
            const lbs = getFloatVal('healthWeightLbs') || 154;
            const totalInches = ft * 12 + inches;
            heightM = totalInches * 0.0254;
            weightKg = lbs * 0.453592;
        }

        if (heightM <= 0 || weightKg <= 0) return;

        const bmi = weightKg / (heightM * heightM);
        const age = parseInt(document.getElementById('healthAge')?.value, 10) || 25;
        const gender = document.querySelector('input[name="healthGender"]:checked')?.value || 'male';

        // Category
        let cat = 'Normal Weight';
        let badgeClass = 'badge-normal';
        let pointerPercent = 45;

        if (bmi < 18.5) {
            cat = 'Underweight';
            badgeClass = 'badge-under';
            pointerPercent = (bmi / 18.5) * 25;
        } else if (bmi < 25) {
            cat = 'Normal Weight';
            badgeClass = 'badge-normal';
            pointerPercent = 25 + ((bmi - 18.5) / 6.5) * 25;
        } else if (bmi < 30) {
            cat = 'Overweight';
            badgeClass = 'badge-over';
            pointerPercent = 50 + ((bmi - 25) / 5) * 25;
        } else {
            cat = 'Obese';
            badgeClass = 'badge-obese';
            pointerPercent = Math.min(100, 75 + ((bmi - 30) / 10) * 25);
        }

        const bmiValEl = document.getElementById('bmiValue');
        if (bmiValEl) bmiValEl.textContent = bmi.toFixed(1);

        const catElem = document.getElementById('bmiCategory');
        if (catElem) {
            catElem.textContent = cat;
            catElem.className = `bmi-badge ${badgeClass}`;
        }

        const pointerEl = document.getElementById('bmiPointer');
        if (pointerEl) pointerEl.style.left = `${pointerPercent}%`;

        // Healthy Range: 18.5 to 24.9 BMI
        const minW = (18.5 * heightM * heightM).toFixed(1);
        const maxW = (24.9 * heightM * heightM).toFixed(1);
        const healthyRangeEl = document.getElementById('healthyRangeVal');
        if (healthyRangeEl) {
            healthyRangeEl.textContent = unit === 'metric' 
                ? `${minW} kg - ${maxW} kg` 
                : `${(minW * 2.20462).toFixed(1)} lbs - ${(maxW * 2.20462).toFixed(1)} lbs`;
        }

        // BMR (Mifflin-St Jeor)
        let bmr = (10 * weightKg) + (6.25 * heightM * 100) - (5 * age);
        bmr = gender === 'male' ? bmr + 5 : bmr - 161;
        const tdee = bmr * 1.375; // light activity baseline

        const bmrEl = document.getElementById('bmrVal');
        if (bmrEl) bmrEl.textContent = `${Math.round(bmr).toLocaleString()} kcal / day`;

        const tdeeEl = document.getElementById('tdeeVal');
        if (tdeeEl) tdeeEl.textContent = `${Math.round(tdee).toLocaleString()} kcal / day`;
    }
};
