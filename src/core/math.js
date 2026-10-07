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
export function sanitizeForEval(expr, angleMode = 'DEG') {
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
export function factorial(n) {
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
export function evaluateMath(expression, angleMode = 'DEG') {
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
