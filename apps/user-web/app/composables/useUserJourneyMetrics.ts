import { computed, ref } from "vue";

interface JourneyState {
    loginAt: number | null;
    actionAt: number | null;
    stateAt: number | null;
}

export function useUserJourneyMetrics() {
    const state = ref<JourneyState>({
        loginAt: null,
        actionAt: null,
        stateAt: null
    });

    const durationMs = computed(() => {
        if (!state.value.loginAt || !state.value.stateAt) {
            return null;
        }

        return state.value.stateAt - state.value.loginAt;
    });

    function markLogin(): void {
        state.value.loginAt = Date.now();
    }

    function markAction(): void {
        state.value.actionAt = Date.now();
    }

    async function markStateReceived(userId: string): Promise<void> {
        state.value.stateAt = Date.now();

        if (durationMs.value === null) {
            return;
        }

        const payload = {
            userId,
            journey: "login_to_action_to_state",
            durationMs: durationMs.value,
            stepCount: 3,
            success: true,
            recordedAt: new Date().toISOString()
        };

        if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
            navigator.sendBeacon("/api/v1/metrics/user-journey", JSON.stringify(payload));
            return;
        }

        await $fetch("/api/v1/metrics/user-journey", {
            method: "POST",
            body: payload
        });
    }

    return {
        durationMs,
        markLogin,
        markAction,
        markStateReceived
    };
}
