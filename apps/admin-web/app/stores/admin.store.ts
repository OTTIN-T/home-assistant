import { defineStore } from "pinia";
import type {
    RegisteredDeviceStatus,
    SecurityEventSeverity,
    UserRole
} from "@home-assistant/shared";

export interface AdminUserItem {
    id: string;
    email: string;
    role: UserRole;
    status: "active" | "suspended";
    lastRoleChangeAt: string;
}

export interface AdminDeviceItem {
    id: string;
    userId: string;
    displayName: string;
    status: RegisteredDeviceStatus;
    trustLevel: "low" | "medium" | "high";
    lastAccessAt: string | null;
}

export interface AdminAuditItem {
    id: string;
    eventType: string;
    severity: SecurityEventSeverity;
    createdAt: string;
    details: Record<string, unknown>;
}

const seededUsers: AdminUserItem[] = [
    {
        id: "11111111-1111-1111-1111-111111111111",
        email: "user@example.com",
        role: "user",
        status: "active",
        lastRoleChangeAt: "2026-04-24T09:00:00.000Z"
    },
    {
        id: "22222222-2222-2222-2222-222222222222",
        email: "admin@example.com",
        role: "admin",
        status: "active",
        lastRoleChangeAt: "2026-04-25T12:15:00.000Z"
    }
];

const seededDevices: AdminDeviceItem[] = [
    {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        userId: "11111111-1111-1111-1111-111111111111",
        displayName: "User Phone",
        status: "authorized",
        trustLevel: "high",
        lastAccessAt: "2026-04-25T18:42:00.000Z"
    },
    {
        id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        userId: "22222222-2222-2222-2222-222222222222",
        displayName: "Admin Tablet",
        status: "authorized",
        trustLevel: "high",
        lastAccessAt: "2026-04-25T19:03:00.000Z"
    },
    {
        id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        userId: "11111111-1111-1111-1111-111111111111",
        displayName: "Kitchen Wall Panel",
        status: "pending",
        trustLevel: "medium",
        lastAccessAt: null
    }
];

const seededAudit: AdminAuditItem[] = [
    {
        id: "evt-001",
        eventType: "role_change",
        severity: "warning",
        createdAt: "2026-04-25T19:05:00.000Z",
        details: {
            actorId: "22222222-2222-2222-2222-222222222222",
            targetId: "11111111-1111-1111-1111-111111111111",
            newRole: "admin"
        }
    },
    {
        id: "evt-002",
        eventType: "admin_action",
        severity: "critical",
        createdAt: "2026-04-25T19:10:00.000Z",
        details: {
            actorId: "22222222-2222-2222-2222-222222222222",
            deviceId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            action: "revoke"
        }
    },
    {
        id: "evt-003",
        eventType: "access_denied",
        severity: "info",
        createdAt: "2026-04-25T19:12:00.000Z",
        details: {
            userId: "11111111-1111-1111-1111-111111111111",
            reason: "session_refresh_required"
        }
    }
];

export const useAdminStore = defineStore("admin", {
    state: () => ({
        users: seededUsers,
        devices: seededDevices,
        audit: seededAudit,
        selectedSeverity: "all" as SecurityEventSeverity | "all",
        message: "Vue gouvernance prechargee avec les donnees de reference US3."
    }),
    getters: {
        filteredAudit(state): AdminAuditItem[] {
            if (state.selectedSeverity === "all") {
                return state.audit;
            }

            return state.audit.filter((event) => event.severity === state.selectedSeverity);
        },
        stats(state) {
            const revokedDevices = state.devices.filter((device) => device.status === "revoked").length;
            const privilegedUsers = state.users.filter((user) => user.role === "admin").length;
            const criticalEvents = state.audit.filter((event) => event.severity === "critical").length;

            return {
                totalUsers: state.users.length,
                privilegedUsers,
                revokedDevices,
                criticalEvents
            };
        }
    },
    actions: {
        setUsers(users: AdminUserItem[]) {
            this.users = users;
        },
        setDevices(devices: AdminDeviceItem[]) {
            this.devices = devices;
        },
        setAudit(audit: AdminAuditItem[]) {
            this.audit = audit;
        },
        updateUserRole(userId: string, role: UserRole) {
            this.users = this.users.map((user) =>
                user.id === userId
                    ? {
                        ...user,
                        role,
                        lastRoleChangeAt: new Date().toISOString()
                    }
                    : user
            );
            this.audit = [
                {
                    id: `evt-${Date.now()}`,
                    eventType: "role_change",
                    severity: "warning",
                    createdAt: new Date().toISOString(),
                    details: {
                        targetId: userId,
                        newRole: role
                    }
                },
                ...this.audit
            ];
            this.message = `Role mis a jour pour ${userId}.`;
        },
        revokeDevice(deviceId: string) {
            this.devices = this.devices.map((device) =>
                device.id === deviceId
                    ? {
                        ...device,
                        status: "revoked"
                    }
                    : device
            );
            this.audit = [
                {
                    id: `evt-${Date.now() + 1}`,
                    eventType: "admin_action",
                    severity: "critical",
                    createdAt: new Date().toISOString(),
                    details: {
                        deviceId,
                        action: "revoke"
                    }
                },
                ...this.audit
            ];
            this.message = `Appareil ${deviceId} revoque avec invalidation de session demandee.`;
        },
        setAuditSeverity(severity: SecurityEventSeverity | "all") {
            this.selectedSeverity = severity;
        },
        setMessage(message: string) {
            this.message = message;
        }
    }
});
