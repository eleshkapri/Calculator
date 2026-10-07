/**
 * ============================================================================
 * CalVerse Pro - BMI & Metabolic Health Engine
 * File: src/features/health.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Computes essential biometric and metabolic health indicators:
 * 1. Body Mass Index (BMI): Supports Metric (cm, kg) and Imperial (ft/in, lbs) units.
 * 2. Visual Color Gauge Indicator: Positions the UI pointer dynamically across 4 WHO zones:
 *    Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), and Obese (>=30).
 * 3. Ideal Healthy Weight Range: Computes optimal weight bounds based on target BMI 18.5 - 24.9.
 * 4. Basal Metabolic Rate (BMR): Computes resting energy expenditure via the Mifflin-St Jeor formula.
 * 5. Total Daily Energy Expenditure (TDEE): Estimates daily caloric maintenance needs.
 * 
 * OBJECTS & METHODS PRESENT IN THIS FILE:
 * HealthEngine:
 * 1. setUnit(unit):
 *    - Toggles between 'metric' and 'imperial' input modes and re-runs calculations.
 * 
 * 2. calculate():
 *    - Converts inputs to standard SI units (meters and kilograms).
 *    - Computes BMI = weight / (height²).
 *    - Updates gauge pointer percentage position and category status badge.
 *    - Computes healthy weight range.
 *    - Computes gender-adjusted Mifflin-St Jeor BMR and activity TDEE.
 * ============================================================================
 */

import { state } from '../core/state.js';
import { SoundFx } from '../core/sound.js';
import { getFloatVal } from '../core/dom.js';

export const HealthEngine = {
    /**
     * Toggles between Metric and Imperial measurement systems.
     * 
     * @param {'metric'|'imperial'} unit - Selected measurement unit system.
     */
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

    /**
     * Executes complete biometric calculations: BMI, health category, gauge position,
     * healthy weight range, Mifflin-St Jeor BMR, and light-activity TDEE.
     */
    calculate() {
        SoundFx.playClick(600);
        const unit = state.health.unit;
        let heightM = 0;
        let weightKg = 0;

        // Convert user inputs into metric base units (meters & kilograms)
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

        // BMI Formula: weight (kg) / [height (m)]²
        const bmi = weightKg / (heightM * heightM);
        const age = parseInt(document.getElementById('healthAge')?.value, 10) || 25;
        const gender = document.querySelector('input[name="healthGender"]:checked')?.value || 'male';

        // Determine WHO Classification & visual gauge pointer percentage position
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

        // Healthy Weight Range: Target BMI between 18.5 and 24.9
        const minW = (18.5 * heightM * heightM).toFixed(1);
        const maxW = (24.9 * heightM * heightM).toFixed(1);
        const healthyRangeEl = document.getElementById('healthyRangeVal');
        if (healthyRangeEl) {
            healthyRangeEl.textContent = unit === 'metric' 
                ? `${minW} kg - ${maxW} kg` 
                : `${(minW * 2.20462).toFixed(1)} lbs - ${(maxW * 2.20462).toFixed(1)} lbs`;
        }

        // Basal Metabolic Rate (BMR) via Mifflin-St Jeor Equation
        // Men:   BMR = 10*W + 6.25*H - 5*Age + 5
        // Women: BMR = 10*W + 6.25*H - 5*Age - 161
        let bmr = (10 * weightKg) + (6.25 * heightM * 100) - (5 * age);
        bmr = gender === 'male' ? bmr + 5 : bmr - 161;

        // Total Daily Energy Expenditure (TDEE) with light activity factor (1.375x)
        const tdee = bmr * 1.375;

        const bmrEl = document.getElementById('bmrVal');
        if (bmrEl) bmrEl.textContent = `${Math.round(bmr).toLocaleString()} kcal / day`;

        const tdeeEl = document.getElementById('tdeeVal');
        if (tdeeEl) tdeeEl.textContent = `${Math.round(tdee).toLocaleString()} kcal / day`;
    }
};
