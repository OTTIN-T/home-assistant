import { defineNitroPlugin } from "nitropack/runtime";

interface UserJourneyMetric {
    userId: string;
    journey: "login_to_action_to_state";
    durationMs: number;
    stepCount: number;
    success: boolean;
    recordedAt: string;
}

const userJourneyMetrics: UserJourneyMetric[] = [];

export function recordUserJourneyMetric(metric: UserJourneyMetric): void {
    userJourneyMetrics.push(metric);
    if (userJourneyMetrics.length > 5000) {
        userJourneyMetrics.splice(0, userJourneyMetrics.length - 5000);
    }
}

export function getUserJourneyMetrics() {
    return [...userJourneyMetrics];
}

export default defineNitroPlugin((nitroApp: any) => {
    nitroApp.hooks.hook("request", (event: any) => {
        event.context.__journeyRequestStartedAt = Date.now();
    });
});
