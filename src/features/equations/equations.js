/**
 * CalVerse Pro - Equation & Algebra Feature
 * Quadratic roots & vertex solver, 2x2 linear systems & rational fraction reducer
 */

export const EquationEngine = {
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
