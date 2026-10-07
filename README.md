# <div align="center">🧮 CalVerse Pro</div>

<div align="center">

### Next-Generation Universal Multi-Calculator, Financial & Analytical Suite

[![Live Demo](https://img.shields.io/badge/Live%20Demo-calverse--esk.vercel.app-2563eb?style=for-the-badge&logo=vercel&logoColor=white)](https://calverse-esk.vercel.app/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable%20%26%20Offline%20Ready-10b981?style=for-the-badge&logo=pwa&logoColor=white)](https://calverse-esk.vercel.app/)
[![JavaScript](https://img.shields.io/badge/ES6%2B%20Modular-OOP%20Architecture-f59e0b?style=for-the-badge&logo=javascript&logoColor=white)](https://calverse-esk.vercel.app/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0%20(Pure%20Vanilla)-8b5cf6?style=for-the-badge)](https://calverse-esk.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**A blazing-fast, zero-dependency, offline-first Progressive Web Application featuring 12 professional calculator engines.**

[🚀 Launch Live Web App](https://calverse-esk.vercel.app/) • [✨ 12 Calculator Engines](#-12-dedicated-calculator-engines) • [📱 1-Click PWA Install](#-1-click-multi-platform-installation-pwa) • [⌨️ Keyboard Shortcuts](#️-keyboard-shortcuts-reference) • [📂 Architecture](#-project-architecture)

</div>

---

## 🌐 Live Web Application

👉 **[https://calverse-esk.vercel.app/](https://calverse-esk.vercel.app/)**  
📁 **GitHub Repository**: **[https://github.com/eleshkapri/Calculator](https://github.com/eleshkapri/Calculator)**

---

## 🌟 Overview & Highlights

**CalVerse Pro** is an all-in-one computational suite engineered from the ground up using **pure vanilla web standards** (ES6+ JavaScript, CSS3 variables, and semantic HTML5). It delivers desktop-grade computational capability directly in the browser and as an installable native-like app on Android, iOS, Windows, and macOS.

* **Zero External Dependencies**: Pure vanilla implementation — zero framework overhead, instant startup, and tiny bundle size.
* **Modular OOP Architecture**: Built with modern Object-Oriented Programming (encapsulation, inheritance, and facade design pattern).
* **100% Offline-First PWA**: Powered by a Service Worker with network-first caching, ensuring full operational capability without an internet connection.
* **Dual Obsidian Dark & Crisp Light Themes**: Beautiful glassmorphic styling with high-contrast accessibility and seamless theme toggle.
* **Tactile Web Audio Synthesizer**: Low-latency synthesized sound feedback powered by the Web Audio API with zero audio file downloads.
* **Full Hardware Keyboard Support**: Complete keyboard navigation for standard, scientific, and programmer keypads, plus hotkeys like `h` for History.

---

## ✨ 12 Dedicated Calculator Engines

| # | Engine | Key Capabilities |
| :-: | :--- | :--- |
| **1** | **🔢 Standard Calculator** | Everyday arithmetic with live equation retention, expression chaining, parenthesis parsing, percentage, sign toggle, and persistent memory register stack ($MC, MR, M+, M-, MS$). |
| **2** | **🔬 Scientific Calculator** | Trigonometric functions ($\sin, \cos, \tan, \sin^{-1}, \cos^{-1}, \tan^{-1}$) with **DEG/RAD** switching, logarithms ($\ln, \log_{10}$), powers ($x^y, x^2, \sqrt{x}$), factorials ($n!$), and constants ($\pi, e$). |
| **3** | **📈 Graphing Calculator** | Interactive HTML5 2D canvas function plotter ($y = f(x)$), multi-curve color-coded overlays, touch pan and pinch zoom, live coordinate HUD, and 1-click function presets. |
| **4** | **💰 Financial & Currency** | **Loan & EMI Calculator** with interactive visual amortization breakdown, **Compound Interest & SIP** projections, and **Real-Time Live Currency Converter** supporting 20+ world currencies via live rates with offline cache. |
| **5** | **🔄 Unit Converter** | Instant bidirectional conversions across 7 categories: Length, Weight/Mass, Temperature, Area, Speed, Digital Data, and Time with real-time reactive outputs. |
| **6** | **💻 Programmer Calculator** | Multi-radix representation across **HEX, DEC, OCT, and BIN** (with 4-bit nibbles), dynamic word size masking (**8-bit, 16-bit, 32-bit, 64-bit**), and bitwise logic (`AND`, `OR`, `XOR`, `NOT`, `<<`, `>>`). |
| **7** | **⚖️ BMI & Health** | Metric and Imperial health metrics, visual BMI gauge, personalized Healthy Weight Target Range, Basal Metabolic Rate (BMR), and Daily Maintenance Calorie targets. |
| **8** | **📅 Date & Age** | Exact age calculation breakdown (Years, Months, Days), Next Birthday countdown, Date Difference analyzer (days, weeks, elapsed hours), and Add/Subtract Days calculator. |
| **9** | **⏱️ Time Calculator** | Dedicated time unit keypad (`h`, `m`, `s`, `ms`), Work Shift duration calculator with unpaid break deduction, Time arithmetic interval solver, high-precision Stopwatch with laps, and live Unix Epoch converter. |
| **10** | **🧾 Discount & Tip** | Multi-currency discount calculator with sales tax and coupon deductions, live savings breakdown, and Tip/Bill Splitting with shareable summary receipt. |
| **11** | **🧮 Equation & Algebra** | Quadratic Equation solver ($ax^2 + bx + c = 0$) with discriminant analysis and vertex coordinates, $2 \times 2$ Linear System solver using Cramer's Determinants, and Fraction arithmetic with step-by-step reduction. |
| **12** | **📊 Statistics Analyzer** | Interactive statistical visualizer featuring Distribution Bars with IQR highlight, Box & Whisker Plot, and Frequency Histogram, paired with comprehensive metrics ($\bar{x}, \text{Med}, \text{Mode}, \sigma, s, s^2, \Sigma x$). |

---

## 📱 1-Click Multi-Platform Installation (PWA)

CalVerse Pro is configured as a standalone Progressive Web Application. You can install it on any modern operating system without an app store:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CALVERSE PRO - PWA ECOSYSTEM                         │
├────────────────────┬────────────────────┬───────────────────────────────────┤
│     Android        │   iOS (Apple)      │      Desktop (Windows / Mac)      │
│  Tap Chrome menu ⋮ │ Tap Safari Share 📤│ Click Install Icon in address bar │
│  ➔ "Install app"   │➔ "Add to Home"     │ or download standalone launcher   │
└────────────────────┴────────────────────┴───────────────────────────────────┘
```

* **Offline Readiness**: All core scripts, stylesheets, and logic are pre-cached by `sw.js` for instant, offline launch.
* **Auto-Sync**: Background network listeners update exchange rates and refresh caches whenever connectivity returns.
* **Storage Protection**: Preferences, audio toggles, and calculation histories persist reliably in `localStorage`.

---

## ⌨️ Hardware Keyboard Shortcuts Reference

CalVerse Pro features seamless desktop and laptop hardware keyboard mapping:

| Key | Calculator Action | Engine |
| :--- | :--- | :--- |
| `0` - `9` | Input Numeric Digits | Standard & Scientific |
| `.` or `,` | Decimal Point | Standard & Scientific |
| `+`, `-`, `*`, `/` | Addition, Subtraction, Multiplication, Division | Standard & Scientific |
| `(` and `)` | Open / Close Parentheses | Standard & Scientific |
| `%` | Percentage | Standard & Scientific |
| `^` | Exponent / Power ($x^y$) | Scientific |
| `Enter` or `=` | Calculate Result / Plot Graph / Solve | All Keypads |
| `Backspace` | Delete last character | All Keypads |
| `Escape` or `Delete` | Clear All (`C` / `AC`) | All Keypads |
| `c` or `C` | Clear All (`C`) | Standard & Scientific |
| `h` or `H` | **Toggle Calculation History Drawer** | Global Hotkey |
| `Escape` | Close History Drawer or Active Modal | Global Hotkey |
| `0` - `9`, `A` - `F` | Hexadecimal & Decimal Digits | Programmer |

---

## 📂 Project Architecture

The codebase follows a modular Object-Oriented architecture, separating core state management, feature engines, UI controllers, and design systems:

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
| **Dependencies** | **0 External Dependencies** (No npm build step, zero third-party script bloat) |

---

## 🚀 Local Development Setup

To run CalVerse Pro locally on your machine, clone the repository and serve it using any lightweight local web server:

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

Navigate to `http://localhost:3000` (or the port specified by your server) in your browser.

---

## 👨‍💻 Author

**Elesh Kapri**
* GitHub: [@eleshkapri](https://github.com/eleshkapri)
* Live Project: [CalVerse](https://calverse-esk.vercel.app/)

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
