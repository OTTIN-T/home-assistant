/**
 * PWA Lifecycle Service
 *
 * Manages PWA lifecycle events (installation, SW updates, offline sync).
 */

import type { ServiceWorkerLifecycleEvent } from "../types/pwa.types";
import {
    ServiceWorkerEventStatus,
    ServiceWorkerEventType,
    ServiceWorkerLifecycleEventSchema
} from "../types/pwa.types";

export class PwaLifecycleService {
    /**
     * Record a service worker lifecycle event
     */
    async recordEvent(event: ServiceWorkerLifecycleEvent): Promise<void> {
        // Validate event
        const validated = ServiceWorkerLifecycleEventSchema.parse(event);

        console.log(
            `[PWA Lifecycle] ${validated.eventType}:${validated.eventStatus}`,
            validated
        );

        // TODO: Store in database
        // await db.pwa_lifecycle_events.insert(validated);
    }

    /**
     * Record SW registration success
     */
    async recordSwRegistered(swVersion: string, scope: string): Promise<void> {
        await this.recordEvent({
            serviceWorkerVersion: swVersion,
            eventType: ServiceWorkerEventType.SwRegistered,
            eventStatus: ServiceWorkerEventStatus.Success,
            details: { scope },
            timestamp: Date.now()
        });
    }

    /**
     * Record SW update found
     */
    async recordSwUpdateFound(swVersion: string): Promise<void> {
        await this.recordEvent({
            serviceWorkerVersion: swVersion,
            eventType: ServiceWorkerEventType.SwUpdateFound,
            eventStatus: ServiceWorkerEventStatus.Success,
            timestamp: Date.now()
        });
    }

    /**
     * Record SW update applied
     */
    async recordSwUpdateApplied(swVersion: string): Promise<void> {
        await this.recordEvent({
            serviceWorkerVersion: swVersion,
            eventType: ServiceWorkerEventType.SwUpdateApplied,
            eventStatus: ServiceWorkerEventStatus.Success,
            timestamp: Date.now()
        });
    }

    /**
     * Record SW activated
     */
    async recordSwActivated(swVersion: string): Promise<void> {
        await this.recordEvent({
            serviceWorkerVersion: swVersion,
            eventType: ServiceWorkerEventType.SwActivated,
            eventStatus: ServiceWorkerEventStatus.Success,
            timestamp: Date.now()
        });
    }

    /**
     * Record SW registration error
     */
    async recordSwRegistrationError(error: Error): Promise<void> {
        await this.recordEvent({
            serviceWorkerVersion: "unknown",
            eventType: ServiceWorkerEventType.SwRegistrationError,
            eventStatus: ServiceWorkerEventStatus.Error,
            details: { error: error.message, stack: error.stack },
            timestamp: Date.now()
        });
    }
}

export function createPwaLifecycleService(): PwaLifecycleService {
    return new PwaLifecycleService();
}
