/**
 * CalVerse Pro - Financial & Currency Feature
 * Loan EMI calculator, SIP compound growth & live real-time currency exchange
 */

import { CURRENCY_CONFIG } from '../../core/constants.js';
import { formatMoney } from '../../core/format.js';
import { SoundFx } from '../../core/sound.js';
import { getFloatVal, showToast } from '../../core/dom.js';

export const FinancialEngine = {
    currentCurrency: localStorage.getItem('calverse_fin_currency') || 'INR',

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

        // Sliders & Number sync
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

        // Compound listeners
        ['ciPrincipal', 'ciMonthly', 'ciRate', 'ciYears', 'ciCompoundFreq'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.calculateCompound());
        });

        this.calculateEMI();
        this.calculateCompound();
        this.fetchLiveRates();
    },

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

    formatMoney(amount) {
        return formatMoney(amount, this.currentCurrency);
    },

    calculateEMI() {
        const P = getFloatVal('loanAmount');
        const annualRate = getFloatVal('interestRate');
        const years = getFloatVal('loanTenure');

        if (P <= 0 || annualRate <= 0 || years <= 0) return;

        const r = annualRate / 12 / 100;
        const n = years * 12;

        // EMI Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
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

        // Monthly SIP Future Value: PMT * [ ( (1 + i)^months - 1 ) / i ]
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

    // =====================================================================
    // Live Exchange Rates & Converter
    // =====================================================================
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
    ratesLastUpdated: null,

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
