import { z } from "zod";

const uuidSchema = z.string().uuid();
const dateTimeSchema = z.string().datetime();
const jsonObjectSchema = z.record(z.string(), z.unknown());

export const userSchema = z.object({
  id: uuidSchema,
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
  status: z.enum(["active", "suspended"]),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema
});

export const registeredDeviceSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  fingerprint: z.string().min(1),
  displayName: z.string().min(1),
  trustLevel: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "authorized", "revoked"]),
  lastAccessAt: dateTimeSchema.nullable(),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema
});

export const accessSessionSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  deviceId: uuidSchema,
  authnLevel: z.enum(["password", "mfa"]),
  ip: z.string().min(3),
  status: z.enum(["open", "closed", "rejected"]),
  openedAt: dateTimeSchema,
  closedAt: dateTimeSchema.nullable()
});

export const userProfileSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  name: z.string().min(1),
  isActive: z.boolean(),
  uiPreferences: jsonObjectSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema
});

export const widgetConfigurationSchema = z.object({
  id: uuidSchema,
  profileId: uuidSchema,
  widgetType: z.string().min(1),
  position: z.number().int().min(0),
  parameters: jsonObjectSchema,
  visible: z.boolean()
});

export const providerSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  status: z.enum(["available", "unavailable", "maintenance"]),
  lastHeartbeatAt: dateTimeSchema
});

export const homeDeviceSchema = z.object({
  id: uuidSchema,
  providerId: uuidSchema,
  name: z.string().min(1),
  category: z.enum(["light", "shutter", "heating", "security", "other"]),
  capabilities: jsonObjectSchema,
  currentState: jsonObjectSchema,
  accessMode: z.enum(["read_write", "read_only"]),
  updatedAt: dateTimeSchema
});

export const deviceCommandSchema = z.object({
  id: uuidSchema,
  deviceId: uuidSchema,
  issuerUserId: uuidSchema,
  issuerRole: z.enum(["admin", "user"]),
  action: z.string().min(1),
  priority: z.number().int(),
  status: z.enum(["received", "arbitrated", "executed", "rejected", "failed"]),
  statusReason: z.string().nullable(),
  requestId: z.string().min(1),
  createdAt: dateTimeSchema,
  executedAt: dateTimeSchema.nullable()
});

export const behaviorRuleSchema = z.object({
  id: uuidSchema,
  profileId: uuidSchema,
  context: jsonObjectSchema,
  targetAction: jsonObjectSchema,
  active: z.boolean()
});

export const securityEventSchema = z.object({
  id: uuidSchema,
  eventType: z.enum([
    "login",
    "access_denied",
    "privilege_escalation",
    "role_change",
    "admin_action",
    "command_arbitration"
  ]),
  severity: z.enum(["info", "warning", "critical"]),
  userId: uuidSchema.nullable(),
  deviceId: uuidSchema.nullable(),
  targetId: uuidSchema.nullable(),
  details: jsonObjectSchema,
  legalHoldActive: z.boolean(),
  createdAt: dateTimeSchema,
  expiresAt: dateTimeSchema
});
