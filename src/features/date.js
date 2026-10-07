/**
 * ============================================================================
 * CalVerse Pro - Date & Age Calculation Engine (OOP Architecture)
 * File: src/features/date.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Object-oriented calendar and chronological date calculation engine:
 * 1. Date Duration / Difference: Calculates absolute days, weeks, and hours between dates.
 * 2. Chronological Age Breakdown: Computes exact years, months, and days lived.
 * 3. Date Arithmetic: Computes future or past calendar dates by day offsets.
 * 
 * OOP PRINCIPLES:
 * 1. Inheritance: Extends BaseCalculator.
 * 2. Encapsulation: Date parsing, leap-year calculations, and day difference models
 *    are encapsulated in DateCalculator methods.
 * ============================================================================
 */

import { BaseCalculator } from './base.js';

export class DateCalculator extends BaseCalculator {
    constructor(id = 'date') {
        super(id);
    }

    /**
     * Initializes default dates and calculates initial results.
     */
    init() {
        if (this.isInitialized) return;
        this.markInitialized();

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
    }

    /**
     * Computes difference in days, weeks, and hours between two calendar dates.
     */
    calculateDiff() {
        this.playFeedback(600);
        const dFromEl = document.getElementById('dateFrom');
        const dToEl = document.getElementById('dateTo');
        if (!dFromEl || !dToEl) return;

        const d1 = new Date(dFromEl.value);
        const d2 = new Date(dToEl.value);

        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return;

        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffWeeks = (diffDays / 7).toFixed(1);
        const diffHours = (diffDays * 24).toLocaleString();

        const primEl = document.getElementById('dateDiffPrimary');
        const wksEl = document.getElementById('dateDiffWeeks');
        const hrsEl = document.getElementById('dateDiffHours');

        if (primEl) primEl.textContent = `${diffDays.toLocaleString()} Days`;
        if (wksEl) wksEl.textContent = `${diffWeeks} Weeks`;
        if (hrsEl) hrsEl.textContent = `${diffHours} Hours`;
    }

    /**
     * Computes exact chronological age taking into account varying month lengths and leap years.
     */
    calculateAge() {
        this.playFeedback(600);
        const birthEl = document.getElementById('birthDate');
        const asOfEl = document.getElementById('asOfDate');
        if (!birthEl || !asOfEl) return;

        const birth = new Date(birthEl.value);
        const asOf = new Date(asOfEl.value);

        if (isNaN(birth.getTime()) || isNaN(asOf.getTime()) || birth > asOf) return;

        let years = asOf.getFullYear() - birth.getFullYear();
        let months = asOf.getMonth() - birth.getMonth();
        let days = asOf.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            const prevMonthLastDay = new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
            days += prevMonthLastDay;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        const agePrim = document.getElementById('agePrimary');
        const ageSec = document.getElementById('ageSecondary');
        const daysLivedEl = document.getElementById('ageDaysLived');

        const totalDaysLived = Math.floor((asOf - birth) / (1000 * 60 * 60 * 24));

        if (agePrim) agePrim.textContent = `${years} Years, ${months} Months`;
        if (ageSec) ageSec.textContent = `${days} Days`;
        if (daysLivedEl) daysLivedEl.textContent = `Total Days Lived: ${totalDaysLived.toLocaleString()} days`;
    }

    /**
     * Adds or subtracts specified days from a date.
     */
    calculateAddSub() {
        this.playFeedback(600);
        const asDateEl = document.getElementById('addsubDate');
        const opEl = document.getElementById('addsubOp');
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
}

/** Default singleton instance of DateCalculator */
export const DateEngine = new DateCalculator();
