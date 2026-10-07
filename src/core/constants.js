/**
 * CalVerse Pro - Core Constants & Reference Data
 * Centralized immutable configuration used across multiple calculators
 */

export const CURRENCY_CONFIG = {
    INR: { symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
    USD: { symbol: '$', locale: 'en-US', name: 'US Dollar' },
    EUR: { symbol: '€', locale: 'de-DE', name: 'Euro' },
    GBP: { symbol: '£', locale: 'en-GB', name: 'British Pound' },
    JPY: { symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen' },
    CAD: { symbol: 'CA$', locale: 'en-CA', name: 'Canadian Dollar' },
    AUD: { symbol: 'AU$', locale: 'en-AU', name: 'Australian Dollar' },
    AED: { symbol: 'AED ', locale: 'ar-AE', name: 'UAE Dirham' },
    CNY: { symbol: '¥', locale: 'zh-CN', name: 'Chinese Yuan' }
};

export const TITLES = {
    standard: { title: 'Standard Calculator', subtitle: 'Fast, precise everyday arithmetic' },
    scientific: { title: 'Scientific Calculator', subtitle: 'Advanced functions, trigonometry & algebra' },
    graphing: { title: 'Graphing Calculator', subtitle: 'Interactive 2D function visualizer & analyzer' },
    financial: { title: 'Financial Calculator', subtitle: 'Loan EMI, compound interest & investment growth' },
    converter: { title: 'Unit Converter', subtitle: 'Instant conversions across multiple categories' },
    programmer: { title: 'Programmer Calculator', subtitle: 'HEX, DEC, OCT, BIN & bitwise operations' },
    health: { title: 'BMI & Health Calculator', subtitle: 'Body mass index, healthy weight & metabolic rate' },
    date: { title: 'Date & Age Calculator', subtitle: 'Exact duration between dates and age breakdown' },
    time: { title: 'Time Calculator', subtitle: 'Work duration, time math, stopwatch & unix timestamps' },
    discount: { title: 'Discount & Tip Calculator', subtitle: 'Shopping savings, sales tax & bill splitting' },
    equation: { title: 'Equation & Algebra Solver', subtitle: 'Quadratic roots, 2x2 linear systems & fractions' },
    statistics: { title: 'Statistics & Data Analyzer', subtitle: 'Mean, median, variance, std dev & box plots' }
};

export const CONVERTER_UNITS = {
    length: {
        Meter: 1,
        Kilometer: 1000,
        Centimeter: 0.01,
        Millimeter: 0.001,
        Mile: 1609.344,
        Yard: 0.9144,
        Foot: 0.3048,
        Inch: 0.0254
    },
    mass: {
        Kilogram: 1,
        Gram: 0.001,
        Milligram: 0.000001,
        MetricTon: 1000,
        Pound: 0.45359237,
        Ounce: 0.028349523
    },
    temperature: {
        Celsius: 'C',
        Fahrenheit: 'F',
        Kelvin: 'K'
    },
    area: {
        'Square Meter': 1,
        'Square Kilometer': 1000000,
        'Square Foot': 0.092903,
        'Acre': 4046.86,
        'Hectare': 10000
    },
    speed: {
        'Meter/Second': 1,
        'Kilometer/Hour': 0.277778,
        'Miles/Hour': 0.44704,
        'Knot': 0.514444
    },
    digital: {
        Byte: 1,
        Kilobyte: 1024,
        Megabyte: 1048576,
        Gigabyte: 1073741824,
        Terabyte: 1099511627776
    },
    time: {
        Second: 1,
        Minute: 60,
        Hour: 3600,
        Day: 86400,
        Week: 604800,
        Month: 2629746,
        Year: 31556952
    }
};
