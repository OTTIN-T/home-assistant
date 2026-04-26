/**
 * Composable: usePwaInstall
 *
 * Gère l'état et la logique d'installation PWA
 */

import { ref, computed, onMounted } from "vue";

type PwaEligibility = "eligible" | "ineligible" | "unsupported";
type PwaInstallStatus = "not_installed" | "prompt_shown" | "installed" | "dismissed";

export interface PwaInstallState {
    eligibility: PwaEligibility;
    installStatus: PwaInstallStatus;
    platform: string;
    browser: string;
    canPrompt: boolean;
    isSupported: boolean;
}

export function usePwaInstall() {
    const state = ref<PwaInstallState>({
        eligibility: "unsupported",
        installStatus: "not_installed",
        platform: "unknown",
        browser: "unknown",
        canPrompt: false,
        isSupported: "serviceWorker" in navigator
    });

    const deferredPrompt = ref<Event | null>(null);

    const isInstalled = computed(
        () =>
            state.value.installStatus === "installed" ||
            window.matchMedia("(display-mode: standalone)").matches
    );

    const isEligible = computed(
        () => state.value.eligibility === "eligible"
    );

    const canShowPrompt = computed(
        () =>
            state.value.isSupported &&
            state.value.eligibility === "eligible" &&
            state.value.installStatus === "prompt_shown" &&
            deferredPrompt.value !== null
    );

    // Detect browser and platform
    const detectEnvironment = () => {
        const ua = navigator.userAgent;

        // Browser detection
        if (/Edge/.test(ua)) {
            state.value.browser = "edge";
        } else if (/Chrome/.test(ua)) {
            state.value.browser = "chrome";
        } else if (/Safari/.test(ua)) {
            state.value.browser = "safari";
        } else {
            state.value.browser = "other";
        }

        // Platform detection
        if (/Android/.test(ua)) {
            state.value.platform = "android";
        } else if (/iPhone|iPad|iPod/.test(ua)) {
            state.value.platform = "ios";
        } else if (/Windows/.test(ua)) {
            state.value.platform = "windows";
        } else if (/Mac/.test(ua)) {
            state.value.platform = "macos";
        } else if (/Linux/.test(ua)) {
            state.value.platform = "linux";
        }

        // Eligibility: Chrome/Edge on mobile or desktop
        if (
            (state.value.browser === "chrome" || state.value.browser === "edge") &&
            (state.value.platform === "android" ||
                state.value.platform === "windows" ||
                state.value.platform === "macos" ||
                state.value.platform === "linux")
        ) {
            state.value.eligibility = "eligible";
        } else if (state.value.browser === "safari" && state.value.platform === "ios") {
            // iOS Safari: eligible but installation is native
            state.value.eligibility = "eligible";
        } else if (!state.value.isSupported) {
            state.value.eligibility = "unsupported";
        } else {
            state.value.eligibility = "ineligible";
        }
    };

    const handleBeforeInstallPrompt = (event: Event) => {
        event.preventDefault();
        deferredPrompt.value = event;
        state.value.installStatus = "prompt_shown";
        state.value.canPrompt = true;
    };

    const install = async (): Promise<boolean> => {
        if (!deferredPrompt.value) {
            console.warn("[PWA Install] No deferred prompt available");
            return false;
        }

        try {
            // Show the install prompt
            (deferredPrompt.value as any).prompt();

            // Wait for user response
            const { outcome } = await (deferredPrompt.value as any).userChoice;

            if (outcome === "accepted") {
                state.value.installStatus = "installed";
                state.value.canPrompt = false;
                deferredPrompt.value = null;
                return true;
            } else {
                state.value.installStatus = "dismissed";
                state.value.canPrompt = false;
                return false;
            }
        } catch (error) {
            console.error("[PWA Install] Installation error", error);
            return false;
        }
    };

    const dismiss = () => {
        state.value.installStatus = "dismissed";
        state.value.canPrompt = false;
        deferredPrompt.value = null;
    };

    const reset = () => {
        state.value.installStatus = "not_installed";
        state.value.canPrompt = false;
        deferredPrompt.value = null;
    };

    onMounted(() => {
        detectEnvironment();

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any);
        };
    });

    return {
        state,
        isInstalled,
        isEligible,
        canShowPrompt,
        install,
        dismiss,
        reset
    };
}
