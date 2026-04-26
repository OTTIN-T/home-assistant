import { getAvailability, summarizeUptime, type UptimeEvent } from "./uptime.collector";

export interface MonthlyAvailabilityReport {
    period: string;
    targetAvailability: number;
    measuredAvailability: number;
    objectiveMet: boolean;
    surfaces: ReturnType<typeof summarizeUptime>;
}

export function generateMonthlyAvailabilityReport(
    period: string,
    events: UptimeEvent[],
    targetAvailability = 0.999
): MonthlyAvailabilityReport {
    const surfaces = summarizeUptime(events);
    const measuredAvailability = getAvailability(surfaces);

    return {
        period,
        targetAvailability,
        measuredAvailability,
        objectiveMet: measuredAvailability >= targetAvailability,
        surfaces
    };
}
