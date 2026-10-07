# <div align="center"><img src="assets/icons/icon-512.png" alt="CalVerse Pro Logo" width="108" height="108" style="border-radius: 22px; box-shadow: 0 8px 24px rgba(0,0,0,0.25);" /><br><br>🧮 CalVerse Pro</div>

<div align="center">

### Next-Generation Universal Multi-Calculator, Financial & Analytical Suite

[![Live Demo](https://img.shields.io/badge/Live%20Demo-calverse--esk.vercel.app-2563eb?style=for-the-badge&logo=vercel&logoColor=white)](https://calverse-esk.vercel.app/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable%20%26%20Offline%20Ready-10b981?style=for-the-badge&logo=pwa&logoColor=white)](https://calverse-esk.vercel.app/)
[![JavaScript](https://img.shields.io/badge/ES6%2B%20Modular-OOP%20Architecture-f59e0b?style=for-the-badge&logo=javascript&logoColor=white)](https://calverse-esk.vercel.app/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0%20(Pure%20Vanilla)-8b5cf6?style=for-the-badge)](https://calverse-esk.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**An ultra-responsive, zero-dependency, offline-first Progressive Web Application featuring 12 professional calculation and graphing engines.**

[🚀 Launch Live Web App](https://calverse-esk.vercel.app/) • [✨ 12 Engines Breakdown](#-12-dedicated-calculator-engines) • [📱 PWA Installation](#-1-click-multi-platform-installation-pwa) • [⌨️ Keyboard Shortcuts](#️-hardware-keyboard-shortcuts-reference) • [🛡️ Security & OOP](#-core-engineering--security-principles) • [📂 Architecture](#-project-architecture)

</div>

---

## 📑 Table of Contents

- [🌐 Live Web Application](#-live-web-application)
- [🌟 Overview & Key Highlights](#-overview--key-highlights)
- [✨ 12 Dedicated Calculator Engines](#-12-dedicated-calculator-engines)
  - [1. Standard Calculator](#1--standard-calculator)
  - [2. Scientific Calculator](#2--scientific-calculator)
  - [3. Graphing Calculator](#3--graphing-calculator)
  - [4. Financial & Currency Suite](#4--financial--currency-suite)
  - [5. Unit Converter](#5--unit-converter)
  - [6. Programmer Calculator](#6--programmer-calculator)
  - [7. BMI & Health Calculator](#7-️-bmi--health-calculator)
  - [8. Date & Age Calculator](#8--date--age-calculator)
  - [9. Time Calculator](#9-️-time-calculator)
  - [10. Discount & Tip Calculator](#10--discount--tip-calculator)
  - [11. Equation & Algebra Solver](#11--equation--algebra-solver)
  - [12. Statistics & Visual Data Analyzer](#12--statistics--visual-data-analyzer)
- [📱 1-Click Multi-Platform Installation (PWA)](#-1-click-multi-platform-installation-pwa)
- [⌨️ Hardware Keyboard Shortcuts Reference](#️-hardware-keyboard-shortcuts-reference)
- [🛡️ Core Engineering & Security Principles](#-core-engineering--security-principles)
- [📂 Project Architecture](#-project-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [🌐 Browser & Platform Compatibility](#-browser--platform-compatibility)
- [🚀 Local Development Setup](#-local-development-setup)
- [🤝 Contributing](#-contributing)
- [👨‍💻 Author & License](#-author--license)

---

## 🌐 Live Web Application

* 🚀 **Production Deployment**: **[https://calverse-esk.vercel.app/](https://calverse-esk.vercel.app/)**
* 📁 **Source Code Repository**: **[https://github.com/eleshkapri/Calculator](https://github.com/eleshkapri/Calculator)**

---

## 🌟 Overview & Key Highlights

**CalVerse Pro** is an all-in-one computational suite engineered using **pure vanilla web standards** (ES6+ JavaScript, CSS3 custom properties, and semantic HTML5). It delivers desktop-grade computational capability directly in any web browser and operates as an installable standalone application on Android, iOS, Windows, and macOS.

* ⚡ **Zero External Dependencies**: Zero npm dependencies, zero framework runtime overhead, instant initialization, and tiny footprint.
* 🧩 **Modular OOP Architecture**: Built with modern Object-Oriented design patterns (Inheritance, Encapsulation, Polymorphism, and Singleton State Management).
* 📴 **100% Offline-First PWA**: Powered by an intelligent Service Worker (`sw.js`) with pre-caching and background auto-sync, functioning seamlessly without an internet connection.
* 🌓 **Dual Obsidian Dark & Crisp Light Themes**: Custom CSS-variable design system featuring smooth transitions and automatic system-preference detection.
* 🔊 **Procedural Web Audio Synthesizer**: Low-latency, tactile auditory click feedback synthesized via the browser's Web Audio API with zero audio file downloads.
* ⌨️ **Universal Hardware Keyboard Routing**: Complete desktop/laptop hotkey navigation for numeric entries, operators, and global history drawer toggling.

---

## ✨ 12 Dedicated Calculator Engines

### 1. 🔢 Standard Calculator
* **Live Equation Retention**: Displays the full expression line with equals (e.g. `888 + 1 =`) while the computed output (`889`) remains displayed in the accumulator.
* **Continuous Operation Chaining**: Chain mathematical operations seamlessly using previous computed results.
* **Parenthesis & Precedence**: Full bracket grouping `(...)`, percentage `%`, sign toggle `±`, and decimal management.
* **Persistent Memory Register**: Full stack operations ($MC, MR, M+, M-, MS$) with visual status indicators.
* **Calculation History Drawer**: Slides out calculation history with click-to-recall and 1-tap clipboard copy.

### 2. 🔬 Scientific Calculator
* **Trigonometry**: Sine, Cosine, Tangent, and their inverse functions ($\sin, \cos, \tan, \sin^{-1}, \cos^{-1}, \tan^{-1}$) with **DEG / RAD** mode toggle.
* **Logarithms & Powers**: Natural log ($\ln$), base-10 log ($\log_{10}$), exponentiation ($x^y$), square ($x^2$), square root ($\sqrt{x}$), reciprocal ($1/x$), and absolute value ($|x|$).
* **Combinatorics**: Integer factorial computation ($n!$).
* **Fundamental Constants**: 1-click access to $\pi$ and Euler's number $e$.

### 3. 📈 Graphing Calculator
* **HTML5 2D Canvas Engine**: Hardware-accelerated dynamic function plotter ($y = f(x)$).
* **Multi-Curve Overlay**: Render and compare multiple mathematical functions simultaneously with contrasting color coding.
* **Interactive Navigation**: Drag-to-pan viewport navigation, touch gesture support on mobile, and zoom controls ($1.25\times / 0.8\times$).
* **Live Coordinate HUD**: Real-time crosshair coordinate tracking $(x, y)$ under cursor or touch pointer.
* **Quick Presets**: *Sine & Cosine, Parabola & Line, Cubic Curve, Hyperbola, V-Curves, Gaussian Bell*.

### 4. 💰 Financial & Currency Suite
* **Loan & EMI Calculator**: Monthly installments, total payable amount, total interest, and a color-coded visual amortization progress bar.
* **Compound Interest & SIP**: Projections for initial lump sums and recurring monthly investments across multiple compounding frequencies (Daily, Monthly, Quarterly, Annually).
* **Real-Time Live Currency Converter**:
  * Live exchange rates via Open Exchange Rates API with automatic offline cache fallback.
  * Bidirectional conversion across 20+ major global currencies (`USD`, `INR`, `EUR`, `GBP`, `JPY`, `CAD`, `AUD`, `AED`, `CNY`, etc.).
  * 1-Click **⇄ Swap** and quick-access cards for popular international currency pairs.
* **Universal Currency Selector**: Configure your global currency preference (`₹ INR`, `$ USD`, `€ EUR`, `£ GBP`, `¥ JPY`, `CA$ CAD`, `AU$ AUD`, `AED`, `¥ CNY`).

### 5. 🔄 Unit Converter
Instant, bidirectional conversion across 7 measurement categories:
* 📏 **Length**: Meters, Kilometers, Centimeters, Millimeters, Miles, Yards, Feet, Inches, Nautical Miles.
* ⚖️ **Weight / Mass**: Kilograms, Grams, Milligrams, Pounds, Ounces, Metric Tons.
* 🌡️ **Temperature**: Celsius ($^\circ\text{C}$), Fahrenheit ($^\circ\text{F}$), Kelvin ($\text{K}$).
* 📐 **Area**: Square Meters, Square Kilometers, Square Feet, Square Miles, Acres, Hectares.
* ⚡ **Speed**: Meters per second (m/s), Kilometers per hour (km/h), Miles per hour (mph), Knots.
* 💾 **Digital Storage**: Bytes, KB, MB, GB, TB.
* ⏱️ **Time**: Seconds, Minutes, Hours, Days, Weeks.

### 6. 💻 Programmer Calculator
* **Multi-Radix Synchronous Representation**: Simultaneous real-time conversion across:
  * **HEX** (Hexadecimal)
  * **DEC** (Decimal)
  * **OCT** (Octal)
  * **BIN** (Binary formatted with 4-bit nibbles)
* **Word Size Masking**: Dynamic bit register widths: **8-bit (Byte)**, **16-bit (Word)**, **32-bit (DWord)**, **64-bit (QWord)**.
* **Bitwise Logic**: `AND`, `OR`, `XOR`, `NOT`, Left Bit Shift (`<<`), and Right Bit Shift (`>>`).

### 7. ⚖️ BMI & Health Calculator
* **Dual Measurement Standards**: Metric ($\text{cm} / \text{kg}$) and Imperial ($\text{ft} / \text{in} / \text{lbs}$).
* **Visual Gauge**: Interactive BMI status needle (*Underweight, Normal Weight, Overweight, Obese*).
* **Health Metrics**: Personalized Healthy Weight Target Range, Basal Metabolic Rate (BMR), and Daily Maintenance Caloric recommendations.

### 8. 📅 Date & Age Calculator
* **Exact Age Breakdown**: Age in exact Years, Months, and Days, paired with an active Next Birthday countdown.
* **Date Difference**: Absolute count of calendar days, work weeks, total hours, and elapsed time between two dates.
* **Date Offsetting**: Add or subtract specific day offsets to determine future or past calendar dates.

### 9. ⏱️ Time Calculator
* **Dedicated Time Unit Keypad**: Fast entry of hours, minutes, seconds, and milliseconds (`10h 30m 45s`).
* **Work Shift Duration**: Calculates exact shift working hours minus unpaid break/lunch times.
* **Time Interval Arithmetic**: Add and subtract multi-part time durations.
* **High-Precision Stopwatch**: Millisecond stopwatch with lap recording.
* **Unix Epoch Converter**: Real-time ticking Unix timestamp converter (Epoch $\leftrightarrow$ Human Date).

### 10. 🧾 Discount & Tip Calculator
* **Discount & Sales Tax**: Compute final prices from original amounts, discount percentages, extra coupons, and regional sales tax.
* **Tip & Bill Splitting**: Interactive tip percentage chips, party size steppers, individual per-person shares, and 1-click shareable text receipts.

### 11. 🧮 Equation & Algebra Solver
* **Quadratic Solver**: Solves roots for $ax^2 + bx + c = 0$ (real and complex), discriminant $\Delta = b^2 - 4ac$, and parabola vertex coordinates $(h, k)$ with step-by-step breakdown.
* **$2 \times 2$ Linear System Solver**: Solves simultaneous linear equations ($a_1 x + b_1 y = c_1$, $a_2 x + b_2 y = c_2$) using Cramer's Determinant method.
* **Fraction Arithmetic**: Full fraction arithmetic with greatest common divisor reduction, improper fractions, mixed numbers, and decimal equivalencies.

### 12. 📊 Statistics & Visual Data Analyzer
* **Interactive Canvas Visualizer**:
  * 📊 **Sorted Distribution Bar Chart**: Value labels, trendline, and highlighted Interquartile Range (IQR).
  * 📦 **Box & Whisker Plot**: 5-number summary ($MIN, Q_1, MEDIAN, Q_3, MAX$) with diamond mean marker.
  * 📈 **Frequency Histogram**: Dynamic class intervals and frequency counts.
* **Comprehensive Statistical Metrics**: Mean ($\bar{x}$), Median, Mode, Sample and Population Standard Deviation ($\sigma, s$), Variance ($s^2$), Count ($N$), Sum ($\Sigma x$), Range, and Quartiles ($Q_1, Q_3, \text{IQR}$).

---

## 📱 1-Click Multi-Platform Installation (PWA)

CalVerse Pro is configured as a standalone Progressive Web Application:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CALVERSE PRO - PWA ECOSYSTEM                         │
├────────────────────┬────────────────────┬───────────────────────────────────┤
│     Android        │   iOS (Apple)      │      Desktop (Windows / Mac)      │
│  Tap Chrome menu ⋮ │ Tap Safari Share 📤│ Click Install Icon in address bar │
│  ➔ "Install app"   │➔ "Add to Home"     │ or click standalone launcher      │
└────────────────────┴────────────────────┴───────────────────────────────────┘
```

* **Instant Offline Boot**: All application assets are pre-cached by `sw.js` for zero-connectivity operation.
* **Background Sync**: Silently fetches fresh currency rates and updates caches upon internet reconnection.
* **Persistent Local State**: Theme preferences, audio toggles, and calculation logs are persisted in `localStorage`.

---

## ⌨️ Hardware Keyboard Shortcuts Reference

CalVerse Pro includes responsive hardware keyboard routing:

| Key | Action | Supported Modes |
| :--- | :--- | :--- |
| `0` - `9` | Input Digits | Standard & Scientific |
| `.` or `,` | Decimal Separator | Standard & Scientific |
| `+`, `-`, `*`, `/` | Arithmetic Operators ($+, -, \times, \div$) | Standard & Scientific |
| `Enter` or `=` | Calculate Expression / Solve / Plot | All Keypads |
| `Backspace` | Delete last character | All Keypads |
| `Escape` or `Delete` | Clear Active Expression (`C` / `AC`) | All Keypads |
| `c` or `C` | Clear Current Value | Standard & Scientific |
| `(` and `)` | Parentheses Grouping | Standard & Scientific |
| `%` | Percentage Calculation | Standard & Scientific |
| `^` | Exponentiation ($x^y$) | Scientific |
| `h` or `H` | **Toggle Calculation History Drawer** | Global Hotkey |
| `Escape` | Close History Drawer or Active Modal | Global Hotkey |
| `0` - `9`, `A` - `F` | Hexadecimal & Decimal Digits | Programmer |

---

## 🛡️ Core Engineering & Security Principles

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CALVERSE PRO OOP ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  [UI Layer]         navigation.js │ keyboard.js │ theme.js │ pwa.js         │
│                           │               │          │         │            │
│  [Facade API]       window.CalVerse (CalVerseFacade - Frozen Global API)    │
│                           │                                                 │
│  [Feature Engines]  StandardCalculator  ─── inherits ───► BaseCalculator    │
│                     ScientificCalculator ─── inherits ───► StandardCalc     │
│                     GraphingEngine, FinancialEngine, ProgrammerEngine...    │
│                           │                                                 │
│  [Core Services]    StateManager (Singleton) │ MathParser │ SoundFx         │
│                     StorageEngine (XSS Safe) │ DOMUtilities                │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Object-Oriented Programming (OOP)**:
   * **Inheritance**: `ScientificCalculator` inherits core arithmetic and memory registers from `StandardCalculator`, which in turn inherits from `BaseCalculator`.
   * **Encapsulation**: State buffers (`std`, `sci`, `prog`, `health`) are strictly encapsulated inside the `StateManager` singleton class.
   * **Polymorphism**: Unified lifecycle hooks (`mount()`, `updateDisplay()`, `playFeedback()`) across all engines.
   * **Facade Pattern**: All internal engines are aggregated into a frozen `CalVerse` namespace attached to `window.CalVerse`, preventing prototype tampering.

2. **Security Hardening**:
   * **XSS Immunization**: All dynamic HTML insertions (such as calculation history items and formulas) are sanitized through a strict `escapeHtml()` utility.
   * **Zero `eval()` Policy**: Mathematical evaluation uses a custom recursive tokenizer and operator-precedence parser rather than dangerous JavaScript `eval()` or `Function()` constructs.

3. **Performance Optimization**:
   * **60 FPS Hardware Acceleration**: Slide-out drawers and modals utilize CSS `transform: translateX()` and `will-change` hints for smooth GPU rendering.
   * **Event Debouncing**: Drawer toggles and modal triggers include debounce guards to eliminate double-firing from rapid taps or mixed inline/script listeners.

---

## 📂 Project Architecture

```
Calculator/
├── assets/
│   ├── css/
│   │   ├── core/
│   │   │   ├── reset.css              # Cross-browser CSS baseline normalization
│   │   │   └── variables.css          # Design system tokens (Dark/Light palettes, spacing)
│   │   ├── features/                  # 11 Modular Feature Stylesheets
│   │   │   ├── converter.css          # Unit converter grid & card styling
│   │   │   ├── date.css               # Date picker & countdown card layouts
│   │   │   ├── discount.css           # Discount summary & receipt card styles
│   │   │   ├── equations.css          # Math equation rendering & step-by-step boxes
│   │   │   ├── financial.css          # Loan amortization, SIP & currency converter UI
│   │   │   ├── graphing.css           # 2D Canvas graphing viewport & control HUD
│   │   │   ├── health.css             # BMI gauge & calorie recommendation cards
│   │   │   ├── programmer.css         # Programmer bit-word grids & radix displays
│   │   │   ├── standard.css           # Arithmetic keypad & memory indicator styling
│   │   │   ├── statistics.css         # Data visualizer charts & metric summary chips
│   │   │   └── time.css               # Time unit keypad, shift tracker & stopwatch
│   │   ├── ui/                        # 7 Application Shell Stylesheets
│   │   │   ├── display.css            # Result screens, expression lines & cursors
│   │   │   ├── footer.css             # Mobile utility bar & bottom controls
│   │   │   ├── header.css             # Top app bar, live titles & action buttons
│   │   │   ├── keypad.css             # Universal button grid & tactile press states
│   │   │   ├── layout.css             # Fluid responsive shell & viewport grid
│   │   │   ├── modals.css             # History slide drawer, install sheet & toasts
│   │   │   └── sidebar.css            # Navigation drawer, clock & constant chips
│   │   ├── responsive.css             # Adaptive breakpoint rules for all devices
│   │   └── style.css                  # Master CSS orchestrator (@import bundle)
│   └── icons/
│       ├── favicon.svg                # Scalable vector brand emblem
│       ├── icon-192.png               # 192x192 PWA launcher icon
│       └── icon-512.png               # 512x512 high-resolution PWA launcher icon
├── src/
│   ├── core/                          # Foundation Services & State Singleton
│   │   ├── constants.js               # Application constants, currencies & mode titles
│   │   ├── dom.js                     # Safe DOM manipulation & XSS-hardened utilities
│   │   ├── format.js                  # Internationalized number formatting & rounding
│   │   ├── math.js                    # Math evaluator, token parser & trig engines
│   │   ├── sound.js                   # Web Audio API procedural sound synthesizer
│   │   ├── state.js                   # Centralized StateManager Singleton
│   │   └── storage.js                 # Web Storage persistence & history serialization
│   ├── features/                      # 13 Object-Oriented Feature Engines
│   │   ├── base.js                    # BaseCalculator abstract parent class
│   │   ├── standard.js                # Standard arithmetic & history manager
│   │   ├── scientific.js              # Scientific, trigonometric & power operations
│   │   ├── graphing.js                # HTML5 2D Canvas function plotter
│   │   ├── financial.js               # Loan EMI, SIP & live exchange rate converter
│   │   ├── converter.js               # 7-category reactive unit conversion engine
│   │   ├── programmer.js              # Multi-radix & bitwise logical manipulator
│   │   ├── health.js                  # BMI gauge, BMR & calorie computation
│   │   ├── date.js                    # Date differential & exact age solver
│   │   ├── time.js                    # Time arithmetic, shift calculator & stopwatch
│   │   ├── discount.js                # Discount, sales tax & bill splitting engine
│   │   ├── equations.js               # Quadratic, 2x2 linear & fraction algebra solver
│   │   └── statistics.js              # Multi-mode statistical analyzer & chart renderer
│   ├── ui/                            # User Interface Controllers
│   │   ├── clock.js                   # Live sidebar digital clock & calendar ticker
│   │   ├── keyboard.js                # Global hardware keyboard shortcut router
│   │   ├── navigation.js              # App shell router, drawer toggles & view swapper
│   │   ├── pwa.js                     # PWA install prompt & standalone detection
│   │   └── theme.js                   # Dark/Light theme manager & persistent storage
│   └── main.js                        # Application bootstrapper & global CalVerse facade
├── favicon.ico                        # Multi-resolution native browser favicon
├── index.html                         # High-performance semantic application shell
├── manifest.json                      # W3C Web App Manifest for mobile & desktop
├── sw.js                              # Offline-first Service Worker with auto-sync
├── LICENSE                            # MIT Open Source License
└── README.md                          # Comprehensive project documentation
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Language & Architecture** | Pure Vanilla JavaScript (ES6+ Modules, Object-Oriented Programming, Facade Pattern) |
| **Styling & Theming** | Semantic Vanilla CSS3, CSS Custom Properties (Variables), Fluid CSS Grid & Flexbox |
| **Web Standards & APIs** | HTML5 Canvas API, Web Audio API, Service Worker API, Cache Storage API, Web Storage (`localStorage`) |
| **Network & Data** | Open Exchange Rates API (with offline cache fallback) |
| **PWA & Native Integration** | W3C Web App Manifest (`manifest.json`), WebAPK standalone execution |
| **Dependencies** | **0 External Dependencies** (Zero third-party runtime scripts, zero build steps) |

---

## 🌐 Browser & Platform Compatibility

| Platform / Browser | Support Status | Native Installable (PWA) | Offline Mode |
| :--- | :---: | :---: | :---: |
| **Google Chrome** (Desktop & Android) | ✅ Supported | ✅ Yes (WebAPK) | ✅ Yes |
| **Microsoft Edge** (Windows & Mac) | ✅ Supported | ✅ Yes (Desktop App) | ✅ Yes |
| **Apple Safari** (iOS & macOS) | ✅ Supported | ✅ Yes (Add to Home) | ✅ Yes |
| **Mozilla Firefox** (Desktop & Android) | ✅ Supported | ✅ Yes | ✅ Yes |
| **Brave, Opera, Vivaldi** | ✅ Supported | ✅ Yes | ✅ Yes |

---

## 🚀 Local Development Setup

To test and run CalVerse Pro locally on your machine, clone the repository and serve it using any lightweight static web server:

```bash
# 1. Clone the repository
git clone https://github.com/eleshkapri/Calculator.git

# 2. Enter the project directory
cd Calculator

# 3. Start a local server (choose any preferred method)
# Option A: Node.js (npx)
npx serve .

# Option B: Python 3
python -m http.server 3000

# Option C: VS Code
# Open with Live Server extension
```

Open `http://localhost:3000` (or your server's assigned port) in your web browser.

---

## 🤝 Contributing

Contributions, feedback, and suggestions are welcome!
1. **Fork** the repository: [https://github.com/eleshkapri/Calculator](https://github.com/eleshkapri/Calculator)
2. **Create** your feature branch: `git checkout -b feature/NewFeature`
3. **Commit** your modifications: `git commit -m 'feat: Add NewFeature'`
4. **Push** to your branch: `git push origin feature/NewFeature`
5. **Open** a Pull Request on GitHub.

---

## 👨‍💻 Author & License

**Elesh Kapri**
* GitHub: [@eleshkapri](https://github.com/eleshkapri)
* Live Web App: [CalVerse](https://calverse-esk.vercel.app/)

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete details.
