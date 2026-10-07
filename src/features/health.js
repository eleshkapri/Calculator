/**
 * ============================================================================
 * CalVerse Pro - BMI & Metabolic Health Engine (OOP Architecture)
 * File: src/features/health.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Object-oriented biometric and metabolic health calculation engine:
 * 1. Body Mass Index (BMI): Supports Metric (cm, kg) and Imperial (ft/in, lbs) units.
 * 2. Visual Color Gauge Indicator: Positions the UI pointer dynamically across 4 WHO zones:
 *    Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), and Obese (>=30).
 * 3. Ideal Healthy Weight Range: Computes optimal weight bounds based on target BMI 18.5 - 24.9.
 * 4. Basal Metabolic Rate (BMR): Computes resting energy expenditure via the Mifflin-St Jeor formula.
 * 5. Total Daily Energy Expenditure (TDEE): Estimates daily caloric maintenance needs.
 * 
 * OOP PRINCIPLES:
 * 1. Inheritance: Extends BaseCalculator.
 * 2. Encapsulation: Unit preferences, biometric formulas, and gauge coordinates are
 *    encapsulated in HealthCalculator methods.
 * ============================================================================
 */

import { BaseCalculator } from './base.js';
import { state } from '../core/state.js';
import { getFloatVal } from '../core/dom.js';

export class HealthCalculator extends BaseCalculator {
    constructor(id = 'health') {
        super(id);
    }

    /**
     * Toggles between Metric and Imperial measurement systems.
     * @param {'metric'|'imperial'} unit
     */
    setUnit(unit) {
        state.health.unit = unit;
        const mBtn = document.getElementById('healthMetricBtn');
        const iBtn = document.getElementById('healthImperialBtn');
        if (mBtn) mBtn.classList.toggle('active', unit === 'metric');
        if (iBtn) iBtn.classList.toggle('active', unit === 'imperial');

        const hmCard = document.getElementById('heightMetricCard');
        const hiCard = document.getElementById('heightImperialCard');
        const wmCard = document.getElementById('weightMetricCard');
        const wiCard = document.getElementById('weightImperialCard');

        if (hmCard) hmCard.style.display = unit === 'metric' ? 'flex' : 'none';
        if (hiCard) hiCard.style.display = unit === 'imperial' ? 'flex' : 'none';
        if (wmCard) wmCard.style.display = unit === 'metric' ? 'flex' : 'none';
        if (wiCard) wiCard.style.display = unit === 'imperial' ? 'flex' : 'none';

        this.calculate();
    }

    /**
     * Executes complete biometric calculations: BMI, category, gauge pointer,
     * healthy weight range, Mifflin-St Jeor BMR, and TDEE.
     */
    calculate() {
        this.playFeedback(600);
        const unit = state.health.unit;
        let heightM = 0;
        let weightKg = 0;

        if (unit === 'metric') {
            const hCm = getFloatVal('healthHeightCm');
            const wKg = getFloatVal('healthWeightKg');
            heightM = hCm / 100;
            weightKg = wKg;
        } else {
            const feet = getFloatVal('healthHeightFt');
            const inches = getFloatVal('healthHeightIn');
            const lbs = getFloatVal('healthWeightLbs');
            heightM = ((feet * 12) + inches) * 0.0254;
            weightKg = lbs * 0.453592;
        }

        const age = getFloatVal('healthAge') || 25;
        const gender = document.getElementById('healthGender')?.value || 'male';

        if (heightM <= 0 || weightKg <= 0) return;

        // BMI Computation
        const bmi = weightKg / (heightM * heightM);
        const bmiRounded = bmi.toFixed(1);

        // Classification according to WHO standards
        let category = 'Normal';
        let badgeClass = 'badge-normal';
        let gaugePct = 0;

        if (bmi < 18.5) {
            category = 'Underweight';
            badgeClass = 'badge-under';
            gaugePct = Math.max(5, (bmi / 18.5) * 25);
        } else if (bmi < 25) {
            category = 'Normal';
            badgeClass = 'badge-normal';
            gaugePct = 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 25;
        } else if (bmi < 30) {
            category = 'Overweight';
            badgeClass = 'badge-over';
            gaugePct = 50 + ((bmi - 25) / (29.9 - 25)) * 25;
        } else {
            category = 'Obese';
            badgeClass = 'badge-obese';
            gaugePct = Math.min(95, 75 + ((bmi - 30) / 10) * 20);
        }

        const valEl = document.getElementById('bmiPrimaryVal');
        const badgeEl = document.getElementById('bmiStatusBadge');
        const pointerEl = document.getElementById('bmiGaugePointer');

        if (valEl) valEl.textContent = bmiRounded;
        if (badgeEl) {
            badgeEl.textContent = category;
            badgeEl.className = `status-badge ${badgeClass}`;
        }
        if (pointerEl) {
            pointerEl.style.left = `${gaugePct}%`;
        }

        // Healthy Weight Range: BMI 18.5 to 24.9
        const minHealthyKg = 18.5 * (heightM * heightM);
        const maxHealthyKg = 24.9 * (heightM * heightM);
        const rangeEl = document.getElementById('bmiHealthyRange');

        if (rangeEl) {
            if (unit === 'metric') {
                rangeEl.textContent = `${minHealthyKg.toFixed(1)} - ${maxHealthyKg.toFixed(1)} kg`;
            } else {
                const minLbs = minHealthyKg / 0.453592;
                const maxLbs = maxHealthyKg / 0.453592;
                rangeEl.textContent = `${minLbs.toFixed(1)} - ${maxLbs.toFixed(1)} lbs`;
            }
        }

        // Basal Metabolic Rate (BMR) - Mifflin-St Jeor formula
        let bmr = (10 * weightKg) + (6.25 * heightM * 100) - (5 * age);
        bmr = gender === 'male' ? bmr + 5 : bmr - 161;

        // Total Daily Energy Expenditure (TDEE) with light activity factor (1.375x)
        const tdee = bmr * 1.375;

        const bmrEl = document.getElementById('bmrVal');
        if (bmrEl) bmrEl.textContent = `${Math.round(bmr).toLocaleString()} kcal / day`;

        const tdeeEl = document.getElementById('tdeeVal');
        if (tdeeEl) tdeeEl.textContent = `${Math.round(tdee).toLocaleString()} kcal / day`;
    }
}

/** Default singleton instance of HealthCalculator */
export const HealthEngine = new HealthCalculator();
