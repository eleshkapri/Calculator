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

import { SoundFx } from '../core/sound.js';
import { copyToClipboard } from '../core/dom.js';
import { addHistory } from './standard.js';

export const TimeEngine = {
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
    isCalculated: false,
    lastIsRatio: false,

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
            if (this.isCalculated) {
                // Chain from previous calculated answer
                const prevFormatted = this.lastIsRatio 
                    ? this.keypadLastSeconds.toString() 
                    : this.formatSeconds(this.keypadLastSeconds, 'HMS');
                this.keypadExpr = `${prevFormatted} ${val} `;
                this.keypadBuffer = '';
                this.isCalculated = false;
            } else {
                if (this.keypadBuffer) {
                    this.keypadExpr += this.keypadBuffer + ' ';
                    this.keypadBuffer = '';
                }
                this.keypadExpr = this.keypadExpr.trimEnd() + ` ${val} `;
            }
        } else if (val === '.') {
            if (this.isCalculated) {
                this.keypadExpr = '';
                this.keypadBuffer = '0.';
                this.isCalculated = false;
            } else if (!this.keypadBuffer.includes('.')) {
                this.keypadBuffer = (this.keypadBuffer || '0') + '.';
            }
        } else {
            // Numeric Digits (0-9)
            if (this.isCalculated) {
                this.keypadExpr = '';
                this.keypadBuffer = val;
                this.isCalculated = false;
            } else {
                this.keypadBuffer += val;
            }
        }
        this.updateKeypadScreen();
        this.calculateKeypad(false);
    },

    inputUnit(unit) {
        SoundFx.playClick(550);
        if (this.isCalculated) {
            this.keypadExpr = '';
            this.keypadBuffer = '';
            this.isCalculated = false;
        }

        const num = this.keypadBuffer || (this.keypadExpr ? '' : '1');
        if (!num && !this.keypadExpr) return;

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
        this.isCalculated = false;
        this.lastIsRatio = false;
        const exprEl = document.getElementById('timeKeypadExpression');
        const resEl = document.getElementById('timeKeypadResult');
        const bdEl = document.getElementById('timeKeypadBreakdown');
        if (exprEl) exprEl.textContent = '0';
        if (resEl) resEl.textContent = '0hour 0min';
        if (bdEl) bdEl.innerHTML = '<span>0 Hours</span> • <span>0 Minutes</span> • <span>0 Seconds</span>';
    },

    backspaceKeypad() {
        SoundFx.playClick(480);
        if (this.isCalculated) {
            this.isCalculated = false;
        }
        if (this.keypadBuffer.length > 0) {
            this.keypadBuffer = this.keypadBuffer.slice(0, -1);
        } else if (this.keypadExpr.length > 0) {
            this.keypadExpr = this.keypadExpr.trimEnd();
            // Check if last token is unit word
            const units = ['m.sec', 'hour', 'min', 'sec'];
            let foundUnit = false;
            for (const u of units) {
                if (this.keypadExpr.endsWith(u)) {
                    this.keypadExpr = this.keypadExpr.slice(0, -u.length).trimEnd();
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
            let s = rawExpr;

            // Normalize operator glyphs
            s = s.replace(/×/g, '*')
                 .replace(/÷/g, '/')
                 .replace(/−/g, '-');

            const unitMultipliers = {
                'hour': 3600,
                'min': 60,
                'sec': 1,
                'm.sec': 0.001
            };

            // 1. Tag each (number + unit) as an absolute seconds token: __T__<sec>__
            let tagged = s.replace(/(\d+(?:\.\d+)?)\s*(hour|min|sec|m\.sec)/g, (_, val, unit) => {
                const sec = parseFloat(val) * (unitMultipliers[unit] || 1);
                return `__T__${sec}__`;
            });

            // 2. Group adjacent time tokens with NO intervening operator into compound duration
            // e.g. "__T__7200__ __T__1800__" -> "__T__9000__"
            while (/__T__([0-9.]+)__\s+__T__([0-9.]+)__/.test(tagged)) {
                tagged = tagged.replace(/__T__([0-9.]+)__\s+__T__([0-9.]+)__/g, (m, a, b) => {
                    const sum = parseFloat(a) + parseFloat(b);
                    return `__T__${sum}__`;
                });
            }

            // 3. Detect if this is a division of duration by duration (e.g. 2hour / 30min -> 4)
            const isDurationDiv = /__T__([0-9.]+)__\s*\/\s*__T__([0-9.]+)__/.test(tagged) &&
                !/[\+\-]/.test(tagged);

            // 4. Convert all __T__<sec>__ tokens to parenthesized expressions (sec)
            let mathExpr = tagged.replace(/__T__([0-9.]+)__/g, '($1)');

            // 5. Handle percentage notation (e.g. * 50% -> * 0.5, + 20% -> * 1.20)
            mathExpr = mathExpr.replace(/([\*\/])\s*(\d+(?:\.\d+)?)\s*%/g, '$1 ($2 / 100)');
            mathExpr = mathExpr.replace(/([\+\-])\s*(\d+(?:\.\d+)?)\s*%/g, '$1 ($2 / 100)');
            mathExpr = mathExpr.replace(/(\d+(?:\.\d+)?)\s*%/g, '($1 / 100)');

            // Strip trailing operator for live evaluation while user is typing
            mathExpr = mathExpr.replace(/[\+\-\*\/%]\s*$/, '');

            const evaluatedSec = Function(`"use strict"; return (${mathExpr});`)();
            if (typeof evaluatedSec === 'number' && isFinite(evaluatedSec)) {
                this.keypadLastSeconds = evaluatedSec;
                this.lastIsRatio = isDurationDiv;

                let formatted = '';
                if (isDurationDiv) {
                    formatted = `${parseFloat(evaluatedSec.toFixed(4))}× (Ratio)`;
                } else {
                    formatted = this.formatSeconds(evaluatedSec, this.keypadFormatMode);
                }
                
                const resEl = document.getElementById('timeKeypadResult');
                const bdEl = document.getElementById('timeKeypadBreakdown');
                if (resEl) resEl.textContent = formatted;

                if (bdEl) {
                    if (isDurationDiv) {
                        bdEl.innerHTML = `<span>Ratio Multiplier: ${parseFloat(evaluatedSec.toFixed(4))}×</span> • <span>Dimensionless Result</span>`;
                    } else {
                        const decH = (evaluatedSec / 3600).toFixed(3);
                        const totM = (evaluatedSec / 60).toFixed(1);
                        const totS = evaluatedSec.toFixed(0);
                        bdEl.innerHTML = `<span>${parseFloat(decH).toLocaleString()} Hours</span> • <span>${parseFloat(totM).toLocaleString()} Minutes</span> • <span>${parseFloat(totS).toLocaleString()} Seconds</span>`;
                    }
                }

                if (isFinal) {
                    SoundFx.playClick(850, 'triangle', 0.05);
                    this.isCalculated = true;
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
        if (this.lastIsRatio) return;
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
