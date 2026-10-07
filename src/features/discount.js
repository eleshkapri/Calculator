/**
 * CalVerse Pro - Discount & Tip Feature
 * Shopping savings, sales tax, coupon reduction & bill splitting with tip
 */

import { CURRENCY_CONFIG } from '../core/constants.js';
import { formatMoney } from '../core/format.js';
import { SoundFx } from '../core/sound.js';
import { copyToClipboard } from '../core/dom.js';

export const DiscountEngine = {
    currentCurrency: localStorage.getItem('calverse_disc_currency') || 'INR',

    init() {
        const curSelect = document.getElementById('discCurrencySelect');
        if (curSelect) {
            curSelect.value = this.currentCurrency;
        }
        this.updateLabels();
        this.calculateDiscount();
        this.calculateTip();
    },

    setCurrency(code) {
        if (CURRENCY_CONFIG[code]) {
            this.currentCurrency = code;
            localStorage.setItem('calverse_disc_currency', code);
            const curSelect = document.getElementById('discCurrencySelect');
            if (curSelect) curSelect.value = code;
            this.updateLabels();
            this.calculateDiscount();
            this.calculateTip();
            SoundFx.playClick(650);
        }
    },

    formatMoney(amount) {
        return formatMoney(amount, this.currentCurrency);
    },

    updateLabels() {
        const conf = CURRENCY_CONFIG[this.currentCurrency] || CURRENCY_CONFIG.INR;
        const origLabel = document.getElementById('discOriginalPriceLabel');
        const tipBillLabel = document.getElementById('tipBillAmountLabel');

        if (origLabel) origLabel.textContent = `Original Price (${conf.symbol.trim()})`;
        if (tipBillLabel) tipBillLabel.textContent = `Bill Amount (${conf.symbol.trim()})`;
    },

    calculateDiscount() {
        const orig = parseFloat(document.getElementById('discOriginalPrice')?.value) || 0;
        const pct = parseFloat(document.getElementById('discPercent')?.value) || 0;
        const coup = parseFloat(document.getElementById('discCoupon')?.value) || 0;
        const tax = parseFloat(document.getElementById('discTax')?.value) || 0;

        const discAmt = orig * (pct / 100);
        const afterDisc = orig - discAmt;
        const coupAmt = afterDisc * (coup / 100);
        const afterCoup = afterDisc - coupAmt;
        const taxAmt = afterCoup * (tax / 100);
        const finalPrice = afterCoup + taxAmt;
        const totalSaved = (orig - afterCoup);
        const savedPct = orig > 0 ? ((totalSaved / orig) * 100).toFixed(1) : '0';

        const finalEl = document.getElementById('discFinalPrice');
        const savingsEl = document.getElementById('discSavingsTag');
        const origEl = document.getElementById('discOrigShow');
        const amtEl = document.getElementById('discAmountShow');
        const coupRow = document.getElementById('discCouponRow');
        const coupEl = document.getElementById('discCouponShow');
        const taxRow = document.getElementById('discTaxRow');
        const taxEl = document.getElementById('discTaxShow');

        const formattedFinal = this.formatMoney(finalPrice);
        const formattedSaved = this.formatMoney(totalSaved);
        const formattedOrig = this.formatMoney(orig);
        const formattedDiscAmt = this.formatMoney(discAmt);
        const formattedCoupAmt = this.formatMoney(coupAmt);
        const formattedTaxAmt = this.formatMoney(taxAmt);

        if (finalEl) finalEl.textContent = formattedFinal;
        if (savingsEl) savingsEl.textContent = `You save ${formattedSaved} (${savedPct}%)`;
        if (origEl) origEl.textContent = formattedOrig;
        if (amtEl) amtEl.textContent = `-${formattedDiscAmt}`;

        if (coupRow) coupRow.style.display = coup > 0 ? 'flex' : 'none';
        if (coupEl) coupEl.textContent = `-${formattedCoupAmt}`;
        if (taxRow) taxRow.style.display = tax > 0 ? 'flex' : 'none';
        if (taxEl) taxEl.textContent = `+${formattedTaxAmt}`;
    },

    setDiscountPct(val) {
        SoundFx.playClick(600);
        const el = document.getElementById('discPercent');
        if (el) el.value = val;
        const chips = document.querySelectorAll('#subtab-discount-calc .quick-pct-chip');
        chips.forEach(c => c.classList.toggle('active', c.textContent.trim() === `${val}%`));
        this.calculateDiscount();
    },

    calculateTip() {
        const bill = parseFloat(document.getElementById('tipBillAmount')?.value) || 0;
        const tipPct = parseFloat(document.getElementById('tipPercent')?.value) || 0;
        const people = parseInt(document.getElementById('tipPeopleCount')?.value, 10) || 1;

        const tipAmt = bill * (tipPct / 100);
        const total = bill + tipAmt;
        const perPersonTotal = people > 0 ? total / people : total;
        const perPersonTip = people > 0 ? tipAmt / people : tipAmt;

        const perPersonEl = document.getElementById('tipPerPersonVal');
        const perPersonTipEl = document.getElementById('tipPerPersonTipVal');
        const totalBillEl = document.getElementById('tipTotalBillShow');
        const totalTipEl = document.getElementById('tipTotalTipShow');
        const grandTotalEl = document.getElementById('tipGrandTotalShow');
        const peopleEl = document.getElementById('tipPeopleCountShow');

        const formattedPerPerson = this.formatMoney(perPersonTotal);
        const formattedPerPersonTip = this.formatMoney(perPersonTip);
        const formattedBill = this.formatMoney(bill);
        const formattedTipAmt = this.formatMoney(tipAmt);
        const formattedTotal = this.formatMoney(total);

        if (perPersonEl) perPersonEl.textContent = formattedPerPerson;
        if (perPersonTipEl) perPersonTipEl.textContent = formattedPerPersonTip;
        if (totalBillEl) totalBillEl.textContent = formattedBill;
        if (totalTipEl) totalTipEl.textContent = formattedTipAmt;
        if (grandTotalEl) grandTotalEl.textContent = formattedTotal;
        if (peopleEl) peopleEl.textContent = people.toString();
    },

    setTipPct(val) {
        SoundFx.playClick(600);
        const el = document.getElementById('tipPercent');
        if (el) el.value = val;
        const chips = document.querySelectorAll('#subtab-tip-calc .quick-pct-chip');
        chips.forEach(c => c.classList.toggle('active', c.textContent.trim() === `${val}%`));
        this.calculateTip();
    },

    stepTipPeople(delta) {
        SoundFx.playClick(500);
        const el = document.getElementById('tipPeopleCount');
        if (!el) return;
        let val = parseInt(el.value, 10) || 1;
        val = Math.max(1, Math.min(100, val + delta));
        el.value = val;
        this.calculateTip();
    },

    copyTipSummary() {
        const bill = document.getElementById('tipTotalBillShow')?.textContent || this.formatMoney(0);
        const tip = document.getElementById('tipTotalTipShow')?.textContent || this.formatMoney(0);
        const grand = document.getElementById('tipGrandTotalShow')?.textContent || this.formatMoney(0);
        const people = document.getElementById('tipPeopleCountShow')?.textContent || '1';
        const perPerson = document.getElementById('tipPerPersonVal')?.textContent || this.formatMoney(0);

        const summary = `🧾 CalVerse Bill Split Receipt\nBill Amount: ${bill}\nTip Amount: ${tip}\nTotal with Tip: ${grand}\nSplit Between: ${people} person(s)\n👉 Each Person Pays: ${perPerson}`;
        copyToClipboard(summary);
    }
};
