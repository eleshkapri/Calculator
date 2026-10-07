/**
 * CalVerse Pro - Date & Age Feature
 * Precise duration between dates, chronological age breakdown & date math
 */

import { SoundFx } from '../core/sound.js';

export const DateEngine = {
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

    calculateDiff() {
        SoundFx.playClick(600);
        const dFromEl = document.getElementById('dateFrom');
        const dToEl = document.getElementById('dateTo');
        if (!dFromEl || !dToEl) return;

        const from = new Date(dFromEl.value);
        const to = new Date(dToEl.value);

        if (isNaN(from.getTime()) || isNaN(to.getTime())) return;

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

        if (days < 0) {
            months--;
            const prevMonthDays = new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
            days += prevMonthDays;
        }
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
