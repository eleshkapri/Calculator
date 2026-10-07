/**
 * CalVerse Pro - Statistics & Data Analyzer Feature
 * Statistical metrics (Mean, Median, Mode, Variance, StdDev, IQR) & HTML5 Canvas visual charts (Bars, Boxplot, Histogram)
 */

import { state } from '../../core/state.js';
import { SoundFx } from '../../core/sound.js';
import { copyToClipboard } from '../../core/dom.js';

export const StatisticsEngine = {
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
