/**
 * ============================================================================
 * CalVerse Pro - Sidebar Live Clock & Calendar Controller
 * File: src/ui/clock.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * Renders real-time digital clock time (HH:MM:SS AM/PM) and calendar date
 * (e.g. "Wed, Oct 7") inside the bottom desktop sidebar and mobile navigation drawer.
 * Automatically updates every 1,000 milliseconds using a background interval timer.
 * 
 * FUNCTIONS PRESENT IN THIS FILE:
 * 1. initSidebarClock():
 *    - Finds clock DOM elements (#sidebarLiveClock and #sidebarLiveDate), performs
 *      immediate render, and schedules a 1-second recurring interval tick.
 * ============================================================================
 */

/**
 * Initializes and starts the sidebar real-time clock and calendar date ticker.
 */
export function initSidebarClock() {
    const timeEl = document.getElementById('sidebarLiveClock');
    const dateEl = document.getElementById('sidebarLiveDate');
    if (!timeEl || !dateEl) return;

    const update = () => {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        dateEl.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    };
    update();
    setInterval(update, 1000);
}
