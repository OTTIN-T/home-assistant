export type ApiSurface = "auth" | "devices" | "profiles" | "admin";

export interface UptimeEvent {
    surface: ApiSurface;
    statusCode: number;
    durationMs: number;
    timestamp: string;
}

export interface UptimeSummary {
    surface: ApiSurface;
    totalRequests: number;
    successfulRequests: number;
    availabilityRate: number;
}

const uptimeEvents: UptimeEvent[] = [];

export function recordUptimeEvent(event: UptimeEvent): void {
    uptimeEvents.push(event);

    if (uptimeEvents.length > 25_000) {
        uptimeEvents.splice(0, uptimeEvents.length - 25_000);
    }
}

function round(value: number): number {
    return Math.round(value * 10_000) / 10_000;
}

export function summarizeUptime(events: UptimeEvent[] = uptimeEvents): UptimeSummary[] {
    const surfaces: ApiSurface[] = ["auth", "devices", "profiles", "admin"];

    return surfaces.map((surface) => {
        const scoped = events.filter((event) => event.surface === surface);
        const successful = scoped.filter((event) => event.statusCode < 500);

        return {
            surface,
            totalRequests: scoped.length,
            successfulRequests: successful.length,
            availabilityRate: scoped.length === 0 ? 1 : round(successful.length / scoped.length)
        };
    });
}

export function getAvailability(summary: UptimeSummary[]): number {
    const totals = summary.reduce(
        (acc, item) => {
            acc.total += item.totalRequests;
            acc.success += item.successfulRequests;
            return acc;
        },
        { total: 0, success: 0 }
    );

    if (totals.total === 0) {
        return 1;
    }

    return round(totals.success / totals.total);
}
