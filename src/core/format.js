/**
 * CalVerse Pro - Core Formatting Engine
 * Consistent currency and number localization across all calculators
 */

import { CURRENCY_CONFIG } from './constants.js';

export function formatMoney(amount, currencyCode = 'INR') {
    const cur = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.INR;
    try {
        return new Intl.NumberFormat(cur.locale, {
            style: 'currency',
            currency: currencyCode,
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(amount);
    } catch (e) {
        const formatted = Number(amount).toLocaleString(cur.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return `${cur.symbol}${formatted}`;
    }
}

export function formatNumber(val, maxDecimals = 4) {
    if (isNaN(val)) return '--';
    return Number(Number(val).toFixed(maxDecimals)).toLocaleString();
}
