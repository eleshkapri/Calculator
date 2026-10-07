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

export const GraphEngine = {
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
