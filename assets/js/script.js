/**
 * CalVerse Pro - Universal Multi-Calculator & Financial Suite Engine
 * Modern, High-Performance Multi-Engine Suite with Zero Dependencies
 * Architecture: Clean Vanilla ES6+ Modular Pattern
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. Audio Click Synthesizer (Zero-dependency tactile feedback)
    // =========================================================================
    const SoundFx = {
        enabled: (localStorage.getItem('calverse_sound') || localStorage.getItem('calcverse_sound')) === 'true',
        ctx: null,
        _unlocked: false,

        // Must be called from a user-gesture (touch/click) to unlock audio on mobile
        unlockAudio() {
            if (this._unlocked && this.ctx) return;
            try {
                const AC = window.AudioContext || window.webkitAudioContext;
                if (!AC) return;
                if (!this.ctx) this.ctx = new AC();
                // Resume if suspended (required by Chrome, Safari autoplay policy)
                if (this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
                // iOS Safari fix: play a silent buffer to fully unlock audio pipeline
                const buf = this.ctx.createBuffer(1, 1, 22050);
                const src = this.ctx.createBufferSource();
                src.buffer = buf;
                src.connect(this.ctx.destination);
                src.start(0);
                this._unlocked = true;
            } catch (e) {
                // AudioContext not supported
            }
        },

        playClick(freq = 600, type = 'sine', duration = 0.03) {
            if (!this.enabled) return;
            try {
                // Ensure context exists and is running
                if (!this.ctx) this.unlockAudio();
                if (!this.ctx) return;
                if (this.ctx.state === 'suspended') this.ctx.resume();

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {
                // AudioContext not permitted or supported
            }
        }
    };

    // Unlock audio on first user interaction (required for mobile browsers)
    function _onFirstInteraction() {
        SoundFx.unlockAudio();
        document.removeEventListener('touchstart', _onFirstInteraction, true);
        document.removeEventListener('touchend', _onFirstInteraction, true);
        document.removeEventListener('click', _onFirstInteraction, true);
    }
    document.addEventListener('touchstart', _onFirstInteraction, true);
    document.addEventListener('touchend', _onFirstInteraction, true);
    document.addEventListener('click', _onFirstInteraction, true);

    // =========================================================================
    // 2. Global State & App Controller
    // =========================================================================
    const state = {
        currentMode: 'standard',
        angleMode: 'DEG', // DEG or RAD
        is2nd: false,
        memory: { std: 0, sci: 0 },
        std: { expr: '', current: '0', waitingForNewNumber: false },
        sci: { expr: '', current: '0', waitingForNewNumber: false },
        prog: {
            radix: 'HEX',
            wordSize: 32, // 8, 16, 32, 64
            val: 0n,
            currentInput: '0',
            pendingOp: null,
            storedVal: null,
            waitingForNew: false
        },
        health: { unit: 'metric' },
        history: JSON.parse(localStorage.getItem('omni_calc_history') || '[]')
    };

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

    // =========================================================================
    // 3. UI Navigation & App Shell
    // =========================================================================
    function initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const views = document.querySelectorAll('.calculator-view');
        const calcTitle = document.getElementById('calculatorTitle');
        const calcSubtitle = document.getElementById('calculatorSubtitle');
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

        // =========================================================================
        // Device/OS Theme Sync — Always Matches Phone/Laptop Theme
        // Toggle button = session-only override (resets on next visit)
        // =========================================================================
        const themeBtn = document.getElementById('themeToggleBtn');
        const themeIcon = document.getElementById('themeIcon');
        const themeText = themeBtn ? themeBtn.querySelector('.btn-text') : null;
        let _userSessionOverride = false; // true only if user tapped toggle this session

        function applyTheme(themeName) {
            const isLight = themeName === 'light';
            document.body.classList.toggle('light-theme', isLight);
            document.body.classList.toggle('dark-theme', !isLight);
            document.documentElement.classList.toggle('light-theme', isLight);
            document.documentElement.classList.toggle('dark-theme', !isLight);
            
            if (themeIcon) themeIcon.textContent = isLight ? '🌙' : '☀️';
            if (themeText) themeText.textContent = isLight ? 'Dark Mode' : 'Light Mode';
            
            // Sync mobile OS status bar color
            const themeMeta = document.querySelector('meta[name="theme-color"]');
            if (themeMeta) {
                themeMeta.setAttribute('content', isLight ? '#f1f5f9' : '#0a0e17');
            }

            // Redraw charts if active
            if (state.currentMode === 'graphing' && typeof GraphEngine !== 'undefined') GraphEngine.render();
            if (state.currentMode === 'statistics' && typeof StatisticsEngine !== 'undefined') StatisticsEngine.renderVisualChart();
        }

        // On page load: ALWAYS read from device/OS prefers-color-scheme
        (function initThemeFromOS() {
            const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
            applyTheme(prefersLight ? 'light' : 'dark');
        })();

        // Listen for LIVE OS theme switches (e.g. phone sunrise/sunset auto mode)
        if (window.matchMedia) {
            const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: light)');
            colorSchemeMedia.addEventListener('change', (e) => {
                // Always follow OS unless user tapped toggle during this session
                if (!_userSessionOverride) {
                    applyTheme(e.matches ? 'light' : 'dark');
                }
            });
        }

        // Toggle button: session-only override (not saved to localStorage)
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                SoundFx.playClick(800);
                _userSessionOverride = true;
                const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
                applyTheme(nextTheme);
            });
        }

        // Sound Toggle
        const soundBtn = document.getElementById('soundToggleBtn');
        const soundIcon = document.getElementById('soundIcon');
        const soundText = soundBtn.querySelector('.btn-text');
        
        // Initialize sound UI state
        soundIcon.textContent = SoundFx.enabled ? '🔊' : '🔇';
        soundText.textContent = SoundFx.enabled ? 'Sound ON' : 'Sound OFF';

        soundBtn.addEventListener('click', () => {
            SoundFx.enabled = !SoundFx.enabled;
            soundIcon.textContent = SoundFx.enabled ? '🔊' : '🔇';
            soundText.textContent = SoundFx.enabled ? 'Sound ON' : 'Sound OFF';
            localStorage.setItem('calverse_sound', SoundFx.enabled ? 'true' : 'false');
            if (SoundFx.enabled) {
                SoundFx.unlockAudio(); // Ensure audio is unlocked on this user gesture
                SoundFx.playClick(900);
            }
        });

        // History Drawer
        const historyDrawer = document.getElementById('historyDrawer');
        const drawerOverlay = document.getElementById('drawerOverlay');
        const toggleHistory = () => {
            historyDrawer.classList.toggle('open');
            drawerOverlay.classList.toggle('open');
            renderHistoryList();
        };

        document.getElementById('historyToggleBtn').addEventListener('click', toggleHistory);
        document.getElementById('quickHistoryBtn').addEventListener('click', toggleHistory);
        document.getElementById('closeHistoryBtn').addEventListener('click', toggleHistory);
        drawerOverlay.addEventListener('click', toggleHistory);

        // Copy buttons
        document.getElementById('stdCopyBtn').addEventListener('click', () => copyToClipboard(document.getElementById('stdDisplay').value));
        document.getElementById('sciCopyBtn').addEventListener('click', () => copyToClipboard(document.getElementById('sciDisplay').value));
    }

    function switchMode(mode) {
        SoundFx.playClick(700);
        state.currentMode = mode;

        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.mode === mode);
        });

        document.querySelectorAll('.calculator-view').forEach(view => {
            view.classList.toggle('active', view.id === `view-${mode}`);
        });

        if (TITLES[mode]) {
            document.getElementById('calculatorTitle').textContent = TITLES[mode].title;
            document.getElementById('calculatorSubtitle').textContent = TITLES[mode].subtitle;
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

    function showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2200);
    }

    function copyToClipboard(text) {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            showToast(`Copied: ${text}`);
            SoundFx.playClick(1000);
        }).catch(() => {
            showToast('Failed to copy');
        });
    }

    // =========================================================================
    // 4. Standard & Scientific Calculator Core
    // =========================================================================
    function updateDisplay(type) {
        const data = state[type];
        const dispElem = document.getElementById(`${type}Display`);
        const exprElem = document.getElementById(`${type}Expression`);
        const memElem = document.getElementById(`${type}MemoryIndicator`);

        if (dispElem) dispElem.value = data.current;
        if (exprElem) exprElem.textContent = data.expr;
        if (memElem) memElem.textContent = state.memory[type] !== 0 ? `M (${state.memory[type]})` : '';
    }

    function sanitizeForEval(expr, angleMode = 'DEG') {
        let s = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/π/g, `${Math.PI}`)
            .replace(/\be\b/g, `${Math.E}`)
            .replace(/\^/g, '**');

        // Functions replacement
        const radFactor = angleMode === 'DEG' ? `* (${Math.PI} / 180)` : '';
        const invFactor = angleMode === 'DEG' ? `* (180 / ${Math.PI})` : '';

        s = s.replace(/sin\(([^)]+)\)/g, `Math.sin(($1)${radFactor})`);
        s = s.replace(/cos\(([^)]+)\)/g, `Math.cos(($1)${radFactor})`);
        s = s.replace(/tan\(([^)]+)\)/g, `Math.tan(($1)${radFactor})`);
        s = s.replace(/asin\(([^)]+)\)/g, `(Math.asin($1)${invFactor})`);
        s = s.replace(/acos\(([^)]+)\)/g, `(Math.acos($1)${invFactor})`);
        s = s.replace(/atan\(([^)]+)\)/g, `(Math.atan($1)${invFactor})`);
        s = s.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
        s = s.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
        s = s.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
        s = s.replace(/abs\(([^)]+)\)/g, 'Math.abs($1)');
        s = s.replace(/exp\(([^)]+)\)/g, 'Math.exp($1)');

        return s;
    }

    function factorial(n) {
        if (n < 0 || !Number.isInteger(n)) return NaN;
        if (n === 0 || n === 1) return 1;
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
    }

    function evaluateMath(expression, angleMode) {
        try {
            // Factorial handling: e.g. 5!
            let exp = expression.replace(/(\d+)!/g, (_, num) => factorial(parseInt(num, 10)));
            const sanitized = sanitizeForEval(exp, angleMode);
            // Safe evaluation using Function
            const result = Function(`"use strict"; return (${sanitized});`)();
            if (!isFinite(result)) return 'Error';
            return parseFloat(result.toFixed(10)).toString();
        } catch (e) {
            return 'Error';
        }
    }

    function inputVal(type, val) {
        SoundFx.playClick(500);
        const data = state[type];

        // If the expression was just evaluated (contains '='):
        if (data.expr && data.expr.includes('=')) {
            if (['+', '−', '×', '÷', '^', '%'].includes(val)) {
                // Operator after equals: chain on previous answer
                if (data.current === 'Error') data.current = '0';
                data.expr = `${data.current} ${val} `;
                data.waitingForNewNumber = true;
                updateDisplay(type);
                return;
            } else {
                // New digit or function after equals: clear expression line
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
            // Number
            if (data.current === '0' || data.waitingForNewNumber) {
                data.current = val;
                data.waitingForNewNumber = false;
            } else {
                data.current += val;
            }
        }
        updateDisplay(type);
    }

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
            // Trigonometry / Log
            data.current = evaluateMath(`${fn}(${cur})`, state.angleMode);
            data.expr = `${fn}(${cur}) =`;
        }
        data.waitingForNewNumber = true;
        updateDisplay('sci');
    }

    function clear(type) {
        SoundFx.playClick(450);
        state[type].expr = '';
        state[type].current = '0';
        state[type].waitingForNewNumber = false;
        updateDisplay(type);
    }

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

    function toggleSign(type) {
        SoundFx.playClick(500);
        const data = state[type];
        if (data.current !== '0' && data.current !== 'Error') {
            data.current = (parseFloat(data.current) * -1).toString();
            updateDisplay(type);
        }
    }

    function calculate(type) {
        SoundFx.playClick(850, 'triangle', 0.05);
        const data = state[type];

        // If empty or already calculated with '=', prevent repeating
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

    // Memory Functions
    function memClear(type) { state.memory[type] = 0; updateDisplay(type); }
    function memRecall(type) { state[type].current = state.memory[type].toString(); state[type].waitingForNewNumber = true; updateDisplay(type); }
    function memStore(type) { state.memory[type] = parseFloat(state[type].current) || 0; updateDisplay(type); }
    function memAdd(type) { state.memory[type] += parseFloat(state[type].current) || 0; updateDisplay(type); }
    function memSub(type) { state.memory[type] -= parseFloat(state[type].current) || 0; updateDisplay(type); }

    function toggleAngleMode() {
        SoundFx.playClick(600);
        state.angleMode = state.angleMode === 'DEG' ? 'RAD' : 'DEG';
        const pill = document.getElementById('sciAngleMode');
        if (pill) pill.textContent = state.angleMode;
    }

    function toggle2nd() {
        SoundFx.playClick(600);
        state.is2nd = !state.is2nd;
        // Invert labels if needed
    }

    // History Storage
    function addHistory(expr, result) {
        state.history.unshift({ expr, result, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        if (state.history.length > 50) state.history.pop();
        localStorage.setItem('omni_calc_history', JSON.stringify(state.history));
        renderHistoryList();
    }

    function renderHistoryList() {
        const list = document.getElementById('historyList');
        const count = document.getElementById('historyCount');
        if (!list) return;

        count.textContent = state.history.length;
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

    function clearHistory() {
        state.history = [];
        localStorage.removeItem('omni_calc_history');
        renderHistoryList();
    }

    // =========================================================================
    // 5. Graphing Engine (HTML5 Canvas Plotter)
    // =========================================================================
    const GraphEngine = {
        canvas: null,
        ctx: null,
        scale: 40, // pixels per unit
        originX: 0,
        originY: 0,
        isDragging: false,
        startX: 0,
        startY: 0,

        init() {
            this.canvas = document.getElementById('graphCanvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());

            // Pan & Zoom Listeners
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

            // Touch support for mobile dragging
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

            this.canvas.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
                this.zoom(zoomFactor);
            });

            this.render();
        },

        resize() {
            if (!this.canvas || !this.canvas.parentElement) return;
            this.canvas.width = this.canvas.parentElement.clientWidth;
            this.canvas.height = this.canvas.parentElement.clientHeight;
            this.originX = this.canvas.width / 2;
            this.originY = this.canvas.height / 2;
            this.render();
        },

        zoom(factor) {
            this.scale = Math.max(10, Math.min(300, this.scale * factor));
            this.render();
        },

        reset() {
            this.scale = 40;
            this.originX = this.canvas.width / 2;
            this.originY = this.canvas.height / 2;
            this.render();
        },

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

                // Auto multiplication e.g. 2x -> 2*x
                code = code.replace(/(\d+)\s*([a-zA-Z])/g, '$1*$2');
                return new Function('x', `"use strict"; try { return (${code}); } catch(e){ return NaN; }`);
            } catch (e) {
                return null;
            }
        },

        render() {
            if (!this.ctx) return;
            const w = this.canvas.width;
            const h = this.canvas.height;
            const isLight = document.body.classList.contains('light-theme');

            this.ctx.clearRect(0, 0, w, h);

            // Draw Grid
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';

            const startX = Math.floor(-this.originX / this.scale);
            const endX = Math.ceil((w - this.originX) / this.scale);
            const startY = Math.floor(-(h - this.originY) / this.scale);
            const endY = Math.ceil(this.originY / this.scale);

            for (let x = startX; x <= endX; x++) {
                const px = this.originX + x * this.scale;
                this.ctx.beginPath();
                this.ctx.moveTo(px, 0);
                this.ctx.lineTo(px, h);
                this.ctx.stroke();
            }

            for (let y = startY; y <= endY; y++) {
                const py = this.originY - y * this.scale;
                this.ctx.beginPath();
                this.ctx.moveTo(0, py);
                this.ctx.lineTo(w, py);
                this.ctx.stroke();
            }

            // Axes
            this.ctx.lineWidth = 1.8;
            this.ctx.strokeStyle = isLight ? '#94a3b8' : '#475569';
            
            // X-Axis
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.originY);
            this.ctx.lineTo(w, this.originY);
            this.ctx.stroke();

            // Y-Axis
            this.ctx.beginPath();
            this.ctx.moveTo(this.originX, 0);
            this.ctx.lineTo(this.originX, h);
            this.ctx.stroke();

            // Plot curves
            const fn1Str = document.getElementById('graphFuncInput1')?.value;
            const fn2Str = document.getElementById('graphFuncInput2')?.value;

            this.plotCurve(fn1Str, '#3b82f6');
            this.plotCurve(fn2Str, '#f43f5e');
        },

        plotCurve(funcStr, color) {
            const fn = this.parseFunction(funcStr);
            if (!fn) return;

            const w = this.canvas.width;
            this.ctx.beginPath();
            this.ctx.lineWidth = 2.5;
            this.ctx.strokeStyle = color;

            let first = true;
            for (let px = 0; px <= w; px += 2) {
                const mathX = (px - this.originX) / this.scale;
                const mathY = fn(mathX);

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

    // =========================================================================
    // 6. Financial Engine (Loan EMI & Compound Growth)
    // =========================================================================
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

    const FinancialEngine = {
        currentCurrency: localStorage.getItem('calverse_fin_currency') || localStorage.getItem('calcverse_fin_currency') || 'INR',

        init() {
            // Restore saved currency
            const curSelect = document.getElementById('finCurrencySelect');
            if (curSelect) {
                curSelect.value = this.currentCurrency;
            }
            this.updateLabels();

            // Restore offline cached exchange rates
            try {
                const cachedRates = localStorage.getItem('calverse_rates_cache') || localStorage.getItem('calcverse_rates_cache');
                if (cachedRates) {
                    const parsed = JSON.parse(cachedRates);
                    if (parsed && parsed.rates) {
                        this.rates = { ...this.rates, ...parsed.rates };
                        if (parsed.time) this.ratesLastUpdated = new Date(parsed.time);
                    }
                }
            } catch (e) {}

            // Sliders & Number sync
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

            // Compound listeners
            ['ciPrincipal', 'ciMonthly', 'ciRate', 'ciYears', 'ciCompoundFreq'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('input', () => this.calculateCompound());
            });

            this.calculateEMI();
            this.calculateCompound();
            this.fetchLiveRates();
        },

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

        formatMoney(amount) {
            const cur = CURRENCY_CONFIG[this.currentCurrency] || CURRENCY_CONFIG.INR;
            const formatted = amount.toLocaleString(cur.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            return `${cur.symbol}${formatted}`;
        },

        calculateEMI() {
            const P = parseFloat(document.getElementById('loanAmount').value) || 0;
            const annualRate = parseFloat(document.getElementById('interestRate').value) || 0;
            const years = parseFloat(document.getElementById('loanTenure').value) || 0;

            if (P <= 0 || annualRate <= 0 || years <= 0) return;

            const r = annualRate / 12 / 100;
            const n = years * 12;

            // EMI Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
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

        calculateCompound() {
            const P = parseFloat(document.getElementById('ciPrincipal').value) || 0;
            const PMT = parseFloat(document.getElementById('ciMonthly').value) || 0;
            const r = (parseFloat(document.getElementById('ciRate').value) || 0) / 100;
            const t = parseFloat(document.getElementById('ciYears').value) || 0;
            const n = parseInt(document.getElementById('ciCompoundFreq').value, 10) || 12;

            const months = t * 12;
            const monthlyRate = r / 12;

            // Lump sum compound
            let FV_lump = P * Math.pow(1 + r / n, n * t);

            // Monthly SIP Future Value: PMT * [ ( (1 + i)^months - 1 ) / i ]
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

        // =====================================================================
        // Live Exchange Rates & Converter
        // =====================================================================
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
        ratesLastUpdated: null,

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

    // =========================================================================
    // 7. Unit Converter Engine
    // =========================================================================
    const ConverterEngine = {
        currentCategory: 'length',

        units: {
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
        },

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

            document.getElementById('convertValFrom').addEventListener('input', () => this.convert('from'));
            document.getElementById('convertValTo').addEventListener('input', () => this.convert('to'));
            document.getElementById('convertUnitFrom').addEventListener('change', () => this.convert('from'));
            document.getElementById('convertUnitTo').addEventListener('change', () => this.convert('from'));

            document.getElementById('swapUnitsBtn').addEventListener('click', () => {
                SoundFx.playClick(600);
                const fromUnit = document.getElementById('convertUnitFrom');
                const toUnit = document.getElementById('convertUnitTo');
                const temp = fromUnit.value;
                fromUnit.value = toUnit.value;
                toUnit.value = temp;
                this.convert('from');
            });

            this.populateUnits();
            this.convert('from');
        },

        populateUnits() {
            const uList = Object.keys(this.units[this.currentCategory]);
            const fromSelect = document.getElementById('convertUnitFrom');
            const toSelect = document.getElementById('convertUnitTo');

            fromSelect.innerHTML = uList.map(u => `<option value="${u}">${u}</option>`).join('');
            toSelect.innerHTML = uList.map(u => `<option value="${u}">${u}</option>`).join('');

            fromSelect.selectedIndex = 0;
            toSelect.selectedIndex = Math.min(1, uList.length - 1);
        },

        convert(source) {
            const cat = this.currentCategory;
            const fromUnit = document.getElementById('convertUnitFrom').value;
            const toUnit = document.getElementById('convertUnitTo').value;

            if (cat === 'temperature') {
                if (source === 'from') {
                    const val = parseFloat(document.getElementById('convertValFrom').value) || 0;
                    const res = this.convertTemp(val, fromUnit, toUnit);
                    document.getElementById('convertValTo').value = res.toFixed(3);
                } else {
                    const val = parseFloat(document.getElementById('convertValTo').value) || 0;
                    const res = this.convertTemp(val, toUnit, fromUnit);
                    document.getElementById('convertValFrom').value = res.toFixed(3);
                }
            } else {
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

            const fromVal = document.getElementById('convertValFrom').value;
            const toVal = document.getElementById('convertValTo').value;
            document.getElementById('conversionFormula').textContent = `${fromVal} ${fromUnit} = ${toVal} ${toUnit}`;
        },

        convertTemp(val, from, to) {
            if (from === to) return val;
            let c = val;
            if (from === 'Fahrenheit') c = (val - 32) * (5 / 9);
            if (from === 'Kelvin') c = val - 273.15;

            if (to === 'Celsius') return c;
            if (to === 'Fahrenheit') return c * (9 / 5) + 32;
            if (to === 'Kelvin') return c + 273.15;
            return c;
        }
    };

    // =========================================================================
    // 8. Programmer Calculator Engine
    // =========================================================================
    const ProgrammerEngine = {
        setRadix(radix) {
            SoundFx.playClick(600);
            state.prog.radix = radix;
            document.querySelectorAll('.radix-row').forEach(row => {
                row.classList.toggle('active', row.dataset.radix === radix);
            });
            this.updateKeypadState();
        },

        setWordSize(bits) {
            SoundFx.playClick(600);
            state.prog.wordSize = bits;
            document.querySelectorAll('.word-btn').forEach(btn => {
                btn.classList.toggle('active', parseInt(btn.dataset.bits, 10) === bits);
            });
            this.maskValue();
            this.updateDisplay();
        },

        getMask() {
            const bits = state.prog.wordSize;
            if (bits === 8) return 0xFFn;
            if (bits === 16) return 0xFFFFn;
            if (bits === 32) return 0xFFFFFFFFn;
            return 0xFFFFFFFFFFFFFFFFn;
        },

        maskValue() {
            state.prog.val = state.prog.val & this.getMask();
        },

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
                // invalid digit for base
            }
        },

        inputBitwise(op) {
            SoundFx.playClick(550);
            const p = state.prog;
            if (op === 'NOT') {
                p.val = (~p.val) & this.getMask();
                this.updateDisplay();
                return;
            }

            p.storedVal = p.val;
            p.pendingOp = op;
            p.waitingForNew = true;
        },

        inputOp(op) {
            this.inputBitwise(op);
        },

        calculate() {
            SoundFx.playClick(850);
            const p = state.prog;
            if (p.storedVal === null || !p.pendingOp) return;

            let a = p.storedVal;
            let b = p.val;
            let res = 0n;

            switch (p.pendingOp) {
                case 'AND': res = a & b; break;
                case 'OR': res = a | b; break;
                case 'XOR': res = a ^ b; break;
                case '<<': res = a << b; break;
                case '>>': res = a >> b; break;
                case '+': res = a + b; break;
                case '−': res = a - b; break;
                case '×': res = a * b; break;
                case '÷': res = b !== 0n ? a / b : 0n; break;
                case '%': res = b !== 0n ? a % b : 0n; break;
            }

            p.val = res;
            this.maskValue();
            p.storedVal = null;
            p.pendingOp = null;
            p.waitingForNew = true;
            this.updateDisplay();
        },

        clear() {
            state.prog.val = 0n;
            state.prog.currentInput = '0';
            state.prog.storedVal = null;
            state.prog.pendingOp = null;
            this.updateDisplay();
        },

        backspace() {
            const p = state.prog;
            let str = p.val.toString(p.radix === 'HEX' ? 16 : p.radix === 'DEC' ? 10 : p.radix === 'OCT' ? 8 : 2);
            str = str.slice(0, -1);
            p.val = str ? BigInt(parseInt(str, p.radix === 'HEX' ? 16 : p.radix === 'DEC' ? 10 : p.radix === 'OCT' ? 8 : 2)) : 0n;
            this.updateDisplay();
        },

        toggleSign() {
            state.prog.val = (-state.prog.val) & this.getMask();
            this.updateDisplay();
        },

        updateDisplay() {
            const p = state.prog;
            const val = p.val;
            const hex = val.toString(16).toUpperCase();
            const dec = val.toString(10);
            const oct = val.toString(8);
            
            let bin = val.toString(2);
            // Pad binary with spacing
            const padLen = state.prog.wordSize;
            bin = bin.padStart(padLen, '0');
            bin = bin.match(/.{1,4}/g)?.join(' ') || bin;

            document.getElementById('progHex').textContent = hex || '0';
            document.getElementById('progDec').textContent = dec || '0';
            document.getElementById('progOct').textContent = oct || '0';
            document.getElementById('progBin').textContent = bin;
        },

        updateKeypadState() {
            const radix = state.prog.radix;
            const hexBtns = document.querySelectorAll('.btn-hex');
            const numBtns = document.querySelectorAll('.programmer-keypad .btn-num');

            hexBtns.forEach(b => b.classList.toggle('disabled', radix !== 'HEX'));

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

    // =========================================================================
    // 9. BMI & Health Calculator Engine
    // =========================================================================
    const HealthEngine = {
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

        calculate() {
            SoundFx.playClick(600);
            const unit = state.health.unit;
            let heightM = 0;
            let weightKg = 0;

            if (unit === 'metric') {
                const cm = parseFloat(document.getElementById('healthHeightCm').value) || 175;
                weightKg = parseFloat(document.getElementById('healthWeightKg').value) || 70;
                heightM = cm / 100;
            } else {
                const ft = parseFloat(document.getElementById('healthHeightFt').value) || 5;
                const inches = parseFloat(document.getElementById('healthHeightIn').value) || 9;
                const lbs = parseFloat(document.getElementById('healthWeightLbs').value) || 154;
                const totalInches = ft * 12 + inches;
                heightM = totalInches * 0.0254;
                weightKg = lbs * 0.453592;
            }

            if (heightM <= 0 || weightKg <= 0) return;

            const bmi = weightKg / (heightM * heightM);
            const age = parseInt(document.getElementById('healthAge').value, 10) || 25;
            const gender = document.querySelector('input[name="healthGender"]:checked')?.value || 'male';

            // Category
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

            document.getElementById('bmiValue').textContent = bmi.toFixed(1);
            const catElem = document.getElementById('bmiCategory');
            catElem.textContent = cat;
            catElem.className = `bmi-badge ${badgeClass}`;
            document.getElementById('bmiPointer').style.left = `${pointerPercent}%`;

            // Healthy Range: 18.5 to 24.9 BMI
            const minW = (18.5 * heightM * heightM).toFixed(1);
            const maxW = (24.9 * heightM * heightM).toFixed(1);
            document.getElementById('healthyRangeVal').textContent = unit === 'metric' 
                ? `${minW} kg - ${maxW} kg` 
                : `${(minW * 2.20462).toFixed(1)} lbs - ${(maxW * 2.20462).toFixed(1)} lbs`;

            // BMR (Mifflin-St Jeor)
            let bmr = (10 * weightKg) + (6.25 * heightM * 100) - (5 * age);
            bmr = gender === 'male' ? bmr + 5 : bmr - 161;
            const tdee = bmr * 1.375; // light activity baseline

            document.getElementById('bmrVal').textContent = `${Math.round(bmr).toLocaleString()} kcal / day`;
            document.getElementById('tdeeVal').textContent = `${Math.round(tdee).toLocaleString()} kcal / day`;
        }
    };

    // =========================================================================
    // 10. Date & Age Calculator Engine
    // =========================================================================
    const DateEngine = {
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

        calculateDiff() {
            SoundFx.playClick(600);
            const from = new Date(document.getElementById('dateFrom').value);
            const to = new Date(document.getElementById('dateTo').value);

            if (isNaN(from.getTime()) || isNaN(to.getTime())) return;

            const diffTime = Math.abs(to - from);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const weeks = (diffDays / 7).toFixed(1);

            document.getElementById('diffPrimary').textContent = `${diffDays} Days`;
            document.getElementById('diffBreakdown').innerHTML = `
                Equivalent to <strong>${weeks} weeks</strong> or <strong>${(diffDays * 24).toLocaleString()} hours</strong>
            `;
        },

        calculateAge() {
            SoundFx.playClick(600);
            const dob = new Date(document.getElementById('birthDate').value);
            const asOf = new Date(document.getElementById('asOfDate').value);

            if (isNaN(dob.getTime()) || isNaN(asOf.getTime())) return;

            let years = asOf.getFullYear() - dob.getFullYear();
            let months = asOf.getMonth() - dob.getMonth();
            let days = asOf.getDate() - dob.getDate();

            if (days < 0) {
                months--;
                const prevMonthDays = new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
                days += prevMonthDays;
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            const totalDays = Math.floor((asOf - dob) / (1000 * 60 * 60 * 24));

            document.getElementById('agePrimary').textContent = `${years} Years, ${months} Months, ${days} Days`;
            document.getElementById('ageBreakdown').innerHTML = `
                Total lived: <strong>${totalDays.toLocaleString()} days</strong> (≈ <strong>${Math.floor(totalDays / 7).toLocaleString()} weeks</strong>)
            `;
        },

        calculateAddSub() {
            SoundFx.playClick(600);
            const start = new Date(document.getElementById('addsubDate').value);
            const op = document.getElementById('addsubOperation').value;
            const days = parseInt(document.getElementById('addsubDays').value, 10) || 0;

            if (isNaN(start.getTime())) return;

            const resultDate = new Date(start);
            if (op === 'add') {
                resultDate.setDate(resultDate.getDate() + days);
            } else {
                resultDate.setDate(resultDate.getDate() - days);
            }

            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('addsubResult').textContent = resultDate.toLocaleDateString(undefined, options);
            document.getElementById('addsubDayOfWeek').textContent = `${op === 'add' ? '+' : '−'} ${days} days from ${start.toLocaleDateString()}`;
        }
    };

    // =========================================================================
    // 11. Time Calculator & Stopwatch Engine (Matches Android App Style)
    // =========================================================================
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
                // Convert units into arithmetic multiplications of seconds
                // e.g. 2hour -> (2 * 3600)
                // 35min -> (35 * 60)
                // 45sec -> (45 * 1)
                // 500m.sec -> (500 * 0.001)
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
            const startVal = document.getElementById('timeStart').value;
            const endVal = document.getElementById('timeEnd').value;
            const breakMins = parseInt(document.getElementById('timeBreak').value, 10) || 0;

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

            document.getElementById('timeDurationPrimary').textContent = `${h}h ${m}m ${s}s`;
            document.getElementById('timeDurationDecimal').textContent = `${decimalHrs} hrs`;
            document.getElementById('timeDurationMinutes').textContent = `${totalMins.toLocaleString()} mins`;
            document.getElementById('timeDurationSeconds').textContent = `${netSec.toLocaleString()} sec`;
        },

        calculateMath() {
            SoundFx.playClick(600);
            const t1H = parseInt(document.getElementById('t1Hours').value, 10) || 0;
            const t1M = parseInt(document.getElementById('t1Mins').value, 10) || 0;
            const t1S = parseInt(document.getElementById('t1Secs').value, 10) || 0;

            const t2H = parseInt(document.getElementById('t2Hours').value, 10) || 0;
            const t2M = parseInt(document.getElementById('t2Mins').value, 10) || 0;
            const t2S = parseInt(document.getElementById('t2Secs').value, 10) || 0;

            const op = document.getElementById('timeMathOp').value;

            const sec1 = t1H * 3600 + t1M * 60 + t1S;
            const sec2 = t2H * 3600 + t2M * 60 + t2S;

            let resSec = op === 'add' ? sec1 + sec2 : sec1 - sec2;
            const isNegative = resSec < 0;
            resSec = Math.abs(resSec);

            const h = Math.floor(resSec / 3600);
            const m = Math.floor((resSec % 3600) / 60);
            const s = resSec % 60;

            const prefix = isNegative ? '− ' : '';
            document.getElementById('timeMathResult').textContent = `${prefix}${h}h ${m}m ${s}s`;
            document.getElementById('timeMathSecs').textContent = `${prefix}${resSec.toLocaleString()} s`;
            document.getElementById('timeMathMins').textContent = `${prefix}${(resSec / 60).toFixed(2)} m`;
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
                startBtn.textContent = 'Resume';
                startBtn.classList.remove('running');
            } else {
                // Start
                this.swStartTime = Date.now();
                this.swTimerInterval = setInterval(() => this.updateStopwatchDisplay(), 10);
                this.swIsRunning = true;
                startBtn.textContent = 'Stop';
                startBtn.classList.add('running');
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
            const disp = document.getElementById('stopwatchDisplay').textContent;
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
            const ep = parseInt(document.getElementById('epochInput').value, 10);
            if (isNaN(ep)) return;

            const d = new Date(ep * 1000);
            document.getElementById('epochResultPrimary').textContent = d.toLocaleString();
            document.getElementById('epochResultSecondary').innerHTML = `
                UTC: <strong>${d.toUTCString()}</strong><br>
                ISO: <strong>${d.toISOString()}</strong>
            `;
        },

        convertDateToEpoch() {
            SoundFx.playClick(600);
            const dtVal = document.getElementById('dateToEpochInput').value;
            if (!dtVal) return;

            const d = new Date(dtVal);
            const epochSec = Math.floor(d.getTime() / 1000);
            document.getElementById('epochResultPrimary').textContent = `${epochSec} Epoch`;
            document.getElementById('epochResultSecondary').textContent = `${d.toUTCString()} (Local: ${d.toLocaleString()})`;
        }
    };

    // =========================================================================
    // 12. Discount & Tip Engine
    // =========================================================================
    const DiscountEngine = {
        currentCurrency: localStorage.getItem('calverse_disc_currency') || localStorage.getItem('calcverse_disc_currency') || 'INR',

        init() {
            const curSelect = document.getElementById('discCurrencySelect');
            if (curSelect) {
                curSelect.value = this.currentCurrency;
            }
            this.updateLabels();
            this.calculateDiscount();
            this.calculateTip();
        },

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

        formatMoney(amount) {
            const conf = CURRENCY_CONFIG[this.currentCurrency] || CURRENCY_CONFIG.INR;
            try {
                return new Intl.NumberFormat(conf.locale, {
                    style: 'currency',
                    currency: this.currentCurrency,
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                }).format(amount);
            } catch (e) {
                return `${conf.symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
        },

        updateLabels() {
            const conf = CURRENCY_CONFIG[this.currentCurrency] || CURRENCY_CONFIG.INR;
            const origLabel = document.getElementById('discOriginalPriceLabel');
            const tipBillLabel = document.getElementById('tipBillAmountLabel');

            if (origLabel) origLabel.textContent = `Original Price (${conf.symbol.trim()})`;
            if (tipBillLabel) tipBillLabel.textContent = `Bill Amount (${conf.symbol.trim()})`;
        },

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

            if (coupRow) coupRow.style.display = coup > 0 ? 'flex' : 'none';
            if (coupEl) coupEl.textContent = `-${formattedCoupAmt}`;
            if (taxRow) taxRow.style.display = tax > 0 ? 'flex' : 'none';
            if (taxEl) taxEl.textContent = `+${formattedTaxAmt}`;
        },

        setDiscountPct(val) {
            SoundFx.playClick(600);
            const el = document.getElementById('discPercent');
            if (el) el.value = val;
            const chips = document.querySelectorAll('#subtab-discount-calc .quick-pct-chip');
            chips.forEach(c => c.classList.toggle('active', c.textContent.trim() === `${val}%`));
            this.calculateDiscount();
        },

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

        setTipPct(val) {
            SoundFx.playClick(600);
            const el = document.getElementById('tipPercent');
            if (el) el.value = val;
            const chips = document.querySelectorAll('#subtab-tip-calc .quick-pct-chip');
            chips.forEach(c => c.classList.toggle('active', c.textContent.trim() === `${val}%`));
            this.calculateTip();
        },

        stepTipPeople(delta) {
            SoundFx.playClick(500);
            const el = document.getElementById('tipPeopleCount');
            if (!el) return;
            let val = parseInt(el.value, 10) || 1;
            val = Math.max(1, Math.min(100, val + delta));
            el.value = val;
            this.calculateTip();
        },

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

    // =========================================================================
    // 13. Equation & Algebra Solver Engine
    // =========================================================================
    const EquationEngine = {
        init() {
            this.solveQuadratic();
            this.solveLinearSystem();
            this.calculateFraction();
        },

        solveQuadratic() {
            const a = parseFloat(document.getElementById('quadA')?.value);
            const b = parseFloat(document.getElementById('quadB')?.value);
            const c = parseFloat(document.getElementById('quadC')?.value);

            const r1El = document.getElementById('quadRoot1');
            const r2El = document.getElementById('quadRoot2');
            const stepDisc = document.getElementById('quadStepDisc');
            const stepForm = document.getElementById('quadStepFormula');
            const stepVert = document.getElementById('quadStepVertex');

            // Update live equation preview
            this.updateLiveEquation(a, b, c);

            if (isNaN(a) || isNaN(b) || isNaN(c)) return;

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

            const D = b * b - 4 * a * c;
            const h = -b / (2 * a);
            const k = c - (b * b) / (4 * a);
            const opens = a > 0 ? 'Opens Upward (Minimum)' : 'Opens Downward (Maximum)';

            if (D > 0) {
                const x1 = ((-b + Math.sqrt(D)) / (2 * a)).toFixed(4);
                const x2 = ((-b - Math.sqrt(D)) / (2 * a)).toFixed(4);
                if (r1El) r1El.textContent = x1;
                if (r2El) r2El.textContent = x2;
                if (stepDisc) stepDisc.innerHTML = `<span class="step-num">1.</span> Discriminant: Δ = b² − 4ac = (${b})² − 4(${a})(${c}) = ${D} > 0 → Two Real Roots`;
                if (stepForm) stepForm.innerHTML = `<span class="step-num">2.</span> Quadratic Formula: x = (−(${b}) ± √${D}) / (2 × ${a}) → x₁ = ${x1}, x₂ = ${x2}`;
                if (stepVert) stepVert.innerHTML = `<span class="step-num">3.</span> Vertex: (h, k) = (${h.toFixed(2)}, ${k.toFixed(2)}) • ${opens}`;
            } else if (D === 0) {
                const x = ((-b) / (2 * a)).toFixed(4);
                if (r1El) r1El.textContent = x;
                if (r2El) r2El.textContent = `${x} (Double Root)`;
                if (stepDisc) stepDisc.innerHTML = `<span class="step-num">1.</span> Discriminant: Δ = 0 → One Repeated Root`;
                if (stepForm) stepForm.innerHTML = `<span class="step-num">2.</span> Root: x = −(${b}) / (2 × ${a}) = ${x}`;
                if (stepVert) stepVert.innerHTML = `<span class="step-num">3.</span> Vertex: (h, k) = (${h.toFixed(2)}, ${k.toFixed(2)}) • ${opens}`;
            } else {
                const realPart = ((-b) / (2 * a)).toFixed(4);
                const imagPart = ((Math.sqrt(-D)) / (2 * Math.abs(a))).toFixed(4);
                if (r1El) r1El.textContent = `${realPart} + ${imagPart}i`;
                if (r2El) r2El.textContent = `${realPart} - ${imagPart}i`;
                if (stepDisc) stepDisc.innerHTML = `<span class="step-num">1.</span> Discriminant: Δ = ${D} < 0 → Two Complex Roots`;
                if (stepForm) stepForm.innerHTML = `<span class="step-num">2.</span> Formula: x = ${realPart} ± ${imagPart}i`;
                if (stepVert) stepVert.innerHTML = `<span class="step-num">3.</span> Vertex: (h, k) = (${h.toFixed(2)}, ${k.toFixed(2)}) • ${opens}`;
            }
        },

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

            if (den < 0) {
                num = -num;
                den = -den;
            }

            const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
            const common = gcd(num, den);
            const simNum = num / common;
            const simDen = den / common;

            // Mixed fraction
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

    // =========================================================================
    // 14. Statistics & Data Analyzer Engine
    // =========================================================================
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

    // =========================================================================
    // 15. Keyboard Shortcuts Controller
    // =========================================================================
    function initKeyboard() {
        window.addEventListener('keydown', (e) => {
            // Ignore when focused in text/number input
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                if (e.key === 'Enter' && state.currentMode === 'graphing') {
                    GraphEngine.render();
                }
                return;
            }

            const key = e.key;

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
            } else if (state.currentMode === 'programmer') {
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

    // =========================================================================
    // 13. Public CalVerse API Export
    // =========================================================================
    window.CalVerse = {
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
        toggle2nd,
        clearHistory,

        // Graphing API
        plotGraph: () => GraphEngine.render(),
        setGraphPreset: (f1, f2) => {
            document.getElementById('graphFuncInput1').value = f1;
            document.getElementById('graphFuncInput2').value = f2;
            GraphEngine.render();
        },
        zoomGraph: (factor) => GraphEngine.zoom(factor),
        resetGraph: () => GraphEngine.reset(),

        // Financial & Currency API
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

        // Install Modal API
        openInstallModal: () => {
            SoundFx.playClick(600);
            if (window._deferredInstallPrompt) {
                window.CalVerse.triggerPwaPrompt();
                return;
            }
            const modal = document.getElementById('installModalBackdrop');
            if (modal) modal.classList.add('open');
        },

        closeInstallModal: () => {
            const modal = document.getElementById('installModalBackdrop');
            if (modal) modal.classList.remove('open');
        },

        downloadDetectedApp: () => {
            const ua = navigator.userAgent || '';
            if (/Android/i.test(ua)) {
                window.CalVerse.triggerPwaPrompt();
            } else if (/Windows/i.test(ua)) {
                window.CalVerse.downloadExe();
            } else if (/iPhone|iPad|iPod/i.test(ua)) {
                window.CalVerse.downloadIosProfile();
            } else {
                window.CalVerse.triggerPwaPrompt();
            }
        },

        installAndroidApp: () => {
            SoundFx.playClick(700);
            window.CalVerse.triggerPwaPrompt();
        },

        downloadExe: () => {
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

        downloadIosProfile: () => {
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

        triggerPwaPrompt: async () => {
            if (window._deferredInstallPrompt) {
                window._deferredInstallPrompt.prompt();
                const { outcome } = await window._deferredInstallPrompt.userChoice;
                if (outcome === 'accepted') {
                    showToast('🎉 CalVerse installed successfully!');
                    window.CalVerse.closeInstallModal();
                }
                window._deferredInstallPrompt = null;
            } else {
                showToast('📱 To install: Click the browser address bar icon or menu -> "Install App"');
            }
        }
    };

    // Backward-compatibility aliases
    window.CalcVerse = window.CalVerse;
    window.OmniCalc = window.CalVerse;

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

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        initNavigation();
        initKeyboard();
        FinancialEngine.init();
        DiscountEngine.init();
        EquationEngine.init();
        StatisticsEngine.init();
        renderHistoryList();
        initSidebarClock();

        // Clear old legacy caches
        if ('caches' in window) {
            caches.keys().then((names) => {
                names.forEach((name) => {
                    if (name.includes('omni') || name === 'omnicalc-v1' || name.includes('calcverse')) {
                        caches.delete(name);
                    }
                });
            });
        }

        // PWA Service Worker Registration & Force Update
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').then((reg) => {
                reg.update().catch(() => {});
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
            if (window.CalVerse && window.CalVerse.closeInstallModal) {
                window.CalVerse.closeInstallModal();
            }
            showToast('🎉 CalVerse installed successfully!');
        });

        // Close modal when backdrop clicked
        const modalBackdrop = document.getElementById('installModalBackdrop');
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', (e) => {
                if (e.target === modalBackdrop) {
                    window.CalVerse.closeInstallModal();
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

        // Prevent Pull-To-Refresh on Mobile Devices & WebViews
        let _touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length === 1) {
                _touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length === 1) {
                const touchY = e.touches[0].clientY;
                const touchDiff = touchY - _touchStartY;
                
                // If user is pulling downward at the top of the container
                const scrollable = e.target.closest('.main-viewport, .sidebar, .history-drawer, .calculators-container, .modal-card');
                const isAtTop = scrollable ? scrollable.scrollTop <= 0 : window.scrollY <= 0;

                if (isAtTop && touchDiff > 0 && !e.target.closest('input, textarea, select')) {
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                }
            }
        }, { passive: false });
    });

})();

