import type { RegisteredDeviceEntity, SecurityEventEntity } from "@home-assistant/shared";
import type { AdminAccessSessionRecord } from "./runtime-store";

export class AdminDeviceService {
  public constructor(
    private readonly devices: RegisteredDeviceEntity[],
    private readonly sessions: AdminAccessSessionRecord[],
    private readonly securityEvents: SecurityEventEntity[]
  ) {}

  public revokeDevice(actorId: string, deviceId: string): { revoked: boolean; invalidatedSessions: number } {
    const target = this.devices.find((item) => item.id === deviceId);
    if (!target) {
      throw new Error("Device not found");
    }

    if (target.status === "revoked") {
      return { revoked: false, invalidatedSessions: 0 };
    }

    target.status = "revoked";
    target.updatedAt = new Date().toISOString();

    let invalidated = 0;
    for (const session of this.sessions) {
      if (session.deviceId === deviceId && session.status === "open") {
        session.status = "closed";
        session.closedAt = new Date().toISOString();
        invalidated += 1;
      }
    }

    this.securityEvents.push({
      id: crypto.randomUUID(),
      eventType: "admin_action",
      severity: "warning",
      userId: actorId,
      deviceId,
      targetId: deviceId,
      details: { action: "revoke_device", invalidatedSessions: invalidated },
      legalHoldActive: false,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    });

    return { revoked: true, invalidatedSessions: invalidated };
  }

  public listAuditEvents(severity?: "info" | "warning" | "critical") {
    if (!severity) {
      return this.securityEvents;
    }

    return this.securityEvents.filter((event) => event.severity === severity);
  }
}
