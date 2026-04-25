import type { SecurityEventEntity } from "../schemas/entities.types";
import { SecurityEventService } from "./security-event.service";

export interface SecurityEventRetentionResult {
    purged: SecurityEventEntity[];
    retained: SecurityEventEntity[];
}

export function purgeExpiredSecurityEvents(
    events: SecurityEventEntity[],
    now: Date = new Date()
): SecurityEventRetentionResult {
    const purged: SecurityEventEntity[] = [];
    const retained: SecurityEventEntity[] = [];

    for (const event of events) {
        if (SecurityEventService.shouldPurge(event, now)) {
            purged.push(event);
            continue;
        }

        retained.push(event);
    }

    return { purged, retained };
}
