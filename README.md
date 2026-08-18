# CalcVerse Pro 🚀 — Universal Multi-Calculator & Financial Suite

[![Live Demo](https://img.shields.io/badge/Live%20Demo-calculator--iota--seven--12.vercel.app-blue?style=for-the-badge&logo=vercel)](https://calculator-iota-seven-12.vercel.app)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-10b981?style=for-the-badge&logo=pwa)](https://calculator-iota-seven-12.vercel.app)
[![Platforms](https://img.shields.io/badge/Platforms-Android%20%7C%20Windows%20%7C%20iOS%20%7C%20Web-purple?style=for-the-badge)](https://calculator-iota-seven-12.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**CalcVerse Pro** is an all-in-one, zero-dependency multi-calculator suite engineered for everyday productivity, scientific research, financial planning, unit conversion, and multi-platform native deployment (Android APK, Windows EXE, Apple iOS, and PWA Web App).

---

## 🌐 Live Web Application
👉 **[https://calculator-iota-seven-12.vercel.app](https://calculator-iota-seven-12.vercel.app)**  
📁 **GitHub Repository**: **[https://github.com/eleshkapri/Calculator](https://github.com/eleshkapri/Calculator)**

---

## 📱 1-Click Multi-Platform Installation (PWA)

CalcVerse can be installed directly onto your device with **1-click**, providing a full-screen standalone app experience with offline support:

| Platform | Installation Method | Experience |
| :--- | :--- | :--- |
| **Android** | In Chrome, tap **⋮** ➔ **"Install app"** or click **"📲 Install App"** | Native WebAPK with app icon in App Drawer & Home Screen |
| **iOS (iPhone/iPad)** | In Safari, tap Share **📤** ➔ **"Add to Home Screen"** | Full-screen standalone web app on iOS Home Screen |
| **Windows / macOS** | In Chrome/Edge, click the install icon in address bar or sidebar | Desktop standalone application launcher |

---

## ✨ 12 Dedicated Calculator Engines

### 1. 🔢 Standard Calculator
- Precise everyday arithmetic with operator precedence ($+$, $-$, $\times$, $\div$).
- Bracket evaluation $(...)$, percentage calculation, and sign toggle ($\pm$).
- Full memory stack ($MC, MR, M+, M-, MS$) with active indicator.
- Ergonomic centered layout on both desktop and mobile viewports.

### 2. 🔬 Scientific Calculator
- Comprehensive trigonometry ($\sin, \cos, \tan, \sin^{-1}, \cos^{-1}, \tan^{-1}$) with **DEG / RAD** modes.
- Logarithms ($\ln, \log_{10}$), powers ($x^y, x^2, \sqrt{x}$), factorials ($n!$), and reciprocals ($1/x$).
- Mathematical constants ($\pi, e$) and 2nd function switcher.
- Compact laptop-optimized key grid.

### 3. 📈 Graphing Calculator
- High-performance HTML5 2D canvas function plotter ($y = f(x)$).
- Multi-curve overlay with distinct color codings (e.g. $y_1 = \sin(x)$, $y_2 = \cos(x)$).
- **Interactive Controls**: Touch pan dragging on mobile, mouse drag-to-pan, zoom in/out ($1.25\times / 0.8\times$), and view reset.
- Live coordinate HUD tracking $(x, y)$ under cursor/touch.
- One-click presets: *Sine & Cosine, Parabola & Line, Cubic Curve, Hyperbola, V-Curves, Gaussian Bell*.

### 4. 💰 Financial & Currency Suite
- **Loan & EMI Calculator**: Monthly installments, total payable, total interest, and color-coded visual amortization progress bar.
- **Compound Interest & SIP**: Projections for initial lump sum + recurring monthly deposits with custom compounding frequencies (Monthly, Quarterly, Annually, Daily).
- **💱 Real-Time Live Currency Converter**:
  - Live exchange rate fetching via **Open Exchange Rates API** with automatic offline caching fallback.
  - Bidirectional real-time conversion across 20+ world currencies (`USD`, `INR`, `EUR`, `GBP`, `JPY`, `CAD`, `AUD`, `AED`, `CNY`, `SGD`, `CHF`, `SAR`, etc.).
  - Instant **⇄ Swap** currencies and live exchange formula display.
  - **Live Popular Pairs Matrix**: 1-click quick-switch cards (`USD/INR`, `EUR/USD`, `GBP/INR`, `USD/AED`, `EUR/INR`, `USD/CAD`, `USD/JPY`, `AED/INR`).
- **Global Currency Selector**: Set preferred calculation currency (`₹ INR`, `$ USD`, `€ EUR`, `£ GBP`, `¥ JPY`, `CA$ CAD`, `AU$ AUD`, `AED`, `¥ CNY`).

### 5. 🔄 Unit Converter
- Real-time instant bidirectional conversions across 7 categories:
  - 📏 **Length**: Meters, Kilometers, Centimeters, Millimeters, Miles, Yards, Feet, Inches, Nautical Miles.
  - ⚖️ **Weight / Mass**: Kilograms, Grams, Milligrams, Pounds, Ounces, Metric Tons.
  - 🌡️ **Temperature**: Celsius ($^\circ\text{C}$), Fahrenheit ($^\circ\text{F}$), Kelvin ($\text{K}$).
  - 📐 **Area**: Sq Meters, Sq Kilometers, Sq Feet, Sq Miles, Acres, Hectares.
  - ⚡ **Speed**: m/s, km/h, mph, Knots.
  - 💾 **Digital Data**: Bytes, KB, MB, GB, TB.
  - ⏱️ **Time**: Seconds, Minutes, Hours, Days, Weeks.

### 6. 💻 Programmer Calculator
- Simultaneous real-time conversion and representation across 4 number bases:
  - **HEX** (Hexadecimal)
  - **DEC** (Decimal)
  - **OCT** (Octal)
  - **BIN** (Binary with 4-bit nibble formatting)
- Dynamic bit word size masking: **8-bit (Byte)**, **16-bit (Word)**, **32-bit (DWord)**, **64-bit (QWord)**.
- Bitwise Logic: `AND`, `OR`, `XOR`, `NOT`, Left Shift (`<<`), Right Shift (`>>`).

### 7. ⚖️ BMI & Health Calculator
- Metric ($\text{cm}/\text{kg}$) and Imperial ($\text{ft}/\text{in}/\text{lbs}$) measurement modes.
- Visual BMI category gauge (*Underweight, Normal, Overweight, Obese*).
- Personalized **Healthy Weight Target Range**, **BMR (Basal Metabolic Rate)**, and **Daily Maintenance Calories**.

### 8. 📅 Date & Age Calculator
- **Date Difference**: Exact count of calendar days, working weeks, total hours, and elapsed time.
- **Exact Age Breakdown**: Exact age in Years, Months, and Days with Next Birthday countdown.
- **Add / Subtract Days**: Calculate future or past target dates with custom day offsets.

### 9. ⏱️ Time Calculator
- **Time Unit Keypad**: Dedicated keypad for entering hours, minutes, seconds, and milliseconds (`10h 30m 45s`).
- **Work Shift Duration**: Calculates exact shift hours minus unpaid lunch/break times.
- **Time Arithmetic**: Add or subtract multiple time intervals.
- **Millisecond Stopwatch**: High-precision stopwatch with real-time lap recording.
- **Unix Epoch Converter**: Live ticking Unix timestamp converter (Epoch $\leftrightarrow$ Human Date).

### 10. 🧾 Discount & Tip Calculator
- **Discount & Sales Tax**: Original price, discount %, extra coupon %, and sales tax with live savings breakdown.
- **Tip & Bill Splitting**: Custom tip percentage chips, number of people stepper, per-person split, and 1-click shareable receipt copy.

### 11. 🧮 Equation & Algebra Solver
- **Quadratic Equations** ($ax^2 + bx + c = 0$): Solves real and complex roots, discriminant $\Delta = b^2 - 4ac$, and parabola vertex $(h, k)$ coordinates.
- **$2\times 2$ Linear System**: Solves simultaneous linear equations ($a_1 x + b_1 y = c_1$, $a_2 x + b_2 y = c_2$) using Cramer's Rule determinants.
- **Fraction Calculator**: Arithmetic with step-by-step reduction, mixed numbers, and decimal conversions.

### 12. 📊 Statistics & Data Analyzer
- Comprehensive statistical metrics: **Mean ($\bar{x}$)**, **Median**, **Mode**, **Sample & Population Standard Deviation ($\sigma, s$)**, **Variance**, **Min/Max**, **Sum**, **Range**, and **Quartiles ($Q_1, Q_3, \text{IQR}$)**.
- Visual data distribution chart rendered on HTML5 canvas with 1-click full summary export.

---

## 🎛️ Sidebar Mini-Widgets

- **Live Digital Clock & Date**: Real-time ticking 12-hour clock with active date and day indicator.
- **Quick Math Constants Pill Box**: 1-click clipboard copy for mathematical constants:
  - $\pi = 3.1415926535$
  - $e = 2.7182818284$
  - $\phi = 1.6180339887$ (Golden Ratio)
  - $\sqrt{2} = 1.4142135623$ (Pythagoras Constant)

---

## 🎨 UI, Aesthetics & Accessibility

- **Dark Obsidian & Crisp Light Themes**: Tailored palettes with smooth CSS variable transitions and saved preferences.
- **Tactile Audio Feedback**: Synthesized clicks via Web Audio API with dedicated `Sound ON / OFF` toggle.
- **Calculation History Drawer**: Complete persistent history storage, click-to-recall, and 1-tap clipboard copying.
- **Responsive Fluid Layout**: Centered desktop & laptop presentations with adaptive mobile swipe carousels and backdrop slide-out menus.

---

## ⌨️ Keyboard Shortcuts Reference

| Key | Action |
| :--- | :--- |
| `0` - `9` | Input Digits |
| `.` | Decimal Point |
| `+`, `-`, `*`, `/` | Add, Subtract, Multiply, Divide |
| `Enter` or `=` | Calculate Result |
| `Backspace` | Delete last character |
| `Escape` | Clear All (`AC`) |
| `(` / `)` | Open / Close Parentheses |
| `%` | Percentage |
| `^` | Power ($x^y$) |

---

## 🛠️ Technology Stack

- **Frontend**: Semantic HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3 (Custom Design System).
- **APIs**: Web Audio API, HTML5 Canvas API, Open Exchange Rates API, Web Storage API (`localStorage`), Service Worker API (PWA Cache-First + Network-First).
- **PWA Capabilities**: Full offline caching via Service Worker (`sw.js`), WebAPK integration, responsive layout for Mobile & Desktop.
- **Zero External Dependencies**: Fast load times, lightweight, and completely self-contained.

---

## 🚀 Local Development Setup

Clone the repository and run locally using any web server:

```bash
# 1. Clone the repository
git clone https://github.com/eleshkapri/Calculator.git

# 2. Navigate to project directory
cd Calculator

# 3. Start local development server
npx serve .
```

Open your browser at `http://localhost:3000`.

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute.
