import { defineNitroPlugin } from "nitropack/runtime";

type Surface = "auth" | "devices" | "profiles" | "admin";

interface LatencySample {
    route: string;
    durationMs: number;
    timestamp: string;
}

const samples: LatencySample[] = [];

export function recordLatency(route: string, durationMs: number): void {
    samples.push({
        route,
        durationMs,
        timestamp: new Date().toISOString()
    });

    if (samples.length > 2000) {
        samples.splice(0, samples.length - 2000);
    }
}

function percentile(values: number[], p: number): number {
    if (values.length === 0) {
        return 0;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
    return sorted[index] ?? 0;
}

export function getPerformanceSnapshot() {
    const deviceRoutes = samples.filter((item) => item.route.startsWith("/api/v1/devices"));
    const pushRoutes = samples.filter((item) => item.route.startsWith("/api/v1/notifications"));

    return {
        p95DeviceCommandMs: percentile(deviceRoutes.map((item) => item.durationMs), 95),
        p95PushMs: percentile(pushRoutes.map((item) => item.durationMs), 95),
        thresholds: {
            p95DeviceCommandMs: 400,
            p95PushMs: 10_000
        }
    };
}

export function mapRouteToSurface(route: string): Surface {
    if (route.startsWith("/api/v1/auth")) {
        return "auth";
    }
    if (route.startsWith("/api/v1/devices")) {
        return "devices";
    }
    if (route.startsWith("/api/v1/profiles")) {
        return "profiles";
    }
    return "admin";
}

export default defineNitroPlugin((nitroApp: any) => {
    nitroApp.hooks.hook("request", (event: any) => {
        event.context.__requestStartedAt = Date.now();
    });

    nitroApp.hooks.hook("afterResponse", (event: any) => {
        const startedAt = event.context.__requestStartedAt as number | undefined;
        if (!startedAt) {
            return;
        }

        const route = event.path || event.node.req.url || "unknown";
        const durationMs = Date.now() - startedAt;
        recordLatency(route, durationMs);
    });
});
