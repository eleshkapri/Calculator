/**
 * ============================================================================
 * CalVerse Pro - Core Mathematical Evaluator & Parser (OOP Architecture)
 * File: src/core/math.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Encapsulates expression sanitization, angular mode adjustments, factorial computation,
 * token whitelist validation, and sandbox isolation inside the MathEvaluator OOP class.
 * 
 * DESIGN PRINCIPLES (OOP & SECURITY):
 * 1. Encapsulation: Token whitelists, blacklisted script identifiers, and evaluation
 *    sandboxing are protected within private/class methods and frozen objects.
 * 2. Abstraction: Callers consume high-level evaluate() and sanitize() methods without
 *    needing to manage JS parsing rules or regex complexity.
 * 3. Defensive Security:
 *    - Strict token whitelist and keyword blacklist prevents arbitrary JS injection.
 *    - Sandbox function execution shadows sensitive global scopes (window, document, fetch, etc.).
 *    - Prototype freezing prevents prototype pollution attacks.
 * ============================================================================
 */

/**
 * Object-Oriented Mathematical Evaluation and Security Sanitization Engine.
 */
export class MathEvaluator {
    /**
     * Set of sensitive identifiers strictly forbidden in mathematical formulas.
     * @type {ReadonlyArray<string>}
     */
    static #FORBIDDEN_KEYWORDS = Object.freeze([
        'window', 'document', 'globalthis', 'self', 'top', 'parent', 'frames',
        'location', 'fetch', 'xmlhttprequest', 'localstorage', 'sessionstorage',
        'indexeddb', 'cookie', 'alert', 'prompt', 'confirm', 'eval', 'function',
        'constructor', 'prototype', '__proto__', 'import', 'require', 'process'
    ]);

    /**
     * Arguments used to shadow sensitive browser globals within the execution sandbox.
     * @type {ReadonlyArray<string>}
     */
    static #SANDBOX_ARGUMENTS = Object.freeze([
        'window', 'document', 'globalThis', 'self', 'top', 'parent', 'frames',
        'location', 'fetch', 'XMLHttpRequest', 'localStorage', 'sessionStorage',
        'indexedDB', 'alert', 'prompt', 'confirm', 'process'
    ]);

    /**
     * Validates whether an expression contains only permitted mathematical characters and functions.
     * 
     * @param {string} sanitizedExpr - Expression after normalization.
     * @returns {boolean} True if safe, false if suspicious.
     */
    static validateExpression(sanitizedExpr) {
        if (!sanitizedExpr || typeof sanitizedExpr !== 'string') return false;
        if (sanitizedExpr.length > 2000) return false; // Denial-of-Service payload cap

        const lower = sanitizedExpr.toLowerCase();
        for (const word of this.#FORBIDDEN_KEYWORDS) {
            // Check word boundary or property access
            const regex = new RegExp(`\\b${word}\\b|\\.${word}|\\[['"]?${word}`, 'i');
            if (regex.test(lower)) {
                return false;
            }
        }

        // Strip known safe Math members and numeric tokens
        const stripped = sanitizedExpr
            .replace(/Math\.(sin|cos|tan|asin|acos|atan|log|log10|sqrt|abs|exp|PI|E)/g, '')
            .replace(/Infinity|NaN/g, '')
            .replace(/[0-9.]+/g, '')
            .replace(/[\+\-\*\/\%\(\)\,\s\^]/g, '');

        // If any unexpected alpha or symbol characters remain, reject the expression
        return stripped.trim().length === 0;
    }

    /**
     * Sanitizes and converts a human-readable mathematical formula into executable JS.
     * Maps custom UI symbols (×, ÷, −, π) to operators and standard Math methods,
     * and handles degree/radian conversion for trigonometry.
     * 
     * @param {string} expr - Human-readable mathematical formula (e.g., "sin(30) + 5 × 2").
     * @param {'DEG'|'RAD'} [angleMode='DEG'] - Angle mode for trigonometric computations.
     * @returns {string} Executable JavaScript arithmetic string.
     */
    static sanitize(expr, angleMode = 'DEG') {
        if (!expr) return '0';

        let s = String(expr)
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
     * Guarded with bounds check to prevent CPU exhaustion.
     * 
     * @param {number} n - Non-negative integer (capped at 170 to stay within IEEE-754 range).
     * @returns {number} Factorial result, or NaN if input is negative/non-integer.
     */
    static factorial(n) {
        if (n < 0 || !Number.isInteger(n) || n > 170) return NaN;
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
    static evaluate(expression, angleMode = 'DEG') {
        if (!expression || typeof expression !== 'string') return 'Error';

        try {
            // Pre-process factorial notation (e.g. "5!" becomes "120")
            let exp = expression.replace(/(\d+)!/g, (_, num) => {
                const f = this.factorial(parseInt(num, 10));
                return Number.isFinite(f) ? f.toString() : 'NaN';
            });

            const sanitized = this.sanitize(exp, angleMode);

            // Strict Whitelist Security Validation
            if (!this.validateExpression(sanitized)) {
                return 'Error';
            }

            // Execute within a hardened sandbox where browser environment globals are shadowed
            const sandbox = new Function(
                ...this.#SANDBOX_ARGUMENTS,
                `"use strict"; return (${sanitized});`
            );

            const result = sandbox(...this.#SANDBOX_ARGUMENTS.map(() => undefined));
            if (typeof result !== 'number' || !Number.isFinite(result)) return 'Error';

            // Trim float rounding drift up to 10 decimal places
            return parseFloat(result.toFixed(10)).toString();
        } catch (e) {
            return 'Error';
        }
    }
}

// Freeze class definition against runtime tampering
Object.freeze(MathEvaluator);
Object.freeze(MathEvaluator.prototype);

/**
 * Backward-compatible exports matching existing codebase signatures.
 */
export const sanitizeForEval = (expr, angleMode = 'DEG') => MathEvaluator.sanitize(expr, angleMode);
export const factorial = (n) => MathEvaluator.factorial(n);
export const evaluateMath = (expr, angleMode = 'DEG') => MathEvaluator.evaluate(expr, angleMode);
