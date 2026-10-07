/**
 * CalVerse Pro - Compiled Production Bundle
 * Generated from modular src/ architecture
 * Built: 2026-10-07T11:50:45.802Z
 * Zero dependencies • Offline-ready PWA
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // Module: src/core/constants.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Core Constants & Reference Data
     * File: src/core/constants.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * This file serves as the single source of truth for global configuration,
     * currency formatting metadata, mode header descriptions, and conversion
     * ratios used throughout the CalVerse application.
     * 
     * EXPORTED DATA STRUCTURES:
     * 1. CURRENCY_CONFIG:
     *    - Metadata for supported world currencies (INR, USD, EUR, GBP, JPY, CAD, AUD, AED, CNY).
     *    - Includes ISO symbol, Intl.NumberFormat locale, and human-readable currency name.
     * 
     * 2. TITLES:
     *    - Header title and descriptive subtitle definitions for all 12 calculator modes.
     *    - Used by the navigation router to dynamically update the top app bar header.
     * 
     * 3. CONVERTER_UNITS:
     *    - Conversion multipliers and identifiers for 7 measurement categories:
     *      Length, Mass, Temperature, Area, Speed, Digital Storage, and Time.
     *    - All scalar values are normalized against standard SI base units.
     * ============================================================================
     */
    
    /**
     * Currency configuration dictionary for financial calculations and discount formatting.
     * Maps 3-letter ISO 4217 currency codes to locale formatting rules and currency symbols.
     */
    const CURRENCY_CONFIG = {
        INR: { symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
        USD: { symbol: '$', locale: 'en-US', name: 'US Dollar' },
        EUR: { symbol: '€', locale: 'de-DE', name: 'Euro' },
        GBP: { symbol: '£', locale: 'en-GB', name: 'British Pound' },
        JPY: { symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen' },
        CAD: { symbol: 'CA$', locale: 'en-CA', name: 'Canadian Dollar' },
        AUD: { symbol: 'AU$', locale: 'en-AU', name: 'Australian Dollar' },
        AED: { symbol: 'AED ', locale: 'ar-AE', name: 'UAE Dirham' },
        CNY: { symbol: '¥', locale: 'zh-CN', name: 'Chinese Yuan' }
    };
    
    /**
     * View Titles and Subtitles dictionary.
     * Maps mode keys to display titles rendered in the top app navigation bar.
     */
    const TITLES = {
        standard: { title: 'Standard Calculator', subtitle: 'Fast, precise everyday arithmetic' },
        scientific: { title: 'Scientific Calculator', subtitle: 'Advanced functions, trigonometry & algebra' },
        graphing: { title: 'Graphing Calculator', subtitle: 'Interactive 2D function visualizer & analyzer' },
        financial: { title: 'Financial Calculator', subtitle: 'Loan EMI, compound interest & investment growth' },
        converter: { title: 'Unit Converter', subtitle: 'Instant conversions across multiple categories' },
        programmer: { title: 'Programmer Calculator', subtitle: 'HEX, DEC, OCT, BIN & bitwise operations' },
        health: { title: 'BMI & Health Calculator', subtitle: 'Body mass index, healthy weight & metabolic rate' },
        date: { title: 'Date & Age Calculator', subtitle: 'Exact duration between dates and age breakdown' },
        time: { title: 'Time Calculator', subtitle: 'Work duration, time math, stopwatch & unix timestamps' },
        discount: { title: 'Discount & Tip Calculator', subtitle: 'Shopping savings, sales tax & bill splitting' },
        equation: { title: 'Equation & Algebra Solver', subtitle: 'Quadratic roots, 2x2 linear systems & fractions' },
        statistics: { title: 'Statistics & Data Analyzer', subtitle: 'Mean, median, variance, std dev & box plots' }
    };
    
    /**
     * Unit conversion factors relative to the standard SI base unit for each category.
     * Base Units:
     * - Length: Meter (m)
     * - Mass: Kilogram (kg)
     * - Area: Square Meter (m²)
     * - Speed: Meter per Second (m/s)
     * - Digital: Byte (B)
     * - Time: Second (s)
     * - Temperature: Evaluated via custom affine transformation formulas in converter.js
     */
    const CONVERTER_UNITS = {
        length: {
            Meter: 1,
            Kilometer: 1000,
            Centimeter: 0.01,
            Millimeter: 0.001,
            Mile: 1609.344,
            Yard: 0.9144,
            Foot: 0.3048,
            Inch: 0.0254
        },
        mass: {
            Kilogram: 1,
            Gram: 0.001,
            Milligram: 0.000001,
            MetricTon: 1000,
            Pound: 0.45359237,
            Ounce: 0.028349523
        },
        temperature: {
            Celsius: 'C',
            Fahrenheit: 'F',
            Kelvin: 'K'
        },
        area: {
            'Square Meter': 1,
            'Square Kilometer': 1000000,
            'Square Foot': 0.092903,
            'Acre': 4046.86,
            'Hectare': 10000
        },
        speed: {
            'Meter/Second': 1,
            'Kilometer/Hour': 0.277778,
            'Miles/Hour': 0.44704,
            'Knot': 0.514444
        },
        digital: {
            Byte: 1,
            Kilobyte: 1024,
            Megabyte: 1048576,
            Gigabyte: 1073741824,
            Terabyte: 1099511627776
        },
        time: {
            Second: 1,
            Minute: 60,
            Hour: 3600,
            Day: 86400,
            Week: 604800,
            Month: 2629746,
            Year: 31556952
        }
    };
    

    // -------------------------------------------------------------------------
    // Module: src/core/sound.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Audio & Haptic Feedback Synthesizer
     * File: src/core/sound.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Implements a zero-dependency audio synthesizer using the native HTML5
     * Web Audio API. Generates low-latency micro-tones (clicks/beeps) on user
     * button taps, providing pleasant tactile feedback. Resolves autoplay policy
     * constraints on mobile WebKit and Chrome.
     * 
     * OBJECTS & FUNCTIONS PRESENT IN THIS FILE:
     * 1. SoundFx:
     *    - Singleton object holding the AudioContext instance and sound preferences.
     *    - Methods:
     *      * unlockAudio(): Wakes suspended AudioContext and plays a silent buffer
     *        to satisfy iOS/Android autoplay restrictions.
     *      * playClick(freq, type, duration): Generates a custom frequency tone with
     *        exponential decay gain envelope.
     * 
     * 2. initSoundAutoUnlock():
     *    - Registers capture-phase event listeners on touchstart/touchend/click to
     *      transparently unlock the audio subsystem on the user's very first interaction.
     * ============================================================================
     */
    
    const SoundFx = {
        /** Whether sound feedback is enabled by user preference */
        enabled: localStorage.getItem('calverse_sound') === 'true',
        /** Internal Web Audio API AudioContext instance */
        ctx: null,
        /** Guard flag preventing multiple unlock buffer allocations */
        _unlocked: false,
    
        /**
         * Initializes and unlocks the Web Audio API context.
         * Required to be invoked from a direct user gesture (click/touch) to satisfy
         * modern browser audio autoplay policies.
         */
        unlockAudio() {
            if (this._unlocked && this.ctx) return;
            try {
                const AC = window.AudioContext || window.webkitAudioContext;
                if (!AC) return;
                if (!this.ctx) this.ctx = new AC();
    
                // Resume context if suspended (common in Chromium background tabs)
                if (this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
    
                // iOS Safari requirement: Play a 1-sample silent buffer to unlock the hardware pipeline
                const buf = this.ctx.createBuffer(1, 1, 22050);
                const src = this.ctx.createBufferSource();
                src.buffer = buf;
                src.connect(this.ctx.destination);
                src.start(0);
                this._unlocked = true;
            } catch (e) {
                // Web Audio API unavailable in this environment
            }
        },
    
        /**
         * Synthesizes a soft, pleasant mechanical click tone.
         * Uses an oscillator with an exponential decay gain ramp.
         * 
         * @param {number} [freq=600] - Tone frequency in Hertz (Hz).
         * @param {OscillatorType} [type='sine'] - Waveform ('sine', 'triangle', 'square', 'sawtooth').
         * @param {number} [duration=0.03] - Sound duration in seconds.
         */
        playClick(freq = 600, type = 'sine', duration = 0.03) {
            if (!this.enabled) return;
            try {
                // Lazy unlock if not already instantiated
                if (!this.ctx) this.unlockAudio();
                if (!this.ctx) return;
                if (this.ctx.state === 'suspended') this.ctx.resume();
    
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
                // Quick decay envelope: peak volume at 0.08, decay exponentially to 0.001
                gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {
                // Prevent audio errors from interfering with calculation logic
            }
        }
    };
    
    /**
     * Attaches one-time event listeners on document to unlock audio upon the user's
     * very first touch or click event, then removes listeners to prevent overhead.
     */
    function initSoundAutoUnlock() {
        function _onFirstInteraction() {
            SoundFx.unlockAudio();
            document.removeEventListener('touchstart', _onFirstInteraction, true);
            document.removeEventListener('touchend', _onFirstInteraction, true);
            document.removeEventListener('click', _onFirstInteraction, true);
        }
        document.addEventListener('touchstart', _onFirstInteraction, true);
        document.addEventListener('touchend', _onFirstInteraction, true);
        document.addEventListener('click', _onFirstInteraction, true);
    }
    

    // -------------------------------------------------------------------------
    // Module: src/core/dom.js
    // -------------------------------------------------------------------------
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
    
    
    
    /**
     * Safely extracts and parses a floating-point number from an input element.
     * 
     * @param {string} id - The DOM element ID of the target input element.
     * @returns {number} The parsed numeric float value, or 0 if empty/invalid/missing.
     */
    function getFloatVal(id) {
        const el = document.getElementById(id);
        return el ? (parseFloat(el.value) || 0) : 0;
    }
    
    /**
     * Displays a transient toast notification banner at the bottom of the screen.
     * Automatically dims and hides itself after 2,200 milliseconds.
     * 
     * @param {string} msg - The notification message text to display.
     */
    function showToast(msg) {
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
    function copyToClipboard(text) {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            showToast(`Copied: ${text}`);
            SoundFx.playClick(1000);
        }).catch(() => {
            showToast('Failed to copy');
        });
    }
    

    // -------------------------------------------------------------------------
    // Module: src/core/format.js
    // -------------------------------------------------------------------------
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
    
    
    
    /**
     * Formats a numeric amount into a localized currency string.
     * Uses Intl.NumberFormat based on the configured locale for that currency.
     * 
     * @param {number|string} amount - The numeric monetary value to format.
     * @param {string} [currencyCode='INR'] - The 3-letter ISO 4217 currency code (e.g., 'INR', 'USD', 'EUR').
     * @returns {string} Fully formatted monetary string (e.g., "$1,234.50" or "₹1,23,456.00").
     */
    function formatMoney(amount, currencyCode = 'INR') {
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
    function formatNumber(val, maxDecimals = 4) {
        if (isNaN(val)) return '--';
        return Number(Number(val).toFixed(maxDecimals)).toLocaleString();
    }
    

    // -------------------------------------------------------------------------
    // Module: src/core/storage.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Persistent Storage & Calculation History Store
     * File: src/core/storage.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Wraps browser localStorage access in robust try/catch blocks to prevent
     * DOMExceptions in private browsing modes, disabled storage settings, or
     * quota exceeded conditions. Manages calculation history persistence.
     * 
     * OBJECTS & METHODS PRESENT IN THIS FILE:
     * StorageEngine:
     * - getItem(key, defaultVal): Safely retrieves a stored string value or returns default.
     * - setItem(key, val): Safely persists a string key/value pair.
     * - removeItem(key): Safely removes a stored key.
     * - loadHistory(): Deserializes calculation history array from localStorage.
     * - saveHistory(history): Serializes and saves calculation history array.
     * - clearHistory(): Purges calculation history entries from storage.
     * ============================================================================
     */
    
    /** LocalStorage key for calculation history */
    const HISTORY_KEY = 'omni_calc_history';
    
    /**
     * StorageEngine provides fail-safe access to browser localStorage.
     */
    const StorageEngine = {
        /**
         * Safely retrieves a value from localStorage with a fallback default.
         * 
         * @param {string} key - Storage key name.
         * @param {*} [defaultVal=null] - Default fallback returned if key does not exist or errors occur.
         * @returns {string|*} Retrieved string value or fallback.
         */
        getItem(key, defaultVal = null) {
            try {
                const val = localStorage.getItem(key);
                return val !== null ? val : defaultVal;
            } catch (e) {
                return defaultVal;
            }
        },
    
        /**
         * Safely stores a string value in localStorage.
         * 
         * @param {string} key - Storage key name.
         * @param {string} val - String value to store.
         * @returns {boolean} True on success, false if quota exceeded or disabled.
         */
        setItem(key, val) {
            try {
                localStorage.setItem(key, val);
                return true;
            } catch (e) {
                return false;
            }
        },
    
        /**
         * Safely deletes a key from localStorage.
         * 
         * @param {string} key - Storage key name.
         * @returns {boolean} True on success, false on error.
         */
        removeItem(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                return false;
            }
        },
    
        /**
         * Loads and parses saved calculation history from localStorage.
         * 
         * @returns {Array<Object>} Array of calculation history objects [{expr, res, time}].
         */
        loadHistory() {
            try {
                return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
            } catch (e) {
                return [];
            }
        },
    
        /**
         * Serializes and writes calculation history to localStorage.
         * 
         * @param {Array<Object>} history - Array of calculation history objects to serialize.
         */
        saveHistory(history) {
            try {
                localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
            } catch (e) {
                // Silently swallow quota errors
            }
        },
    
        /**
         * Deletes all saved calculation history records from localStorage.
         */
        clearHistory() {
            try {
                localStorage.removeItem(HISTORY_KEY);
            } catch (e) {
                // Silently swallow errors
            }
        }
    };
    

    // -------------------------------------------------------------------------
    // Module: src/core/state.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Centralized Global Application State
     * File: src/core/state.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Acts as the centralized state store for CalVerse. Tracks active application
     * view modes, trigonometric units, standard/scientific display buffers,
     * memory registers, programmer bitwise buffers, health unit preferences,
     * and calculation history.
     * 
     * EXPORTED STATE OBJECT:
     * - state.currentMode: Active calculator view identifier (e.g. 'standard', 'scientific').
     * - state.angleMode: Current trigonometric angle unit ('DEG' or 'RAD').
     * - state.memory: Independent memory registers for standard and scientific keypads.
     * - state.std: Expression, current display value, and entry flag for Standard mode.
     * - state.sci: Expression, current display value, and entry flag for Scientific mode.
     * - state.prog: Programmer calculator state (Radix, Bit width, BigInt accumulator, pending operation).
     * - state.health: Preferred units for BMI/health calculations ('metric' or 'imperial').
     * - state.history: In-memory array of historical calculations synced to localStorage.
     * ============================================================================
     */
    
    
    
    /**
     * Global reactive state object shared by all calculator features and UI components.
     */
    const state = {
        /** Currently active calculator view mode ('standard', 'scientific', 'graphing', etc.) */
        currentMode: 'standard',
    
        /** Active trigonometric angle mode: 'DEG' (degrees) or 'RAD' (radians) */
        angleMode: 'DEG',
    
        /** Memory registers for memory buttons (MC, MR, M+, M-, MS) */
        memory: {
            std: 0,
            sci: 0
        },
    
        /** Standard calculator operational buffer */
        std: {
            expr: '',
            current: '0',
            waitingForNewNumber: false
        },
    
        /** Scientific calculator operational buffer */
        sci: {
            expr: '',
            current: '0',
            waitingForNewNumber: false
        },
    
        /** Programmer calculator operational buffer supporting arbitrary precision BigInt */
        prog: {
            radix: 'HEX',         // 'HEX', 'DEC', 'OCT', or 'BIN'
            wordSize: 32,         // 8, 16, 32, or 64 bits
            val: 0n,              // Primary numeric value in BigInt format
            currentInput: '0',    // Raw string input in current radix
            pendingOp: null,      // Active binary operator ('+', '-', '&', '|', etc.)
            storedVal: null,      // Value buffered before operator was pressed
            waitingForNew: false  // Reset input buffer upon subsequent keypress
        },
    
        /** Health module unit system: 'metric' (kg, cm) or 'imperial' (lbs, ft/in) */
        health: {
            unit: 'metric'
        },
    
        /** Calculation history records loaded from persistent local storage */
        history: StorageEngine.loadHistory()
    };
    

    // -------------------------------------------------------------------------
    // Module: src/core/math.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Core Mathematical Evaluator & Parser
     * File: src/core/math.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Contains the mathematical parser, expression sanitizer, factorial algorithm,
     * and safe evaluation engine used by both the Standard and Scientific calculators,
     * as well as the 2D Graphing engine.
     * 
     * FUNCTIONS PRESENT IN THIS FILE:
     * 1. sanitizeForEval(expr, angleMode):
     *    - Normalizes mathematical display glyphs (×, ÷, −, π, ^) into valid JavaScript syntax.
     *    - Injects angle conversions (degrees to radians, or inverse radians to degrees)
     *      around trigonometric calls (sin, cos, tan, asin, acos, atan).
     *    - Replaces ln, log, sqrt, abs, exp with standard Math equivalents.
     * 
     * 2. factorial(n):
     *    - Computes n! for non-negative integers using an iterative multiplication loop.
     * 
     * 3. evaluateMath(expression, angleMode):
     *    - Executes expressions safely inside an isolated Function scope.
     *    - Handles trailing factorial operators (e.g. "5!").
     *    - Rounds precision to 10 decimal digits to eliminate IEEE-754 floating-point artifacts.
     *    - Returns string representation or 'Error' upon divide-by-zero or syntax invalidity.
     * ============================================================================
     */
    
    /**
     * Sanitizes and converts a human-readable mathematical formula into executable JS.
     * Maps custom UI symbols (×, ÷, −, π) to operators and standard Math methods,
     * and handles degree/radian conversion for trigonometry.
     * 
     * @param {string} expr - Human-readable mathematical formula (e.g., "sin(30) + 5 × 2").
     * @param {'DEG'|'RAD'} [angleMode='DEG'] - Angle mode for trigonometric computations.
     * @returns {string} Executable JavaScript arithmetic string.
     */
    function sanitizeForEval(expr, angleMode = 'DEG') {
        let s = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/π/g, `${Math.PI}`)
            .replace(/\be\b/g, `${Math.E}`)
            .replace(/\^/g, '**');
    
        // Angle mode conversion factor injection
        const radFactor = angleMode === 'DEG' ? `* (${Math.PI} / 180)` : '';
        const invFactor = angleMode === 'DEG' ? `* (180 / ${Math.PI})` : '';
    
        // Direct trigonometric replacements
        s = s.replace(/sin\(([^)]+)\)/g, `Math.sin(($1)${radFactor})`);
        s = s.replace(/cos\(([^)]+)\)/g, `Math.cos(($1)${radFactor})`);
        s = s.replace(/tan\(([^)]+)\)/g, `Math.tan(($1)${radFactor})`);
    
        // Inverse trigonometric replacements (convert radians back to degrees if DEG mode)
        s = s.replace(/asin\(([^)]+)\)/g, `(Math.asin($1)${invFactor})`);
        s = s.replace(/acos\(([^)]+)\)/g, `(Math.acos($1)${invFactor})`);
        s = s.replace(/atan\(([^)]+)\)/g, `(Math.atan($1)${invFactor})`);
    
        // Common scientific functions
        s = s.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
        s = s.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
        s = s.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
        s = s.replace(/abs\(([^)]+)\)/g, 'Math.abs($1)');
        s = s.replace(/exp\(([^)]+)\)/g, 'Math.exp($1)');
    
        return s;
    }
    
    /**
     * Calculates the factorial of an integer n (n!).
     * 
     * @param {number} n - Non-negative integer.
     * @returns {number} Factorial result, or NaN if input is negative or non-integer.
     */
    function factorial(n) {
        if (n < 0 || !Number.isInteger(n)) return NaN;
        if (n === 0 || n === 1) return 1;
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
    }
    
    /**
     * Safely evaluates a mathematical expression string and returns the computed result.
     * Supports factorials, trigonometric angle modes, and IEEE-754 precision correction.
     * 
     * @param {string} expression - The math expression string to evaluate.
     * @param {'DEG'|'RAD'} [angleMode='DEG'] - Selected angle mode.
     * @returns {string} String representation of evaluated number, or 'Error'.
     */
    function evaluateMath(expression, angleMode = 'DEG') {
        try {
            // Pre-process factorial notation (e.g. "5!" becomes "120")
            let exp = expression.replace(/(\d+)!/g, (_, num) => factorial(parseInt(num, 10)));
            const sanitized = sanitizeForEval(exp, angleMode);
    
            // Execute in strict sandbox Function constructor
            const result = Function(`"use strict"; return (${sanitized});`)();
            if (!isFinite(result)) return 'Error';
    
            // Trim float rounding drift up to 10 decimal places
            return parseFloat(result.toFixed(10)).toString();
        } catch (e) {
            return 'Error';
        }
    }
    

    // -------------------------------------------------------------------------
    // Module: src/features/standard.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Standard Arithmetic & Memory Engine
     * File: src/features/standard.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Powers everyday arithmetic, keypad input routing, memory register management
     * (MC, MR, MS, M+, M-), and calculation history for both Standard and Scientific
     * calculators.
     * 
     * FUNCTIONS PRESENT IN THIS FILE:
     * 1. updateDisplay(type):
     *    - Updates the primary output value, expression preview line, and memory badge indicator.
     * 
     * 2. inputVal(type, val):
     *    - Core keypad input processor. Handles chained operations, decimal points, constants (π, e),
     *      parentheses, and numbers.
     * 
     * 3. clear(type):
     *    - Resets expression and display buffer to '0'.
     * 
     * 4. backspace(type):
     *    - Deletes rightmost character from active display value.
     * 
     * 5. toggleSign(type):
     *    - Flips positive/negative sign of current accumulator value.
     * 
     * 6. calculate(type):
     *    - Evaluates complete arithmetic expression, records result in history, and updates UI.
     * 
     * 7. Memory Operations:
     *    - memClear(type): Resets memory register to 0.
     *    - memRecall(type): Recalls stored memory value into active display.
     *    - memStore(type): Stores current display value into memory register.
     *    - memAdd(type): Adds current display value to memory register.
     *    - memSub(type): Subtracts current display value from memory register.
     * 
     * 8. History Management:
     *    - addHistory(expr, result): Appends new calculation record to history list (max 50 records).
     *    - renderHistoryList(): Renders calculation history drawer DOM list with tap-to-reuse listeners.
     *    - clearHistory(): Purges calculation history from memory and persistent localStorage.
     * ============================================================================
     */
    
    
    
    
    
    
    
    /**
     * Synchronizes DOM display inputs and expression labels with state values.
     * 
     * @param {'std'|'sci'} type - Keypad type identifier ('std' for standard, 'sci' for scientific).
     */
    function updateDisplay(type) {
        const data = state[type];
        const dispElem = document.getElementById(`${type}Display`);
        const exprElem = document.getElementById(`${type}Expression`);
        const memElem = document.getElementById(`${type}MemoryIndicator`);
    
        if (dispElem) dispElem.value = data.current;
        if (exprElem) exprElem.textContent = data.expr;
        if (memElem) memElem.textContent = state.memory[type] !== 0 ? `M (${state.memory[type]})` : '';
    }
    
    /**
     * Handles numeric digit, arithmetic operator, parenthesis, and constant entries.
     * 
     * @param {'std'|'sci'} type - Calculator type ('std' or 'sci').
     * @param {string} val - Pressed key value (e.g. '7', '+', '.', 'π', 'e').
     */
    function inputVal(type, val) {
        SoundFx.playClick(500);
        const data = state[type];
    
        // If the expression was just evaluated (contains '='):
        if (data.expr && data.expr.includes('=')) {
            if (['+', '−', '×', '÷', '^', '%'].includes(val)) {
                // Operator after equals: chain forward using previous computed answer
                if (data.current === 'Error') data.current = '0';
                data.expr = `${data.current} ${val} `;
                data.waitingForNewNumber = true;
                updateDisplay(type);
                return;
            } else {
                // New digit or constant after equals: reset expression line
                data.expr = '';
                if (val === '.') {
                    data.current = '0.';
                    data.waitingForNewNumber = false;
                    updateDisplay(type);
                    return;
                }
            }
        }
    
        if (['+', '−', '×', '÷', '^', '%'].includes(val)) {
            if (data.current === 'Error') data.current = '0';
            data.expr += `${data.current} ${val} `;
            data.current = '0';
            data.waitingForNewNumber = true;
        } else if (val === '(' || val === ')') {
            data.expr += val;
        } else if (val === '.') {
            if (data.waitingForNewNumber) {
                data.current = '0.';
                data.waitingForNewNumber = false;
            } else if (!data.current.includes('.')) {
                data.current += '.';
            }
        } else if (val === 'π') {
            data.current = Math.PI.toString();
            data.waitingForNewNumber = true;
        } else if (val === 'e') {
            data.current = Math.E.toString();
            data.waitingForNewNumber = true;
        } else {
            // Numeric digit 0-9
            if (data.current === '0' || data.waitingForNewNumber) {
                data.current = val;
                data.waitingForNewNumber = false;
            } else {
                data.current += val;
            }
        }
        updateDisplay(type);
    }
    
    /**
     * Resets the calculator's expression buffer and active display value back to 0.
     * 
     * @param {'std'|'sci'} type - Calculator type identifier.
     */
    function clear(type) {
        SoundFx.playClick(450);
        state[type].expr = '';
        state[type].current = '0';
        state[type].waitingForNewNumber = false;
        updateDisplay(type);
    }
    
    /**
     * Removes the trailing character from the current display value.
     * 
     * @param {'std'|'sci'} type - Calculator type identifier.
     */
    function backspace(type) {
        SoundFx.playClick(480);
        const data = state[type];
        if (data.expr && data.expr.includes('=')) {
            data.expr = '';
        }
        if (data.current.length > 1 && data.current !== 'Error') {
            data.current = data.current.slice(0, -1);
        } else {
            data.current = '0';
        }
        updateDisplay(type);
    }
    
    /**
     * Toggles the negative/positive algebraic sign of the current active number.
     * 
     * @param {'std'|'sci'} type - Calculator type identifier.
     */
    function toggleSign(type) {
        SoundFx.playClick(500);
        const data = state[type];
        if (data.current !== '0' && data.current !== 'Error') {
            data.current = (parseFloat(data.current) * -1).toString();
            updateDisplay(type);
        }
    }
    
    /**
     * Evaluates the complete accumulated mathematical expression and stores the calculation in history.
     * 
     * @param {'std'|'sci'} type - Calculator type identifier.
     */
    function calculate(type) {
        SoundFx.playClick(850, 'triangle', 0.05);
        const data = state[type];
    
        // Avoid duplicate evaluation if already computed
        if (!data.expr && (data.current === '0' || data.current === 'Error' || data.current === '')) return;
        if (data.expr.endsWith('=')) return;
    
        const fullExpr = (data.expr + data.current).trim();
        const res = evaluateMath(fullExpr, state.angleMode);
    
        if (res !== 'Error') {
            addHistory(fullExpr, res);
            data.expr = `${fullExpr} =`;
            data.current = res;
            data.waitingForNewNumber = true;
        } else {
            data.current = 'Error';
            data.waitingForNewNumber = true;
        }
        updateDisplay(type);
    }
    
    // =============================================================================
    // Memory Register Operations (MC, MR, MS, M+, M-)
    // =============================================================================
    
    /** Clears the memory register (MC) */
    function memClear(type) { state.memory[type] = 0; updateDisplay(type); }
    /** Recalls the stored memory register value into the active display (MR) */
    function memRecall(type) { state[type].current = state.memory[type].toString(); state[type].waitingForNewNumber = true; updateDisplay(type); }
    /** Stores current display value into memory register (MS) */
    function memStore(type) { state.memory[type] = parseFloat(state[type].current) || 0; updateDisplay(type); }
    /** Adds current display value to memory register (M+) */
    function memAdd(type) { state.memory[type] += parseFloat(state[type].current) || 0; updateDisplay(type); }
    /** Subtracts current display value from memory register (M-) */
    function memSub(type) { state.memory[type] -= parseFloat(state[type].current) || 0; updateDisplay(type); }
    
    // =============================================================================
    // Calculation History Management
    // =============================================================================
    
    /**
     * Appends a successful calculation entry to history and saves to localStorage.
     * 
     * @param {string} expr - Mathematical formula string.
     * @param {string} result - Calculated answer string.
     */
    function addHistory(expr, result) {
        state.history.unshift({ expr, result, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        if (state.history.length > 50) state.history.pop();
        StorageEngine.saveHistory(state.history);
        renderHistoryList();
    }
    
    /**
     * Renders calculation history list items inside the slide-out history drawer.
     * Attaches click-to-load listeners that populate the result back into the display.
     */
    function renderHistoryList() {
        const list = document.getElementById('historyList');
        const count = document.getElementById('historyCount');
        if (!list) return;
    
        if (count) count.textContent = state.history.length;
        if (state.history.length === 0) {
            list.innerHTML = '<div class="empty-history">No calculations recorded yet</div>';
            return;
        }
    
        list.innerHTML = state.history.map((item, idx) => `
            <div class="history-item" data-index="${idx}">
                <div class="hist-exp">${item.expr} =</div>
                <div class="hist-res">${item.result}</div>
            </div>
        `).join('');
    
        list.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.dataset.index, 10);
                const record = state.history[idx];
                if (record) {
                    state[state.currentMode].current = record.result;
                    updateDisplay(state.currentMode);
                    copyToClipboard(record.result);
                }
            });
        });
    }
    
    /**
     * Purges all historical calculations from the drawer and persistent local storage.
     */
    function clearHistory() {
        state.history = [];
        StorageEngine.clearHistory();
        renderHistoryList();
    }
    

    // -------------------------------------------------------------------------
    // Module: src/features/scientific.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Scientific Calculator Feature
     * File: src/features/scientific.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Extends basic arithmetic with scientific and transcendental functions:
     * 1. Scientific Operations: Square (x²), Square Root (√x), Factorial (n!),
     *    Multiplicative Inverse (1/x), and Absolute Value (|x|).
     * 2. Trigonometry & Logarithms: sin, cos, tan, asin, acos, atan, ln, log₁₀, exp.
     * 3. Angular Mode Toggle: Switches trigonometric calculations dynamically between
     *    Degrees (DEG) and Radians (RAD).
     * 
     * FUNCTIONS PRESENT IN THIS FILE:
     * 1. inputFunc(fn):
     *    - Applies a unary scientific function to the currently buffered display value.
     *    - Immediately evaluates result, sets the mathematical expression preview,
     *      and sets waitingForNewNumber to true.
     * 
     * 2. toggleAngleMode():
     *    - Switches global angle mode state between 'DEG' and 'RAD'.
     *    - Updates UI angle pill badge text and plays click feedback sound.
     * ============================================================================
     */
    
    
    
    
    
    
    /**
     * Executes a unary scientific function (e.g. sin, cos, tan, sqrt, sqr, fact, inv, abs)
     * on the current accumulator value and updates the scientific display.
     * 
     * @param {string} fn - Function identifier ('sqr', 'sqrt', 'fact', 'inv', 'abs', 'sin', 'cos', etc.).
     */
    function inputFunc(fn) {
        SoundFx.playClick(550);
        const data = state.sci;
        const cur = data.current;
    
        if (fn === 'sqr') {
            data.current = evaluateMath(`(${cur}) * (${cur})`, state.angleMode);
            data.expr = `sqr(${cur}) =`;
        } else if (fn === 'sqrt') {
            data.current = evaluateMath(`sqrt(${cur})`, state.angleMode);
            data.expr = `√(${cur}) =`;
        } else if (fn === 'fact') {
            data.current = factorial(parseInt(cur, 10)).toString();
            data.expr = `${cur}! =`;
        } else if (fn === 'inv') {
            data.current = evaluateMath(`1 / (${cur})`, state.angleMode);
            data.expr = `1/(${cur}) =`;
        } else if (fn === 'abs') {
            data.current = Math.abs(parseFloat(cur)).toString();
            data.expr = `|${cur}| =`;
        } else {
            // Trigonometric or Logarithmic function (sin, cos, tan, ln, log, exp)
            data.current = evaluateMath(`${fn}(${cur})`, state.angleMode);
            data.expr = `${fn}(${cur}) =`;
        }
        data.waitingForNewNumber = true;
        updateDisplay('sci');
    }
    
    /**
     * Toggles trigonometric angle evaluation unit between Degrees (DEG) and Radians (RAD).
     */
    function toggleAngleMode() {
        SoundFx.playClick(600);
        state.angleMode = state.angleMode === 'DEG' ? 'RAD' : 'DEG';
        const pill = document.getElementById('sciAngleMode');
        if (pill) pill.textContent = state.angleMode;
    }
    

    // -------------------------------------------------------------------------
    // Module: src/features/graphing.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - 2D Graphing & Function Visualizer Engine
     * File: src/features/graphing.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * An interactive HTML5 Canvas 2D Cartesian graphing engine. Supports real-time
     * mathematical curve plotting (dual functions f₁(x) and f₂(x)), dynamic mouse/touch
     * pan and drag, mouse wheel zooming, responsive canvas resizing, coordinate HUD tracking,
     * and Cartesian grid rendering.
     * 
     * OBJECTS & METHODS PRESENT IN THIS FILE:
     * GraphEngine:
     * 1. init():
     *    - Acquires canvas context, sets up resize watchers, pan/drag event listeners
     *      for mouse and mobile touch, and mouse wheel zoom listeners.
     * 
     * 2. resize():
     *    - Dynamically resizes the HTML5 canvas buffer to match its container element
     *      dimensions and centers the Cartesian origin (0, 0).
     * 
     * 3. zoom(factor):
     *    - Multiplies current pixels-per-unit scale by zoom factor (clamped 10 to 300) and re-renders.
     * 
     * 4. reset():
     *    - Restores default zoom level (40 px/unit) and centers Cartesian origin in the viewport.
     * 
     * 5. parseFunction(funcStr):
     *    - Parses user mathematical expression into an executable JavaScript function f(x).
     *    - Auto-injects explicit multiplication (e.g., converts '2x' to '2*x').
     * 
     * 6. render():
     *    - Clears the canvas, paints theme-adaptive background gridlines, draws Cartesian X and Y axes,
     *      and renders active function curves.
     * 
     * 7. plotCurve(funcStr, color):
     *    - Samples the function f(x) across canvas pixel columns and renders a smooth 2D Bézier path.
     * ============================================================================
     */
    
    const GraphEngine = {
        /** Guard preventing duplicate event listener attachments */
        _initialized: false,
        /** Reference to HTML5 Canvas element */
        canvas: null,
        /** 2D rendering context */
        ctx: null,
        /** Current zoom scale: pixels per mathematical unit */
        scale: 40,
        /** Pixel coordinate of Cartesian origin (0,0) along the X-axis */
        originX: 0,
        /** Pixel coordinate of Cartesian origin (0,0) along the Y-axis */
        originY: 0,
        /** Dragging state flag */
        isDragging: false,
        /** Drag start anchor X */
        startX: 0,
        /** Drag start anchor Y */
        startY: 0,
    
        /**
         * Initializes the canvas, dimensions, and interaction listeners.
         */
        init() {
            if (GraphEngine._initialized) { GraphEngine.render(); return; }
            GraphEngine._initialized = true;
            this.canvas = document.getElementById('graphCanvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
    
            // Mouse Pan & Coordinate HUD Tracking
            this.canvas.addEventListener('mousedown', (e) => {
                this.isDragging = true;
                this.startX = e.clientX - this.originX;
                this.startY = e.clientY - this.originY;
            });
    
            window.addEventListener('mousemove', (e) => {
                if (this.isDragging) {
                    this.originX = e.clientX - this.startX;
                    this.originY = e.clientY - this.startY;
                    this.render();
                } else if (this.canvas) {
                    // Update live coordinate HUD in bottom right corner
                    const rect = this.canvas.getBoundingClientRect();
                    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
                        const mouseX = e.clientX - rect.left;
                        const mouseY = e.clientY - rect.top;
                        const mathX = ((mouseX - this.originX) / this.scale).toFixed(2);
                        const mathY = (-(mouseY - this.originY) / this.scale).toFixed(2);
                        const hud = document.getElementById('graphHud');
                        if (hud) hud.textContent = `x: ${mathX} , y: ${mathY}`;
                    }
                }
            });
    
            window.addEventListener('mouseup', () => { this.isDragging = false; });
    
            // Touch gestures for mobile dragging
            this.canvas.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    this.isDragging = true;
                    this.startX = e.touches[0].clientX - this.originX;
                    this.startY = e.touches[0].clientY - this.originY;
                }
            }, { passive: true });
    
            window.addEventListener('touchmove', (e) => {
                if (this.isDragging && e.touches.length === 1) {
                    this.originX = e.touches[0].clientX - this.startX;
                    this.originY = e.touches[0].clientY - this.startY;
                    this.render();
                }
            }, { passive: true });
    
            window.addEventListener('touchend', () => { this.isDragging = false; });
    
            // Mouse Wheel Zoom
            this.canvas.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
                this.zoom(zoomFactor);
            });
    
            this.render();
        },
    
        /**
         * Resizes the canvas to fill its parent container and re-centers origin.
         */
        resize() {
            if (!this.canvas || !this.canvas.parentElement) return;
            this.canvas.width = this.canvas.parentElement.clientWidth;
            this.canvas.height = this.canvas.parentElement.clientHeight;
            this.originX = this.canvas.width / 2;
            this.originY = this.canvas.height / 2;
            this.render();
        },
    
        /**
         * Zooms the Cartesian plane by the specified multiplication factor.
         * 
         * @param {number} factor - Scale multiplier (e.g. 1.15 for zoom in, 0.85 for zoom out).
         */
        zoom(factor) {
            this.scale = Math.max(10, Math.min(300, this.scale * factor));
            this.render();
        },
    
        /**
         * Resets the scale to 40 px/unit and re-centers the view.
         */
        reset() {
            this.scale = 40;
            this.originX = this.canvas.width / 2;
            this.originY = this.canvas.height / 2;
            this.render();
        },
    
        /**
         * Converts a mathematical formula string (e.g. "sin(x) + cos(2x)") into an executable function f(x).
         * 
         * @param {string} funcStr - Input formula text.
         * @returns {Function|null} Compiled function accepting numeric argument x, or null on error.
         */
        parseFunction(funcStr) {
            if (!funcStr || !funcStr.trim()) return null;
            try {
                let code = funcStr
                    .replace(/\^/g, '**')
                    .replace(/\bsin\b/g, 'Math.sin')
                    .replace(/\bcos\b/g, 'Math.cos')
                    .replace(/\btan\b/g, 'Math.tan')
                    .replace(/\babs\b/g, 'Math.abs')
                    .replace(/\bexp\b/g, 'Math.exp')
                    .replace(/\bln\b/g, 'Math.log')
                    .replace(/\blog\b/g, 'Math.log10')
                    .replace(/\bsqrt\b/g, 'Math.sqrt')
                    .replace(/\bpi\b/gi, 'Math.PI')
                    .replace(/\be\b/g, 'Math.E');
    
                // Automatic multiplication for coefficients adjacent to variable (e.g. "2x" -> "2*x")
                code = code.replace(/(\d+)\s*([a-zA-Z])/g, '$1*$2');
                return new Function('x', `"use strict"; try { return (${code}); } catch(e){ return NaN; }`);
            } catch (e) {
                return null;
            }
        },
    
        /**
         * Redraws the Cartesian grid, coordinate axes, and active function curves.
         */
        render() {
            if (!this.ctx) return;
            const w = this.canvas.width;
            const h = this.canvas.height;
            const isLight = document.body.classList.contains('light-theme');
    
            this.ctx.clearRect(0, 0, w, h);
    
            // 1. Draw Background Grid
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
    
            const startX = Math.floor(-this.originX / this.scale);
            const endX = Math.ceil((w - this.originX) / this.scale);
            const startY = Math.floor(-(h - this.originY) / this.scale);
            const endY = Math.ceil(this.originY / this.scale);
    
            // Vertical grid lines
            for (let x = startX; x <= endX; x++) {
                const px = this.originX + x * this.scale;
                this.ctx.beginPath();
                this.ctx.moveTo(px, 0);
                this.ctx.lineTo(px, h);
                this.ctx.stroke();
            }
    
            // Horizontal grid lines
            for (let y = startY; y <= endY; y++) {
                const py = this.originY - y * this.scale;
                this.ctx.beginPath();
                this.ctx.moveTo(0, py);
                this.ctx.lineTo(w, py);
                this.ctx.stroke();
            }
    
            // 2. Draw Main Axes
            this.ctx.lineWidth = 1.8;
            this.ctx.strokeStyle = isLight ? '#94a3b8' : '#475569';
            
            // Horizontal X-Axis
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.originY);
            this.ctx.lineTo(w, this.originY);
            this.ctx.stroke();
    
            // Vertical Y-Axis
            this.ctx.beginPath();
            this.ctx.moveTo(this.originX, 0);
            this.ctx.lineTo(this.originX, h);
            this.ctx.stroke();
    
            // 3. Plot Curve Functions
            const fn1Str = document.getElementById('graphFuncInput1')?.value;
            const fn2Str = document.getElementById('graphFuncInput2')?.value;
    
            this.plotCurve(fn1Str, '#3b82f6'); // Function 1 in Electric Blue
            this.plotCurve(fn2Str, '#f43f5e'); // Function 2 in Rose Pink
        },
    
        /**
         * Evaluates and paints a single continuous function curve across visible pixels.
         * 
         * @param {string} funcStr - Math function string.
         * @param {string} color - Stroke CSS color.
         */
        plotCurve(funcStr, color) {
            const fn = this.parseFunction(funcStr);
            if (!fn) return;
    
            const w = this.canvas.width;
            this.ctx.beginPath();
            this.ctx.lineWidth = 2.5;
            this.ctx.strokeStyle = color;
    
            let first = true;
            // Sample every 2 pixels horizontally for optimal performance & sharpness
            for (let px = 0; px <= w; px += 2) {
                const mathX = (px - this.originX) / this.scale;
                const mathY = fn(mathX);
    
                // Handle asymptotes, singularities, and domain breaks (e.g. 1/x or sqrt(-1))
                if (isNaN(mathY) || !isFinite(mathY)) {
                    first = true;
                    continue;
                }
    
                const py = this.originY - mathY * this.scale;
                if (first) {
                    this.ctx.moveTo(px, py);
                    first = false;
                } else {
                    this.ctx.lineTo(px, py);
                }
            }
            this.ctx.stroke();
        }
    };
    

    // -------------------------------------------------------------------------
    // Module: src/features/financial.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Financial & Currency Calculation Engine
     * File: src/features/financial.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Powers three financial computation modules:
     * 1. Loan EMI (Equated Monthly Installment) Calculator:
     *    - Amortization formula computing monthly payment, total interest, and principal/interest ratios.
     * 2. Compound Interest & SIP (Systematic Investment Plan) Growth Calculator:
     *    - Future value projections combining initial lump-sum compounding and monthly SIP contributions.
     * 3. Live Foreign Exchange Rate Converter:
     *    - Fetches real-time currency exchange rates from open.er-api.com with offline cache persistence.
     *    - Bidirectional conversion and popular currency pairs grid.
     * 
     * OBJECTS & METHODS PRESENT IN THIS FILE:
     * FinancialEngine:
     * 1. init(): Restores saved currency & cached exchange rates, binds range sliders, runs initial models.
     * 2. setCurrency(code): Updates active financial currency and re-renders labels and figures.
     * 3. updateLabels(): Rewrites input header labels with active currency symbol.
     * 4. formatMoney(amount): Formats numeric values according to the active financial currency locale.
     * 5. calculateEMI(): Computes monthly EMI, total interest, principal ratio, and progress bar widths.
     * 6. calculateCompound(): Computes future value of compound lump sum plus recurring monthly contributions.
     * 7. fetchLiveRates(showFeedback): Queries real-time currency API; provides graceful offline fallback.
     * 8. convert(source): Performs bidirectional currency exchange conversion.
     * 9. swap(): Swaps 'From' and 'To' currency select values and reconverts.
     * 10. renderPopularPairs(): Renders clickable quick-convert currency pair cards.
     * 11. setQuickPair(from, to): Activates a currency pair when a card is clicked.
     * ============================================================================
     */
    
    
    
    
    
    
    const FinancialEngine = {
        /** Currently selected currency code for loans and investments (persisted) */
        currentCurrency: localStorage.getItem('calverse_fin_currency') || 'INR',
    
        /**
         * Initializes financial subtab inputs, range sync listeners, and triggers live rates fetch.
         */
        init() {
            // Restore saved currency
            const curSelect = document.getElementById('finCurrencySelect');
            if (curSelect) {
                curSelect.value = this.currentCurrency;
            }
            this.updateLabels();
    
            // Restore offline cached exchange rates
            try {
                const cachedRates = localStorage.getItem('calverse_rates_cache');
                if (cachedRates) {
                    const parsed = JSON.parse(cachedRates);
                    if (parsed && parsed.rates) {
                        this.rates = { ...this.rates, ...parsed.rates };
                        if (parsed.time) this.ratesLastUpdated = new Date(parsed.time);
                    }
                }
            } catch (e) {}
    
            // Two-way synchronization between number input boxes and range sliders
            const syncInputs = [
                ['loanAmount', 'loanAmountRange'],
                ['interestRate', 'interestRateRange'],
                ['loanTenure', 'loanTenureRange']
            ];
    
            syncInputs.forEach(([numId, rangeId]) => {
                const num = document.getElementById(numId);
                const range = document.getElementById(rangeId);
                if (num && range) {
                    num.addEventListener('input', () => { range.value = num.value; this.calculateEMI(); });
                    range.addEventListener('input', () => { num.value = range.value; this.calculateEMI(); });
                }
            });
    
            // Compound interest input listeners
            ['ciPrincipal', 'ciMonthly', 'ciRate', 'ciYears', 'ciCompoundFreq'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('input', () => this.calculateCompound());
            });
    
            this.calculateEMI();
            this.calculateCompound();
            this.fetchLiveRates();
        },
    
        /**
         * Switches the currency code for loan and investment calculations.
         * 
         * @param {string} code - ISO 4217 currency code (e.g., 'INR', 'USD', 'EUR').
         */
        setCurrency(code) {
            if (CURRENCY_CONFIG[code]) {
                SoundFx.playClick(600);
                this.currentCurrency = code;
                localStorage.setItem('calverse_fin_currency', code);
                this.updateLabels();
                this.calculateEMI();
                this.calculateCompound();
                showToast(`Currency set to ${CURRENCY_CONFIG[code].name} (${CURRENCY_CONFIG[code].symbol})`);
            }
        },
    
        /**
         * Updates label text in the UI to display the active currency symbol.
         */
        updateLabels() {
            const cur = CURRENCY_CONFIG[this.currentCurrency] || CURRENCY_CONFIG.INR;
            const sym = cur.symbol;
    
            const lAmount = document.getElementById('loanAmountLabel');
            if (lAmount) lAmount.textContent = `Loan Amount (${sym})`;
    
            const cPrinc = document.getElementById('ciPrincipalLabel');
            if (cPrinc) cPrinc.textContent = `Initial Principal (${sym})`;
    
            const cMonth = document.getElementById('ciMonthlyLabel');
            if (cMonth) cMonth.textContent = `Monthly Contribution (${sym})`;
        },
    
        /**
         * Formats an amount using the active financial currency settings.
         * 
         * @param {number} amount - Numeric monetary amount.
         * @returns {string} Localized currency string.
         */
        formatMoney(amount) {
            return formatMoney(amount, this.currentCurrency);
        },
    
        /**
         * Calculates loan EMI using the standard amortization formula:
         *   E = P * r * (1 + r)^n / ((1 + r)^n - 1)
         * Where:
         *   P = Principal loan amount
         *   r = Monthly interest rate (annual rate / 12 / 100)
         *   n = Total number of monthly installments (years * 12)
         */
        calculateEMI() {
            const P = getFloatVal('loanAmount');
            const annualRate = getFloatVal('interestRate');
            const years = getFloatVal('loanTenure');
    
            if (P <= 0 || annualRate <= 0 || years <= 0) return;
    
            const r = annualRate / 12 / 100;
            const n = years * 12;
    
            const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPayable = emi * n;
            const totalInterest = totalPayable - P;
    
            const principalRatio = (P / totalPayable * 100).toFixed(1);
            const interestRatio = (totalInterest / totalPayable * 100).toFixed(1);
    
            document.getElementById('emiMonthly').textContent = this.formatMoney(emi);
            document.getElementById('emiPrincipal').textContent = this.formatMoney(P);
            document.getElementById('emiTotalInterest').textContent = this.formatMoney(totalInterest);
            document.getElementById('emiTotalPayable').textContent = this.formatMoney(totalPayable);
    
            document.getElementById('ratioPrincipal').textContent = `${principalRatio}%`;
            document.getElementById('ratioInterest').textContent = `${interestRatio}%`;
            document.getElementById('barPrincipal').style.width = `${principalRatio}%`;
            document.getElementById('barInterest').style.width = `${interestRatio}%`;
        },
    
        /**
         * Calculates Compound Interest & Monthly SIP Investment Growth.
         * Future Value:
         *   FV_lump = P * (1 + r/n)^(n*t)
         *   FV_sip  = PMT * (((1 + i)^months - 1) / i)
         */
        calculateCompound() {
            const P = getFloatVal('ciPrincipal');
            const PMT = getFloatVal('ciMonthly');
            const r = getFloatVal('ciRate') / 100;
            const t = getFloatVal('ciYears');
            const n = parseInt(document.getElementById('ciCompoundFreq').value, 10) || 12;
    
            const months = t * 12;
            const monthlyRate = r / 12;
    
            // Lump sum compound
            let FV_lump = P * Math.pow(1 + r / n, n * t);
    
            // Monthly recurring investment compounding
            let FV_sip = 0;
            if (monthlyRate > 0) {
                FV_sip = PMT * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
            } else {
                FV_sip = PMT * months;
            }
    
            const totalFutureValue = FV_lump + FV_sip;
            const totalInvested = P + (PMT * months);
            const totalInterest = Math.max(0, totalFutureValue - totalInvested);
    
            document.getElementById('ciFutureValue').textContent = this.formatMoney(totalFutureValue);
            document.getElementById('ciTotalInvested').textContent = this.formatMoney(totalInvested);
            document.getElementById('ciTotalInterest').textContent = this.formatMoney(totalInterest);
        },
    
        // =========================================================================
        // Live Exchange Rates & Converter
        // =========================================================================
    
        /** Baseline exchange rates relative to USD (1.00) used offline or upon network failure */
        rates: {
            USD: 1,
            INR: 83.52,
            EUR: 0.92,
            GBP: 0.78,
            JPY: 155.40,
            CAD: 1.36,
            AUD: 1.51,
            AED: 3.67,
            CNY: 7.24,
            SGD: 1.35,
            CHF: 0.90,
            SAR: 3.75,
            KRW: 1365.20,
            BRL: 5.15,
            ZAR: 18.25,
            RUB: 91.50,
            NZD: 1.63,
            KWD: 0.31,
            QAR: 3.64,
            THB: 36.80
        },
        /** Timestamp when exchange rates were last synchronized */
        ratesLastUpdated: null,
    
        /**
         * Asynchronously downloads real-time currency conversion rates via Open Exchange Rates API.
         * Caches successful responses in localStorage. Gracefully falls back to cached data offline.
         * 
         * @param {boolean} [showFeedback=false] - Whether to show on-screen toast feedback upon completion.
         */
        async fetchLiveRates(showFeedback = false) {
            const statusText = document.getElementById('rateStatusText');
            const refreshIcon = document.getElementById('refreshIcon');
            if (refreshIcon) refreshIcon.style.animation = 'spin 1s infinite linear';
    
            if (!navigator.onLine) {
                // Device is offline: Use cached rates immediately without throwing network errors
                if (refreshIcon) refreshIcon.style.animation = '';
                if (statusText) {
                    if (this.ratesLastUpdated) {
                        statusText.textContent = `Offline • Cached (${this.ratesLastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
                    } else {
                        statusText.textContent = 'Offline • Baseline Rates';
                    }
                }
                this.convert('from');
                this.renderPopularPairs();
                if (showFeedback) showToast('🟠 Offline: Operating from cached data');
                return;
            }
    
            try {
                const res = await fetch('https://open.er-api.com/v6/latest/USD');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.rates) {
                        this.rates = { ...this.rates, ...data.rates };
                        this.ratesLastUpdated = new Date();
                        localStorage.setItem('calverse_rates_cache', JSON.stringify({
                            rates: this.rates,
                            time: this.ratesLastUpdated.toISOString()
                        }));
                        if (statusText) {
                            statusText.textContent = `🟢 Live Rates: Updated ${this.ratesLastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                        }
                        if (showFeedback) showToast('🟢 Live exchange rates updated');
                    }
                }
            } catch (e) {
                // Offline fallback on fetch failure
                if (statusText) {
                    statusText.textContent = this.ratesLastUpdated 
                        ? `Offline • Cached (${this.ratesLastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})` 
                        : 'Offline • Baseline Rates';
                }
            } finally {
                if (refreshIcon) refreshIcon.style.animation = '';
                this.convert('from');
                this.renderPopularPairs();
            }
        },
    
        /**
         * Converts currency amount between two selected currencies.
         * 
         * @param {'from'|'to'} [source='from'] - Field that triggered the calculation.
         */
        convert(source = 'from') {
            const fromUnit = document.getElementById('currencyUnitFrom')?.value || 'USD';
            const toUnit = document.getElementById('currencyUnitTo')?.value || 'INR';
            const fromRate = this.rates[fromUnit] || 1;
            const toRate = this.rates[toUnit] || 1;
    
            const fromInput = document.getElementById('currencyValFrom');
            const toInput = document.getElementById('currencyValTo');
            const formulaEl = document.getElementById('currencyFormula');
    
            const oneUnitConverted = (1 / fromRate) * toRate;
            if (formulaEl) {
                formulaEl.textContent = `1 ${fromUnit} = ${oneUnitConverted.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${toUnit}`;
            }
    
            if (source === 'from' && fromInput && toInput) {
                const val = parseFloat(fromInput.value) || 0;
                const converted = (val / fromRate) * toRate;
                toInput.value = parseFloat(converted.toFixed(4));
            } else if (source === 'to' && fromInput && toInput) {
                const val = parseFloat(toInput.value) || 0;
                const converted = (val / toRate) * fromRate;
                fromInput.value = parseFloat(converted.toFixed(4));
            }
        },
    
        /**
         * Swaps the "From" and "To" currency units and triggers conversion.
         */
        swap() {
            SoundFx.playClick(600);
            const fromSelect = document.getElementById('currencyUnitFrom');
            const toSelect = document.getElementById('currencyUnitTo');
            if (fromSelect && toSelect) {
                const temp = fromSelect.value;
                fromSelect.value = toSelect.value;
                toSelect.value = temp;
                this.convert('from');
            }
        },
    
        /**
         * Populates quick-action cards for popular global currency pairs (USD/INR, EUR/USD, etc.).
         */
        renderPopularPairs() {
            const pairsGrid = document.getElementById('popularPairsGrid');
            if (!pairsGrid) return;
    
            const popular = [
                ['USD', 'INR'],
                ['EUR', 'USD'],
                ['GBP', 'INR'],
                ['USD', 'AED'],
                ['EUR', 'INR'],
                ['USD', 'CAD'],
                ['USD', 'JPY'],
                ['AED', 'INR']
            ];
    
            pairsGrid.innerHTML = popular.map(([from, to]) => {
                const fRate = this.rates[from] || 1;
                const tRate = this.rates[to] || 1;
                const rate = (1 / fRate) * tRate;
                return `
                    <div class="pair-card" onclick="CalVerse.setQuickPair('${from}', '${to}')">
                        <span class="pair-names">${from} / ${to}</span>
                        <span class="pair-rate">${rate.toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
                    </div>
                `;
            }).join('');
        },
    
        /**
         * Selects a popular currency pair and refreshes conversion inputs.
         * 
         * @param {string} from - Source currency code.
         * @param {string} to - Target currency code.
         */
        setQuickPair(from, to) {
            SoundFx.playClick(600);
            const fromSelect = document.getElementById('currencyUnitFrom');
            const toSelect = document.getElementById('currencyUnitTo');
            if (fromSelect && toSelect) {
                fromSelect.value = from;
                toSelect.value = to;
                this.convert('from');
                showToast(`Switched pair to ${from}/${to}`);
            }
        }
    };
    

    // -------------------------------------------------------------------------
    // Module: src/features/programmer.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Programmer Calculator Engine
     * File: src/features/programmer.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Powers computing and hardware-level arithmetic:
     * 1. Multi-Radix Simultaneous Display: Synchronously renders Hexadecimal (HEX),
     *    Decimal (DEC), Octal (OCT), and Binary (BIN) representations using arbitrary
     *    precision JavaScript BigInt arithmetic.
     * 2. Word Size Masking: Enforces 8-bit (Byte), 16-bit (Word), 32-bit (DWord),
     *    and 64-bit (QWord) hardware integer limits.
     * 3. Bitwise & Logical Operations: AND, OR, XOR, NOT, left-shift (<<), right-shift (>>),
     *    arithmetic (+, -, *, /, %), and sign negation.
     * 4. Dynamic Keypad Validation: Disables keys ineligible for the active radix
     *    (e.g., A-F disabled outside HEX, digits 2-9 disabled in BIN, 8-9 disabled in OCT).
     * 
     * OBJECTS & METHODS PRESENT IN THIS FILE:
     * ProgrammerEngine:
     * 1. setRadix(radix): Sets primary radix ('HEX', 'DEC', 'OCT', 'BIN') and disables invalid keys.
     * 2. setWordSize(bits): Updates bit width (8, 16, 32, 64) and masks the stored BigInt value.
     * 3. getMask(): Returns the bitmask BigInt for the current word size.
     * 4. maskValue(): Clamps the current value according to getMask().
     * 5. inputDigit(d): Parses incoming character according to the current radix and updates state.
     * 6. inputBitwise(op): Buffers binary operator (AND, OR, XOR, <<, >>) or immediately calculates unary NOT (~).
     * 7. inputOp(op): Alias for inputBitwise to handle general arithmetic operators.
     * 8. calculate(): Evaluates pending bitwise or arithmetic operation on stored and current BigInt operands.
     * 9. clear(): Clears accumulator, inputs, and pending operators to 0.
     * 10. backspace(): Removes the last digit typed in the active radix.
     * 11. toggleSign(): Negates the current BigInt value and applies word-size bitmask.
     * 12. updateDisplay(): Updates HEX, DEC, OCT, and formatted 4-bit nibble spaced BIN display labels.
     * 13. updateKeypadState(): Toggles .disabled styling on keypad buttons based on the active base.
     * ============================================================================
     */
    
    
    
    
    const ProgrammerEngine = {
        /**
         * Sets active radix base ('HEX', 'DEC', 'OCT', or 'BIN') and updates keypad states.
         * 
         * @param {'HEX'|'DEC'|'OCT'|'BIN'} radix - Selected radix numeral base.
         */
        setRadix(radix) {
            SoundFx.playClick(600);
            state.prog.radix = radix;
            document.querySelectorAll('.radix-row').forEach(row => {
                row.classList.toggle('active', row.dataset.radix === radix);
            });
            this.updateKeypadState();
        },
    
        /**
         * Sets the active integer word size bit width (8, 16, 32, or 64 bits).
         * 
         * @param {8|16|32|64} bits - Bit width limit.
         */
        setWordSize(bits) {
            SoundFx.playClick(600);
            state.prog.wordSize = bits;
            document.querySelectorAll('.word-btn').forEach(btn => {
                btn.classList.toggle('active', parseInt(btn.dataset.bits, 10) === bits);
            });
            this.maskValue();
            this.updateDisplay();
        },
    
        /**
         * Computes the BigInt bitmask for the currently active word size.
         * 
         * @returns {bigint} Bitmask representation (e.g. 0xFFFFFFFFn for 32-bit).
         */
        getMask() {
            const bits = state.prog.wordSize;
            if (bits === 8) return 0xFFn;
            if (bits === 16) return 0xFFFFn;
            if (bits === 32) return 0xFFFFFFFFn;
            return 0xFFFFFFFFFFFFFFFFn;
        },
    
        /**
         * Clamps the active value to stay strictly within word-size bit limits.
         */
        maskValue() {
            state.prog.val = state.prog.val & this.getMask();
        },
    
        /**
         * Handles keypad digit entry in the current radix base.
         * 
         * @param {string} d - Digit character ('0'-'9', 'A'-'F').
         */
        inputDigit(d) {
            SoundFx.playClick(500);
            const p = state.prog;
            let curStr = p.waitingForNew ? '' : p.currentInput;
    
            if (curStr === '0') curStr = '';
            curStr += d;
    
            try {
                let radixBase = 16;
                if (p.radix === 'DEC') radixBase = 10;
                if (p.radix === 'OCT') radixBase = 8;
                if (p.radix === 'BIN') radixBase = 2;
    
                p.val = BigInt(parseInt(curStr, radixBase) || 0);
                this.maskValue();
                p.currentInput = curStr;
                p.waitingForNew = false;
                this.updateDisplay();
            } catch (e) {
                // Silently ignore digits invalid for current base
            }
        },
    
        /**
         * Handles bitwise operations (AND, OR, XOR, NOT, <<, >>).
         * 
         * @param {string} op - Bitwise operator string.
         */
        inputBitwise(op) {
            SoundFx.playClick(550);
            const p = state.prog;
            // Unary NOT immediately inverts bits and reapplies mask
            if (op === 'NOT') {
                p.val = (~p.val) & this.getMask();
                this.updateDisplay();
                return;
            }
    
            p.storedVal = p.val;
            p.pendingOp = op;
            p.waitingForNew = true;
        },
    
        /**
         * Alias for inputBitwise to handle binary operations.
         * 
         * @param {string} op - Operator symbol.
         */
        inputOp(op) {
            this.inputBitwise(op);
        },
    
        /**
         * Calculates the pending bitwise or arithmetic operation on stored operands.
         */
        calculate() {
            SoundFx.playClick(850);
            const p = state.prog;
            if (p.storedVal === null || !p.pendingOp) return;
    
            let a = p.storedVal;
            let b = p.val;
            let res = 0n;
    
            switch (p.pendingOp) {
                case 'AND': res = a & b; break;
                case 'OR':  res = a | b; break;
                case 'XOR': res = a ^ b; break;
                case '<<':  res = a << b; break;
                case '>>':  res = a >> b; break;
                case '+':   res = a + b; break;
                case '−':   res = a - b; break;
                case '×':   res = a * b; break;
                case '÷':   res = b !== 0n ? a / b : 0n; break;
                case '%':   res = b !== 0n ? a % b : 0n; break;
            }
    
            p.val = res;
            this.maskValue();
            p.storedVal = null;
            p.pendingOp = null;
            p.waitingForNew = true;
            this.updateDisplay();
        },
    
        /**
         * Clears all programmer calculator registers to zero.
         */
        clear() {
            state.prog.val = 0n;
            state.prog.currentInput = '0';
            state.prog.storedVal = null;
            state.prog.pendingOp = null;
            this.updateDisplay();
        },
    
        /**
         * Removes the rightmost digit from the active input.
         */
        backspace() {
            const p = state.prog;
            let str = p.val.toString(p.radix === 'HEX' ? 16 : p.radix === 'DEC' ? 10 : p.radix === 'OCT' ? 8 : 2);
            str = str.slice(0, -1);
            p.val = str ? BigInt(parseInt(str, p.radix === 'HEX' ? 16 : p.radix === 'DEC' ? 10 : p.radix === 'OCT' ? 8 : 2)) : 0n;
            this.updateDisplay();
        },
    
        /**
         * Negates value using two's complement and applies active word size mask.
         */
        toggleSign() {
            state.prog.val = (-state.prog.val) & this.getMask();
            this.updateDisplay();
        },
    
        /**
         * Renders synchronized representations in HEX, DEC, OCT, and nibble-separated BIN.
         */
        updateDisplay() {
            const p = state.prog;
            const val = p.val;
            const hex = val.toString(16).toUpperCase();
            const dec = val.toString(10);
            const oct = val.toString(8);
            
            let bin = val.toString(2);
            // Format binary output into neat 4-bit nibble groupings (e.g. "0000 1111")
            const padLen = state.prog.wordSize;
            bin = bin.padStart(padLen, '0');
            bin = bin.match(/.{1,4}/g)?.join(' ') || bin;
    
            const hexEl = document.getElementById('progHex');
            const decEl = document.getElementById('progDec');
            const octEl = document.getElementById('progOct');
            const binEl = document.getElementById('progBin');
    
            if (hexEl) hexEl.textContent = hex || '0';
            if (decEl) decEl.textContent = dec || '0';
            if (octEl) octEl.textContent = oct || '0';
            if (binEl) binEl.textContent = bin;
        },
    
        /**
         * Disables keypad keys that are mathematically illegal in the current radix base.
         */
        updateKeypadState() {
            const radix = state.prog.radix;
            const hexBtns = document.querySelectorAll('.btn-hex');
            const numBtns = document.querySelectorAll('.programmer-keypad .btn-num');
    
            // Hexadecimal A-F only allowed in HEX mode
            hexBtns.forEach(b => b.classList.toggle('disabled', radix !== 'HEX'));
    
            // Restrict numeric buttons according to base
            numBtns.forEach(b => {
                const digit = parseInt(b.textContent, 10);
                if (radix === 'BIN') {
                    b.classList.toggle('disabled', digit > 1);
                } else if (radix === 'OCT') {
                    b.classList.toggle('disabled', digit > 7);
                } else {
                    b.classList.remove('disabled');
                }
            });
        }
    };
    

    // -------------------------------------------------------------------------
    // Module: src/features/converter.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Unit Converter Engine
     * File: src/features/converter.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Powers the real-time bidirectional unit conversion system across 7 physical
     * and digital categories: Length, Mass, Temperature, Area, Speed, Digital, and Time.
     * Handles linear scaling via SI base multipliers as well as affine transformations
     * for temperature units (Celsius, Fahrenheit, Kelvin).
     * 
     * OBJECTS & METHODS PRESENT IN THIS FILE:
     * ConverterEngine:
     * 1. init():
     *    - Binds category switcher tab buttons, bidirectional input listeners,
     *      dropdown selectors, and unit swap button.
     * 
     * 2. populateUnits():
     *    - Populates the "From" and "To" <select> dropdowns based on the currently
     *      selected measurement category.
     * 
     * 3. convert(source):
     *    - Performs bidirectional real-time unit calculation (from -> to, or to -> from).
     *    - Normalizes values to SI base unit before converting to the target unit.
     *    - Updates the human-readable formula summary indicator.
     * 
     * 4. convertTemp(val, from, to):
     *    - Specialized non-linear converter for temperature (scales between °C, °F, and K).
     * ============================================================================
     */
    
    
    
    
    
    const ConverterEngine = {
        /** Currently selected unit category (defaults to 'length') */
        currentCategory: 'length',
        /** Reference map of conversion coefficients */
        units: CONVERTER_UNITS,
    
        /**
         * Initializes UI event listeners for categories, input synchronization, and unit swapping.
         */
        init() {
            const catBtns = document.querySelectorAll('.cat-btn');
            catBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    catBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.currentCategory = btn.dataset.cat;
                    this.populateUnits();
                    this.convert('from');
                });
            });
    
            // Live bidirectional typing listeners
            document.getElementById('convertValFrom').addEventListener('input', () => this.convert('from'));
            document.getElementById('convertValTo').addEventListener('input', () => this.convert('to'));
            document.getElementById('convertUnitFrom').addEventListener('change', () => this.convert('from'));
            document.getElementById('convertUnitTo').addEventListener('change', () => this.convert('from'));
    
            // Swap units button
            document.getElementById('swapUnitsBtn').addEventListener('click', () => {
                SoundFx.playClick(600);
                const fromUnit = document.getElementById('convertUnitFrom');
                const toUnit = document.getElementById('convertUnitTo');
                const temp = fromUnit.value;
                fromUnit.value = toUnit.value;
                toUnit.value = temp;
                this.convert('from');
            });
    
            // Initial setup
            this.populateUnits();
            this.convert('from');
        },
    
        /**
         * Rebuilds <option> elements in source and target dropdowns when the active category changes.
         */
        populateUnits() {
            const uList = Object.keys(this.units[this.currentCategory]);
            const fromSelect = document.getElementById('convertUnitFrom');
            const toSelect = document.getElementById('convertUnitTo');
    
            fromSelect.innerHTML = uList.map(u => `<option value="${u}">${u}</option>`).join('');
            toSelect.innerHTML = uList.map(u => `<option value="${u}">${u}</option>`).join('');
    
            fromSelect.selectedIndex = 0;
            toSelect.selectedIndex = Math.min(1, uList.length - 1);
        },
    
        /**
         * Executes bidirectional unit conversion.
         * 
         * @param {'from'|'to'} source - Identifies which input field triggered the conversion.
         */
        convert(source) {
            const cat = this.currentCategory;
            const fromUnit = document.getElementById('convertUnitFrom').value;
            const toUnit = document.getElementById('convertUnitTo').value;
    
            // Temperature uses affine shift/scale formulas
            if (cat === 'temperature') {
                if (source === 'from') {
                    const val = getFloatVal('convertValFrom');
                    const res = this.convertTemp(val, fromUnit, toUnit);
                    document.getElementById('convertValTo').value = res.toFixed(3);
                } else {
                    const val = getFloatVal('convertValTo');
                    const res = this.convertTemp(val, toUnit, fromUnit);
                    document.getElementById('convertValFrom').value = res.toFixed(3);
                }
            } else {
                // Standard SI linear multiplier conversion
                const uMap = this.units[cat];
                const fromFactor = uMap[fromUnit];
                const toFactor = uMap[toUnit];
    
                if (source === 'from') {
                    const val = parseFloat(document.getElementById('convertValFrom').value) || 0;
                    const baseVal = val * fromFactor;
                    const res = baseVal / toFactor;
                    document.getElementById('convertValTo').value = parseFloat(res.toFixed(6));
                } else {
                    const val = parseFloat(document.getElementById('convertValTo').value) || 0;
                    const baseVal = val * toFactor;
                    const res = baseVal / fromFactor;
                    document.getElementById('convertValFrom').value = parseFloat(res.toFixed(6));
                }
            }
    
            // Update the formula summary label (e.g. "1 Meter = 3.28084 Foot")
            const fromVal = document.getElementById('convertValFrom').value;
            const toVal = document.getElementById('convertValTo').value;
            document.getElementById('conversionFormula').textContent = `${fromVal} ${fromUnit} = ${toVal} ${toUnit}`;
        },
    
        /**
         * Converts temperature values between Celsius, Fahrenheit, and Kelvin.
         * 
         * @param {number} val - Input temperature reading.
         * @param {string} from - Source unit name ('Celsius', 'Fahrenheit', 'Kelvin').
         * @param {string} to - Destination unit name ('Celsius', 'Fahrenheit', 'Kelvin').
         * @returns {number} Converted temperature reading.
         */
        convertTemp(val, from, to) {
            if (from === to) return val;
            // Step 1: Normalize input to Celsius
            let c = val;
            if (from === 'Fahrenheit') c = (val - 32) * (5 / 9);
            if (from === 'Kelvin') c = val - 273.15;
    
            // Step 2: Convert Celsius to target unit
            if (to === 'Celsius') return c;
            if (to === 'Fahrenheit') return c * (9 / 5) + 32;
            if (to === 'Kelvin') return c + 273.15;
            return c;
        }
    };
    

    // -------------------------------------------------------------------------
    // Module: src/features/health.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - BMI & Metabolic Health Engine
     * File: src/features/health.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Computes essential biometric and metabolic health indicators:
     * 1. Body Mass Index (BMI): Supports Metric (cm, kg) and Imperial (ft/in, lbs) units.
     * 2. Visual Color Gauge Indicator: Positions the UI pointer dynamically across 4 WHO zones:
     *    Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), and Obese (>=30).
     * 3. Ideal Healthy Weight Range: Computes optimal weight bounds based on target BMI 18.5 - 24.9.
     * 4. Basal Metabolic Rate (BMR): Computes resting energy expenditure via the Mifflin-St Jeor formula.
     * 5. Total Daily Energy Expenditure (TDEE): Estimates daily caloric maintenance needs.
     * 
     * OBJECTS & METHODS PRESENT IN THIS FILE:
     * HealthEngine:
     * 1. setUnit(unit):
     *    - Toggles between 'metric' and 'imperial' input modes and re-runs calculations.
     * 
     * 2. calculate():
     *    - Converts inputs to standard SI units (meters and kilograms).
     *    - Computes BMI = weight / (height²).
     *    - Updates gauge pointer percentage position and category status badge.
     *    - Computes healthy weight range.
     *    - Computes gender-adjusted Mifflin-St Jeor BMR and activity TDEE.
     * ============================================================================
     */
    
    
    
    
    
    const HealthEngine = {
        /**
         * Toggles between Metric and Imperial measurement systems.
         * 
         * @param {'metric'|'imperial'} unit - Selected measurement unit system.
         */
        setUnit(unit) {
            state.health.unit = unit;
            document.getElementById('healthMetricBtn').classList.toggle('active', unit === 'metric');
            document.getElementById('healthImperialBtn').classList.toggle('active', unit === 'imperial');
    
            document.getElementById('heightMetricCard').style.display = unit === 'metric' ? 'flex' : 'none';
            document.getElementById('heightImperialCard').style.display = unit === 'imperial' ? 'flex' : 'none';
            document.getElementById('weightMetricCard').style.display = unit === 'metric' ? 'flex' : 'none';
            document.getElementById('weightImperialCard').style.display = unit === 'imperial' ? 'flex' : 'none';
    
            this.calculate();
        },
    
        /**
         * Executes complete biometric calculations: BMI, health category, gauge position,
         * healthy weight range, Mifflin-St Jeor BMR, and light-activity TDEE.
         */
        calculate() {
            SoundFx.playClick(600);
            const unit = state.health.unit;
            let heightM = 0;
            let weightKg = 0;
    
            // Convert user inputs into metric base units (meters & kilograms)
            if (unit === 'metric') {
                const cm = getFloatVal('healthHeightCm') || 175;
                weightKg = getFloatVal('healthWeightKg') || 70;
                heightM = cm / 100;
            } else {
                const ft = getFloatVal('healthHeightFt') || 5;
                const inches = getFloatVal('healthHeightIn') || 9;
                const lbs = getFloatVal('healthWeightLbs') || 154;
                const totalInches = ft * 12 + inches;
                heightM = totalInches * 0.0254;
                weightKg = lbs * 0.453592;
            }
    
            if (heightM <= 0 || weightKg <= 0) return;
    
            // BMI Formula: weight (kg) / [height (m)]²
            const bmi = weightKg / (heightM * heightM);
            const age = parseInt(document.getElementById('healthAge')?.value, 10) || 25;
            const gender = document.querySelector('input[name="healthGender"]:checked')?.value || 'male';
    
            // Determine WHO Classification & visual gauge pointer percentage position
            let cat = 'Normal Weight';
            let badgeClass = 'badge-normal';
            let pointerPercent = 45;
    
            if (bmi < 18.5) {
                cat = 'Underweight';
                badgeClass = 'badge-under';
                pointerPercent = (bmi / 18.5) * 25;
            } else if (bmi < 25) {
                cat = 'Normal Weight';
                badgeClass = 'badge-normal';
                pointerPercent = 25 + ((bmi - 18.5) / 6.5) * 25;
            } else if (bmi < 30) {
                cat = 'Overweight';
                badgeClass = 'badge-over';
                pointerPercent = 50 + ((bmi - 25) / 5) * 25;
            } else {
                cat = 'Obese';
                badgeClass = 'badge-obese';
                pointerPercent = Math.min(100, 75 + ((bmi - 30) / 10) * 25);
            }
    
            const bmiValEl = document.getElementById('bmiValue');
            if (bmiValEl) bmiValEl.textContent = bmi.toFixed(1);
    
            const catElem = document.getElementById('bmiCategory');
            if (catElem) {
                catElem.textContent = cat;
                catElem.className = `bmi-badge ${badgeClass}`;
            }
    
            const pointerEl = document.getElementById('bmiPointer');
            if (pointerEl) pointerEl.style.left = `${pointerPercent}%`;
    
            // Healthy Weight Range: Target BMI between 18.5 and 24.9
            const minW = (18.5 * heightM * heightM).toFixed(1);
            const maxW = (24.9 * heightM * heightM).toFixed(1);
            const healthyRangeEl = document.getElementById('healthyRangeVal');
            if (healthyRangeEl) {
                healthyRangeEl.textContent = unit === 'metric' 
                    ? `${minW} kg - ${maxW} kg` 
                    : `${(minW * 2.20462).toFixed(1)} lbs - ${(maxW * 2.20462).toFixed(1)} lbs`;
            }
    
            // Basal Metabolic Rate (BMR) via Mifflin-St Jeor Equation
            // Men:   BMR = 10*W + 6.25*H - 5*Age + 5
            // Women: BMR = 10*W + 6.25*H - 5*Age - 161
            let bmr = (10 * weightKg) + (6.25 * heightM * 100) - (5 * age);
            bmr = gender === 'male' ? bmr + 5 : bmr - 161;
    
            // Total Daily Energy Expenditure (TDEE) with light activity factor (1.375x)
            const tdee = bmr * 1.375;
    
            const bmrEl = document.getElementById('bmrVal');
            if (bmrEl) bmrEl.textContent = `${Math.round(bmr).toLocaleString()} kcal / day`;
    
            const tdeeEl = document.getElementById('tdeeVal');
            if (tdeeEl) tdeeEl.textContent = `${Math.round(tdee).toLocaleString()} kcal / day`;
        }
    };
    

    // -------------------------------------------------------------------------
    // Module: src/features/date.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Date & Age Calculation Engine
     * File: src/features/date.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Provides calendar and chronological date algorithms:
     * 1. Date Duration / Difference: Calculates absolute days, weeks, and hours between two dates.
     * 2. Chronological Age Breakdown: Computes exact years, months, and days lived from date of birth.
     * 3. Date Arithmetic: Computes future or past calendar dates by adding or subtracting an arbitrary number of days.
     * 
     * OBJECTS & METHODS PRESENT IN THIS FILE:
     * DateEngine:
     * 1. init():
     *    - Defaults date inputs to today's date and runs initial calculations.
     * 
     * 2. calculateDiff():
     *    - Reads 'dateFrom' and 'dateTo', computes the day delta, and updates display badges.
     * 
     * 3. calculateAge():
     *    - Computes exact chronological age taking into account leap years and varying month lengths.
     * 
     * 4. calculateAddSub():
     *    - Adds or subtracts specified days from a seed date and outputs the target weekday and date.
     * ============================================================================
     */
    
    
    
    const DateEngine = {
        /**
         * Initializes default dates to today / year 2000 and calculates initial results.
         */
        init() {
            const today = new Date().toISOString().split('T')[0];
            const dFrom = document.getElementById('dateFrom');
            const dTo = document.getElementById('dateTo');
            const bDate = document.getElementById('birthDate');
            const asDate = document.getElementById('asOfDate');
            const addDate = document.getElementById('addsubDate');
    
            if (dFrom && !dFrom.value) dFrom.value = today;
            if (dTo && !dTo.value) dTo.value = today;
            if (bDate && !bDate.value) bDate.value = '2000-01-01';
            if (asDate && !asDate.value) asDate.value = today;
            if (addDate && !addDate.value) addDate.value = today;
    
            this.calculateDiff();
            this.calculateAge();
            this.calculateAddSub();
        },
    
        /**
         * Computes the absolute difference in days, weeks, and hours between two calendar dates.
         */
        calculateDiff() {
            SoundFx.playClick(600);
            const dFromEl = document.getElementById('dateFrom');
            const dToEl = document.getElementById('dateTo');
            if (!dFromEl || !dToEl) return;
    
            const from = new Date(dFromEl.value);
            const to = new Date(dToEl.value);
    
            if (isNaN(from.getTime()) || isNaN(to.getTime())) return;
    
            // Calculate absolute time difference in milliseconds
            const diffTime = Math.abs(to - from);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const weeks = (diffDays / 7).toFixed(1);
    
            const primEl = document.getElementById('diffPrimary');
            const breakEl = document.getElementById('diffBreakdown');
            if (primEl) primEl.textContent = `${diffDays} Days`;
            if (breakEl) {
                breakEl.innerHTML = `Equivalent to <strong>${weeks} weeks</strong> or <strong>${(diffDays * 24).toLocaleString()} hours</strong>`;
            }
        },
    
        /**
         * Calculates exact chronological age (Years, Months, Days) from birthdate up to an 'as of' date.
         * Accurately borrows days from previous months when day subtraction goes negative.
         */
        calculateAge() {
            SoundFx.playClick(600);
            const bDateEl = document.getElementById('birthDate');
            const asDateEl = document.getElementById('asOfDate');
            if (!bDateEl || !asDateEl) return;
    
            const dob = new Date(bDateEl.value);
            const asOf = new Date(asDateEl.value);
    
            if (isNaN(dob.getTime()) || isNaN(asOf.getTime())) return;
    
            let years = asOf.getFullYear() - dob.getFullYear();
            let months = asOf.getMonth() - dob.getMonth();
            let days = asOf.getDate() - dob.getDate();
    
            // Adjust negative day borrowing from previous month
            if (days < 0) {
                months--;
                const prevMonthDays = new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
                days += prevMonthDays;
            }
            // Adjust negative month borrowing from previous year
            if (months < 0) {
                years--;
                months += 12;
            }
    
            const totalDays = Math.floor((asOf - dob) / (1000 * 60 * 60 * 24));
    
            const agePrimEl = document.getElementById('agePrimary');
            const ageBreakEl = document.getElementById('ageBreakdown');
            if (agePrimEl) agePrimEl.textContent = `${years} Years, ${months} Months, ${days} Days`;
            if (ageBreakEl) {
                ageBreakEl.innerHTML = `Total lived: <strong>${totalDays.toLocaleString()} days</strong> (≈ <strong>${Math.floor(totalDays / 7).toLocaleString()} weeks</strong>)`;
            }
        },
    
        /**
         * Adds or subtracts days from a specified date and displays the resulting date and day of week.
         */
        calculateAddSub() {
            SoundFx.playClick(600);
            const asDateEl = document.getElementById('addsubDate');
            const opEl = document.getElementById('addsubOperation');
            const daysEl = document.getElementById('addsubDays');
            if (!asDateEl || !opEl || !daysEl) return;
    
            const start = new Date(asDateEl.value);
            const op = opEl.value;
            const days = parseInt(daysEl.value, 10) || 0;
    
            if (isNaN(start.getTime())) return;
    
            const resultDate = new Date(start);
            if (op === 'add') {
                resultDate.setDate(resultDate.getDate() + days);
            } else {
                resultDate.setDate(resultDate.getDate() - days);
            }
    
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const resEl = document.getElementById('addsubResult');
            const dayEl = document.getElementById('addsubDayOfWeek');
            if (resEl) resEl.textContent = resultDate.toLocaleDateString(undefined, options);
            if (dayEl) dayEl.textContent = `${op === 'add' ? '+' : '−'} ${days} days from ${start.toLocaleDateString()}`;
        }
    };
    

    // -------------------------------------------------------------------------
    // Module: src/features/time.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Time Calculation & Stopwatch Engine
     * File: src/features/time.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * A multi-tool temporal calculation and chronometer engine:
     * 1. Time Unit Keypad: Dedicated keypad accepting hours, minutes, seconds, and milliseconds
     *    with direct arithmetic expressions (e.g., "2hour 35min + 45min").
     *    Supports multiple format output views: Hours/Minutes/Seconds (HMS), Decimal Hours,
     *    Total Minutes, and Total Seconds.
     * 2. Time Duration & Shift: Computes elapsed duration between clock times (e.g. 09:30 to 18:15)
     *    and shifts times forward or backward.
     * 3. Unix Epoch Converter: Real-time live UTC epoch counter with bidirectional date-to-epoch
     *    and epoch-to-date converters.
     * 4. Precision Digital Stopwatch: Millisecond chronometer with Lap times recording,
     *    fastest/slowest lap highlighting, and clipboard export.
     * 
     * OBJECTS & METHODS PRESENT IN THIS FILE:
     * TimeEngine:
     * 1. init(): Initializes default keypad screens, computes duration, and starts live epoch ticker.
     * 2. Keypad Subsystem:
     *    - inputKeypad(val): Handles numeric digits and operator buttons.
     *    - inputUnit(unit): Appends temporal unit token ('hour', 'min', 'sec', 'm.sec').
     *    - clearKeypad(): Resets keypad expression buffer.
     *    - backspaceKeypad(): Removes last character or temporal unit word.
     *    - updateKeypadScreen(): Synchronizes expression preview DOM element.
     *    - calculateKeypad(recordHistory): Evaluates time tokens to total seconds and formats display.
     *    - toggleFormat(): Cycles output mode through HMS -> Decimal Hours -> Total Minutes -> Total Seconds.
     *    - copyKeypadResult(): Copies current keypad result to clipboard.
     * 3. Duration & Arithmetic:
     *    - calculateDuration(): Computes elapsed difference between start and end clock times.
     *    - calculateMath(): Computes target clock time by adding/subtracting hours/minutes.
     * 4. Epoch Timestamps:
     *    - startEpochTicker(): Starts 1-second interval updating current live Unix epoch.
     *    - convertEpochToDate(): Converts numeric epoch timestamp to UTC/Local date string.
     *    - convertDateToEpoch(): Converts datetime picker value to integer Unix epoch seconds.
     * 5. Stopwatch:
     *    - startStopwatch(): Starts requestAnimationFrame/interval timer.
     *    - pauseStopwatch(): Freezes elapsed time counter.
     *    - resetStopwatch(): Resets timer and clears recorded laps.
     *    - recordLap(): Stores split and cumulative lap records.
     *    - renderLaps(): Renders lap table DOM.
     * ============================================================================
     */
    
    
    
    
    
    const TimeEngine = {
        swStartTime: 0,
        swElapsedTime: 0,
        swTimerInterval: null,
        swIsRunning: false,
        swLaps: [],
        epochTickerInterval: null,
    
        // Time Keypad State
        keypadExpr: '2hour 35min + 3hour 45min',
        keypadBuffer: '',
        keypadFormatMode: 'HMS', // 'HMS', 'DEC', 'MIN', 'SEC'
        keypadLastSeconds: 22800, // 6h 20m
    
        init() {
            this.updateKeypadScreen();
            this.calculateDuration();
            this.calculateMath();
            this.startEpochTicker();
        },
    
        // --- Time Keypad Methods ---
        inputKeypad(val) {
            SoundFx.playClick(500);
            if (['+', '−', '×', '÷', '%'].includes(val)) {
                if (this.keypadBuffer) {
                    this.keypadExpr += this.keypadBuffer + ' ';
                    this.keypadBuffer = '';
                }
                this.keypadExpr = this.keypadExpr.trimEnd() + ` ${val} `;
            } else if (val === '.') {
                if (!this.keypadBuffer.includes('.')) {
                    this.keypadBuffer = (this.keypadBuffer || '0') + '.';
                }
            } else {
                // Digits
                this.keypadBuffer += val;
            }
            this.updateKeypadScreen();
            this.calculateKeypad(false);
        },
    
        inputUnit(unit) {
            SoundFx.playClick(550);
            if (!this.keypadBuffer && !this.keypadExpr) return;
    
            const num = this.keypadBuffer || '';
            this.keypadExpr += num + unit + ' ';
            this.keypadBuffer = '';
            this.updateKeypadScreen();
            this.calculateKeypad(false);
        },
    
        clearKeypad() {
            SoundFx.playClick(450);
            this.keypadExpr = '';
            this.keypadBuffer = '';
            this.keypadLastSeconds = 0;
            const exprEl = document.getElementById('timeKeypadExpression');
            const resEl = document.getElementById('timeKeypadResult');
            const bdEl = document.getElementById('timeKeypadBreakdown');
            if (exprEl) exprEl.textContent = '0';
            if (resEl) resEl.textContent = '0hour 0min';
            if (bdEl) bdEl.innerHTML = '<span>0 Hours</span> • <span>0 Minutes</span> • <span>0 Seconds</span>';
        },
    
        backspaceKeypad() {
            SoundFx.playClick(480);
            if (this.keypadBuffer.length > 0) {
                this.keypadBuffer = this.keypadBuffer.slice(0, -1);
            } else if (this.keypadExpr.length > 0) {
                this.keypadExpr = this.keypadExpr.trimEnd();
                // Check if last token is unit word
                const units = ['m.sec', 'hour', 'min', 'sec'];
                let foundUnit = false;
                for (const u of units) {
                    if (this.keypadExpr.endsWith(u)) {
                        this.keypadExpr = this.keypadExpr.slice(0, -u.length);
                        foundUnit = true;
                        break;
                    }
                }
                if (!foundUnit) {
                    this.keypadExpr = this.keypadExpr.slice(0, -1);
                }
            }
            this.updateKeypadScreen();
            this.calculateKeypad(false);
        },
    
        updateKeypadScreen() {
            const exprEl = document.getElementById('timeKeypadExpression');
            if (!exprEl) return;
            const fullDisplay = (this.keypadExpr + this.keypadBuffer).trim() || '0';
            exprEl.textContent = fullDisplay;
        },
    
        formatSeconds(totalSec, mode = 'HMS') {
            const isNeg = totalSec < 0;
            const absSec = Math.abs(totalSec);
    
            if (mode === 'DEC') {
                const dec = (absSec / 3600).toFixed(3);
                return `${isNeg ? '−' : ''}${parseFloat(dec)} Hours`;
            }
            if (mode === 'MIN') {
                const mins = (absSec / 60).toFixed(2);
                return `${isNeg ? '−' : ''}${parseFloat(mins).toLocaleString()} min`;
            }
            if (mode === 'SEC') {
                return `${isNeg ? '−' : ''}${parseFloat(absSec.toFixed(3)).toLocaleString()} sec`;
            }
    
            // HMS format (e.g. 6hour 20min 15sec)
            const ms = Math.round((absSec % 1) * 1000);
            const totalWholeSec = Math.floor(absSec);
            const h = Math.floor(totalWholeSec / 3600);
            const m = Math.floor((totalWholeSec % 3600) / 60);
            const s = totalWholeSec % 60;
    
            const parts = [];
            if (h > 0 || (m === 0 && s === 0 && ms === 0)) parts.push(`${h}hour`);
            if (m > 0 || (h > 0 && s > 0)) parts.push(`${m}min`);
            if (s > 0 || (h === 0 && m === 0 && ms === 0)) parts.push(`${s}sec`);
            if (ms > 0) parts.push(`${ms}m.sec`);
    
            const resStr = parts.join(' ') || '0hour 0min';
            return `${isNeg ? '− ' : ''}${resStr}`;
        },
    
        calculateKeypad(isFinal = true) {
            const rawExpr = (this.keypadExpr + this.keypadBuffer).trim();
            if (!rawExpr || rawExpr === '0') return;
    
            try {
                let mathExpr = rawExpr
                    .replace(/(\d+(\.\d+)?)\s*hour/g, '($1 * 3600)')
                    .replace(/(\d+(\.\d+)?)\s*min/g, '($1 * 60)')
                    .replace(/(\d+(\.\d+)?)\s*sec/g, '($1 * 1)')
                    .replace(/(\d+(\.\d+)?)\s*m\.sec/g, '($1 * 0.001)');
    
                // Replace operators for JS eval
                mathExpr = mathExpr
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/−/g, '-');
    
                // Handle adjacent implicit addition (e.g. 2hour 35min -> 2hour + 35min)
                mathExpr = mathExpr.replace(/\)\s*\(/g, ') + (');
    
                // Clean up trailing operators if not final
                mathExpr = mathExpr.replace(/[\+\-\*\/%]\s*$/, '');
    
                const evaluatedSec = Function(`"use strict"; return (${mathExpr});`)();
                if (typeof evaluatedSec === 'number' && isFinite(evaluatedSec)) {
                    this.keypadLastSeconds = evaluatedSec;
                    const formatted = this.formatSeconds(evaluatedSec, this.keypadFormatMode);
                    
                    const resEl = document.getElementById('timeKeypadResult');
                    const bdEl = document.getElementById('timeKeypadBreakdown');
                    if (resEl) resEl.textContent = formatted;
    
                    if (bdEl) {
                        const decH = (evaluatedSec / 3600).toFixed(3);
                        const totM = (evaluatedSec / 60).toFixed(1);
                        const totS = evaluatedSec.toFixed(0);
                        bdEl.innerHTML = `<span>${parseFloat(decH).toLocaleString()} Hours</span> • <span>${parseFloat(totM).toLocaleString()} Minutes</span> • <span>${parseFloat(totS).toLocaleString()} Seconds</span>`;
                    }
    
                    if (isFinal) {
                        SoundFx.playClick(850, 'triangle', 0.05);
                        addHistory(rawExpr, formatted);
                    }
                }
            } catch (e) {
                if (isFinal) {
                    const resEl = document.getElementById('timeKeypadResult');
                    if (resEl) resEl.textContent = 'Error';
                }
            }
        },
    
        toggleFormat() {
            SoundFx.playClick(600);
            const modes = ['HMS', 'DEC', 'MIN', 'SEC'];
            const labels = { HMS: 'Format: H:M:S', DEC: 'Format: Dec Hours', MIN: 'Format: Total Mins', SEC: 'Format: Total Secs' };
            const nextIdx = (modes.indexOf(this.keypadFormatMode) + 1) % modes.length;
            this.keypadFormatMode = modes[nextIdx];
    
            const badge = document.getElementById('timeFormatModeBadge');
            if (badge) badge.textContent = labels[this.keypadFormatMode];
    
            const formatted = this.formatSeconds(this.keypadLastSeconds, this.keypadFormatMode);
            const resEl = document.getElementById('timeKeypadResult');
            if (resEl) resEl.textContent = formatted;
        },
    
        copyKeypadResult() {
            const resEl = document.getElementById('timeKeypadResult');
            if (resEl) copyToClipboard(resEl.textContent);
        },
    
        calculateDuration() {
            SoundFx.playClick(600);
            const sEl = document.getElementById('timeStart');
            const eEl = document.getElementById('timeEnd');
            const bEl = document.getElementById('timeBreak');
            if (!sEl || !eEl) return;
    
            const startVal = sEl.value;
            const endVal = eEl.value;
            const breakMins = parseInt(bEl ? bEl.value : '0', 10) || 0;
    
            if (!startVal || !endVal) return;
    
            const [sH, sM, sS = 0] = startVal.split(':').map(Number);
            const [eH, eM, eS = 0] = endVal.split(':').map(Number);
    
            let startTotalSec = sH * 3600 + sM * 60 + sS;
            let endTotalSec = eH * 3600 + eM * 60 + eS;
    
            // Across midnight handling
            if (endTotalSec < startTotalSec) {
                endTotalSec += 24 * 3600;
            }
    
            let netSec = (endTotalSec - startTotalSec) - (breakMins * 60);
            if (netSec < 0) netSec = 0;
    
            const h = Math.floor(netSec / 3600);
            const m = Math.floor((netSec % 3600) / 60);
            const s = netSec % 60;
            const decimalHrs = (netSec / 3600).toFixed(2);
            const totalMins = Math.floor(netSec / 60);
    
            const primEl = document.getElementById('timeDurationPrimary');
            const decEl = document.getElementById('timeDurationDecimal');
            const minEl = document.getElementById('timeDurationMinutes');
            const secEl = document.getElementById('timeDurationSeconds');
    
            if (primEl) primEl.textContent = `${h}h ${m}m ${s}s`;
            if (decEl) decEl.textContent = `${decimalHrs} hrs`;
            if (minEl) minEl.textContent = `${totalMins.toLocaleString()} mins`;
            if (secEl) secEl.textContent = `${netSec.toLocaleString()} sec`;
        },
    
        calculateMath() {
            SoundFx.playClick(600);
            const t1HEl = document.getElementById('t1Hours');
            const t1MEl = document.getElementById('t1Mins');
            const t1SEl = document.getElementById('t1Secs');
            const t2HEl = document.getElementById('t2Hours');
            const t2MEl = document.getElementById('t2Mins');
            const t2SEl = document.getElementById('t2Secs');
            const opEl = document.getElementById('timeMathOp');
    
            const t1H = parseInt(t1HEl ? t1HEl.value : '0', 10) || 0;
            const t1M = parseInt(t1MEl ? t1MEl.value : '0', 10) || 0;
            const t1S = parseInt(t1SEl ? t1SEl.value : '0', 10) || 0;
    
            const t2H = parseInt(t2HEl ? t2HEl.value : '0', 10) || 0;
            const t2M = parseInt(t2MEl ? t2MEl.value : '0', 10) || 0;
            const t2S = parseInt(t2SEl ? t2SEl.value : '0', 10) || 0;
    
            const op = opEl ? opEl.value : 'add';
    
            const sec1 = t1H * 3600 + t1M * 60 + t1S;
            const sec2 = t2H * 3600 + t2M * 60 + t2S;
    
            let resSec = op === 'add' ? sec1 + sec2 : sec1 - sec2;
            const isNegative = resSec < 0;
            resSec = Math.abs(resSec);
    
            const h = Math.floor(resSec / 3600);
            const m = Math.floor((resSec % 3600) / 60);
            const s = resSec % 60;
    
            const prefix = isNegative ? '− ' : '';
            const resEl = document.getElementById('timeMathResult');
            const sResEl = document.getElementById('timeMathSecs');
            const mResEl = document.getElementById('timeMathMins');
    
            if (resEl) resEl.textContent = `${prefix}${h}h ${m}m ${s}s`;
            if (sResEl) sResEl.textContent = `${prefix}${resSec.toLocaleString()} s`;
            if (mResEl) mResEl.textContent = `${prefix}${(resSec / 60).toFixed(2)} m`;
        },
    
        // Stopwatch
        toggleStopwatch() {
            SoundFx.playClick(700);
            const startBtn = document.getElementById('swStartBtn');
            if (this.swIsRunning) {
                // Pause
                clearInterval(this.swTimerInterval);
                this.swElapsedTime += Date.now() - this.swStartTime;
                this.swIsRunning = false;
                if (startBtn) {
                    startBtn.textContent = 'Resume';
                    startBtn.classList.remove('running');
                }
            } else {
                // Start
                this.swStartTime = Date.now();
                this.swTimerInterval = setInterval(() => this.updateStopwatchDisplay(), 10);
                this.swIsRunning = true;
                if (startBtn) {
                    startBtn.textContent = 'Stop';
                    startBtn.classList.add('running');
                }
            }
        },
    
        updateStopwatchDisplay() {
            const time = this.swElapsedTime + (Date.now() - this.swStartTime);
            const ms = Math.floor((time % 1000) / 10);
            const totalSec = Math.floor(time / 1000);
            const s = totalSec % 60;
            const m = Math.floor((totalSec / 60) % 60);
            const h = Math.floor(totalSec / 3600);
    
            const fmt = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
            const disp = document.getElementById('stopwatchDisplay');
            if (disp) disp.textContent = fmt;
        },
    
        lapStopwatch() {
            if (!this.swIsRunning && this.swElapsedTime === 0) return;
            SoundFx.playClick(600);
            const dispEl = document.getElementById('stopwatchDisplay');
            const disp = dispEl ? dispEl.textContent : '';
            this.swLaps.unshift({ lapNum: this.swLaps.length + 1, time: disp });
    
            const container = document.getElementById('swLapsContainer');
            if (container) {
                container.innerHTML = this.swLaps.map(l => `
                    <div class="lap-row">
                        <span class="lap-num">Lap ${l.lapNum}</span>
                        <span class="lap-time">${l.time}</span>
                    </div>
                `).join('');
            }
        },
    
        resetStopwatch() {
            SoundFx.playClick(500);
            clearInterval(this.swTimerInterval);
            this.swIsRunning = false;
            this.swElapsedTime = 0;
            this.swLaps = [];
            const disp = document.getElementById('stopwatchDisplay');
            const startBtn = document.getElementById('swStartBtn');
            const container = document.getElementById('swLapsContainer');
            if (disp) disp.textContent = '00:00:00.00';
            if (startBtn) {
                startBtn.textContent = 'Start';
                startBtn.classList.remove('running');
            }
            if (container) container.innerHTML = '<div class="empty-laps">No lap times recorded</div>';
        },
    
        // Unix Epoch
        startEpochTicker() {
            const updateEpoch = () => {
                const el = document.getElementById('currentEpochVal');
                if (el) el.textContent = Math.floor(Date.now() / 1000);
            };
            updateEpoch();
            if (!this.epochTickerInterval) {
                this.epochTickerInterval = setInterval(updateEpoch, 1000);
            }
        },
    
        convertEpochToDate() {
            SoundFx.playClick(600);
            const inp = document.getElementById('epochInput');
            if (!inp) return;
            const ep = parseInt(inp.value, 10);
            if (isNaN(ep)) return;
    
            const d = new Date(ep * 1000);
            const primEl = document.getElementById('epochResultPrimary');
            const secEl = document.getElementById('epochResultSecondary');
            if (primEl) primEl.textContent = d.toLocaleString();
            if (secEl) {
                secEl.innerHTML = `
                    UTC: <strong>${d.toUTCString()}</strong><br>
                    ISO: <strong>${d.toISOString()}</strong>
                `;
            }
        },
    
        convertDateToEpoch() {
            SoundFx.playClick(600);
            const dtInp = document.getElementById('dateToEpochInput');
            if (!dtInp || !dtInp.value) return;
    
            const d = new Date(dtInp.value);
            const epochSec = Math.floor(d.getTime() / 1000);
            const primEl = document.getElementById('epochResultPrimary');
            const secEl = document.getElementById('epochResultSecondary');
            if (primEl) primEl.textContent = `${epochSec} Epoch`;
            if (secEl) secEl.textContent = `${d.toUTCString()} (Local: ${d.toLocaleString()})`;
        }
    };
    

    // -------------------------------------------------------------------------
    // Module: src/features/discount.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Discount, Tax & Tip Calculation Engine
     * File: src/features/discount.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Handles shopping discount calculations, multi-tier coupon reductions, sales tax,
     * restaurant tipping, and multi-person bill splitting. Provides instantaneous
     * currency-aware feedback and clipboard summary generation.
     * 
     * OBJECTS & METHODS PRESENT IN THIS FILE:
     * DiscountEngine:
     * 1. init():
     *    - Loads persisted currency preference from localStorage and runs initial evaluations.
     * 
     * 2. setCurrency(code):
     *    - Changes active currency, updates input label symbols, and re-renders results.
     * 
     * 3. formatMoney(amount):
     *    - Delegates monetary formatting to the core formatMoney utility using the active currency.
     * 
     * 4. updateLabels():
     *    - Dynamically updates UI input labels with the active currency symbol.
     * 
     * 5. calculateDiscount():
     *    - Computes final price after primary discount %, extra coupon %, and sales tax %.
     *    - Calculates absolute and relative monetary savings.
     * 
     * 6. setDiscountPct(val):
     *    - Quick preset button handler for standard discount percentages (e.g. 10%, 20%, 50%).
     * 
     * 7. calculateTip():
     *    - Computes total tip amount, grand total, and per-person split amounts.
     * 
     * 8. setTipPct(val):
     *    - Quick preset button handler for standard tip percentages (10%, 15%, 20%).
     * 
     * 9. stepTipPeople(delta):
     *    - Increments or decrements the number of persons splitting the bill (clamped 1-100).
     * 
     * 10. copyTipSummary():
     *     - Generates and copies a cleanly formatted text receipt to the system clipboard.
     * ============================================================================
     */
    
    
    
    
    
    
    const DiscountEngine = {
        /** Currently active currency code (persisted in localStorage) */
        currentCurrency: localStorage.getItem('calverse_disc_currency') || 'INR',
    
        /**
         * Initializes currency selection, updates DOM labels, and performs initial calculations.
         */
        init() {
            const curSelect = document.getElementById('discCurrencySelect');
            if (curSelect) {
                curSelect.value = this.currentCurrency;
            }
            this.updateLabels();
            this.calculateDiscount();
            this.calculateTip();
        },
    
        /**
         * Switches the active currency, saves to localStorage, and updates UI representations.
         * 
         * @param {string} code - ISO 4217 currency code (e.g., 'INR', 'USD', 'EUR').
         */
        setCurrency(code) {
            if (CURRENCY_CONFIG[code]) {
                this.currentCurrency = code;
                localStorage.setItem('calverse_disc_currency', code);
                const curSelect = document.getElementById('discCurrencySelect');
                if (curSelect) curSelect.value = code;
                this.updateLabels();
                this.calculateDiscount();
                this.calculateTip();
                SoundFx.playClick(650);
            }
        },
    
        /**
         * Helper to format amounts using the active discount currency.
         * 
         * @param {number} amount - Numeric amount to format.
         * @returns {string} Formatted localized currency string.
         */
        formatMoney(amount) {
            return formatMoney(amount, this.currentCurrency);
        },
    
        /**
         * Synchronizes form input labels to reflect the active currency symbol.
         */
        updateLabels() {
            const conf = CURRENCY_CONFIG[this.currentCurrency] || CURRENCY_CONFIG.INR;
            const origLabel = document.getElementById('discOriginalPriceLabel');
            const tipBillLabel = document.getElementById('tipBillAmountLabel');
    
            if (origLabel) origLabel.textContent = `Original Price (${conf.symbol.trim()})`;
            if (tipBillLabel) tipBillLabel.textContent = `Bill Amount (${conf.symbol.trim()})`;
        },
    
        /**
         * Calculates compounded discount, coupon reductions, and tax additions.
         * Formula:
         *   afterDiscount = original - (original * discountPct / 100)
         *   afterCoupon   = afterDiscount - (afterDiscount * couponPct / 100)
         *   finalPrice    = afterCoupon + (afterCoupon * taxPct / 100)
         */
        calculateDiscount() {
            const orig = parseFloat(document.getElementById('discOriginalPrice')?.value) || 0;
            const pct = parseFloat(document.getElementById('discPercent')?.value) || 0;
            const coup = parseFloat(document.getElementById('discCoupon')?.value) || 0;
            const tax = parseFloat(document.getElementById('discTax')?.value) || 0;
    
            const discAmt = orig * (pct / 100);
            const afterDisc = orig - discAmt;
            const coupAmt = afterDisc * (coup / 100);
            const afterCoup = afterDisc - coupAmt;
            const taxAmt = afterCoup * (tax / 100);
            const finalPrice = afterCoup + taxAmt;
            const totalSaved = (orig - afterCoup);
            const savedPct = orig > 0 ? ((totalSaved / orig) * 100).toFixed(1) : '0';
    
            const finalEl = document.getElementById('discFinalPrice');
            const savingsEl = document.getElementById('discSavingsTag');
            const origEl = document.getElementById('discOrigShow');
            const amtEl = document.getElementById('discAmountShow');
            const coupRow = document.getElementById('discCouponRow');
            const coupEl = document.getElementById('discCouponShow');
            const taxRow = document.getElementById('discTaxRow');
            const taxEl = document.getElementById('discTaxShow');
    
            const formattedFinal = this.formatMoney(finalPrice);
            const formattedSaved = this.formatMoney(totalSaved);
            const formattedOrig = this.formatMoney(orig);
            const formattedDiscAmt = this.formatMoney(discAmt);
            const formattedCoupAmt = this.formatMoney(coupAmt);
            const formattedTaxAmt = this.formatMoney(taxAmt);
    
            if (finalEl) finalEl.textContent = formattedFinal;
            if (savingsEl) savingsEl.textContent = `You save ${formattedSaved} (${savedPct}%)`;
            if (origEl) origEl.textContent = formattedOrig;
            if (amtEl) amtEl.textContent = `-${formattedDiscAmt}`;
    
            // Toggle visibility of optional breakdown rows
            if (coupRow) coupRow.style.display = coup > 0 ? 'flex' : 'none';
            if (coupEl) coupEl.textContent = `-${formattedCoupAmt}`;
            if (taxRow) taxRow.style.display = tax > 0 ? 'flex' : 'none';
            if (taxEl) taxEl.textContent = `+${formattedTaxAmt}`;
        },
    
        /**
         * Applies a quick percentage preset chip to the discount input.
         * 
         * @param {number} val - Discount percentage (e.g., 10, 20, 50).
         */
        setDiscountPct(val) {
            SoundFx.playClick(600);
            const el = document.getElementById('discPercent');
            if (el) el.value = val;
            const chips = document.querySelectorAll('#subtab-discount-calc .quick-pct-chip');
            chips.forEach(c => c.classList.toggle('active', c.textContent.trim() === `${val}%`));
            this.calculateDiscount();
        },
    
        /**
         * Calculates bill tip, grand total, and per-person split amounts.
         */
        calculateTip() {
            const bill = parseFloat(document.getElementById('tipBillAmount')?.value) || 0;
            const tipPct = parseFloat(document.getElementById('tipPercent')?.value) || 0;
            const people = parseInt(document.getElementById('tipPeopleCount')?.value, 10) || 1;
    
            const tipAmt = bill * (tipPct / 100);
            const total = bill + tipAmt;
            const perPersonTotal = people > 0 ? total / people : total;
            const perPersonTip = people > 0 ? tipAmt / people : tipAmt;
    
            const perPersonEl = document.getElementById('tipPerPersonVal');
            const perPersonTipEl = document.getElementById('tipPerPersonTipVal');
            const totalBillEl = document.getElementById('tipTotalBillShow');
            const totalTipEl = document.getElementById('tipTotalTipShow');
            const grandTotalEl = document.getElementById('tipGrandTotalShow');
            const peopleEl = document.getElementById('tipPeopleCountShow');
    
            const formattedPerPerson = this.formatMoney(perPersonTotal);
            const formattedPerPersonTip = this.formatMoney(perPersonTip);
            const formattedBill = this.formatMoney(bill);
            const formattedTipAmt = this.formatMoney(tipAmt);
            const formattedTotal = this.formatMoney(total);
    
            if (perPersonEl) perPersonEl.textContent = formattedPerPerson;
            if (perPersonTipEl) perPersonTipEl.textContent = formattedPerPersonTip;
            if (totalBillEl) totalBillEl.textContent = formattedBill;
            if (totalTipEl) totalTipEl.textContent = formattedTipAmt;
            if (grandTotalEl) grandTotalEl.textContent = formattedTotal;
            if (peopleEl) peopleEl.textContent = people.toString();
        },
    
        /**
         * Applies a quick percentage preset chip to the tip input.
         * 
         * @param {number} val - Tip percentage (e.g., 10, 15, 20).
         */
        setTipPct(val) {
            SoundFx.playClick(600);
            const el = document.getElementById('tipPercent');
            if (el) el.value = val;
            const chips = document.querySelectorAll('#subtab-tip-calc .quick-pct-chip');
            chips.forEach(c => c.classList.toggle('active', c.textContent.trim() === `${val}%`));
            this.calculateTip();
        },
    
        /**
         * Adjusts the number of people splitting the bill.
         * 
         * @param {number} delta - Positive or negative integer step (+1 or -1).
         */
        stepTipPeople(delta) {
            SoundFx.playClick(500);
            const el = document.getElementById('tipPeopleCount');
            if (!el) return;
            let val = parseInt(el.value, 10) || 1;
            val = Math.max(1, Math.min(100, val + delta));
            el.value = val;
            this.calculateTip();
        },
    
        /**
         * Copies a clean ASCII bill receipt to the clipboard for sharing with friends.
         */
        copyTipSummary() {
            const bill = document.getElementById('tipTotalBillShow')?.textContent || this.formatMoney(0);
            const tip = document.getElementById('tipTotalTipShow')?.textContent || this.formatMoney(0);
            const grand = document.getElementById('tipGrandTotalShow')?.textContent || this.formatMoney(0);
            const people = document.getElementById('tipPeopleCountShow')?.textContent || '1';
            const perPerson = document.getElementById('tipPerPersonVal')?.textContent || this.formatMoney(0);
    
            const summary = `🧾 CalVerse Bill Split Receipt\nBill Amount: ${bill}\nTip Amount: ${tip}\nTotal with Tip: ${grand}\nSplit Between: ${people} person(s)\n👉 Each Person Pays: ${perPerson}`;
            copyToClipboard(summary);
        }
    };
    

    // -------------------------------------------------------------------------
    // Module: src/features/equations.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Equation & Algebra Engine
     * File: src/features/equations.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Solves polynomial, linear, and rational algebraic problems with full
     * pedagogical step-by-step mathematical breakdowns:
     * 1. Quadratic Equation Solver: Solves ax² + bx + c = 0, calculates discriminant Δ,
     *    identifies real/complex roots, and computes parabola vertex (h, k).
     * 2. 2x2 Linear System Solver: Solves simultaneous linear equations via Cramer's Rule
     *    with determinant analysis (unique solution, coincident infinite solutions, parallel).
     * 3. Rational Fraction Engine: Adds, subtracts, multiplies, and divides fractions,
     *    simplifies via Euclidean Greatest Common Divisor (GCD), and computes mixed numbers.
     * 
     * OBJECTS & METHODS PRESENT IN THIS FILE:
     * EquationEngine:
     * 1. init():
     *    - Triggers initial solutions for quadratic, linear, and fraction engines.
     * 
     * 2. solveQuadratic():
     *    - Reads a, b, c; calculates discriminant D; computes roots (real or complex with imaginary unit i);
     *      computes parabola vertex (h, k); writes step-by-step explanations.
     * 
     * 3. updateLiveEquation(a, b, c):
     *    - Dynamically formats the live LaTeX-style equation preview label with correct signs.
     * 
     * 4. solveLinearSystem():
     *    - Solves a1*x + b1*y = c1 and a2*x + b2*y = c2 using Cramer's Rule determinants D, Dx, Dy.
     * 
     * 5. calculateFraction():
     *    - Computes rational fractions (n1/d1) [+, -, *, /] (n2/d2), simplifies via GCD Euclidean
     *      algorithm, formats mixed fractions and decimal approximations.
     * ============================================================================
     */
    
    const EquationEngine = {
        /**
         * Solves initial quadratic, linear, and fraction equations on boot.
         */
        init() {
            this.solveQuadratic();
            this.solveLinearSystem();
            this.calculateFraction();
        },
    
        /**
         * Solves the quadratic equation ax² + bx + c = 0.
         * Computes discriminant Δ = b² - 4ac, real/complex roots, and parabola vertex (h, k).
         */
        solveQuadratic() {
            const a = parseFloat(document.getElementById('quadA')?.value);
            const b = parseFloat(document.getElementById('quadB')?.value);
            const c = parseFloat(document.getElementById('quadC')?.value);
    
            const r1El = document.getElementById('quadRoot1');
            const r2El = document.getElementById('quadRoot2');
            const stepDisc = document.getElementById('quadStepDisc');
            const stepForm = document.getElementById('quadStepFormula');
            const stepVert = document.getElementById('quadStepVertex');
    
            // Update live formula preview banner
            this.updateLiveEquation(a, b, c);
    
            if (isNaN(a) || isNaN(b) || isNaN(c)) return;
    
            // Linear degenerate case (a = 0)
            if (a === 0) {
                if (b !== 0) {
                    const x = (-c / b).toFixed(4);
                    if (r1El) r1El.textContent = x;
                    if (r2El) r2El.textContent = 'Linear (1 Root)';
                    if (stepDisc) stepDisc.innerHTML = `<span class="step-num">1.</span> Linear Equation: ${b}x + ${c} = 0`;
                    if (stepForm) stepForm.innerHTML = `<span class="step-num">2.</span> x = −(${c}) / ${b} = ${x}`;
                    if (stepVert) stepVert.innerHTML = `<span class="step-num">3.</span> Straight line (No vertex)`;
                } else {
                    if (r1El) r1El.textContent = c === 0 ? 'Infinite Roots' : 'No Solution';
                    if (r2El) r2El.textContent = '--';
                }
                return;
            }
    
            // Quadratic analysis
            const D = b * b - 4 * a * c;
            const h = -b / (2 * a);
            const k = c - (b * b) / (4 * a);
            const opens = a > 0 ? 'Opens Upward (Minimum)' : 'Opens Downward (Maximum)';
    
            if (D > 0) {
                // Case 1: Two distinct real roots
                const x1 = ((-b + Math.sqrt(D)) / (2 * a)).toFixed(4);
                const x2 = ((-b - Math.sqrt(D)) / (2 * a)).toFixed(4);
                if (r1El) r1El.textContent = x1;
                if (r2El) r2El.textContent = x2;
                if (stepDisc) stepDisc.innerHTML = `<span class="step-num">1.</span> Discriminant: Δ = b² − 4ac = (${b})² − 4(${a})(${c}) = ${D} > 0 → Two Real Roots`;
                if (stepForm) stepForm.innerHTML = `<span class="step-num">2.</span> Quadratic Formula: x = (−(${b}) ± √${D}) / (2 × ${a}) → x₁ = ${x1}, x₂ = ${x2}`;
                if (stepVert) stepVert.innerHTML = `<span class="step-num">3.</span> Vertex: (h, k) = (${h.toFixed(2)}, ${k.toFixed(2)}) • ${opens}`;
            } else if (D === 0) {
                // Case 2: One repeated real root
                const x = ((-b) / (2 * a)).toFixed(4);
                if (r1El) r1El.textContent = x;
                if (r2El) r2El.textContent = `${x} (Double Root)`;
                if (stepDisc) stepDisc.innerHTML = `<span class="step-num">1.</span> Discriminant: Δ = 0 → One Repeated Root`;
                if (stepForm) stepForm.innerHTML = `<span class="step-num">2.</span> Root: x = −(${b}) / (2 × ${a}) = ${x}`;
                if (stepVert) stepVert.innerHTML = `<span class="step-num">3.</span> Vertex: (h, k) = (${h.toFixed(2)}, ${k.toFixed(2)}) • ${opens}`;
            } else {
                // Case 3: Complex conjugate roots (imaginary unit i)
                const realPart = ((-b) / (2 * a)).toFixed(4);
                const imagPart = ((Math.sqrt(-D)) / (2 * Math.abs(a))).toFixed(4);
                if (r1El) r1El.textContent = `${realPart} + ${imagPart}i`;
                if (r2El) r2El.textContent = `${realPart} - ${imagPart}i`;
                if (stepDisc) stepDisc.innerHTML = `<span class="step-num">1.</span> Discriminant: Δ = ${D} < 0 → Two Complex Roots`;
                if (stepForm) stepForm.innerHTML = `<span class="step-num">2.</span> Formula: x = ${realPart} ± ${imagPart}i`;
                if (stepVert) stepVert.innerHTML = `<span class="step-num">3.</span> Vertex: (h, k) = (${h.toFixed(2)}, ${k.toFixed(2)}) • ${opens}`;
            }
        },
    
        /**
         * Updates the dynamic equation text preview to show current coefficients with correct signs.
         */
        updateLiveEquation(a, b, c) {
            const el = document.getElementById('quadLiveEqText');
            if (!el) return;
            const aVal = isNaN(a) ? '?' : a;
            const bVal = isNaN(b) ? '?' : b;
            const cVal = isNaN(c) ? '?' : c;
            const bSign = (typeof bVal === 'number' && bVal < 0) ? '−' : '+';
            const cSign = (typeof cVal === 'number' && cVal < 0) ? '−' : '+';
            const bAbs = typeof bVal === 'number' ? Math.abs(bVal) : bVal;
            const cAbs = typeof cVal === 'number' ? Math.abs(cVal) : cVal;
            el.textContent = `${aVal}x² ${bSign} ${bAbs}x ${cSign} ${cAbs} = 0`;
        },
    
        /**
         * Solves a 2x2 system of linear equations using Cramer's Rule:
         *   a1*x + b1*y = c1
         *   a2*x + b2*y = c2
         */
        solveLinearSystem() {
            const a1 = parseFloat(document.getElementById('linA1')?.value);
            const b1 = parseFloat(document.getElementById('linB1')?.value);
            const c1 = parseFloat(document.getElementById('linC1')?.value);
            const a2 = parseFloat(document.getElementById('linA2')?.value);
            const b2 = parseFloat(document.getElementById('linB2')?.value);
            const c2 = parseFloat(document.getElementById('linC2')?.value);
    
            const xEl = document.getElementById('linResultX');
            const yEl = document.getElementById('linResultY');
            const sD = document.getElementById('linStepD');
            const sDx = document.getElementById('linStepDx');
            const sDy = document.getElementById('linStepDy');
    
            if ([a1, b1, c1, a2, b2, c2].some(isNaN)) return;
    
            // Cramer's determinants
            const D = a1 * b2 - a2 * b1;
            const Dx = c1 * b2 - c2 * b1;
            const Dy = a1 * c2 - a2 * c1;
    
            if (D !== 0) {
                const x = (Dx / D).toFixed(4);
                const y = (Dy / D).toFixed(4);
                if (xEl) xEl.textContent = x;
                if (yEl) yEl.textContent = y;
                if (sD) sD.innerHTML = `<span class="step-num">D</span> = (a₁·b₂ − a₂·b₁) = (${a1})(${b2}) − (${a2})(${b1}) = ${D}`;
                if (sDx) sDx.innerHTML = `<span class="step-num">Dₓ</span> = (${c1})(${b2}) − (${c2})(${b1}) = ${Dx} → x = Dₓ/D = ${x}`;
                if (sDy) sDy.innerHTML = `<span class="step-num">Dᵧ</span> = (${a1})(${c2}) − (${a2})(${c1}) = ${Dy} → y = Dᵧ/D = ${y}`;
            } else {
                if (Dx === 0 && Dy === 0) {
                    if (xEl) xEl.textContent = 'Infinite Solutions';
                    if (yEl) yEl.textContent = '(Coincident Lines)';
                    if (sD) sD.innerHTML = `<span class="step-num">D</span> = 0, Dₓ = 0, Dᵧ = 0 → Infinitely many solutions`;
                } else {
                    if (xEl) xEl.textContent = 'No Solution';
                    if (yEl) yEl.textContent = '(Parallel Lines)';
                    if (sD) sD.innerHTML = `<span class="step-num">D</span> = 0 but Dₓ or Dᵧ ≠ 0 → Parallel lines (Inconsistent)`;
                }
            }
        },
    
        /**
         * Performs fraction arithmetic and Euclidean GCD reduction:
         * (n1/d1) [op] (n2/d2) -> reduced fraction, mixed fraction, and decimal.
         */
        calculateFraction() {
            const n1 = parseInt(document.getElementById('fracNum1')?.value, 10);
            const d1 = parseInt(document.getElementById('fracDen1')?.value, 10);
            const op = document.getElementById('fracOperator')?.value || '+';
            const n2 = parseInt(document.getElementById('fracNum2')?.value, 10);
            const d2 = parseInt(document.getElementById('fracDen2')?.value, 10);
    
            const resFracEl = document.getElementById('fracResultFrac');
            const resMixedEl = document.getElementById('fracResultMixed');
            const resDecEl = document.getElementById('fracResultDecimal');
            const s1 = document.getElementById('fracStep1');
            const s2 = document.getElementById('fracStep2');
    
            if ([n1, d1, n2, d2].some(isNaN) || d1 === 0 || d2 === 0) {
                if (resFracEl) resFracEl.textContent = 'Invalid Denominator';
                return;
            }
    
            let num = 0;
            let den = 1;
    
            if (op === '+') {
                num = n1 * d2 + n2 * d1;
                den = d1 * d2;
            } else if (op === '-') {
                num = n1 * d2 - n2 * d1;
                den = d1 * d2;
            } else if (op === '*') {
                num = n1 * n2;
                den = d1 * d2;
            } else if (op === '/') {
                if (n2 === 0) {
                    if (resFracEl) resFracEl.textContent = 'Cannot divide by 0';
                    return;
                }
                num = n1 * d2;
                den = d1 * n2;
            }
    
            // Standardize negative sign to numerator
            if (den < 0) {
                num = -num;
                den = -den;
            }
    
            // Euclidean Greatest Common Divisor
            const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
            const common = gcd(num, den);
            const simNum = num / common;
            const simDen = den / common;
    
            // Mixed fraction formatting (e.g. 7/2 -> 3 1/2)
            let mixedStr = '';
            if (Math.abs(simNum) >= simDen && simDen !== 1) {
                const whole = Math.trunc(simNum / simDen);
                const rem = Math.abs(simNum % simDen);
                mixedStr = rem > 0 ? `${whole}  ${rem}/${simDen}` : `${whole}`;
            } else if (simDen === 1) {
                mixedStr = `${simNum}`;
            } else {
                mixedStr = `${simNum}/${simDen}`;
            }
    
            const decimalVal = (simNum / simDen).toFixed(4);
    
            if (resFracEl) resFracEl.textContent = `${simNum} / ${simDen}`;
            if (resMixedEl) resMixedEl.textContent = mixedStr;
            if (resDecEl) resDecEl.textContent = decimalVal;
            if (s1) s1.textContent = `Computation: Numerator = ${num}, Denominator = ${den}`;
            if (s2) s2.textContent = `GCD Reduction by ${common}: ${num}/${den} = ${simNum}/${simDen}`;
        }
    };
    

    // -------------------------------------------------------------------------
    // Module: src/features/statistics.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Statistical Analysis & Data Visualization Engine
     * File: src/features/statistics.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * A comprehensive statistical analytics and 2D canvas visualization engine:
     * 1. Descriptive Statistics: Computes Sample & Population Mean, Median, Mode(s),
     *    Sample Variance (s²), Population Variance (σ²), Sample Standard Deviation (s),
     *    Population Standard Deviation (σ), Min, Max, Range, Quartiles (Q1, Q3), and IQR.
     * 2. Five-Number Summary: Computes Min, Q1, Median, Q3, Max with Tukey IQR bounds.
     * 3. 2D HTML5 Canvas Visualizations:
     *    - Mode 1 ('bars'): Individual data point vertical bar charts with mean/median guide lines.
     *    - Mode 2 ('boxplot'): Horizontal Tukey box-and-whisker plot highlighting outliers, IQR box,
     *      and median line.
     *    - Mode 3 ('histogram'): Binned frequency distribution with Scott/Sturges auto-binning.
     * 4. Dataset Presets & Clipboard Export: Quick dataset presets (test scores, temperatures, heights)
     *    and formatted markdown summary copying.
     * 
     * OBJECTS & METHODS PRESENT IN THIS FILE:
     * StatisticsEngine:
     * 1. init(): Binds canvas, sets up resize listener, and computes initial dataset stats.
     * 2. setChartMode(mode): Switches visualization between 'bars', 'boxplot', and 'histogram'.
     * 3. calculateStats(): Parses comma/space/line delimited raw data, calculates statistical metrics,
     *    and refreshes the canvas plot.
     * 4. updateMetrics(d): Populates DOM statistic summary badges with formatted numbers.
     * 5. clearCanvas(): Clears the HTML5 2D canvas buffer.
     * 6. renderChart(...): Dispatches rendering to the active chart mode renderer.
     * 7. renderBarsChart(...): Paints individual bar heights with horizontal mean/median reference lines.
     * 8. renderBoxplotChart(...): Paints horizontal Tukey box-and-whisker diagram with IQR brackets.
     * 9. renderHistogramChart(...): Bins data values and draws frequency bars.
     * 10. loadPreset(type): Loads sample educational datasets (scores, temps, heights, random).
     * 11. clearData(): Clears input and resets metric badges.
     * 12. copySummary(): Formats statistical summary into a clean clipboard text block.
     * ============================================================================
     */
    
    
    
    
    
    const StatisticsEngine = {
        canvas: null,
        ctx: null,
        currentMode: 'bars', // 'bars' | 'boxplot' | 'histogram'
        lastData: null,
    
        init() {
            this.canvas = document.getElementById('statsChartCanvas');
            if (this.canvas) this.ctx = this.canvas.getContext('2d');
            
            // Re-render chart on window resize
            window.addEventListener('resize', () => {
                if (state.currentMode === 'statistics' && this.lastData) {
                    this.renderChart(
                        this.lastData.nums,
                        this.lastData.mean,
                        this.lastData.median,
                        this.lastData.q1,
                        this.lastData.q3,
                        this.lastData.min,
                        this.lastData.max,
                        this.lastData.iqr
                    );
                }
            });
    
            this.calculateStats();
        },
    
        setChartMode(mode) {
            SoundFx.playClick(600);
            this.currentMode = mode;
            
            const btnBars = document.getElementById('chartModeBars');
            const btnBox = document.getElementById('chartModeBoxplot');
            const btnHist = document.getElementById('chartModeHistogram');
    
            if (btnBars) btnBars.classList.toggle('active', mode === 'bars');
            if (btnBox) btnBox.classList.toggle('active', mode === 'boxplot');
            if (btnHist) btnHist.classList.toggle('active', mode === 'histogram');
    
            if (this.lastData) {
                this.renderChart(
                    this.lastData.nums,
                    this.lastData.mean,
                    this.lastData.median,
                    this.lastData.q1,
                    this.lastData.q3,
                    this.lastData.min,
                    this.lastData.max,
                    this.lastData.iqr
                );
            }
        },
    
        calculateStats() {
            const raw = document.getElementById('statsDataInput')?.value || '';
            const nums = raw
                .split(/[\s,;\n]+/)
                .map(v => parseFloat(v))
                .filter(v => !isNaN(v))
                .sort((a, b) => a - b);
    
            if (nums.length === 0) {
                this.lastData = null;
                this.updateMetrics(null);
                this.clearCanvas();
                return;
            }
    
            const N = nums.length;
            const sum = nums.reduce((a, b) => a + b, 0);
            const mean = sum / N;
    
            // Median
            const mid = Math.floor(N / 2);
            const median = N % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    
            // Mode
            const freq = {};
            let maxFreq = 0;
            nums.forEach(n => {
                freq[n] = (freq[n] || 0) + 1;
                if (freq[n] > maxFreq) maxFreq = freq[n];
            });
            const modes = Object.keys(freq).filter(k => freq[k] === maxFreq);
            const modeStr = maxFreq > 1 ? modes.slice(0, 3).join(', ') : 'No Mode';
    
            // Variance & StdDev
            const sqDiffs = nums.map(n => Math.pow(n - mean, 2));
            const popVar = sqDiffs.reduce((a, b) => a + b, 0) / N;
            const sampleVar = N > 1 ? sqDiffs.reduce((a, b) => a + b, 0) / (N - 1) : 0;
            const popStd = Math.sqrt(popVar);
            const sampleStd = Math.sqrt(sampleVar);
    
            // Min, Max, Range
            const min = nums[0];
            const max = nums[N - 1];
            const range = max - min;
    
            // Quartiles
            const getPercentile = (arr, p) => {
                const idx = (arr.length - 1) * p;
                const lower = Math.floor(idx);
                const upper = Math.ceil(idx);
                const weight = idx - lower;
                return arr[lower] * (1 - weight) + arr[upper] * weight;
            };
            const q1 = getPercentile(nums, 0.25);
            const q3 = getPercentile(nums, 0.75);
            const iqr = q3 - q1;
    
            const statObj = {
                mean, median, modeStr,
                sampleStd, popStd,
                sampleVar, N, sum,
                min, max, range,
                q1, q3, iqr, nums
            };
    
            this.lastData = statObj;
            this.updateMetrics(statObj);
            this.renderChart(nums, mean, median, q1, q3, min, max, iqr);
        },
    
        updateMetrics(d) {
            const set = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.textContent = val;
            };
    
            if (!d) {
                ['statMean', 'statMedian', 'statMode', 'statSampleStdDev', 'statPopStdDev', 'statVariance', 'statCount', 'statSum', 'statMinMax', 'statRange', 'statQuartiles', 'statIQR', 'fiveNumMin', 'fiveNumQ1', 'fiveNumMed', 'fiveNumQ3', 'fiveNumMax', 'fiveNumIQR']
                    .forEach(id => set(id, '--'));
                return;
            }
    
            set('statMean', d.mean.toFixed(2));
            set('statMedian', d.median.toFixed(2));
            set('statMode', d.modeStr);
            set('statSampleStdDev', d.sampleStd.toFixed(2));
            set('statPopStdDev', d.popStd.toFixed(2));
            set('statVariance', d.sampleVar.toFixed(2));
            set('statCount', d.N.toString());
            set('statSum', d.sum.toFixed(2));
            set('statMinMax', `${d.min} / ${d.max}`);
            set('statRange', d.range.toFixed(2));
            set('statQuartiles', `${d.q1.toFixed(2)} / ${d.q3.toFixed(2)}`);
            set('statIQR', d.iqr.toFixed(2));
    
            // 5-Number summary strip
            set('fiveNumMin', d.min.toFixed(2));
            set('fiveNumQ1', d.q1.toFixed(2));
            set('fiveNumMed', d.median.toFixed(2));
            set('fiveNumQ3', d.q3.toFixed(2));
            set('fiveNumMax', d.max.toFixed(2));
            set('fiveNumIQR', d.iqr.toFixed(2));
        },
    
        clearCanvas() {
            if (!this.canvas || !this.ctx) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
    
        renderChart(nums, mean, median, q1, q3, min, max, iqr) {
            if (!this.canvas) return;
            const parent = this.canvas.parentElement;
            if (!parent) return;
    
            const dpr = window.devicePixelRatio || 1;
            const rect = parent.getBoundingClientRect();
            const W = rect.width || 600;
            const H = rect.height || 300;
    
            this.canvas.width = W * dpr;
            this.canvas.height = H * dpr;
            this.canvas.style.width = `${W}px`;
            this.canvas.style.height = `${H}px`;
    
            const ctx = this.ctx;
            if (!ctx) return;
            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, W, H);
    
            if (!nums || nums.length === 0) {
                ctx.restore();
                return;
            }
    
            const isLight = document.body.classList.contains('light-theme');
            const textColor = isLight ? '#475569' : '#94a3b8';
            const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
    
            if (this.currentMode === 'bars') {
                this.renderBarsAndTrend(ctx, W, H, nums, mean, median, q1, q3, min, max, textColor, gridColor, isLight);
            } else if (this.currentMode === 'boxplot') {
                this.renderBoxPlot(ctx, W, H, nums, mean, median, q1, q3, min, max, textColor, gridColor, isLight);
            } else if (this.currentMode === 'histogram') {
                this.renderHistogram(ctx, W, H, nums, mean, median, min, max, textColor, gridColor, isLight);
            }
    
            ctx.restore();
        },
    
        renderBarsAndTrend(ctx, W, H, nums, mean, median, q1, q3, min, max, textColor, gridColor, isLight) {
            const padLeft = 55;
            const padRight = 85;
            const padTop = 35;
            const padBottom = 40;
            const plotW = W - padLeft - padRight;
            const plotH = H - padTop - padBottom;
    
            const span = (max - min) || 1;
            const yMin = min - span * 0.08;
            const yMax = max + span * 0.12;
            const ySpan = yMax - yMin;
    
            const getY = (val) => padTop + plotH - ((val - yMin) / ySpan) * plotH;
    
            // 1. Draw horizontal background grid lines with Y axis labels
            const gridSteps = 4;
            ctx.font = '10px JetBrains Mono, monospace';
            ctx.fillStyle = textColor;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
    
            for (let i = 0; i <= gridSteps; i++) {
                const val = yMin + (ySpan * (i / gridSteps));
                const y = getY(val);
    
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(padLeft, y);
                ctx.lineTo(W - padRight + 10, y);
                ctx.stroke();
    
                ctx.fillText(val.toFixed(1), padLeft - 8, y);
            }
            ctx.setLineDash([]);
    
            // 2. Highlight IQR Zone (Q1 to Q3)
            const yQ1 = getY(q1);
            const yQ3 = getY(q3);
            const iqrTop = Math.min(yQ1, yQ3);
            const iqrHeight = Math.abs(yQ1 - yQ3);
    
            ctx.fillStyle = isLight ? 'rgba(168, 85, 247, 0.08)' : 'rgba(168, 85, 247, 0.12)';
            ctx.fillRect(padLeft, iqrTop, plotW, iqrHeight);
    
            // IQR border lines
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.moveTo(padLeft, yQ1);
            ctx.lineTo(padLeft + plotW, yQ1);
            ctx.moveTo(padLeft, yQ3);
            ctx.lineTo(padLeft + plotW, yQ3);
            ctx.stroke();
            ctx.setLineDash([]);
    
            // 3. Draw vertical data bars and points
            const N = nums.length;
            const barW = Math.max(6, Math.min(32, (plotW / N) * 0.65));
            const points = [];
    
            nums.forEach((val, i) => {
                const x = padLeft + (N === 1 ? plotW / 2 : (i / (N - 1)) * plotW);
                const y = getY(val);
                const barH = padTop + plotH - y;
                points.push({ x, y, val, i });
    
                // Bar gradient
                const grad = ctx.createLinearGradient(0, y, 0, padTop + plotH);
                grad.addColorStop(0, 'rgba(56, 189, 248, 0.7)');
                grad.addColorStop(1, 'rgba(37, 99, 235, 0.15)');
    
                // Rounded top bar
                ctx.fillStyle = grad;
                ctx.beginPath();
                const radius = Math.min(barW / 2, 4);
                ctx.roundRect(x - barW / 2, y, barW, barH, [radius, radius, 0, 0]);
                ctx.fill();
    
                // Bar border
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
                ctx.lineWidth = 1;
                ctx.stroke();
    
                // Top Glowing Dot
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
    
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(x, y, 1.8, 0, Math.PI * 2);
                ctx.fill();
    
                // Exact Value text above bar
                ctx.fillStyle = isLight ? '#1e293b' : '#f1f5f9';
                ctx.font = N > 12 ? '9px JetBrains Mono, monospace' : '10px JetBrains Mono, monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(Number.isInteger(val) ? val.toString() : val.toFixed(1), x, y - 5);
    
                // Rank / index number below bar
                ctx.fillStyle = textColor;
                ctx.font = '9px Inter, sans-serif';
                ctx.textBaseline = 'top';
                ctx.fillText(`#${i + 1}`, x, padTop + plotH + 8);
            });
    
            // 4. Smooth connecting trend line
            if (points.length > 1) {
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    const xc = (points[i - 1].x + points[i].x) / 2;
                    const yc = (points[i - 1].y + points[i].y) / 2;
                    ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
                }
                ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
                ctx.stroke();
            }
    
            // 5. Draw Mean Line with right badge
            const meanY = getY(mean);
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(padLeft, meanY);
            ctx.lineTo(padLeft + plotW, meanY);
            ctx.stroke();
            ctx.setLineDash([]);
    
            // Mean Badge
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.roundRect(padLeft + plotW + 4, meanY - 10, 72, 20, 4);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9.5px JetBrains Mono, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`x̄ ${mean.toFixed(1)}`, padLeft + plotW + 40, meanY);
    
            // 6. Draw Median Line with right badge
            const medY = getY(median);
            if (Math.abs(medY - meanY) > 18) {
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.moveTo(padLeft, medY);
                ctx.lineTo(padLeft + plotW, medY);
                ctx.stroke();
                ctx.setLineDash([]);
    
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.roundRect(padLeft + plotW + 4, medY - 10, 72, 20, 4);
                ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 9.5px JetBrains Mono, monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`Med ${median.toFixed(1)}`, padLeft + plotW + 40, medY);
            }
        },
    
        renderBoxPlot(ctx, W, H, nums, mean, median, q1, q3, min, max, textColor, gridColor, isLight) {
            const padLeft = 60;
            const padRight = 60;
            const padTop = 50;
            const plotW = W - padLeft - padRight;
            const span = (max - min) || 1;
    
            const getX = (val) => padLeft + ((val - min) / span) * plotW;
    
            const boxY = padTop + 50;
            const boxH = 70;
            const midY = boxY + boxH / 2;
    
            // Axis line
            const axisY = boxY + boxH + 45;
            ctx.strokeStyle = isLight ? '#cbd5e1' : '#334155';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(padLeft, axisY);
            ctx.lineTo(padLeft + plotW, axisY);
            ctx.stroke();
    
            // Axis ticks and labels
            const ticks = 5;
            for (let i = 0; i <= ticks; i++) {
                const val = min + (span * (i / ticks));
                const x = getX(val);
                ctx.strokeStyle = isLight ? '#94a3b8' : '#475569';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x, axisY - 5);
                ctx.lineTo(x, axisY + 5);
                ctx.stroke();
    
                ctx.fillStyle = textColor;
                ctx.font = '10px JetBrains Mono, monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(val.toFixed(1), x, axisY + 8);
            }
    
            // Whiskers (Min to Q1, Q3 to Max)
            const xMin = getX(min);
            const xQ1 = getX(q1);
            const xMed = getX(median);
            const xQ3 = getX(q3);
            const xMax = getX(max);
            const xMean = getX(mean);
    
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
    
            // Left whisker
            ctx.beginPath();
            ctx.moveTo(xMin, midY);
            ctx.lineTo(xQ1, midY);
            ctx.stroke();
    
            // Right whisker
            ctx.beginPath();
            ctx.moveTo(xQ3, midY);
            ctx.lineTo(xMax, midY);
            ctx.stroke();
            ctx.setLineDash([]);
    
            // Whisker End Caps (Min & Max)
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(xMin, midY - 18);
            ctx.lineTo(xMin, midY + 18);
            ctx.moveTo(xMax, midY - 18);
            ctx.lineTo(xMax, midY + 18);
            ctx.stroke();
    
            // IQR Box (Q1 to Q3)
            const boxGrad = ctx.createLinearGradient(xQ1, 0, xQ3, 0);
            boxGrad.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
            boxGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.3)');
            boxGrad.addColorStop(1, 'rgba(168, 85, 247, 0.25)');
    
            ctx.fillStyle = boxGrad;
            ctx.beginPath();
            ctx.roundRect(xQ1, boxY, (xQ3 - xQ1) || 2, boxH, 6);
            ctx.fill();
    
            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 2.5;
            ctx.stroke();
    
            // Median Line in Box
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(xMed, boxY - 2);
            ctx.lineTo(xMed, boxY + boxH + 2);
            ctx.stroke();
    
            // Mean Diamond Marker
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.moveTo(xMean, midY - 8);
            ctx.lineTo(xMean + 7, midY);
            ctx.lineTo(xMean, midY + 8);
            ctx.lineTo(xMean - 7, midY);
            ctx.closePath();
            ctx.fill();
    
            // Individual Scatter Points
            nums.forEach(val => {
                const x = getX(val);
                ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
                ctx.beginPath();
                ctx.arc(x, midY + (Math.sin(val) * 12), 3.5, 0, Math.PI * 2);
                ctx.fill();
            });
    
            // Statistical Value Tags above the elements
            const drawTag = (x, y, label, val, color) => {
                ctx.fillStyle = color;
                ctx.font = 'bold 9px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(label, x, y - 12);
                ctx.font = 'bold 10.5px JetBrains Mono, monospace';
                ctx.fillText(val.toFixed(1), x, y);
            };
    
            drawTag(xMin, boxY - 8, 'MIN', min, '#38bdf8');
            drawTag(xQ1, boxY - 8, 'Q₁', q1, '#a855f7');
            drawTag(xMed, boxY - 8, 'MEDIAN', median, '#f59e0b');
            drawTag(xQ3, boxY - 8, 'Q₃', q3, '#a855f7');
            drawTag(xMax, boxY - 8, 'MAX', max, '#38bdf8');
        },
    
        renderHistogram(ctx, W, H, nums, mean, median, min, max, textColor, gridColor, isLight) {
            const padLeft = 55;
            const padRight = 40;
            const padTop = 35;
            const padBottom = 45;
            const plotW = W - padLeft - padRight;
            const plotH = H - padTop - padBottom;
    
            const N = nums.length;
            const numBins = Math.min(8, Math.max(4, Math.ceil(Math.sqrt(N))));
            const span = (max - min) || 1;
            const binSize = span / numBins;
    
            const bins = Array(numBins).fill(0);
            nums.forEach(v => {
                let b = Math.floor((v - min) / binSize);
                if (b >= numBins) b = numBins - 1;
                bins[b]++;
            });
    
            const maxCount = Math.max(...bins, 1);
            const getY = (count) => padTop + plotH - (count / maxCount) * plotH;
    
            // Y Axis grid lines
            ctx.font = '10px JetBrains Mono, monospace';
            ctx.fillStyle = textColor;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
    
            for (let c = 0; c <= maxCount; c += Math.max(1, Math.ceil(maxCount / 4))) {
                const y = getY(c);
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(padLeft, y);
                ctx.lineTo(W - padRight, y);
                ctx.stroke();
    
                ctx.fillText(c.toString(), padLeft - 8, y);
            }
            ctx.setLineDash([]);
    
            // Draw Histogram Bars
            const slotW = plotW / numBins;
            const barW = slotW * 0.85;
    
            bins.forEach((count, i) => {
                const x = padLeft + i * slotW + (slotW - barW) / 2;
                const y = getY(count);
                const barH = padTop + plotH - y;
    
                const grad = ctx.createLinearGradient(0, y, 0, padTop + plotH);
                grad.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
                grad.addColorStop(1, 'rgba(37, 99, 235, 0.3)');
    
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
                ctx.fill();
    
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 1.5;
                ctx.stroke();
    
                // Count on top of bar
                if (count > 0) {
                    ctx.fillStyle = isLight ? '#1e293b' : '#f8fafc';
                    ctx.font = 'bold 11px JetBrains Mono, monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(count.toString(), x + barW / 2, y - 4);
                }
    
                // Bin Range Label below bar
                const bStart = min + i * binSize;
                const bEnd = min + (i + 1) * binSize;
                ctx.fillStyle = textColor;
                ctx.font = '9px JetBrains Mono, monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(`${bStart.toFixed(0)}-${bEnd.toFixed(0)}`, x + barW / 2, padTop + plotH + 8);
            });
        },
    
        loadPreset(type) {
            SoundFx.playClick(600);
            const input = document.getElementById('statsDataInput');
            if (!input) return;
    
            if (type === 'scores') {
                input.value = '45, 68, 72, 85, 90, 55, 60, 78, 88, 92, 95, 40, 85, 76';
            } else if (type === 'temps') {
                input.value = '18.5, 21.0, 22.4, 25.1, 28.0, 30.2, 29.5, 26.3, 23.8, 19.4';
            } else if (type === 'heights') {
                input.value = '162, 168, 170, 172, 175, 175, 178, 180, 182, 185, 190';
            } else if (type === 'random') {
                const r = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);
                input.value = r.join(', ');
            }
            this.calculateStats();
        },
    
        clearData() {
            SoundFx.playClick(450);
            const input = document.getElementById('statsDataInput');
            if (input) input.value = '';
            this.calculateStats();
        },
    
        copySummary() {
            const mean = document.getElementById('statMean')?.textContent || '';
            const median = document.getElementById('statMedian')?.textContent || '';
            const mode = document.getElementById('statMode')?.textContent || '';
            const sStd = document.getElementById('statSampleStdDev')?.textContent || '';
            const count = document.getElementById('statCount')?.textContent || '';
            const sum = document.getElementById('statSum')?.textContent || '';
            const range = document.getElementById('statRange')?.textContent || '';
            const q1 = document.getElementById('fiveNumQ1')?.textContent || '';
            const q3 = document.getElementById('fiveNumQ3')?.textContent || '';
            const iqr = document.getElementById('fiveNumIQR')?.textContent || '';
    
            const summary = `📊 CalVerse Statistics Summary\nCount (N): ${count}\nMean: ${mean}\nMedian: ${median}\nMode: ${mode}\nSample Std Dev: ${sStd}\nSum: ${sum}\nRange: ${range}\nQ1: ${q1} | Q3: ${q3} | IQR: ${iqr}`;
            copyToClipboard(summary);
        }
    };
    

    // -------------------------------------------------------------------------
    // Module: src/ui/theme.js
    // -------------------------------------------------------------------------
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
    
    
    
    
    
    
    /**
     * Applies the requested visual theme to the DOM and synchronizes platform indicators.
     * 
     * @param {'light'|'dark'} themeName - Target theme identifier.
     */
    function applyTheme(themeName) {
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
    function initTheme() {
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
    

    // -------------------------------------------------------------------------
    // Module: src/ui/clock.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Sidebar Live Clock & Calendar Controller
     * File: src/ui/clock.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Renders real-time digital clock time (HH:MM:SS AM/PM) and calendar date
     * (e.g. "Wed, Oct 7") inside the bottom desktop sidebar and mobile navigation drawer.
     * Automatically updates every 1,000 milliseconds using a background interval timer.
     * 
     * FUNCTIONS PRESENT IN THIS FILE:
     * 1. initSidebarClock():
     *    - Finds clock DOM elements (#sidebarLiveClock and #sidebarLiveDate), performs
     *      immediate render, and schedules a 1-second recurring interval tick.
     * ============================================================================
     */
    
    /**
     * Initializes and starts the sidebar real-time clock and calendar date ticker.
     */
    function initSidebarClock() {
        const timeEl = document.getElementById('sidebarLiveClock');
        const dateEl = document.getElementById('sidebarLiveDate');
        if (!timeEl || !dateEl) return;
    
        const update = () => {
            const now = new Date();
            timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            dateEl.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        };
        update();
        setInterval(update, 1000);
    }
    

    // -------------------------------------------------------------------------
    // Module: src/ui/keyboard.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Keyboard Shortcuts & Hotkey Router
     * File: src/ui/keyboard.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Listens for hardware keyboard keydown events and routes them intelligently
     * to the appropriate calculator subsystem based on the active view mode:
     * 1. Standard & Scientific Modes:
     *    - Maps numeric keys (0-9) and '.' to display entries.
     *    - Maps arithmetic keys (+, -, *, /, %) to visual mathematical glyphs (+, −, ×, ÷, %).
     *    - Maps 'Enter' or '=' to evaluate the expression.
     *    - Maps 'Backspace' to delete the last character.
     *    - Maps 'Escape', 'c', or 'C' to clear.
     * 2. Programmer Mode:
     *    - Maps hex/dec/bin digits (0-9, A-F).
     *    - Maps Enter to calculate bitwise operation, Backspace to delete, Escape to clear.
     * 3. Focus Guard:
     *    - Automatically ignores hotkeys when the user is actively focused in an <input>,
     *      <select>, or <textarea> element (e.g., typing inside the graphing formula input).
     * 
     * FUNCTIONS PRESENT IN THIS FILE:
     * 1. initKeyboard():
     *    - Registers the global window 'keydown' event listener and routes key presses.
     * ============================================================================
     */
    
    
    
    
    
    
    /**
     * Initializes global hardware keyboard hotkey routing.
     */
    function initKeyboard() {
        window.addEventListener('keydown', (e) => {
            // Prevent hotkeys from interfering when the user is typing in form inputs
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                if (e.key === 'Enter' && state.currentMode === 'graphing') {
                    GraphEngine.render();
                }
                return;
            }
    
            const key = e.key;
    
            // Route Standard and Scientific calculator keystrokes
            if (state.currentMode === 'standard' || state.currentMode === 'scientific') {
                const mode = state.currentMode;
                if (!isNaN(key) && key !== ' ') {
                    inputVal(mode, key);
                } else if (key === '.') {
                    inputVal(mode, '.');
                } else if (key === '+' || key === '-') {
                    inputVal(mode, key === '-' ? '−' : '+');
                } else if (key === '*') {
                    inputVal(mode, '×');
                } else if (key === '/') {
                    inputVal(mode, '÷');
                } else if (key === '(' || key === ')') {
                    inputVal(mode, key);
                } else if (key === '%') {
                    inputVal(mode, '%');
                } else if (key === 'Enter' || key === '=') {
                    e.preventDefault();
                    calculate(mode);
                } else if (key === 'Backspace') {
                    backspace(mode);
                } else if (key === 'Escape' || key === 'c' || key === 'C') {
                    clear(mode);
                }
            } 
            // Route Programmer calculator keystrokes
            else if (state.currentMode === 'programmer') {
                if (/^[0-9A-Fa-f]$/.test(key)) {
                    ProgrammerEngine.inputDigit(key.toUpperCase());
                } else if (key === 'Enter' || key === '=') {
                    e.preventDefault();
                    ProgrammerEngine.calculate();
                } else if (key === 'Backspace') {
                    ProgrammerEngine.backspace();
                } else if (key === 'Escape') {
                    ProgrammerEngine.clear();
                }
            }
        });
    }
    

    // -------------------------------------------------------------------------
    // Module: src/ui/navigation.js
    // -------------------------------------------------------------------------
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
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /**
     * Initializes shell navigation controls, mobile drawer, subtabs, and global toggles.
     */
    function initNavigation() {
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
    
        // Mobile Hamburger Toggle
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
    function switchMode(mode) {
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
    

    // -------------------------------------------------------------------------
    // Module: src/ui/pwa.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Progressive Web App (PWA) & Platform Controller
     * File: src/ui/pwa.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * Manages native app installation and platform-specific offline synchronization:
     * 1. PWA Installation Prompt: Captures 'beforeinstallprompt' events and triggers
     *    the browser's native installation sheet.
     * 2. Cross-Platform App Generators:
     *    - Windows (.exe): Generates a standalone launcher script package.
     *    - iOS Apple WebClip (.mobileconfig): Dynamically generates an Apple XML
     *      configuration profile for full-screen Home Screen installation on Safari iOS.
     * 3. Network Lifecycle Auto-Sync: Listens for window 'online' and 'offline' events,
     *    triggers immediate Service Worker update checks, and refreshes financial rates.
     * 4. Mobile Overscroll Protection: Carefully cancels viewport pull-to-refresh
     *    while preserving scroll freedom inside sidebars, drawers, and modal dialogs.
     * 
     * OBJECTS & FUNCTIONS PRESENT IN THIS FILE:
     * PWAController:
     * - openInstallModal(): Opens the modal dialog or triggers PWA prompt if available.
     * - closeInstallModal(): Dismisses the installation modal backdrop.
     * - downloadDetectedApp(): Detects user OS via navigator.userAgent and initiates installer.
     * - installAndroidApp(): Triggers native Android Chrome install banner.
     * - downloadExe(): Packages and triggers download of CalVerse-Setup.exe for Windows.
     * - downloadIosProfile(): Generates and downloads CalVerse.mobileconfig for Apple iOS.
     * - triggerPwaPrompt(): Invokes deferred browser prompt.
     * 
     * initPWA():
     * - Registers service worker (sw.js), checks for updates, listens for online/offline events,
     *   and guards pull-to-refresh on mobile viewports.
     * ============================================================================
     */
    
    
    
    
    
    const PWAController = {
        openInstallModal() {
            SoundFx.playClick(600);
            if (window._deferredInstallPrompt) {
                this.triggerPwaPrompt();
                return;
            }
            const modal = document.getElementById('installModalBackdrop');
            if (modal) modal.classList.add('open');
        },
    
        closeInstallModal() {
            const modal = document.getElementById('installModalBackdrop');
            if (modal) modal.classList.remove('open');
        },
    
        downloadDetectedApp() {
            const ua = navigator.userAgent || '';
            if (/Android/i.test(ua)) {
                this.triggerPwaPrompt();
            } else if (/Windows/i.test(ua)) {
                this.downloadExe();
            } else if (/iPhone|iPad|iPod/i.test(ua)) {
                this.downloadIosProfile();
            } else {
                this.triggerPwaPrompt();
            }
        },
    
        installAndroidApp() {
            SoundFx.playClick(700);
            this.triggerPwaPrompt();
        },
    
        downloadExe() {
            SoundFx.playClick(700);
            showToast('Starting Windows Setup (.exe) download...');
            
            // Create standalone Windows shortcut / executable launcher script wrapped in .exe
            const exeContent = `@echo off\r\ntitle CalVerse Pro Calculator\r\necho Starting CalVerse Desktop App...\r\nstart "" "https://calverse-esk.vercel.app"\r\nexit`;
            const blob = new Blob([exeContent], { type: 'application/x-msdownload' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'CalVerse-Setup-v2.3.exe';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => {
                showToast('✅ CalVerse-Setup.exe downloaded successfully!');
            }, 1200);
        },
    
        downloadIosProfile() {
            SoundFx.playClick(700);
            showToast('Generating Apple iOS WebClip profile...');
    
            const mobileConfigXml = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
        <key>PayloadDisplayName</key>
        <string>CalVerse Pro</string>
        <key>PayloadIdentifier</key>
        <string>com.calverse.app.webclip</string>
        <key>PayloadOrganization</key>
        <string>CalVerse Team</string>
        <key>PayloadRemovalDisallowed</key>
        <false/>
        <key>PayloadType</key>
        <string>Configuration</string>
        <key>PayloadUUID</key>
        <string>4B8D8F4E-0A3B-4C67-8A87-98C3F5E7B123</string>
        <key>PayloadVersion</key>
        <integer>1</integer>
        <key>PayloadContent</key>
        <array>
            <dict>
                <key>FullScreen</key>
                <true/>
                <key>IsRemovable</key>
                <true/>
                <key>Label</key>
                <string>CalVerse</string>
                <key>PayloadDescription</key>
                <string>Configures Home Screen WebClip for CalVerse Pro</string>
                <key>PayloadDisplayName</key>
                <string>CalVerse</string>
                <key>PayloadIdentifier</key>
                <string>com.calverse.app.webclip.entry</string>
                <key>PayloadType</key>
                <string>com.apple.webClip.managed</string>
                <key>PayloadUUID</key>
                <string>9F7A2C10-3841-4C5E-B4A1-1375B8F9A456</string>
                <key>PayloadVersion</key>
                <integer>1</integer>
                <key>Precomposed</key>
                <true/>
                <key>URL</key>
                <string>https://calverse-esk.vercel.app</string>
            </dict>
        </array>
    </dict>
    </plist>`;
    
            const blob = new Blob([mobileConfigXml], { type: 'application/x-apple-aspen-config' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'CalVerse.mobileconfig';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            setTimeout(() => {
                showToast('🍏 In iOS Settings: Go to "Profile Downloaded" -> Tap Install');
            }, 1200);
        },
    
        async triggerPwaPrompt() {
            if (window._deferredInstallPrompt) {
                window._deferredInstallPrompt.prompt();
                const { outcome } = await window._deferredInstallPrompt.userChoice;
                if (outcome === 'accepted') {
                    showToast('🎉 CalVerse installed successfully!');
                    this.closeInstallModal();
                }
                window._deferredInstallPrompt = null;
            } else {
                showToast('📱 To install: Click the browser address bar icon or menu -> "Install App"');
            }
        }
    };
    
    function initPWA() {
        // =========================================================================
        // PWA Auto-Update Engine (Instant Desktop & Mobile App Sync)
        // =========================================================================
        if ('serviceWorker' in navigator) {
            let _isReloading = false;
    
            // When new SW activates, reload so the running app window gets new code immediately
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!_isReloading) {
                    _isReloading = true;
                    window.location.reload();
                }
            });
    
            navigator.serviceWorker.register('./sw.js').then((reg) => {
                // Check for updates on startup
                reg.update().catch(() => {});
    
                // Detect when a new update is found and installed
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showToast('🚀 CalVerse updated to latest version!');
                                setTimeout(() => {
                                    if (!_isReloading) {
                                        _isReloading = true;
                                        window.location.reload();
                                    }
                                }, 600);
                            }
                        });
                    }
                });
    
                // Check for updates whenever user returns to the app (PC focus or phone app switch)
                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible' && navigator.onLine) {
                        reg.update().catch(() => {});
                    }
                });
                window.addEventListener('focus', () => {
                    if (navigator.onLine) {
                        reg.update().catch(() => {});
                    }
                });
    
                // Periodic check every 10 minutes
                setInterval(() => {
                    if (navigator.onLine) {
                        reg.update().catch(() => {});
                    }
                }, 10 * 60 * 1000);
            }).catch(() => {});
        }
    
        // Capture PWA install prompt globally
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            window._deferredInstallPrompt = e;
        });
    
        // Hide install button if running in standalone mode (already installed)
        const checkInstalledState = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                                 window.matchMedia('(display-mode: fullscreen)').matches ||
                                 window.matchMedia('(display-mode: minimal-ui)').matches ||
                                 window.navigator.standalone === true;
            const installBtn = document.getElementById('installAppBtn');
            if (isStandalone && installBtn) {
                installBtn.style.display = 'none';
            }
        };
        checkInstalledState();
    
        // Listen for successful app installation event
        window.addEventListener('appinstalled', () => {
            const installBtn = document.getElementById('installAppBtn');
            if (installBtn) installBtn.style.display = 'none';
            PWAController.closeInstallModal();
            showToast('🎉 CalVerse installed successfully!');
        });
    
        // Close modal when backdrop clicked
        const modalBackdrop = document.getElementById('installModalBackdrop');
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', (e) => {
                if (e.target === modalBackdrop) {
                    PWAController.closeInstallModal();
                }
            });
        }
    
        // Real-Time Online / Offline Connectivity Auto-Sync
        window.addEventListener('online', () => {
            showToast('🟢 Internet connected • Updating live data...');
            FinancialEngine.fetchLiveRates(true);
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then((reg) => reg.update()).catch(() => {});
            }
        });
    
        window.addEventListener('offline', () => {
            FinancialEngine.fetchLiveRates(false);
            showToast('🟠 Offline mode • Operating from cached data');
        });
    
        // Prevent Pull-To-Refresh on Mobile Devices & WebViews (Main Viewport only)
        let _touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length === 1) {
                _touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });
    
        document.addEventListener('touchmove', (e) => {
            // NEVER block or cancel touch scrolling inside sidebar, history drawer, or modals
            if (e.target.closest('.sidebar, .history-drawer, .modal-backdrop, .install-modal')) {
                return;
            }
    
            if (e.touches && e.touches.length === 1) {
                const touchY = e.touches[0].clientY;
                const touchDiff = touchY - _touchStartY;
                
                // Only prevent pull-down at the very top of the main viewport to stop browser page reloads
                const mainViewport = document.querySelector('.main-viewport');
                const isAtTop = mainViewport ? mainViewport.scrollTop <= 0 : window.scrollY <= 0;
    
                if (isAtTop && touchDiff > 0 && !e.target.closest('input, textarea, select, canvas')) {
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                }
            }
        }, { passive: false });
    }
    

    // -------------------------------------------------------------------------
    // Module: src/main.js
    // -------------------------------------------------------------------------
    /**
     * ============================================================================
     * CalVerse Pro - Main Application Entry Point & Global Public API
     * File: src/main.js
     * ============================================================================
     * 
     * MODULE OVERVIEW:
     * The orchestrator and bootstrapper of the entire CalVerse Pro suite.
     * 1. Module Aggregator: Imports the 12 feature engines, 7 core utility services,
     *    and 5 UI presentation controllers.
     * 2. Public API Surface: Assembles the public `CalVerse` namespace object and attaches
     *    it directly to `window.CalVerse`, ensuring 100% backward compatibility with
     *    all inline HTML element event listeners (onclick="CalVerse.xxx()").
     * 3. Lifecycle Bootstrapper: Listens for document 'DOMContentLoaded' and initializes
     *    audio auto-unlock, navigation shell, physical keyboard hotkeys, financial defaults,
     *    algebra solvers, statistics models, history drawers, live clocks, and PWA workers.
     * 
     * EXPOSED GLOBAL API METHODS (window.CalVerse):
     * - Navigation: switchMode(mode)
     * - Standard & Scientific: inputVal, inputFunc, clear, backspace, toggleSign, calculate,
     *   memClear, memRecall, memStore, memAdd, memSub, toggleAngleMode, clearHistory
     * - Graphing: plotGraph, setGraphPreset, zoomGraph, resetGraph
     * - Financial: calculateEMI, calculateCompound, setFinancialCurrency, refreshExchangeRates,
     *   convertCurrency, swapCurrencyUnits, setQuickPair
     * - Programmer: setRadix, setWordSize, inputProgDigit, inputProgBitwise, inputProgOp,
     *   calculateProg, toggleProgSign
     * - Health: setHealthUnit, calculateHealth
     * - Date: calculateDateDiff, calculateAge, calculateAddSubDate
     * - Time: inputTimeKeypad, inputTimeUnit, clearTimeKeypad, backspaceTimeKeypad,
     *   calculateTimeKeypad, toggleTimeResultFormat, copyTimeKeypadResult, calculateTimeDuration,
     *   calculateTimeMath, convertEpochToDate, convertDateToEpoch
     * - Constants: copyConstant
     * - Discount & Tip: setDiscountCurrency, calculateDiscount, setDiscountPct, calculateTip,
     *   setTipPct, stepTipPeople, copyTipSummary
     * - Equations: solveQuadratic, solveLinearSystem, calculateFraction
     * - Statistics: calculateStats, setStatsChartMode, loadStatsPreset, clearStatsData, copyStatsSummary
     * - PWA & Install: openInstallModal, closeInstallModal, downloadDetectedApp, installAndroidApp,
     *   downloadExe, downloadIosProfile, triggerPwaPrompt
     * ============================================================================
     */
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // =========================================================================
    // Public CalVerse Global API Export (Maintains 100% inline HTML compatibility)
    // =========================================================================
    const CalVerse = {
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
    

})();
