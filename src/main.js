/**
 * ============================================================================
 * CalVerse Pro - Main Application Entry Point & Facade (OOP Architecture)
 * File: src/main.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * The orchestrator and bootstrapper of the entire CalVerse Pro suite.
 * 1. Facade Pattern: Aggregates the 12 feature engines, core services, and UI
 *    controllers into a unified, frozen `CalVerse` namespace object attached to `window.CalVerse`.
 * 2. 100% Backward Compatibility: Preserves every existing inline HTML handler.
 * 3. Security: Freezes the global CalVerse API to protect against prototype tampering
 *    or malicious third-party script overrides.
 * 4. Lifecycle Bootstrapper: Coordinates clean DOMContentLoaded initialization.
 * ============================================================================
 */

import { initSoundAutoUnlock, SoundFx } from './core/sound.js';
import { copyToClipboard, showToast } from './core/dom.js';
import {
    StandardEngine,
    inputVal,
    clear,
    backspace,
    toggleSign,
    calculate,
    memClear,
    memRecall,
    memStore,
    memAdd,
    memSub,
    renderHistoryList,
    clearHistory
} from './features/standard.js';
import { ScientificEngine, inputFunc, toggleAngleMode } from './features/scientific.js';
import { GraphEngine } from './features/graphing.js';
import { FinancialEngine } from './features/financial.js';
import { ProgrammerEngine } from './features/programmer.js';
import { HealthEngine } from './features/health.js';
import { DateEngine } from './features/date.js';
import { TimeEngine } from './features/time.js';
import { DiscountEngine } from './features/discount.js';
import { EquationEngine } from './features/equations.js';
import { StatisticsEngine } from './features/statistics.js';
import { initNavigation, switchMode, openSidebar, closeSidebar, toggleSidebar, toggleHistory } from './ui/navigation.js';
import { toggleTheme } from './ui/theme.js';
import { initKeyboard } from './ui/keyboard.js';
import { initSidebarClock, updateSidebarClock } from './ui/clock.js';
import { PWAController, initPWA } from './ui/pwa.js';

/**
 * Public CalVerse Global Facade Class.
 * Coordinates all sub-engines under an encapsulated, tamper-proof interface.
 */
export class CalVerseFacade {
    constructor() {
        // Navigation & Shell Controls
        this.switchMode = (mode) => switchMode(mode);
        this.openSidebar = () => openSidebar();
        this.closeSidebar = () => closeSidebar();
        this.toggleSidebar = () => toggleSidebar();
        this.toggleHistory = () => toggleHistory();
        this.toggleTheme = () => toggleTheme();

        // Standard & Scientific Keypad API
        this.inputVal = inputVal;
        this.inputFunc = inputFunc;
        this.clear = clear;
        this.backspace = backspace;
        this.toggleSign = toggleSign;
        this.calculate = calculate;
        this.memClear = memClear;
        this.memRecall = memRecall;
        this.memStore = memStore;
        this.memAdd = memAdd;
        this.memSub = memSub;
        this.toggleAngleMode = toggleAngleMode;
        this.clearHistory = clearHistory;

        // Graphing API
        this.plotGraph = () => GraphEngine.render();
        this.setGraphPreset = (f1, f2) => {
            const i1 = document.getElementById('graphFuncInput1');
            const i2 = document.getElementById('graphFuncInput2');
            if (i1) i1.value = f1;
            if (i2) i2.value = f2;
            GraphEngine.render();
        };
        this.zoomGraph = (factor) => GraphEngine.zoom(factor);
        this.resetGraph = () => GraphEngine.reset();

        // Financial & Currency API
        this.calculateEMI = () => FinancialEngine.calculateEMI();
        this.calculateCompound = () => FinancialEngine.calculateCompound();
        this.setFinancialCurrency = (code) => FinancialEngine.setCurrency(code);
        this.refreshExchangeRates = () => FinancialEngine.fetchLiveRates(true);
        this.convertCurrency = (source) => FinancialEngine.convert(source);
        this.swapCurrencyUnits = () => FinancialEngine.swap();
        this.setQuickPair = (from, to) => FinancialEngine.setQuickPair(from, to);

        // Programmer API
        this.setRadix = (r) => ProgrammerEngine.setRadix(r);
        this.setWordSize = (b) => ProgrammerEngine.setWordSize(b);
        this.inputProgDigit = (d) => ProgrammerEngine.inputDigit(d);
        this.inputProgBitwise = (op) => ProgrammerEngine.inputBitwise(op);
        this.inputProgOp = (op) => ProgrammerEngine.inputOp(op);
        this.calculateProg = () => ProgrammerEngine.calculate();
        this.toggleProgSign = () => ProgrammerEngine.toggleSign();

        // Health API
        this.setHealthUnit = (u) => HealthEngine.setUnit(u);
        this.calculateHealth = () => HealthEngine.calculate();

        // Date API
        this.calculateDateDiff = () => DateEngine.calculateDiff();
        this.calculateAge = () => DateEngine.calculateAge();
        this.calculateAddSubDate = () => DateEngine.calculateAddSub();

        // Time API
        this.inputTimeKeypad = (val) => TimeEngine.inputKeypad(val);
        this.inputTimeUnit = (unit) => TimeEngine.inputUnit(unit);
        this.clearTimeKeypad = () => TimeEngine.clearKeypad();
        this.backspaceTimeKeypad = () => TimeEngine.backspaceKeypad();
        this.calculateTimeKeypad = () => TimeEngine.calculateKeypad(true);
        this.toggleTimeResultFormat = () => TimeEngine.toggleFormat();
        this.copyTimeKeypadResult = () => TimeEngine.copyKeypadResult();
        this.calculateTimeDuration = () => TimeEngine.calculateDuration();
        this.calculateTimeMath = () => TimeEngine.calculateMath();
        this.convertEpochToDate = () => TimeEngine.convertEpochToDate();
        this.convertDateToEpoch = () => TimeEngine.convertDateToEpoch();

        // Constants API
        this.copyConstant = (val, name) => {
            copyToClipboard(val);
            SoundFx.playClick(650);
            showToast(`Copied ${name}: ${val}`);
        };

        // Discount & Tip API
        this.setDiscountCurrency = (code) => DiscountEngine.setCurrency(code);
        this.calculateDiscount = () => DiscountEngine.calculateDiscount();
        this.setDiscountPct = (p) => DiscountEngine.setDiscountPct(p);
        this.calculateTip = () => DiscountEngine.calculateTip();
        this.setTipPct = (p) => DiscountEngine.setTipPct(p);
        this.stepTipPeople = (delta) => DiscountEngine.stepTipPeople(delta);
        this.copyTipSummary = () => DiscountEngine.copyTipSummary();

        // Equation & Algebra API
        this.solveQuadratic = () => EquationEngine.solveQuadratic();
        this.solveLinearSystem = () => EquationEngine.solveLinearSystem();
        this.calculateFraction = () => EquationEngine.calculateFraction();

        // Statistics API
        this.calculateStats = () => StatisticsEngine.calculateStats();
        this.setStatsChartMode = (m) => StatisticsEngine.setChartMode(m);
        this.loadStatsPreset = (t) => StatisticsEngine.loadPreset(t);
        this.clearStatsData = () => StatisticsEngine.clearData();
        this.copyStatsSummary = () => StatisticsEngine.copySummary();

        // Install Modal & Platform API
        this.openInstallModal = () => PWAController.openInstallModal();
        this.closeInstallModal = () => PWAController.closeInstallModal();
        this.downloadDetectedApp = () => PWAController.downloadDetectedApp();
        this.installAndroidApp = () => PWAController.installAndroidApp();
        this.downloadExe = () => PWAController.downloadExe();
        this.downloadIosProfile = () => PWAController.downloadIosProfile();
        this.triggerPwaPrompt = () => PWAController.triggerPwaPrompt();
        this.updateSidebarClock = () => updateSidebarClock();
    }
}

/** Create and freeze public facade API to prevent runtime tampering */
export const CalVerse = Object.freeze(new CalVerseFacade());

// Expose on global window object
window.CalVerse = CalVerse;

/**
 * Robust application bootstrapper with per-subsystem error isolation.
 * Automatically runs immediately if DOM is already parsed or on DOMContentLoaded.
 */
function boot() {
    try { initSidebarClock(); } catch (e) { console.error('Clock init error:', e); }
    try { initSoundAutoUnlock(); } catch (e) { console.warn('SoundFx unlock error:', e); }
    try { initNavigation(); } catch (e) { console.error('Navigation init error:', e); }
    try { initKeyboard(); } catch (e) { console.error('Keyboard init error:', e); }
    try { FinancialEngine.init(); } catch (e) { console.error('Financial init error:', e); }
    try { DiscountEngine.init(); } catch (e) { console.error('Discount init error:', e); }
    try { EquationEngine.init(); } catch (e) { console.error('Equation init error:', e); }
    try { StatisticsEngine.init(); } catch (e) { console.error('Statistics init error:', e); }
    try { DateEngine.init(); } catch (e) { console.error('Date init error:', e); }
    try { renderHistoryList(); } catch (e) { console.error('History init error:', e); }
    try { initPWA(); } catch (e) { console.error('PWA init error:', e); }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
