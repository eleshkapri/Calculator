/**
 * ============================================================================
 * CalVerse Pro - Financial & Currency Calculation Engine (OOP Architecture)
 * File: src/features/financial.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Object-oriented financial computation and currency exchange engine:
 * 1. Loan EMI (Equated Monthly Installment) Calculator: Amortization schedule.
 * 2. Compound Interest & SIP Growth Calculator: Future value compound projections.
 * 3. Live Foreign Exchange Rate Converter: Real-time queries with offline fallback cache.
 * 
 * OOP PRINCIPLES:
 * 1. Inheritance: Extends BaseCalculator.
 * 2. Encapsulation: Currency states, exchange rate matrices, and loan parameters
 *    are encapsulated within FinancialCalculator.
 * 3. Security: Sanitizes popular currency cards and inputs.
 * ============================================================================
 */

import { BaseCalculator } from './base.js';
import { CURRENCY_CONFIG } from '../core/constants.js';
import { formatMoney } from '../core/format.js';
import { getFloatVal, showToast, escapeHtml } from '../core/dom.js';

export class FinancialCalculator extends BaseCalculator {
    constructor(id = 'financial') {
        super(id);
        this.currentCurrency = localStorage.getItem('calverse_fin_currency') || 'INR';
        this.rates = {
            USD: 1.0,
            INR: 83.50,
            EUR: 0.92,
            GBP: 0.79,
            JPY: 155.20,
            AED: 3.67,
            CAD: 1.36,
            AUD: 1.51
        };
        this.ratesLastUpdated = null;
    }

    /**
     * Bootstraps financial currency, synchronizes sliders, and runs models.
     */
    init() {
        if (this.isInitialized) return;
        this.markInitialized();

        const curSelect = document.getElementById('finCurrencySelect');
        if (curSelect) {
            curSelect.value = this.currentCurrency;
        }
        this.updateLabels();

        // Restore offline cached exchange rates
        try {
            const cachedRates = localStorage.getItem('calverse_rates_cache');
            if (cachedRates) {
                const parsed = JSON.parse(cachedRates);
                if (parsed && parsed.rates) {
                    this.rates = { ...this.rates, ...parsed.rates };
                    if (parsed.time) this.ratesLastUpdated = new Date(parsed.time);
                }
            }
        } catch (e) {}

        // Two-way synchronization between number input boxes and range sliders
        const syncInputs = [
            ['loanAmount', 'loanAmountRange'],
            ['interestRate', 'interestRateRange'],
            ['loanTenure', 'loanTenureRange']
        ];

        syncInputs.forEach(([numId, rangeId]) => {
            const num = document.getElementById(numId);
            const range = document.getElementById(rangeId);
            if (num && range) {
                num.addEventListener('input', () => { range.value = num.value; this.calculateEMI(); });
                range.addEventListener('input', () => { num.value = range.value; this.calculateEMI(); });
            }
        });

        // Compound interest input listeners
        ['ciPrincipal', 'ciMonthly', 'ciRate', 'ciYears', 'ciCompoundFreq'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.calculateCompound());
        });

        this.calculateEMI();
        this.calculateCompound();
        this.fetchLiveRates();
    }

    /**
     * Switches the active financial currency code.
     * @param {string} code
     */
    setCurrency(code) {
        if (CURRENCY_CONFIG[code]) {
            this.playFeedback(600);
            this.currentCurrency = code;
            localStorage.setItem('calverse_fin_currency', code);
            this.updateLabels();
            this.calculateEMI();
            this.calculateCompound();
        }
    }

    /**
     * Updates header currency symbol badges.
     */
    updateLabels() {
        const symbol = CURRENCY_CONFIG[this.currentCurrency]?.symbol || this.currentCurrency;
        document.querySelectorAll('.fin-curr-symbol').forEach(el => {
            el.textContent = symbol;
        });
    }

    /**
     * Formats an amount using active currency locale rules.
     * @param {number} amount
     * @returns {string}
     */
    formatMoney(amount) {
        return formatMoney(amount, this.currentCurrency);
    }

    /**
     * Computes loan EMI and updates breakdown charts.
     */
    calculateEMI() {
        const P = getFloatVal('loanAmount');
        const annualRate = getFloatVal('interestRate');
        const tenureYears = getFloatVal('loanTenure');

        if (P <= 0 || annualRate < 0 || tenureYears <= 0) return;

        const N = tenureYears * 12; // Total months
        const r = (annualRate / 12) / 100; // Monthly fractional interest

        let emi = 0;
        let totalPayment = 0;
        let totalInterest = 0;

        if (r === 0) {
            emi = P / N;
            totalPayment = P;
            totalInterest = 0;
        } else {
            const factor = Math.pow(1 + r, N);
            emi = (P * r * factor) / (factor - 1);
            totalPayment = emi * N;
            totalInterest = totalPayment - P;
        }

        const emiEl = document.getElementById('emiMonthlyVal');
        const prinEl = document.getElementById('emiTotalPrincipal');
        const intEl = document.getElementById('emiTotalInterest');
        const totEl = document.getElementById('emiTotalPayment');
        const barPrin = document.getElementById('emiBarPrincipal');
        const barInt = document.getElementById('emiBarInterest');

        if (emiEl) emiEl.textContent = this.formatMoney(emi);
        if (prinEl) prinEl.textContent = this.formatMoney(P);
        if (intEl) intEl.textContent = this.formatMoney(totalInterest);
        if (totEl) totEl.textContent = this.formatMoney(totalPayment);

        if (barPrin && barInt && totalPayment > 0) {
            const pPct = ((P / totalPayment) * 100).toFixed(1);
            const iPct = ((totalInterest / totalPayment) * 100).toFixed(1);
            barPrin.style.width = `${pPct}%`;
            barInt.style.width = `${iPct}%`;
            barPrin.title = `Principal: ${pPct}%`;
            barInt.title = `Interest: ${iPct}%`;
        }
    }

    /**
     * Computes future value of compound lump sum plus recurring monthly contributions.
     */
    calculateCompound() {
        const P = getFloatVal('ciPrincipal');
        const PMT = getFloatVal('ciMonthly');
        const annualRate = getFloatVal('ciRate');
        const years = getFloatVal('ciYears');
        const freqSelect = document.getElementById('ciCompoundFreq');
        const n = parseInt(freqSelect?.value || '12', 10);

        if (years <= 0) return;

        const r = annualRate / 100;
        const totalInvested = P + (PMT * 12 * years);

        // Future Value of Initial Principal
        const fvPrincipal = P * Math.pow(1 + (r / n), n * years);

        // Future Value of Monthly Contributions (Ordinary Annuity formula)
        let fvContributions = 0;
        if (PMT > 0) {
            const rMonth = r / 12;
            const totalMonths = years * 12;
            if (rMonth === 0) {
                fvContributions = PMT * totalMonths;
            } else {
                fvContributions = PMT * ((Math.pow(1 + rMonth, totalMonths) - 1) / rMonth);
            }
        }

        const totalFutureValue = fvPrincipal + fvContributions;
        const totalInterest = Math.max(0, totalFutureValue - totalInvested);

        const fvEl = document.getElementById('ciFutureValue');
        const invEl = document.getElementById('ciTotalInvested');
        const intEl = document.getElementById('ciTotalInterest');
        const barInv = document.getElementById('ciBarInvested');
        const barInt = document.getElementById('ciBarInterest');

        if (fvEl) fvEl.textContent = this.formatMoney(totalFutureValue);
        if (invEl) invEl.textContent = this.formatMoney(totalInvested);
        if (intEl) intEl.textContent = this.formatMoney(totalInterest);

        if (barInv && barInt && totalFutureValue > 0) {
            const invPct = ((totalInvested / totalFutureValue) * 100).toFixed(1);
            const intPct = ((totalInterest / totalFutureValue) * 100).toFixed(1);
            barInv.style.width = `${invPct}%`;
            barInt.style.width = `${intPct}%`;
        }
    }

    /**
     * Queries live foreign exchange rates from open.er-api.com.
     * @param {boolean} [showFeedback=false]
     */
    async fetchLiveRates(showFeedback = false) {
        const refreshBtn = document.getElementById('currencyRefreshBtn');
        const statusEl = document.getElementById('currencyStatusText');

        if (refreshBtn) refreshBtn.classList.add('spinning');
        if (statusEl) statusEl.textContent = 'Updating exchange rates...';

        try {
            const res = await fetch('https://open.er-api.com/v6/latest/USD');
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();

            if (data && data.rates) {
                this.rates = data.rates;
                this.ratesLastUpdated = new Date();
                try {
                    localStorage.setItem('calverse_rates_cache', JSON.stringify({
                        rates: this.rates,
                        time: this.ratesLastUpdated.toISOString()
                    }));
                } catch (e) {}

                if (statusEl) statusEl.textContent = `Updated: ${this.ratesLastUpdated.toLocaleTimeString()}`;
                if (showFeedback) showToast('Live exchange rates updated!');
                this.convert('from');
                this.renderPopularPairs();
            }
        } catch (err) {
            if (statusEl) {
                statusEl.textContent = this.ratesLastUpdated
                    ? `Offline (Cached: ${this.ratesLastUpdated.toLocaleDateString()})`
                    : 'Using offline fallback rates';
            }
            if (showFeedback) showToast('Using offline exchange rates');
            this.convert('from');
            this.renderPopularPairs();
        } finally {
            if (refreshBtn) refreshBtn.classList.remove('spinning');
        }
    }

    /**
     * Converts active currency inputs bidirectionally.
     * @param {'from'|'to'} [source='from']
     */
    convert(source = 'from') {
        const fromUnit = document.getElementById('currencyUnitFrom')?.value || 'USD';
        const toUnit = document.getElementById('currencyUnitTo')?.value || 'INR';
        const fromRate = this.rates[fromUnit] || 1;
        const toRate = this.rates[toUnit] || 1;

        const fromInput = document.getElementById('currencyValFrom');
        const toInput = document.getElementById('currencyValTo');
        const formulaEl = document.getElementById('currencyFormula');

        const oneUnitConverted = (1 / fromRate) * toRate;
        if (formulaEl) {
            formulaEl.textContent = `1 ${fromUnit} = ${oneUnitConverted.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${toUnit}`;
        }

        if (source === 'from' && fromInput && toInput) {
            const val = parseFloat(fromInput.value) || 0;
            const converted = (val / fromRate) * toRate;
            toInput.value = parseFloat(converted.toFixed(4));
        } else if (source === 'to' && fromInput && toInput) {
            const val = parseFloat(toInput.value) || 0;
            const converted = (val / toRate) * fromRate;
            fromInput.value = parseFloat(converted.toFixed(4));
        }
    }

    /**
     * Swaps From and To currencies.
     */
    swap() {
        this.playFeedback(600);
        const fromSelect = document.getElementById('currencyUnitFrom');
        const toSelect = document.getElementById('currencyUnitTo');
        if (fromSelect && toSelect) {
            const temp = fromSelect.value;
            fromSelect.value = toSelect.value;
            toSelect.value = temp;
            this.convert('from');
        }
    }

    /**
     * Renders popular currency pair quick conversion cards.
     */
    renderPopularPairs() {
        const pairsGrid = document.getElementById('popularPairsGrid');
        if (!pairsGrid) return;

        const popular = [
            ['USD', 'INR'],
            ['EUR', 'USD'],
            ['GBP', 'INR'],
            ['USD', 'AED'],
            ['EUR', 'INR'],
            ['USD', 'CAD'],
            ['USD', 'JPY'],
            ['AED', 'INR']
        ];

        pairsGrid.innerHTML = popular.map(([from, to]) => {
            const fRate = this.rates[from] || 1;
            const tRate = this.rates[to] || 1;
            const rate = (1 / fRate) * tRate;
            return `
                <div class="pair-card" onclick="CalVerse.setQuickPair('${escapeHtml(from)}', '${escapeHtml(to)}')">
                    <span class="pair-names">${escapeHtml(from)} / ${escapeHtml(to)}</span>
                    <span class="pair-rate">${rate.toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
                </div>
            `;
        }).join('');
    }

    /**
     * Activates a currency pair.
     * @param {string} from 
     * @param {string} to 
     */
    setQuickPair(from, to) {
        this.playFeedback(600);
        const fromSelect = document.getElementById('currencyUnitFrom');
        const toSelect = document.getElementById('currencyUnitTo');
        if (fromSelect && toSelect) {
            fromSelect.value = from;
            toSelect.value = to;
            this.convert('from');
            showToast(`Switched pair to ${from}/${to}`);
        }
    }
}

/** Default singleton instance of FinancialCalculator */
export const FinancialEngine = new FinancialCalculator();
