/**
 * CalVerse Pro - Navigation & UI Shell Router
 * Sidebar management, mode switching, subtabs navigation & history drawer
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

export function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sidebar = document.getElementById('sidebar');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    const openSidebar = () => {
        if (sidebar) sidebar.classList.add('open');
        if (sidebarOverlay) sidebarOverlay.classList.add('open');
    };

    const closeSidebar = () => {
        if (sidebar) sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('open');
    };

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            if (sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', closeSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const mode = item.dataset.mode;
            switchMode(mode);
            closeSidebar();
        });
    });

    // Subtabs
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

    // Sound Toggle
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

    // History Drawer
    const historyDrawer = document.getElementById('historyDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const toggleHistory = () => {
        if (historyDrawer && drawerOverlay) {
            historyDrawer.classList.toggle('open');
            drawerOverlay.classList.toggle('open');
            renderHistoryList();
        }
    };

    const histBtn = document.getElementById('historyToggleBtn');
    const quickHistBtn = document.getElementById('quickHistoryBtn');
    const closeHistBtn = document.getElementById('closeHistoryBtn');

    if (histBtn) histBtn.addEventListener('click', toggleHistory);
    if (quickHistBtn) quickHistBtn.addEventListener('click', toggleHistory);
    if (closeHistBtn) closeHistBtn.addEventListener('click', toggleHistory);
    if (drawerOverlay) drawerOverlay.addEventListener('click', toggleHistory);

    // Copy buttons
    const stdCopy = document.getElementById('stdCopyBtn');
    const sciCopy = document.getElementById('sciCopyBtn');
    if (stdCopy) stdCopy.addEventListener('click', () => copyToClipboard(document.getElementById('stdDisplay')?.value));
    if (sciCopy) sciCopy.addEventListener('click', () => copyToClipboard(document.getElementById('sciDisplay')?.value));
}

export function switchMode(mode) {
    SoundFx.playClick(700);
    state.currentMode = mode;

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.mode === mode);
    });

    document.querySelectorAll('.calculator-view').forEach(view => {
        view.classList.toggle('active', view.id === `view-${mode}`);
    });

    if (TITLES[mode]) {
        const titleEl = document.getElementById('calculatorTitle');
        const subtitleEl = document.getElementById('calculatorSubtitle');
        if (titleEl) titleEl.textContent = TITLES[mode].title;
        if (subtitleEl) subtitleEl.textContent = TITLES[mode].subtitle;
    }

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
