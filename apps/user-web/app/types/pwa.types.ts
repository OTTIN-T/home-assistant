/**
 * Client-side PWA Types
 *
 * Type definitions for client-side PWA functionality.
 */

export interface PwaState {
    isInstalled: boolean;
    isOnline: boolean;
    hasUpdate: boolean;
    swReady: boolean;
    swUpdating: boolean;
}

export interface PwaInstallPromptEvent {
    prompt: Event;
}

export interface PwaUpdateReadyEvent {
    registration: ServiceWorkerRegistration;
    newWorker: ServiceWorker;
}

export interface OfflineCommandLocal {
    id: string;
    commandName: string;
    commandPayload: Record<string, any>;
    status: "queued" | "syncing" | "synced" | "failed" | "conflict";
    retryCount: number;
    createdAt: number;
    error?: string;
}

export interface SyncStatus {
    isOnline: boolean;
    isSyncing: boolean;
    pendingCount: number;
    lastSyncTime?: number;
    syncError?: string;
}
