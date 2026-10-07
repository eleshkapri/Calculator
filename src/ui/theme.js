/**
 * ============================================================================
 * CalVerse Pro - Theme Controller & OS Mood Synchronization
 * File: src/ui/theme.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Controls the dual-theme visual appearance of CalVerse:
 * 1. Themes:
 *    - Dark Obsidian (#0a0e17): Premium OLED dark mode with neon accents.
 *    - Modern Light (#f1f5f9): High-contrast clean daylight interface.
 * 2. Mobile OS Status Bar Integration: Dynamically updates the <meta name="theme-color">
 *    tag to seamlessly color the mobile browser status and notch bar.
 * 3. System Preferences & Persistence: Automatically synchronizes with OS light/dark
 *    color schemes (matchMedia) and persists user manual override in localStorage.
 * 4. Canvas Refresh: Triggers immediate re-rendering of Graphing and Statistics
 *    canvas charts so grid lines and text colors instantly adapt to the active theme.
 * 
 * FUNCTIONS PRESENT IN THIS FILE:
 * 1. applyTheme(themeName):
 *    - Toggles .light-theme and .dark-theme CSS classes on document.body and documentElement.
 *    - Updates toggle button icon and text label.
 *    - Updates meta theme-color tag.
 *    - Redraws active canvas curves and plots.
 * 
 * 2. initTheme():
 *    - Loads saved preference from localStorage or detects OS preference via matchMedia.
 *    - Attaches live OS scheme change listeners and toggle button click handlers.
 * ============================================================================
 */

import { state } from '../core/state.js';
import { SoundFx } from '../core/sound.js';
import { GraphEngine } from '../features/graphing.js';
import { StatisticsEngine } from '../features/statistics.js';

/**
 * Applies the requested visual theme to the DOM and synchronizes platform indicators.
 * 
 * @param {'light'|'dark'} themeName - Target theme identifier.
 */
export function applyTheme(themeName) {
    const isLight = themeName === 'light';
    document.body.classList.toggle('light-theme', isLight);
    document.body.classList.toggle('dark-theme', !isLight);
    document.documentElement.classList.toggle('light-theme', isLight);
    document.documentElement.classList.toggle('dark-theme', !isLight);
    
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = themeBtn ? themeBtn.querySelector('.btn-text') : null;

    if (themeIcon) themeIcon.textContent = isLight ? '🌙' : '☀️';
    if (themeText) themeText.textContent = isLight ? 'Dark Mode' : 'Light Mode';
    
    // Sync mobile browser status bar tint color
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
        themeMeta.setAttribute('content', isLight ? '#f1f5f9' : '#0a0e17');
    }

    // Persist user theme choice for subsequent sessions
    try { localStorage.setItem('calverse_last_theme', isLight ? 'light' : 'dark'); } catch(e) {}

    // Redraw canvas graphs and statistical diagrams to match theme contrast
    if (state.currentMode === 'graphing' && typeof GraphEngine !== 'undefined') GraphEngine.render();
    if (state.currentMode === 'statistics' && typeof StatisticsEngine !== 'undefined') StatisticsEngine.calculateStats();
}

/**
 * Initializes theme engine: restores saved theme, hooks OS changes, and attaches toggle button.
 */
export function initTheme() {
    const saved = localStorage.getItem('calverse_last_theme');
    if (saved) {
        applyTheme(saved);
    } else {
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        applyTheme(prefersLight ? 'light' : 'dark');
    }

    // Listen for live OS theme changes (e.g. automatic sunset light/dark toggle)
    if (window.matchMedia) {
        const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: light)');
        colorSchemeMedia.addEventListener('change', (e) => {
            applyTheme(e.matches ? 'light' : 'dark');
        });
    }

    // Manual theme toggle button listener
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            SoundFx.playClick(800);
            const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
            applyTheme(nextTheme);
        });
    }
}
