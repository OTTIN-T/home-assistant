/**
 * PWA Operational Log Service
 *
 * Centralized logging for PWA lifecycle events with correlation IDs,
 * categories, and severity levels.
 */

import type { PwaOperationalLogEntry } from "../types/pwa.types";
import { PwaOperationalLogEntrySchema } from "../types/pwa.types";

export class PwaOperationalLogService {
    private logger = console; // Can be replaced with actual logger

    /**
     * Log a PWA operational event
     */
    async log(entry: PwaOperationalLogEntry): Promise<void> {
        // Validate entry
        const validated = PwaOperationalLogEntrySchema.parse(entry);

        // Format log message
        const levelEmoji = {
            info: "ℹ️",
            warning: "⚠️",
            error: "❌",
            critical: "🔥"
        };

        const emoji = levelEmoji[validated.level] || "📝";
        const message = `[PWA] ${emoji} [${validated.category.toUpperCase()}:${validated.level.toUpperCase()}] ${validated.eventName}`;

        // Log with appropriate level
        switch (validated.level) {
            case "critical":
            case "error":
                this.logger.error(message, validated);
                break;
            case "warning":
                this.logger.warn(message, validated);
                break;
            case "info":
            default:
                this.logger.info(message, validated);
        }

        // TODO: Send to observability backend (e.g., Datadog, New Relic)
        // await this.observabilityClient.sendEvent(validated);
    }

    /**
     * Log installation event
     */
    async logInstallation(
        correlationId: string,
        details: Record<string, any>,
        level: "info" | "warning" | "error" = "info"
    ): Promise<void> {
        await this.log({
            correlationId,
            category: "install",
            level,
            eventName: "installation_event",
            payload: details,
            timestamp: Date.now()
        });
    }

    /**
     * Log service worker event
     */
    async logServiceWorker(
        correlationId: string,
        eventName: string,
        details: Record<string, any>,
        level: "info" | "warning" | "error" = "info"
    ): Promise<void> {
        await this.log({
            correlationId,
            category: "service_worker",
            level,
            eventName,
            payload: details,
            timestamp: Date.now()
        });
    }

    /**
     * Log offline queue event
     */
    async logOfflineQueue(
        correlationId: string,
        eventName: string,
        details: Record<string, any>,
        level: "info" | "warning" | "error" = "info"
    ): Promise<void> {
        await this.log({
            correlationId,
            category: "offline_queue",
            level,
            eventName,
            payload: details,
            timestamp: Date.now()
        });
    }

    /**
     * Log push subscription event
     */
    async logPushSubscription(
        correlationId: string,
        eventName: string,
        details: Record<string, any>,
        level: "info" | "warning" | "error" = "info"
    ): Promise<void> {
        await this.log({
            correlationId,
            category: "push",
            level,
            eventName,
            payload: details,
            timestamp: Date.now()
        });
    }

    /**
     * Log cache event
     */
    async logCache(
        correlationId: string,
        eventName: string,
        details: Record<string, any>,
        level: "info" | "warning" | "error" = "info"
    ): Promise<void> {
        await this.log({
            correlationId,
            category: "cache",
            level,
            eventName,
            payload: details,
            timestamp: Date.now()
        });
    }
}

export function createPwaOperationalLogService(): PwaOperationalLogService {
    return new PwaOperationalLogService();
}
