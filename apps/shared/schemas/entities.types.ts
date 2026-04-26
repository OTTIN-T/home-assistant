export type UserRole = "admin" | "user";
export type UserStatus = "active" | "suspended";
export type DeviceTrustLevel = "low" | "medium" | "high";
export type RegisteredDeviceStatus = "pending" | "authorized" | "revoked";
export type SessionAuthnLevel = "password" | "mfa";
export type AccessSessionStatus = "open" | "closed" | "rejected";
export type ProviderStatus = "available" | "unavailable" | "maintenance";
export type HomeDeviceCategory = "light" | "shutter" | "heating" | "security" | "other";
export type HomeDeviceAccessMode = "read_write" | "read_only";
export type CommandStatus = "received" | "arbitrated" | "executed" | "rejected" | "failed";
export type SecurityEventType =
    | "login"
    | "access_denied"
    | "privilege_escalation"
    | "role_change"
    | "admin_action"
    | "command_arbitration";
export type SecurityEventSeverity = "info" | "warning" | "critical";

export interface UserEntity {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}

export interface RegisteredDeviceEntity {
    id: string;
    userId: string;
    fingerprint: string;
    displayName: string;
    trustLevel: DeviceTrustLevel;
    status: RegisteredDeviceStatus;
    lastAccessAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AccessSessionEntity {
    id: string;
    userId: string;
    deviceId: string;
    authnLevel: SessionAuthnLevel;
    ip: string;
    status: AccessSessionStatus;
    openedAt: string;
    closedAt: string | null;
}

export interface UserProfileEntity {
    id: string;
    userId: string;
    name: string;
    isActive: boolean;
    uiPreferences: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

export interface WidgetConfigurationEntity {
    id: string;
    profileId: string;
    widgetType: string;
    position: number;
    parameters: Record<string, unknown>;
    visible: boolean;
}

export interface HomeDeviceEntity {
    id: string;
    providerId: string;
    name: string;
    category: HomeDeviceCategory;
    capabilities: Record<string, unknown>;
    currentState: Record<string, unknown>;
    accessMode: HomeDeviceAccessMode;
    updatedAt: string;
}

export interface DeviceCommandEntity {
    id: string;
    deviceId: string;
    issuerUserId: string;
    issuerRole: UserRole;
    action: string;
    priority: number;
    status: CommandStatus;
    statusReason: string | null;
    requestId: string;
    createdAt: string;
    executedAt: string | null;
}

export interface BehaviorRuleEntity {
    id: string;
    profileId: string;
    context: Record<string, unknown>;
    targetAction: Record<string, unknown>;
    active: boolean;
}

export interface ProviderEntity {
    id: string;
    name: string;
    status: ProviderStatus;
    lastHeartbeatAt: string;
}

export interface SecurityEventEntity {
    id: string;
    eventType: SecurityEventType;
    severity: SecurityEventSeverity;
    userId: string | null;
    deviceId: string | null;
    targetId: string | null;
    details: Record<string, unknown>;
    legalHoldActive: boolean;
    createdAt: string;
    expiresAt: string;
}
