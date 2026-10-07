/**
 * ============================================================================
 * CalVerse Pro - Core Formatting Engine
 * File: src/core/format.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Centralizes international number and monetary formatting. Provides
 * consistent currency symbols, thousands separators, and fractional precision
 * across the Financial, Discount, Tip, and Health calculation engines.
 * 
 * FUNCTIONS PRESENT IN THIS FILE:
 * 1. formatMoney(amount, currencyCode):
 *    - Formats a numeric value into a localized currency string using
 *      ECMAScript Intl.NumberFormat with graceful fallback support.
 * 
 * 2. formatNumber(val, maxDecimals):
 *    - Formats general decimal numbers with thousands groupings and custom
 *      decimal limits, returning '--' if the input is not a valid number.
 * ============================================================================
 */

import { CURRENCY_CONFIG } from './constants.js';

/**
 * Formats a numeric amount into a localized currency string.
 * Uses Intl.NumberFormat based on the configured locale for that currency.
 * 
 * @param {number|string} amount - The numeric monetary value to format.
 * @param {string} [currencyCode='INR'] - The 3-letter ISO 4217 currency code (e.g., 'INR', 'USD', 'EUR').
 * @returns {string} Fully formatted monetary string (e.g., "$1,234.50" or "₹1,23,456.00").
 */
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
        // Fallback for environments lacking specific currency code definitions
        const formatted = Number(amount).toLocaleString(cur.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return `${cur.symbol}${formatted}`;
    }
}

/**
 * Formats a general numeric value with thousands separators and limited decimal precision.
 * 
 * @param {number|string} val - Numeric value to format.
 * @param {number} [maxDecimals=4] - Maximum count of fractional decimal digits to retain.
 * @returns {string} Formatted number string (e.g., "1,234.5678"), or "--" if NaN.
 */
export function formatNumber(val, maxDecimals = 4) {
    if (isNaN(val)) return '--';
    return Number(Number(val).toFixed(maxDecimals)).toLocaleString();
}
