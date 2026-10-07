/**
 * ============================================================================
 * CalVerse Pro - Navigation & UI Shell Router
 * File: src/ui/navigation.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Coordinates the application shell, layout, and screen transitions:
 * 1. Sidebar Drawer: Controls slide-out navigation for mobile and desktop, hamburger button,
 *    and background backdrop dimming.
 * 2. Calculator Mode Router: Switches active view among the 12 calculator tools, updates top
 *    app bar titles, and lazily mounts engine lifecycles.
 * 3. Subtab Navigation: Swaps inner view tabs (e.g. Loan EMI vs SIP vs Currency in Financial).
 * 4. Audio Feedback Toggle: Manages sound toggle button icon, label, and persistent localStorage setting.
 * 5. Calculation History Drawer: Slides out calculation history panel with tap-to-paste listeners.
 * 
 * FUNCTIONS PRESENT IN THIS FILE:
 * 1. initNavigation():
 *    - Binds sidebar open/close events, navigation item clicks, subtab switchers,
 *      sound toggle button, history drawer toggle, and clipboard copy buttons.
 * 
 * 2. switchMode(mode):
 *    - Transitions the UI to the requested calculator view mode.
 *    - Updates header title and subtitle via TITLES dictionary.
 *    - Lazily awakens and initializes the target engine (e.g. GraphEngine.init(), TimeEngine.init()).
 * ============================================================================
 */

import { state } from '../core/state.js';
import { TITLES } from '../core/constants.js';
import { SoundFx } from '../core/sound.js';
import { copyToClipboard } from '../core/dom.js';
import { renderHistoryList } from '../features/standard.js';
import { GraphEngine } from '../features/graphing.js';
import { FinancialEngine } from '../features/financial.js';
import { ConverterEngine } from '../features/converter.js';
import { ProgrammerEngine } from '../features/programmer.js';
import { HealthEngine } from '../features/health.js';
import { DateEngine } from '../features/date.js';
import { TimeEngine } from '../features/time.js';
import { DiscountEngine } from '../features/discount.js';
import { EquationEngine } from '../features/equations.js';
import { StatisticsEngine } from '../features/statistics.js';
import { initTheme } from './theme.js';

/**
 * Controls the slide-out navigation sidebar drawer.
 */
export function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('open');
}

export function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('open');
}

export function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

/**
 * Toggles calculation history slide-out drawer.
 */
export function toggleHistory() {
    const historyDrawer = document.getElementById('historyDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    if (historyDrawer && drawerOverlay) {
        historyDrawer.classList.toggle('open');
        drawerOverlay.classList.toggle('open');
        renderHistoryList();
    }
}

/**
 * Initializes shell navigation controls, mobile drawer, subtabs, and global toggles.
 */
export function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileTitleWrap = document.getElementById('mobileTitleWrap');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    // Mobile Hamburger Toggle
    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleSidebar);
    }

    // Mobile Title bar click opens sidebar mode chooser
    if (mobileTitleWrap) {
        mobileTitleWrap.addEventListener('click', openSidebar);
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', closeSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Sidebar navigation items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const mode = item.dataset.mode;
            switchMode(mode);
            closeSidebar();
        });
    });

    // Subtabs switcher within complex calculators (Financial, Discount, Time, Equations)
    document.querySelectorAll('.sub-tabs').forEach(container => {
        const tabs = container.querySelectorAll('.sub-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const targetSubtab = tab.dataset.subtab;
                const parentView = container.closest('.calculator-view');
                if (parentView) {
                    parentView.querySelectorAll('.subtab-view').forEach(view => {
                        view.classList.remove('active');
                    });
                    const targetView = parentView.querySelector(`#subtab-${targetSubtab}`);
                    if (targetView) targetView.classList.add('active');

                    // Clean toggle for financial toolbar currency dropdown
                    if (parentView.id === 'view-financial') {
                        const finPicker = document.getElementById('finCurrencyPickerWrap');
                        if (finPicker) {
                            finPicker.style.display = (targetSubtab === 'livecurrency') ? 'none' : 'flex';
                        }
                    }
                }
            });
        });
    });

    // Theme initialization
    initTheme();

    // Sound Toggle Controller
    const soundBtn = document.getElementById('soundToggleBtn');
    const soundIcon = document.getElementById('soundIcon');
    const soundText = soundBtn ? soundBtn.querySelector('.btn-text') : null;
    
    if (soundBtn && soundIcon && soundText) {
        soundIcon.textContent = SoundFx.enabled ? '🔊' : '🔇';
        soundText.textContent = SoundFx.enabled ? 'Sound ON' : 'Sound OFF';

        soundBtn.addEventListener('click', () => {
            SoundFx.enabled = !SoundFx.enabled;
            soundIcon.textContent = SoundFx.enabled ? '🔊' : '🔇';
            soundText.textContent = SoundFx.enabled ? 'Sound ON' : 'Sound OFF';
            localStorage.setItem('calverse_sound', SoundFx.enabled ? 'true' : 'false');
            if (SoundFx.enabled) {
                SoundFx.unlockAudio();
                SoundFx.playClick(900);
            }
        });
    }

    // Calculation History Drawer Toggle
    const histBtn = document.getElementById('historyToggleBtn');
    const quickHistBtn = document.getElementById('quickHistoryBtn');
    const closeHistBtn = document.getElementById('closeHistoryBtn');
    const drawerOverlay = document.getElementById('drawerOverlay');

    if (histBtn) histBtn.addEventListener('click', toggleHistory);
    if (quickHistBtn) quickHistBtn.addEventListener('click', toggleHistory);
    if (closeHistBtn) closeHistBtn.addEventListener('click', toggleHistory);
    if (drawerOverlay) drawerOverlay.addEventListener('click', toggleHistory);

    // Quick Copy Display Buttons
    const stdCopy = document.getElementById('stdCopyBtn');
    const sciCopy = document.getElementById('sciCopyBtn');
    if (stdCopy) stdCopy.addEventListener('click', () => copyToClipboard(document.getElementById('stdDisplay')?.value));
    if (sciCopy) sciCopy.addEventListener('click', () => copyToClipboard(document.getElementById('sciDisplay')?.value));
}

/**
 * Switches the active calculator view, updates app bar header, and wakes target engine.
 * 
 * @param {string} mode - Calculator view key (e.g. 'standard', 'scientific', 'graphing', etc.).
 */
export function switchMode(mode) {
    SoundFx.playClick(700);
    state.currentMode = mode;

    // Toggle active sidebar indicator
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.mode === mode);
    });

    // Toggle main calculator view visibility
    document.querySelectorAll('.calculator-view').forEach(view => {
        view.classList.toggle('active', view.id === `view-${mode}`);
    });

    // Update Top App Bar Header & Subtitle
    if (TITLES[mode]) {
        const titleEl = document.getElementById('calculatorTitle');
        const subtitleEl = document.getElementById('calculatorSubtitle');
        if (titleEl) titleEl.textContent = TITLES[mode].title;
        if (subtitleEl) subtitleEl.textContent = TITLES[mode].subtitle;
    }

    // Reset scroll positions so the new view starts cleanly at the top
    const mainViewport = document.querySelector('.main-viewport');
    const calcContainer = document.querySelector('.calculators-container');
    const activeView = document.getElementById(`view-${mode}`);
    if (mainViewport) mainViewport.scrollTop = 0;
    if (calcContainer) calcContainer.scrollTop = 0;
    if (activeView) activeView.scrollTop = 0;

    // Lazy initialization & refresh of engine calculations
    if (mode === 'graphing') {
        setTimeout(() => GraphEngine.init(), 50);
    } else if (mode === 'financial') {
        FinancialEngine.calculateEMI();
        FinancialEngine.calculateCompound();
    } else if (mode === 'converter') {
        ConverterEngine.init();
    } else if (mode === 'programmer') {
        ProgrammerEngine.updateDisplay();
    } else if (mode === 'health') {
        HealthEngine.calculate();
    } else if (mode === 'date') {
        DateEngine.init();
    } else if (mode === 'time') {
        TimeEngine.init();
    } else if (mode === 'discount') {
        DiscountEngine.init();
    } else if (mode === 'equation') {
        EquationEngine.init();
    } else if (mode === 'statistics') {
        StatisticsEngine.init();
    }
}
