/**
 * CalVerse Pro - DOM Utilities
 * Reusable DOM extraction, toast notification & clipboard helpers
 */

import { SoundFx } from './sound.js';

export function getFloatVal(id) {
    const el = document.getElementById(id);
    return el ? (parseFloat(el.value) || 0) : 0;
}

export function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
}

export function copyToClipboard(text) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied: ${text}`);
        SoundFx.playClick(1000);
    }).catch(() => {
        showToast('Failed to copy');
    });
}
