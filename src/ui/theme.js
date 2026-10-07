/**
 * CalVerse Pro - Theme Controller
 * Dual-theme architecture (Dark Obsidian / Light), OS mood synchronization & persistent storage
 */

import { state } from '../core/state.js';
import { SoundFx } from '../core/sound.js';
import { GraphEngine } from '../features/graphing/graphing.js';
import { StatisticsEngine } from '../features/statistics/statistics.js';

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
    
    // Sync mobile OS status bar color
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
        themeMeta.setAttribute('content', isLight ? '#f1f5f9' : '#0a0e17');
    }

    // Remember this mood for next app open
    try { localStorage.setItem('calverse_last_theme', isLight ? 'light' : 'dark'); } catch(e) {}

    // Redraw charts if active
    if (state.currentMode === 'graphing' && typeof GraphEngine !== 'undefined') GraphEngine.render();
    if (state.currentMode === 'statistics' && typeof StatisticsEngine !== 'undefined') StatisticsEngine.calculateStats();
}

export function initTheme() {
    const saved = localStorage.getItem('calverse_last_theme');
    if (saved) {
        applyTheme(saved);
    } else {
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        applyTheme(prefersLight ? 'light' : 'dark');
    }

    // Listen for LIVE OS theme switches (e.g. phone sunrise/sunset auto mode)
    if (window.matchMedia) {
        const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: light)');
        colorSchemeMedia.addEventListener('change', (e) => {
            applyTheme(e.matches ? 'light' : 'dark');
        });
    }

    // Toggle button: switches theme and saves for next visit
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            SoundFx.playClick(800);
            const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
            applyTheme(nextTheme);
        });
    }
}
