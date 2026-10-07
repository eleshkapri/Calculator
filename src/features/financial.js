/**
 * ============================================================================
 * CalVerse Pro - Financial & Currency Calculation Engine
 * File: src/features/financial.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Powers three financial computation modules:
 * 1. Loan EMI (Equated Monthly Installment) Calculator:
 *    - Amortization formula computing monthly payment, total interest, and principal/interest ratios.
 * 2. Compound Interest & SIP (Systematic Investment Plan) Growth Calculator:
 *    - Future value projections combining initial lump-sum compounding and monthly SIP contributions.
 * 3. Live Foreign Exchange Rate Converter:
 *    - Fetches real-time currency exchange rates from open.er-api.com with offline cache persistence.
 *    - Bidirectional conversion and popular currency pairs grid.
 * 
 * OBJECTS & METHODS PRESENT IN THIS FILE:
 * FinancialEngine:
 * 1. init(): Restores saved currency & cached exchange rates, binds range sliders, runs initial models.
 * 2. setCurrency(code): Updates active financial currency and re-renders labels and figures.
 * 3. updateLabels(): Rewrites input header labels with active currency symbol.
 * 4. formatMoney(amount): Formats numeric values according to the active financial currency locale.
 * 5. calculateEMI(): Computes monthly EMI, total interest, principal ratio, and progress bar widths.
 * 6. calculateCompound(): Computes future value of compound lump sum plus recurring monthly contributions.
 * 7. fetchLiveRates(showFeedback): Queries real-time currency API; provides graceful offline fallback.
 * 8. convert(source): Performs bidirectional currency exchange conversion.
 * 9. swap(): Swaps 'From' and 'To' currency select values and reconverts.
 * 10. renderPopularPairs(): Renders clickable quick-convert currency pair cards.
 * 11. setQuickPair(from, to): Activates a currency pair when a card is clicked.
 * ============================================================================
 */

import { CURRENCY_CONFIG } from '../core/constants.js';
import { formatMoney } from '../core/format.js';
import { SoundFx } from '../core/sound.js';
import { getFloatVal, showToast } from '../core/dom.js';

export const FinancialEngine = {
    /** Currently selected currency code for loans and investments (persisted) */
    currentCurrency: localStorage.getItem('calverse_fin_currency') || 'INR',

    /**
     * Initializes financial subtab inputs, range sync listeners, and triggers live rates fetch.
     */
    init() {
        // Restore saved currency
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
    },

    /**
     * Switches the currency code for loan and investment calculations.
     * 
     * @param {string} code - ISO 4217 currency code (e.g., 'INR', 'USD', 'EUR').
     */
    setCurrency(code) {
        if (CURRENCY_CONFIG[code]) {
            SoundFx.playClick(600);
            this.currentCurrency = code;
            localStorage.setItem('calverse_fin_currency', code);
            this.updateLabels();
            this.calculateEMI();
            this.calculateCompound();
            showToast(`Currency set to ${CURRENCY_CONFIG[code].name} (${CURRENCY_CONFIG[code].symbol})`);
        }
    },

    /**
     * Updates label text in the UI to display the active currency symbol.
     */
    updateLabels() {
        const cur = CURRENCY_CONFIG[this.currentCurrency] || CURRENCY_CONFIG.INR;
        const sym = cur.symbol;

        const lAmount = document.getElementById('loanAmountLabel');
        if (lAmount) lAmount.textContent = `Loan Amount (${sym})`;

        const cPrinc = document.getElementById('ciPrincipalLabel');
        if (cPrinc) cPrinc.textContent = `Initial Principal (${sym})`;

        const cMonth = document.getElementById('ciMonthlyLabel');
        if (cMonth) cMonth.textContent = `Monthly Contribution (${sym})`;
    },

    /**
     * Formats an amount using the active financial currency settings.
     * 
     * @param {number} amount - Numeric monetary amount.
     * @returns {string} Localized currency string.
     */
    formatMoney(amount) {
        return formatMoney(amount, this.currentCurrency);
    },

    /**
     * Calculates loan EMI using the standard amortization formula:
     *   E = P * r * (1 + r)^n / ((1 + r)^n - 1)
     * Where:
     *   P = Principal loan amount
     *   r = Monthly interest rate (annual rate / 12 / 100)
     *   n = Total number of monthly installments (years * 12)
     */
    calculateEMI() {
        const P = getFloatVal('loanAmount');
        const annualRate = getFloatVal('interestRate');
        const years = getFloatVal('loanTenure');

        if (P <= 0 || annualRate <= 0 || years <= 0) return;

        const r = annualRate / 12 / 100;
        const n = years * 12;

        const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayable = emi * n;
        const totalInterest = totalPayable - P;

        const principalRatio = (P / totalPayable * 100).toFixed(1);
        const interestRatio = (totalInterest / totalPayable * 100).toFixed(1);

        document.getElementById('emiMonthly').textContent = this.formatMoney(emi);
        document.getElementById('emiPrincipal').textContent = this.formatMoney(P);
        document.getElementById('emiTotalInterest').textContent = this.formatMoney(totalInterest);
        document.getElementById('emiTotalPayable').textContent = this.formatMoney(totalPayable);

        document.getElementById('ratioPrincipal').textContent = `${principalRatio}%`;
        document.getElementById('ratioInterest').textContent = `${interestRatio}%`;
        document.getElementById('barPrincipal').style.width = `${principalRatio}%`;
        document.getElementById('barInterest').style.width = `${interestRatio}%`;
    },

    /**
     * Calculates Compound Interest & Monthly SIP Investment Growth.
     * Future Value:
     *   FV_lump = P * (1 + r/n)^(n*t)
     *   FV_sip  = PMT * (((1 + i)^months - 1) / i)
     */
    calculateCompound() {
        const P = getFloatVal('ciPrincipal');
        const PMT = getFloatVal('ciMonthly');
        const r = getFloatVal('ciRate') / 100;
        const t = getFloatVal('ciYears');
        const n = parseInt(document.getElementById('ciCompoundFreq').value, 10) || 12;

        const months = t * 12;
        const monthlyRate = r / 12;

        // Lump sum compound
        let FV_lump = P * Math.pow(1 + r / n, n * t);

        // Monthly recurring investment compounding
        let FV_sip = 0;
        if (monthlyRate > 0) {
            FV_sip = PMT * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        } else {
            FV_sip = PMT * months;
        }

        const totalFutureValue = FV_lump + FV_sip;
        const totalInvested = P + (PMT * months);
        const totalInterest = Math.max(0, totalFutureValue - totalInvested);

        document.getElementById('ciFutureValue').textContent = this.formatMoney(totalFutureValue);
        document.getElementById('ciTotalInvested').textContent = this.formatMoney(totalInvested);
        document.getElementById('ciTotalInterest').textContent = this.formatMoney(totalInterest);
    },

    // =========================================================================
    // Live Exchange Rates & Converter
    // =========================================================================

    /** Baseline exchange rates relative to USD (1.00) used offline or upon network failure */
    rates: {
        USD: 1,
        INR: 83.52,
        EUR: 0.92,
        GBP: 0.78,
        JPY: 155.40,
        CAD: 1.36,
        AUD: 1.51,
        AED: 3.67,
        CNY: 7.24,
        SGD: 1.35,
        CHF: 0.90,
        SAR: 3.75,
        KRW: 1365.20,
        BRL: 5.15,
        ZAR: 18.25,
        RUB: 91.50,
        NZD: 1.63,
        KWD: 0.31,
        QAR: 3.64,
        THB: 36.80
    },
    /** Timestamp when exchange rates were last synchronized */
    ratesLastUpdated: null,

    /**
     * Asynchronously downloads real-time currency conversion rates via Open Exchange Rates API.
     * Caches successful responses in localStorage. Gracefully falls back to cached data offline.
     * 
     * @param {boolean} [showFeedback=false] - Whether to show on-screen toast feedback upon completion.
     */
    async fetchLiveRates(showFeedback = false) {
        const statusText = document.getElementById('rateStatusText');
        const refreshIcon = document.getElementById('refreshIcon');
        if (refreshIcon) refreshIcon.style.animation = 'spin 1s infinite linear';

        if (!navigator.onLine) {
            // Device is offline: Use cached rates immediately without throwing network errors
            if (refreshIcon) refreshIcon.style.animation = '';
            if (statusText) {
                if (this.ratesLastUpdated) {
                    statusText.textContent = `Offline • Cached (${this.ratesLastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
                } else {
                    statusText.textContent = 'Offline • Baseline Rates';
                }
            }
            this.convert('from');
            this.renderPopularPairs();
            if (showFeedback) showToast('🟠 Offline: Operating from cached data');
            return;
        }

        try {
            const res = await fetch('https://open.er-api.com/v6/latest/USD');
            if (res.ok) {
                const data = await res.json();
                if (data && data.rates) {
                    this.rates = { ...this.rates, ...data.rates };
                    this.ratesLastUpdated = new Date();
                    localStorage.setItem('calverse_rates_cache', JSON.stringify({
                        rates: this.rates,
                        time: this.ratesLastUpdated.toISOString()
                    }));
                    if (statusText) {
                        statusText.textContent = `🟢 Live Rates: Updated ${this.ratesLastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    }
                    if (showFeedback) showToast('🟢 Live exchange rates updated');
                }
            }
        } catch (e) {
            // Offline fallback on fetch failure
            if (statusText) {
                statusText.textContent = this.ratesLastUpdated 
                    ? `Offline • Cached (${this.ratesLastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})` 
                    : 'Offline • Baseline Rates';
            }
        } finally {
            if (refreshIcon) refreshIcon.style.animation = '';
            this.convert('from');
            this.renderPopularPairs();
        }
    },

    /**
     * Converts currency amount between two selected currencies.
     * 
     * @param {'from'|'to'} [source='from'] - Field that triggered the calculation.
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
    },

    /**
     * Swaps the "From" and "To" currency units and triggers conversion.
     */
    swap() {
        SoundFx.playClick(600);
        const fromSelect = document.getElementById('currencyUnitFrom');
        const toSelect = document.getElementById('currencyUnitTo');
        if (fromSelect && toSelect) {
            const temp = fromSelect.value;
            fromSelect.value = toSelect.value;
            toSelect.value = temp;
            this.convert('from');
        }
    },

    /**
     * Populates quick-action cards for popular global currency pairs (USD/INR, EUR/USD, etc.).
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
                <div class="pair-card" onclick="CalVerse.setQuickPair('${from}', '${to}')">
                    <span class="pair-names">${from} / ${to}</span>
                    <span class="pair-rate">${rate.toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
                </div>
            `;
        }).join('');
    },

    /**
     * Selects a popular currency pair and refreshes conversion inputs.
     * 
     * @param {string} from - Source currency code.
     * @param {string} to - Target currency code.
     */
    setQuickPair(from, to) {
        SoundFx.playClick(600);
        const fromSelect = document.getElementById('currencyUnitFrom');
        const toSelect = document.getElementById('currencyUnitTo');
        if (fromSelect && toSelect) {
            fromSelect.value = from;
            toSelect.value = to;
            this.convert('from');
            showToast(`Switched pair to ${from}/${to}`);
        }
    }
};
