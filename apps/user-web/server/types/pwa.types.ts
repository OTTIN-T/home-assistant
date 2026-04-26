/**
 * PWA Types and Contracts
 *
 * Shared type definitions for PWA lifecycle, offline queue, push subscriptions,
 * and operational logging.
 */

import { z } from "zod";

// Installation & Lifecycle
export enum PwaInstallStatus {
    NotInstalled = "not_installed",
    PromptShown = "prompt_shown",
    Installed = "installed",
    Dismissed = "dismissed"
}

export enum PwaEligibility {
    Eligible = "eligible",
    Ineligible = "ineligible",
    Unsupported = "unsupported"
}

export interface PwaInstallEvent {
    eligibility: PwaEligibility;
    installStatus: PwaInstallStatus;
    platform: string;
    browser: string;
    appVersion: string;
    pwaModuleVersion: string;
    timestamp: number;
}

// Service Worker Lifecycle
export enum ServiceWorkerEventType {
    InstallPromptShown = "install_prompt_shown",
    Installed = "installed",
    SwRegistered = "sw_registered",
    SwUpdateFound = "sw_update_found",
    SwUpdateApplied = "sw_update_applied",
    SwActivated = "sw_activated",
    SwRegistrationError = "sw_registration_error",
    OfflineQueueSyncStarted = "offline_queue_sync_started",
    OfflineQueueSyncFinished = "offline_queue_sync_finished"
}

export enum ServiceWorkerEventStatus {
    Success = "success",
    Warning = "warning",
    Error = "error"
}

export interface ServiceWorkerLifecycleEvent {
    serviceWorkerVersion: string;
    eventType: ServiceWorkerEventType;
    eventStatus: ServiceWorkerEventStatus;
    details?: Record<string, any>;
    timestamp: number;
}

// Offline Command Queue
export enum OfflineCommandStatus {
    Queued = "queued",
    Syncing = "syncing",
    Synced = "synced",
    Failed = "failed",
    Conflict = "conflict"
}

export interface OfflineCommand {
    id: string;
    commandName: string;
    commandPayload: Record<string, any>;
    status: OfflineCommandStatus;
    retryCount: number;
    retryAfter?: number;
    conflictReason?: string;
    createdAt: number;
    scheduledAt: number;
    syncedAt?: number;
}

export interface OfflineQueueSyncRequest {
    commands: OfflineCommand[];
    correlationId: string;
    timestamp: number;
}

export interface OfflineQueueSyncResponse {
    synced: string[]; // command IDs
    failed: { id: string; error: string }[];
    conflicts: { id: string; reason: string }[];
    correlationId: string;
    timestamp: number;
}

// Push Subscriptions
export interface PushSubscriptionPayload {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export interface PushSubscriptionPreference {
    id: string;
    endpoint: string;
    p256dh: string;
    auth: string;
    permissionStatus: "granted" | "denied" | "default";
    consentSource: "first_launch_prompt" | "settings";
    revokedAt?: number;
    createdAt: number;
    updatedAt: number;
}

// Operational Logging
export interface PwaOperationalLogEntry {
    correlationId: string;
    userId?: string;
    deviceFingerprint?: string;
    category: "install" | "service_worker" | "offline_queue" | "push" | "cache";
    level: "info" | "warning" | "error" | "critical";
    eventName: string;
    payload: Record<string, any>;
    timestamp: number;
}

// Validators
export const PwaInstallEventSchema = z.object({
    eligibility: z.enum([
        PwaEligibility.Eligible,
        PwaEligibility.Ineligible,
        PwaEligibility.Unsupported
    ]),
    installStatus: z.enum([
        PwaInstallStatus.NotInstalled,
        PwaInstallStatus.PromptShown,
        PwaInstallStatus.Installed,
        PwaInstallStatus.Dismissed
    ]),
    platform: z.string().min(1),
    browser: z.string().min(1),
    appVersion: z.string(),
    pwaModuleVersion: z.string(),
    timestamp: z.number().int().positive()
});

export const ServiceWorkerLifecycleEventSchema = z.object({
    serviceWorkerVersion: z.string().min(1),
    eventType: z.nativeEnum(ServiceWorkerEventType),
    eventStatus: z.nativeEnum(ServiceWorkerEventStatus),
    details: z.record(z.any()).optional(),
    timestamp: z.number().int().positive()
});

export const OfflineCommandSchema = z.object({
    id: z.string().uuid(),
    commandName: z.string().min(1),
    commandPayload: z.record(z.any()),
    status: z.nativeEnum(OfflineCommandStatus),
    retryCount: z.number().int().nonnegative(),
    retryAfter: z.number().optional(),
    conflictReason: z.string().optional(),
    createdAt: z.number().int().positive(),
    scheduledAt: z.number().int().positive(),
    syncedAt: z.number().int().positive().optional()
});

export const PushSubscriptionPayloadSchema = z.object({
    endpoint: z.string().url(),
    keys: z.object({
        p256dh: z.string().min(1),
        auth: z.string().min(1)
    })
});

export const OfflineQueueSyncRequestSchema = z.object({
    commands: z.array(OfflineCommandSchema),
    correlationId: z.string().min(1),
    timestamp: z.number().int().positive()
});

export const PwaOperationalLogEntrySchema = z.object({
    correlationId: z.string().min(1),
    userId: z.string().optional(),
    deviceFingerprint: z.string().optional(),
    category: z.enum(["install", "service_worker", "offline_queue", "push", "cache"]),
    level: z.enum(["info", "warning", "error", "critical"]),
    eventName: z.string().min(1),
    payload: z.record(z.any()),
    timestamp: z.number().int().positive()
});
