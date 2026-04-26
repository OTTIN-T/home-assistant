export interface SessionCreateRequest {
  email: string;
  password: string;
  deviceFingerprint: string;
}

export interface SessionCreateResponse {
  token: string;
  userId: string;
  deviceId: string;
}

export interface DeviceContract {
  id: string;
  name: string;
  accessMode: "read_write" | "read_only";
  state: Record<string, unknown>;
}

export interface CommandRequest {
  action: string;
  payload: Record<string, unknown>;
}

export interface CommandAccepted {
  commandId: string;
  status: "received" | "arbitrated" | "executed";
}

export interface CommandArbitrated {
  commandId: string;
  status: "rejected";
  reason: string;
}

export interface ProfileCreateRequest {
  name: string;
  uiPreferences: Record<string, unknown>;
}

export interface ProfileContract {
  id: string;
  name: string;
  isActive: boolean;
}

export interface WidgetLayoutItem {
  widgetType: string;
  position: number;
  visible: boolean;
  parameters?: Record<string, unknown>;
}

export interface WidgetsConfigurationRequest {
  widgets: WidgetLayoutItem[];
}

export interface PushSubscriptionRequest {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface UpdateRolesRequest {
  role: "admin" | "user";
}

export interface SecurityEventContract {
  id: string;
  eventType: string;
  severity: "info" | "warning" | "critical";
  details: Record<string, unknown>;
  createdAt: string;
  expiresAt: string;
}

// PWA Contracts

export interface PwaLifecycleEventRequest {
  serviceWorkerVersion: string;
  eventType:
  | "install_prompt_shown"
  | "installed"
  | "sw_registered"
  | "sw_update_found"
  | "sw_update_applied"
  | "sw_activated"
  | "sw_registration_error"
  | "offline_queue_sync_started"
  | "offline_queue_sync_finished";
  eventStatus: "success" | "warning" | "error";
  details?: Record<string, any>;
  timestamp: number;
}

export interface PwaLifecycleEventResponse {
  success: boolean;
  eventType: string;
  message: string;
}

export interface OfflineCommand {
  id: string;
  commandName: string;
  commandPayload: Record<string, any>;
  status: "queued" | "syncing" | "synced" | "failed" | "conflict";
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
  synced: string[];
  failed: { id: string; error: string }[];
  conflicts: { id: string; reason: string }[];
  correlationId: string;
  timestamp: number;
}

export interface PushSubscriptionDeleteResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
}
