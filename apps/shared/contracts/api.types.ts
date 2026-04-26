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

export interface ErrorResponse {
  code: string;
  message: string;
}
