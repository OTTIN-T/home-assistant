import type {
  BehaviorRuleEntity,
  HomeDeviceEntity,
  ProviderEntity,
  RegisteredDeviceEntity,
  SecurityEventEntity,
  UserEntity,
  UserProfileEntity,
  WidgetConfigurationEntity
} from "@home-assistant/shared";

export interface AccessSessionRecord {
  id: string;
  userId: string;
  deviceId: string;
  status: "open" | "closed" | "rejected";
  openedAt: string;
  closedAt: string | null;
}

export interface DeviceCommandRecord {
  id: string;
  deviceId: string;
  issuerUserId: string;
  issuerRole: "admin" | "user";
  action: string;
  priority: number;
  status: "received" | "arbitrated" | "executed" | "rejected" | "failed";
  statusReason: string | null;
  requestId: string;
  createdAt: string;
  executedAt: string | null;
}

export interface RuntimeStore {
  users: UserEntity[];
  devices: RegisteredDeviceEntity[];
  sessions: AccessSessionRecord[];
  profiles: UserProfileEntity[];
  widgets: WidgetConfigurationEntity[];
  behaviorRules: BehaviorRuleEntity[];
  pushSubscriptions: Array<{
    id: string;
    userId: string;
    endpoint: string;
    keys: { p256dh: string; auth: string };
    createdAt: string;
  }>;
  providers: ProviderEntity[];
  homeDevices: HomeDeviceEntity[];
  commands: DeviceCommandRecord[];
  securityEvents: SecurityEventEntity[];
}

export function createRuntimeStore(): RuntimeStore {
  const seedNow = new Date().toISOString();

  return {
    users: [
    {
      id: "11111111-1111-1111-1111-111111111111",
      email: "user@example.com",
      role: "user",
      status: "active",
      createdAt: seedNow,
      updatedAt: seedNow
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      email: "admin@example.com",
      role: "admin",
      status: "active",
      createdAt: seedNow,
      updatedAt: seedNow
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
      createdAt: seedNow,
      updatedAt: seedNow
    }
    ],
    sessions: [],
    profiles: [
      {
        id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
        userId: "11111111-1111-1111-1111-111111111111",
        name: "Default",
        isActive: true,
        uiPreferences: { theme: "light" },
        createdAt: seedNow,
        updatedAt: seedNow
      }
    ],
    widgets: [
      {
        id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
        profileId: "dddddddd-dddd-dddd-dddd-dddddddddddd",
        widgetType: "status",
        position: 0,
        parameters: { label: "Power" },
        visible: true
      }
    ],
    behaviorRules: [
      {
        id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
        profileId: "dddddddd-dddd-dddd-dddd-dddddddddddd",
        context: { mode: "home" },
        targetAction: { preferredTemperature: 21 },
        active: true
      }
    ],
    pushSubscriptions: [],
    providers: [
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      name: "Main Provider",
      status: "available",
      lastHeartbeatAt: seedNow
    }
    ],
    homeDevices: [
    {
      id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      providerId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      name: "Living Room Light",
      category: "light",
      capabilities: { actions: ["turn_on", "turn_off"] },
      currentState: { power: "off" },
      accessMode: "read_write",
      updatedAt: seedNow
    }
    ],
    commands: [],
    securityEvents: []
  };
}

export function getRuntimeStore(): RuntimeStore {
  return createRuntimeStore();
}
