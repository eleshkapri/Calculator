/**
 * ============================================================================
 * CalVerse Pro - DOM Utilities & User Feedback Helpers
 * File: src/core/dom.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Provides standardized cross-component helper utilities for extracting
 * numeric values from HTML input elements, triggering transient toast
 * notifications, and interacting with the system clipboard.
 * 
 * FUNCTIONS PRESENT IN THIS FILE:
 * 1. getFloatVal(id):
 *    - Safely reads the .value of an input element by ID and parses it into a Float.
 *    - Returns 0 if element does not exist or value is NaN.
 * 
 * 2. showToast(msg):
 *    - Displays a non-intrusive floating toast message to the user for 2.2 seconds.
 * 
 * 3. copyToClipboard(text):
 *    - Asynchronously writes string text to the user's OS clipboard using the
 *      Navigator Clipboard API, provides affirmative audio feedback, and shows a toast.
 * ============================================================================
 */

import { SoundFx } from './sound.js';

/**
 * Safely extracts and parses a floating-point number from an input element.
 * 
 * @param {string} id - The DOM element ID of the target input element.
 * @returns {number} The parsed numeric float value, or 0 if empty/invalid/missing.
 */
export function getFloatVal(id) {
    const el = document.getElementById(id);
    return el ? (parseFloat(el.value) || 0) : 0;
}

/**
 * Displays a transient toast notification banner at the bottom of the screen.
 * Automatically dims and hides itself after 2,200 milliseconds.
 * 
 * @param {string} msg - The notification message text to display.
 */
export function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
}

/**
 * Copies the provided string text to the system clipboard.
 * Plays an audio click confirmation and displays an on-screen toast notification.
 * 
 * @param {string} text - Text string to be copied into the user's clipboard.
 */
export function copyToClipboard(text) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied: ${text}`);
        SoundFx.playClick(1000);
    }).catch(() => {
        showToast('Failed to copy');
    });
}

/**
 * Escapes unsafe HTML characters to prevent Cross-Site Scripting (XSS).
 * 
 * @param {string} str - Raw string possibly containing special HTML characters.
 * @returns {string} Sanitized string safe for DOM interpolation.
 */
export function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
