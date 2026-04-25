import type {
  RegisteredDeviceEntity,
  SecurityEventEntity,
  UserEntity
} from "@home-assistant/shared";

export interface AdminAccessSessionRecord {
  id: string;
  userId: string;
  deviceId: string;
  status: "open" | "closed" | "rejected";
  openedAt: string;
  closedAt: string | null;
}

export interface AdminRuntimeStore {
  users: UserEntity[];
  devices: RegisteredDeviceEntity[];
  sessions: AdminAccessSessionRecord[];
  securityEvents: SecurityEventEntity[];
}

export function createAdminRuntimeStore(): AdminRuntimeStore {
  const now = new Date().toISOString();
  return {
    users: [
      {
        id: "11111111-1111-1111-1111-111111111111",
        email: "user@example.com",
        role: "user",
        status: "active",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        email: "admin@example.com",
        role: "admin",
        status: "active",
        createdAt: now,
        updatedAt: now
      }
    ],
    devices: [
      {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        userId: "11111111-1111-1111-1111-111111111111",
        fingerprint: "device-fp-001",
        displayName: "User Phone",
        trustLevel: "high",
        status: "authorized",
        lastAccessAt: null,
        createdAt: now,
        updatedAt: now
      }
    ],
    sessions: [
      {
        id: "sess-1",
        userId: "11111111-1111-1111-1111-111111111111",
        deviceId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        status: "open",
        openedAt: now,
        closedAt: null
      }
    ],
    securityEvents: []
  };
}
