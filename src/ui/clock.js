/**
 * ============================================================================
 * CalVerse Pro - Sidebar Live Clock & Calendar Controller
 * File: src/ui/clock.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Renders real-time digital clock time (HH:MM:SS AM/PM) and calendar date
 * (e.g. "Wed, Oct 7, 2026") inside the bottom desktop sidebar and mobile navigation drawer.
 * Automatically updates every 1,000 milliseconds using a background interval timer.
 * 
 * FUNCTIONS PRESENT IN THIS FILE:
 * 1. updateSidebarClock():
 *    - Updates #sidebarLiveClock and #sidebarLiveDate with current time and date immediately.
 * 2. initSidebarClock():
 *    - Performs immediate clock render and schedules the 1-second recurring interval tick.
 * ============================================================================
 */

let clockTimer = null;

/**
 * Updates the sidebar real-time clock and calendar date immediately.
 */
export function updateSidebarClock() {
    const timeEl = document.getElementById('sidebarLiveClock');
    const dateEl = document.getElementById('sidebarLiveDate');
    if (!timeEl && !dateEl) return;

    const now = new Date();
    if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    if (dateEl) {
        dateEl.textContent = now.toLocaleDateString([], {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}

/**
 * Initializes and starts the sidebar real-time clock and calendar date ticker.
 */
export function initSidebarClock() {
    updateSidebarClock();
    if (!clockTimer) {
        clockTimer = setInterval(updateSidebarClock, 1000);
    }
}
