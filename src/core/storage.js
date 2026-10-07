/**
 * CalVerse Pro - Storage & History Store
 * Safe persistent localStorage interactions with fallback
 */

const HISTORY_KEY = 'omni_calc_history';

export const StorageEngine = {
    getItem(key, defaultVal = null) {
        try {
            const val = localStorage.getItem(key);
            return val !== null ? val : defaultVal;
        } catch (e) {
            return defaultVal;
        }
    },

    setItem(key, val) {
        try {
            localStorage.setItem(key, val);
            return true;
        } catch (e) {
            return false;
        }
    },

    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    },

    loadHistory() {
        try {
            return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        } catch (e) {
            return [];
        }
    },

    saveHistory(history) {
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (e) {}
    },

    clearHistory() {
        try {
            localStorage.removeItem(HISTORY_KEY);
        } catch (e) {}
    }
};
