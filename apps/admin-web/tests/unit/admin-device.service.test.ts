import { describe, expect, it } from "vitest";
import type { RegisteredDeviceEntity, SecurityEventEntity } from "@home-assistant/shared";
import type { AdminAccessSessionRecord } from "../../server/services/runtime-store";
import { AdminDeviceService } from "../../server/services/admin-device.service";

function fixtures() {
  const now = new Date().toISOString();
  const devices: RegisteredDeviceEntity[] = [
    {
      id: "d1",
      userId: "u1",
      fingerprint: "fp",
      displayName: "Phone",
      trustLevel: "high",
      status: "authorized",
      lastAccessAt: null,
      createdAt: now,
      updatedAt: now
    }
  ];
  const sessions: AdminAccessSessionRecord[] = [
    { id: "s1", userId: "u1", deviceId: "d1", status: "open", openedAt: now, closedAt: null }
  ];
  const events: SecurityEventEntity[] = [];

  return { devices, sessions, events };
}

describe("AdminDeviceService", () => {
  it("revokes device and invalidates sessions", () => {
    const data = fixtures();
    const service = new AdminDeviceService(data.devices, data.sessions, data.events);

    const result = service.revokeDevice("a1", "d1");
    expect(result.revoked).toBe(true);
    expect(result.invalidatedSessions).toBe(1);
    expect(data.sessions[0].status).toBe("closed");
  });

  it("is idempotent for already revoked device", () => {
    const data = fixtures();
    data.devices[0].status = "revoked";
    const service = new AdminDeviceService(data.devices, data.sessions, data.events);

    const result = service.revokeDevice("a1", "d1");
    expect(result.revoked).toBe(false);
  });
});
