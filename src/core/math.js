/**
 * CalVerse Pro - Core Mathematical Evaluator
 * High-precision safe math parser, factorial, and trigonometric functions
 */

export function sanitizeForEval(expr, angleMode = 'DEG') {
    let s = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/π/g, `${Math.PI}`)
        .replace(/\be\b/g, `${Math.E}`)
        .replace(/\^/g, '**');

    // Functions replacement with angle mode conversion
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

export function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

export function evaluateMath(expression, angleMode = 'DEG') {
    try {
        // Factorial handling: e.g. 5!
        let exp = expression.replace(/(\d+)!/g, (_, num) => factorial(parseInt(num, 10)));
        const sanitized = sanitizeForEval(exp, angleMode);
        // Safe evaluation using Function constructor
        const result = Function(`"use strict"; return (${sanitized});`)();
        if (!isFinite(result)) return 'Error';
        return parseFloat(result.toFixed(10)).toString();
    } catch (e) {
        return 'Error';
    }
}
