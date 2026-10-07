/**
 * CalVerse Pro - Sidebar Live Clock & Calendar
 * Real-time time display with auto-updating second ticks
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
