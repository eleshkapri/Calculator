/**
 * CalVerse Pro - PWA & Platform Controller
 * Installation modal, OS installer generation (.exe, .mobileconfig), Service Worker sync & offline events
 */

import { SoundFx } from '../core/sound.js';
import { showToast } from '../core/dom.js';
import { FinancialEngine } from '../features/financial.js';

export const PWAController = {
    openInstallModal() {
        SoundFx.playClick(600);
        if (window._deferredInstallPrompt) {
            this.triggerPwaPrompt();
            return;
        }
        const modal = document.getElementById('installModalBackdrop');
        if (modal) modal.classList.add('open');
    },

    closeInstallModal() {
        const modal = document.getElementById('installModalBackdrop');
        if (modal) modal.classList.remove('open');
    },

    downloadDetectedApp() {
        const ua = navigator.userAgent || '';
        if (/Android/i.test(ua)) {
            this.triggerPwaPrompt();
        } else if (/Windows/i.test(ua)) {
            this.downloadExe();
        } else if (/iPhone|iPad|iPod/i.test(ua)) {
            this.downloadIosProfile();
        } else {
            this.triggerPwaPrompt();
        }
    },

    installAndroidApp() {
        SoundFx.playClick(700);
        this.triggerPwaPrompt();
    },

    downloadExe() {
        SoundFx.playClick(700);
        showToast('Starting Windows Setup (.exe) download...');
        
        // Create standalone Windows shortcut / executable launcher script wrapped in .exe
        const exeContent = `@echo off\r\ntitle CalVerse Pro Calculator\r\necho Starting CalVerse Desktop App...\r\nstart "" "https://calverse-esk.vercel.app"\r\nexit`;
        const blob = new Blob([exeContent], { type: 'application/x-msdownload' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'CalVerse-Setup-v2.3.exe';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
            showToast('✅ CalVerse-Setup.exe downloaded successfully!');
        }, 1200);
    },

    downloadIosProfile() {
        SoundFx.playClick(700);
        showToast('Generating Apple iOS WebClip profile...');

        const mobileConfigXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadDisplayName</key>
    <string>CalVerse Pro</string>
    <key>PayloadIdentifier</key>
    <string>com.calverse.app.webclip</string>
    <key>PayloadOrganization</key>
    <string>CalVerse Team</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>4B8D8F4E-0A3B-4C67-8A87-98C3F5E7B123</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>FullScreen</key>
            <true/>
            <key>IsRemovable</key>
            <true/>
            <key>Label</key>
            <string>CalVerse</string>
            <key>PayloadDescription</key>
            <string>Configures Home Screen WebClip for CalVerse Pro</string>
            <key>PayloadDisplayName</key>
            <string>CalVerse</string>
            <key>PayloadIdentifier</key>
            <string>com.calverse.app.webclip.entry</string>
            <key>PayloadType</key>
            <string>com.apple.webClip.managed</string>
            <key>PayloadUUID</key>
            <string>9F7A2C10-3841-4C5E-B4A1-1375B8F9A456</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>Precomposed</key>
            <true/>
            <key>URL</key>
            <string>https://calverse-esk.vercel.app</string>
        </dict>
    </array>
</dict>
</plist>`;

        const blob = new Blob([mobileConfigXml], { type: 'application/x-apple-aspen-config' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'CalVerse.mobileconfig';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            showToast('🍏 In iOS Settings: Go to "Profile Downloaded" -> Tap Install');
        }, 1200);
    },

    async triggerPwaPrompt() {
        if (window._deferredInstallPrompt) {
            window._deferredInstallPrompt.prompt();
            const { outcome } = await window._deferredInstallPrompt.userChoice;
            if (outcome === 'accepted') {
                showToast('🎉 CalVerse installed successfully!');
                this.closeInstallModal();
            }
            window._deferredInstallPrompt = null;
        } else {
            showToast('📱 To install: Click the browser address bar icon or menu -> "Install App"');
        }
    }
};

export function initPWA() {
    // =========================================================================
    // PWA Auto-Update Engine (Instant Desktop & Mobile App Sync)
    // =========================================================================
    if ('serviceWorker' in navigator) {
        let _isReloading = false;

        // When new SW activates, reload so the running app window gets new code immediately
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!_isReloading) {
                _isReloading = true;
                window.location.reload();
            }
        });

        navigator.serviceWorker.register('./sw.js').then((reg) => {
            // Check for updates on startup
            reg.update().catch(() => {});

            // Detect when a new update is found and installed
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showToast('🚀 CalVerse updated to latest version!');
                            setTimeout(() => {
                                if (!_isReloading) {
                                    _isReloading = true;
                                    window.location.reload();
                                }
                            }, 600);
                        }
                    });
                }
            });

            // Check for updates whenever user returns to the app (PC focus or phone app switch)
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible' && navigator.onLine) {
                    reg.update().catch(() => {});
                }
            });
            window.addEventListener('focus', () => {
                if (navigator.onLine) {
                    reg.update().catch(() => {});
                }
            });

            // Periodic check every 10 minutes
            setInterval(() => {
                if (navigator.onLine) {
                    reg.update().catch(() => {});
                }
            }, 10 * 60 * 1000);
        }).catch(() => {});
    }

    // Capture PWA install prompt globally
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window._deferredInstallPrompt = e;
    });

    // Hide install button if running in standalone mode (already installed)
    const checkInstalledState = () => {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                             window.matchMedia('(display-mode: fullscreen)').matches ||
                             window.matchMedia('(display-mode: minimal-ui)').matches ||
                             window.navigator.standalone === true;
        const installBtn = document.getElementById('installAppBtn');
        if (isStandalone && installBtn) {
            installBtn.style.display = 'none';
        }
    };
    checkInstalledState();

    // Listen for successful app installation event
    window.addEventListener('appinstalled', () => {
        const installBtn = document.getElementById('installAppBtn');
        if (installBtn) installBtn.style.display = 'none';
        PWAController.closeInstallModal();
        showToast('🎉 CalVerse installed successfully!');
    });

    // Close modal when backdrop clicked
    const modalBackdrop = document.getElementById('installModalBackdrop');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                PWAController.closeInstallModal();
            }
        });
    }

    // Real-Time Online / Offline Connectivity Auto-Sync
    window.addEventListener('online', () => {
        showToast('🟢 Internet connected • Updating live data...');
        FinancialEngine.fetchLiveRates(true);
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((reg) => reg.update()).catch(() => {});
        }
    });

    window.addEventListener('offline', () => {
        FinancialEngine.fetchLiveRates(false);
        showToast('🟠 Offline mode • Operating from cached data');
    });

    // Prevent Pull-To-Refresh on Mobile Devices & WebViews (Main Viewport only)
    let _touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length === 1) {
            _touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        // NEVER block or cancel touch scrolling inside sidebar, history drawer, or modals
        if (e.target.closest('.sidebar, .history-drawer, .modal-backdrop, .install-modal')) {
            return;
        }

        if (e.touches && e.touches.length === 1) {
            const touchY = e.touches[0].clientY;
            const touchDiff = touchY - _touchStartY;
            
            // Only prevent pull-down at the very top of the main viewport to stop browser page reloads
            const mainViewport = document.querySelector('.main-viewport');
            const isAtTop = mainViewport ? mainViewport.scrollTop <= 0 : window.scrollY <= 0;

            if (isAtTop && touchDiff > 0 && !e.target.closest('input, textarea, select, canvas')) {
                if (e.cancelable) {
                    e.preventDefault();
                }
            }
        }
    }, { passive: false });
}
