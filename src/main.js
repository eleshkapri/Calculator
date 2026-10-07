/**
 * CalVerse Pro - Main Application Entry Point
 * Orchestrates all modular subsystems & exports public window.CalVerse API
 */

import { initSoundAutoUnlock, SoundFx } from './core/sound.js';
import { copyToClipboard, showToast } from './core/dom.js';
import {
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
import { inputFunc, toggleAngleMode } from './features/scientific.js';
import { GraphEngine } from './features/graphing.js';
import { FinancialEngine } from './features/financial.js';
import { ProgrammerEngine } from './features/programmer.js';
import { HealthEngine } from './features/health.js';
import { DateEngine } from './features/date.js';
import { TimeEngine } from './features/time.js';
import { DiscountEngine } from './features/discount.js';
import { EquationEngine } from './features/equations.js';
import { StatisticsEngine } from './features/statistics.js';
import { initNavigation, switchMode } from './ui/navigation.js';
import { initKeyboard } from './ui/keyboard.js';
import { initSidebarClock } from './ui/clock.js';
import { PWAController, initPWA } from './ui/pwa.js';

// =========================================================================
// Public CalVerse Global API Export (Maintains 100% inline HTML compatibility)
// =========================================================================
export const CalVerse = {
    // Navigation
    switchMode: (mode) => switchMode(mode),

    // Standard & Scientific Keypad API
    inputVal,
    inputFunc,
    clear,
    backspace,
    toggleSign,
    calculate,
    memClear,
    memRecall,
    memStore,
    memAdd,
    memSub,
    toggleAngleMode,
    clearHistory,

    // Graphing API
    plotGraph: () => GraphEngine.render(),
    setGraphPreset: (f1, f2) => {
        const i1 = document.getElementById('graphFuncInput1');
        const i2 = document.getElementById('graphFuncInput2');
        if (i1) i1.value = f1;
        if (i2) i2.value = f2;
        GraphEngine.render();
    },
    zoomGraph: (factor) => GraphEngine.zoom(factor),
    resetGraph: () => GraphEngine.reset(),

    // Financial & Currency API
    calculateEMI: () => FinancialEngine.calculateEMI(),
    calculateCompound: () => FinancialEngine.calculateCompound(),
    setFinancialCurrency: (code) => FinancialEngine.setCurrency(code),
    refreshExchangeRates: () => FinancialEngine.fetchLiveRates(true),
    convertCurrency: (source) => FinancialEngine.convert(source),
    swapCurrencyUnits: () => FinancialEngine.swap(),
    setQuickPair: (from, to) => FinancialEngine.setQuickPair(from, to),

    // Programmer API
    setRadix: (r) => ProgrammerEngine.setRadix(r),
    setWordSize: (b) => ProgrammerEngine.setWordSize(b),
    inputProgDigit: (d) => ProgrammerEngine.inputDigit(d),
    inputProgBitwise: (op) => ProgrammerEngine.inputBitwise(op),
    inputProgOp: (op) => ProgrammerEngine.inputOp(op),
    calculateProg: () => ProgrammerEngine.calculate(),
    toggleProgSign: () => ProgrammerEngine.toggleSign(),

    // Health API
    setHealthUnit: (u) => HealthEngine.setUnit(u),
    calculateHealth: () => HealthEngine.calculate(),

    // Date API
    calculateDateDiff: () => DateEngine.calculateDiff(),
    calculateAge: () => DateEngine.calculateAge(),
    calculateAddSubDate: () => DateEngine.calculateAddSub(),

    // Time API
    inputTimeKeypad: (val) => TimeEngine.inputKeypad(val),
    inputTimeUnit: (unit) => TimeEngine.inputUnit(unit),
    clearTimeKeypad: () => TimeEngine.clearKeypad(),
    backspaceTimeKeypad: () => TimeEngine.backspaceKeypad(),
    calculateTimeKeypad: () => TimeEngine.calculateKeypad(true),
    toggleTimeResultFormat: () => TimeEngine.toggleFormat(),
    copyTimeKeypadResult: () => TimeEngine.copyKeypadResult(),
    calculateTimeDuration: () => TimeEngine.calculateDuration(),
    calculateTimeMath: () => TimeEngine.calculateMath(),
    convertEpochToDate: () => TimeEngine.convertEpochToDate(),
    convertDateToEpoch: () => TimeEngine.convertDateToEpoch(),

    // Constants API
    copyConstant: (val, name) => {
        copyToClipboard(val);
        SoundFx.playClick(650);
        showToast(`Copied ${name}: ${val}`);
    },

    // Discount & Tip API
    setDiscountCurrency: (code) => DiscountEngine.setCurrency(code),
    calculateDiscount: () => DiscountEngine.calculateDiscount(),
    setDiscountPct: (p) => DiscountEngine.setDiscountPct(p),
    calculateTip: () => DiscountEngine.calculateTip(),
    setTipPct: (p) => DiscountEngine.setTipPct(p),
    stepTipPeople: (delta) => DiscountEngine.stepTipPeople(delta),
    copyTipSummary: () => DiscountEngine.copyTipSummary(),

    // Equation & Algebra API
    solveQuadratic: () => EquationEngine.solveQuadratic(),
    solveLinearSystem: () => EquationEngine.solveLinearSystem(),
    calculateFraction: () => EquationEngine.calculateFraction(),

    // Statistics API
    calculateStats: () => StatisticsEngine.calculateStats(),
    setStatsChartMode: (m) => StatisticsEngine.setChartMode(m),
    loadStatsPreset: (t) => StatisticsEngine.loadPreset(t),
    clearStatsData: () => StatisticsEngine.clearData(),
    copyStatsSummary: () => StatisticsEngine.copySummary(),

    // Install Modal & Platform API
    openInstallModal: () => PWAController.openInstallModal(),
    closeInstallModal: () => PWAController.closeInstallModal(),
    downloadDetectedApp: () => PWAController.downloadDetectedApp(),
    installAndroidApp: () => PWAController.installAndroidApp(),
    downloadExe: () => PWAController.downloadExe(),
    downloadIosProfile: () => PWAController.downloadIosProfile(),
    triggerPwaPrompt: () => PWAController.triggerPwaPrompt()
};

// Bind to window for global access
window.CalVerse = CalVerse;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initSoundAutoUnlock();
    initNavigation();
    initKeyboard();
    FinancialEngine.init();
    DiscountEngine.init();
    EquationEngine.init();
    StatisticsEngine.init();
    renderHistoryList();
    initSidebarClock();
    initPWA();
});
