/**
 * CalVerse Pro - Graphing Calculator Feature
 * Interactive 2D function visualizer & HTML5 canvas plotting engine
 */

export const GraphEngine = {
    _initialized: false,
    canvas: null,
    ctx: null,
    scale: 40, // pixels per unit
    originX: 0,
    originY: 0,
    isDragging: false,
    startX: 0,
    startY: 0,

    init() {
        if (GraphEngine._initialized) { GraphEngine.render(); return; }
        GraphEngine._initialized = true;
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
