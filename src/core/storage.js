/**
 * ============================================================================
 * CalVerse Pro - Persistent Storage & Calculation History Store
 * File: src/core/storage.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Wraps browser localStorage access in robust try/catch blocks to prevent
 * DOMExceptions in private browsing modes, disabled storage settings, or
 * quota exceeded conditions. Manages calculation history persistence.
 * 
 * OBJECTS & METHODS PRESENT IN THIS FILE:
 * StorageEngine:
 * - getItem(key, defaultVal): Safely retrieves a stored string value or returns default.
 * - setItem(key, val): Safely persists a string key/value pair.
 * - removeItem(key): Safely removes a stored key.
 * - loadHistory(): Deserializes calculation history array from localStorage.
 * - saveHistory(history): Serializes and saves calculation history array.
 * - clearHistory(): Purges calculation history entries from storage.
 * ============================================================================
 */

/** LocalStorage key for calculation history */
const HISTORY_KEY = 'omni_calc_history';

/**
 * StorageEngine provides fail-safe access to browser localStorage.
 */
export const StorageEngine = {
    /**
     * Safely retrieves a value from localStorage with a fallback default.
     * 
     * @param {string} key - Storage key name.
     * @param {*} [defaultVal=null] - Default fallback returned if key does not exist or errors occur.
     * @returns {string|*} Retrieved string value or fallback.
     */
    getItem(key, defaultVal = null) {
        try {
            const val = localStorage.getItem(key);
            return val !== null ? val : defaultVal;
        } catch (e) {
            return defaultVal;
        }
    },

    /**
     * Safely stores a string value in localStorage.
     * 
     * @param {string} key - Storage key name.
     * @param {string} val - String value to store.
     * @returns {boolean} True on success, false if quota exceeded or disabled.
     */
    setItem(key, val) {
        try {
            localStorage.setItem(key, val);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Safely deletes a key from localStorage.
     * 
     * @param {string} key - Storage key name.
     * @returns {boolean} True on success, false on error.
     */
    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Loads and parses saved calculation history from localStorage.
     * 
     * @returns {Array<Object>} Array of calculation history objects [{expr, res, time}].
     */
    loadHistory() {
        try {
            return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        } catch (e) {
            return [];
        }
    },

    /**
     * Serializes and writes calculation history to localStorage.
     * 
     * @param {Array<Object>} history - Array of calculation history objects to serialize.
     */
    saveHistory(history) {
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
            // Silently swallow quota errors
        }
    },

    /**
     * Deletes all saved calculation history records from localStorage.
     */
    clearHistory() {
        try {
            localStorage.removeItem(HISTORY_KEY);
        } catch (e) {
            // Silently swallow errors
        }
    }
};
