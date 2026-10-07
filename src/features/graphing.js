/**
 * ============================================================================
 * CalVerse Pro - 2D Graphing Visualizer Engine (OOP Architecture)
 * File: src/features/graphing.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Object-oriented HTML5 Canvas 2D Cartesian graphing engine with security hardening:
 * 1. High-DPI Retina Scaling: Automatically scales canvas backing buffer with devicePixelRatio.
 * 2. Secure Function Parser: Validates mathematical expressions with strict token whitelisting
 *    and sandbox isolation before compilation.
 * 3. Interactive Cartesian Grid: Smooth pan, zoom, touch gesture tracking, and coordinate HUD.
 * 
 * OOP PRINCIPLES:
 * 1. Inheritance: Extends BaseCalculator.
 * 2. Encapsulation: Canvas dimensions, scale limits, coordinate transforms, and dragging state
 *    are protected inside the GraphingCalculator class.
 * ============================================================================
 */

import { BaseCalculator } from './base.js';

export class GraphingCalculator extends BaseCalculator {
    static #FORBIDDEN_KEYWORDS = Object.freeze([
        'window', 'document', 'globalthis', 'self', 'top', 'parent', 'frames',
        'location', 'fetch', 'xmlhttprequest', 'localstorage', 'sessionstorage',
        'indexeddb', 'cookie', 'alert', 'prompt', 'confirm', 'eval', 'function',
        'constructor', 'prototype', '__proto__', 'import', 'require', 'process'
    ]);

    static #SANDBOX_ARGS = Object.freeze([
        'window', 'document', 'globalThis', 'self', 'top', 'parent', 'frames',
        'location', 'fetch', 'XMLHttpRequest', 'localStorage', 'sessionStorage',
        'indexedDB', 'alert', 'prompt', 'confirm', 'process'
    ]);

    constructor(id = 'graphing') {
        super(id);
        this.canvas = null;
        this.ctx = null;
        this.scale = 40;
        this.originX = 0;
        this.originY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.dpr = 1;
    }

    /**
     * Bootstraps canvas bindings, event listeners, and default render.
     */
    init() {
        if (this.isInitialized) {
            this.render();
            return;
        }
        this.markInitialized();

        this.canvas = document.getElementById('graphCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();

        window.addEventListener('resize', () => this.resize());

        // Mouse Pan & HUD Tracking
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

        // Touch gestures for responsive mobile pan
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
        }, { passive: false });

        this.render();
    }

    /**
     * Resizes the canvas with High-DPI / Retina scale support.
     */
    resize() {
        if (!this.canvas || !this.canvas.parentElement) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const w = rect.width || 600;
        const h = rect.height || 420;

        this.dpr = window.devicePixelRatio || 1;
        this.canvas.width = w * this.dpr;
        this.canvas.height = h * this.dpr;
        this.canvas.style.width = `${w}px`;
        this.canvas.style.height = `${h}px`;

        this.originX = w / 2;
        this.originY = h / 2;
        this.render();
    }

    /**
     * Zooms the Cartesian plane by factor.
     * @param {number} factor
     */
    zoom(factor) {
        this.scale = Math.max(10, Math.min(300, this.scale * factor));
        this.render();
    }

    /**
     * Resets scale and re-centers origin.
     */
    reset() {
        this.scale = 40;
        if (this.canvas && this.canvas.parentElement) {
            const w = this.canvas.parentElement.clientWidth;
            const h = this.canvas.parentElement.clientHeight;
            this.originX = w / 2;
            this.originY = h / 2;
        }
        this.render();
    }

    /**
     * Parses and compiles mathematical formula f(x) with strict security validation.
     * @param {string} funcStr
     * @returns {Function|null}
     */
    parseFunction(funcStr) {
        if (!funcStr || typeof funcStr !== 'string' || !funcStr.trim()) return null;
        if (funcStr.length > 500) return null; // Payload size cap

        const lower = funcStr.toLowerCase();
        for (const word of GraphingCalculator.#FORBIDDEN_KEYWORDS) {
            const regex = new RegExp(`\\b${word}\\b|\\.${word}`, 'i');
            if (regex.test(lower)) {
                return null;
            }
        }

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

            // Whitelist verification: strip known tokens
            const testCode = code
                .replace(/Math\.(sin|cos|tan|abs|exp|log|log10|sqrt|PI|E)/g, '')
                .replace(/x/g, '')
                .replace(/[0-9.]+/g, '')
                .replace(/[\+\-\*\/\%\(\)\,\s\^]/g, '');

            if (testCode.trim().length > 0) {
                return null; // Contains unknown symbols or injection
            }

            // Secure function sandbox with shadowed browser globals
            const sandboxFn = new Function(
                'x',
                ...GraphingCalculator.#SANDBOX_ARGS,
                `"use strict"; try { return (${code}); } catch(e){ return NaN; }`
            );

            return (x) => sandboxFn(x, ...GraphingCalculator.#SANDBOX_ARGS.map(() => undefined));
        } catch (e) {
            return null;
        }
    }

    /**
     * Redraws Cartesian plane, axes, and function curves.
     */
    render() {
        if (!this.ctx || !this.canvas) return;

        const w = this.canvas.width / this.dpr;
        const h = this.canvas.height / this.dpr;
        const isLight = document.body.classList.contains('light-theme');

        this.ctx.save();
        this.ctx.scale(this.dpr, this.dpr);
        this.ctx.clearRect(0, 0, w, h);

        // 1. Background Grid
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

        // 2. Axes
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

        // 3. Curves
        const fn1Str = document.getElementById('graphFuncInput1')?.value;
        const fn2Str = document.getElementById('graphFuncInput2')?.value;

        this.plotCurve(fn1Str, '#3b82f6', w);
        this.plotCurve(fn2Str, '#f43f5e', w);

        this.ctx.restore();
    }

    /**
     * Evaluates and paints a continuous curve.
     * @param {string} funcStr 
     * @param {string} color 
     * @param {number} width 
     */
    plotCurve(funcStr, color, width) {
        const fn = this.parseFunction(funcStr);
        if (!fn) return;

        this.ctx.beginPath();
        this.ctx.lineWidth = 2.5;
        this.ctx.strokeStyle = color;

        let first = true;
        for (let px = 0; px <= width; px += 2) {
            const mathX = (px - this.originX) / this.scale;
            const mathY = fn(mathX);

            if (isNaN(mathY) || !Number.isFinite(mathY)) {
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
}

/** Default singleton instance of GraphingCalculator */
export const GraphEngine = new GraphingCalculator();
