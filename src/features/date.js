/**
 * ============================================================================
 * CalVerse Pro - Date & Age Calculation Engine
 * File: src/features/date.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Provides calendar and chronological date algorithms:
 * 1. Date Duration / Difference: Calculates absolute days, weeks, and hours between two dates.
 * 2. Chronological Age Breakdown: Computes exact years, months, and days lived from date of birth.
 * 3. Date Arithmetic: Computes future or past calendar dates by adding or subtracting an arbitrary number of days.
 * 
 * OBJECTS & METHODS PRESENT IN THIS FILE:
 * DateEngine:
 * 1. init():
 *    - Defaults date inputs to today's date and runs initial calculations.
 * 
 * 2. calculateDiff():
 *    - Reads 'dateFrom' and 'dateTo', computes the day delta, and updates display badges.
 * 
 * 3. calculateAge():
 *    - Computes exact chronological age taking into account leap years and varying month lengths.
 * 
 * 4. calculateAddSub():
 *    - Adds or subtracts specified days from a seed date and outputs the target weekday and date.
 * ============================================================================
 */

import { SoundFx } from '../core/sound.js';

export const DateEngine = {
    /**
     * Initializes default dates to today / year 2000 and calculates initial results.
     */
    init() {
        const today = new Date().toISOString().split('T')[0];
        const dFrom = document.getElementById('dateFrom');
        const dTo = document.getElementById('dateTo');
        const bDate = document.getElementById('birthDate');
        const asDate = document.getElementById('asOfDate');
        const addDate = document.getElementById('addsubDate');

        if (dFrom && !dFrom.value) dFrom.value = today;
        if (dTo && !dTo.value) dTo.value = today;
        if (bDate && !bDate.value) bDate.value = '2000-01-01';
        if (asDate && !asDate.value) asDate.value = today;
        if (addDate && !addDate.value) addDate.value = today;

        this.calculateDiff();
        this.calculateAge();
        this.calculateAddSub();
    },

    /**
     * Computes the absolute difference in days, weeks, and hours between two calendar dates.
     */
    calculateDiff() {
        SoundFx.playClick(600);
        const dFromEl = document.getElementById('dateFrom');
        const dToEl = document.getElementById('dateTo');
        if (!dFromEl || !dToEl) return;

        const from = new Date(dFromEl.value);
        const to = new Date(dToEl.value);

        if (isNaN(from.getTime()) || isNaN(to.getTime())) return;

        // Calculate absolute time difference in milliseconds
        const diffTime = Math.abs(to - from);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeks = (diffDays / 7).toFixed(1);

        const primEl = document.getElementById('diffPrimary');
        const breakEl = document.getElementById('diffBreakdown');
        if (primEl) primEl.textContent = `${diffDays} Days`;
        if (breakEl) {
            breakEl.innerHTML = `Equivalent to <strong>${weeks} weeks</strong> or <strong>${(diffDays * 24).toLocaleString()} hours</strong>`;
        }
    },

    /**
     * Calculates exact chronological age (Years, Months, Days) from birthdate up to an 'as of' date.
     * Accurately borrows days from previous months when day subtraction goes negative.
     */
    calculateAge() {
        SoundFx.playClick(600);
        const bDateEl = document.getElementById('birthDate');
        const asDateEl = document.getElementById('asOfDate');
        if (!bDateEl || !asDateEl) return;

        const dob = new Date(bDateEl.value);
        const asOf = new Date(asDateEl.value);

        if (isNaN(dob.getTime()) || isNaN(asOf.getTime())) return;

        let years = asOf.getFullYear() - dob.getFullYear();
        let months = asOf.getMonth() - dob.getMonth();
        let days = asOf.getDate() - dob.getDate();

        // Adjust negative day borrowing from previous month
        if (days < 0) {
            months--;
            const prevMonthDays = new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
            days += prevMonthDays;
        }
        // Adjust negative month borrowing from previous year
        if (months < 0) {
            years--;
            months += 12;
        }

        const totalDays = Math.floor((asOf - dob) / (1000 * 60 * 60 * 24));

        const agePrimEl = document.getElementById('agePrimary');
        const ageBreakEl = document.getElementById('ageBreakdown');
        if (agePrimEl) agePrimEl.textContent = `${years} Years, ${months} Months, ${days} Days`;
        if (ageBreakEl) {
            ageBreakEl.innerHTML = `Total lived: <strong>${totalDays.toLocaleString()} days</strong> (≈ <strong>${Math.floor(totalDays / 7).toLocaleString()} weeks</strong>)`;
        }
    },

    /**
     * Adds or subtracts days from a specified date and displays the resulting date and day of week.
     */
    calculateAddSub() {
        SoundFx.playClick(600);
        const asDateEl = document.getElementById('addsubDate');
        const opEl = document.getElementById('addsubOperation');
        const daysEl = document.getElementById('addsubDays');
        if (!asDateEl || !opEl || !daysEl) return;

        const start = new Date(asDateEl.value);
        const op = opEl.value;
        const days = parseInt(daysEl.value, 10) || 0;

        if (isNaN(start.getTime())) return;

        const resultDate = new Date(start);
        if (op === 'add') {
            resultDate.setDate(resultDate.getDate() + days);
        } else {
            resultDate.setDate(resultDate.getDate() - days);
        }

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const resEl = document.getElementById('addsubResult');
        const dayEl = document.getElementById('addsubDayOfWeek');
        if (resEl) resEl.textContent = resultDate.toLocaleDateString(undefined, options);
        if (dayEl) dayEl.textContent = `${op === 'add' ? '+' : '−'} ${days} days from ${start.toLocaleDateString()}`;
    }
};
