/**
 * PWA Client Plugin
 *
 * Initializes PWA functionality:
 * - Service Worker registration and updates
 * - Offline state detection
 * - Installation state tracking
 * - Update notifications
 */

import { defineNuxtPlugin } from "#app";
import { reactive } from "vue";

export default defineNuxtPlugin((nuxtApp) => {
    // Skip on non-client or when sw is not supported
    if (!process.client || !("serviceWorker" in navigator)) {
        console.debug("[PWA Plugin] Service Worker not supported");
        return;
    }

    // Initialize PWA state
    const pwaState = reactive({
        isInstalled: false,
        isOnline: navigator.onLine,
        hasUpdate: false,
        swReady: false,
        swUpdating: false
    });

    // Offline state tracking
    const handleOnline = () => {
        pwaState.isOnline = true;
        console.log("[PWA] Online status: connected");
    };

    const handleOffline = () => {
        pwaState.isOnline = false;
        console.log("[PWA] Online status: disconnected");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check if app is installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
        pwaState.isInstalled = true;
        console.log("[PWA] Running in standalone mode (installed app)");
    }

    // Service Worker registration and lifecycle
    navigator.serviceWorker.register("/sw.js", {
        scope: "/"
    }).then((registration) => {

        pwaState.swReady = true;
        console.log("[PWA] Service Worker registered", registration.scope);

        // Listen for update availability
        registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            console.log("[PWA] Service Worker update found");
            pwaState.swUpdating = true;

            newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    pwaState.hasUpdate = true;
                    console.log("[PWA] Service Worker update ready to activate");

                    // Emit update event for UI notifications
                    // Auto-activate (skipWaiting + clientsClaim strategy)
                    isUpdating = true;
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                }
            });
        });

        // Listen for controller change (SW activation)
        let isUpdating = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (isUpdating) {
                console.log("[PWA] Service Worker activated and controlling page");
                isUpdating = false;
            }
        });
    }).catch((error) => {
        console.error("[PWA] Service Worker registration failed", error);
    });

    // Lifecycle event: installation prompt
    let deferredPrompt: Event | null = null;

    const handleBeforeInstallPrompt = (event: Event) => {
        event.preventDefault();
        deferredPrompt = event;
        console.log("[PWA] Installation prompt deferred");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Provide PWA state and methods to nuxt app
    return {
        provide: {
            pwa: {
                state: pwaState,
                deferredPrompt: () => deferredPrompt,
                isSupported: () => "serviceWorker" in navigator,
                canInstall: () => deferredPrompt !== null,
                getRegistration: () => navigator.serviceWorker.getRegistration()
            }
        }
    };
});
