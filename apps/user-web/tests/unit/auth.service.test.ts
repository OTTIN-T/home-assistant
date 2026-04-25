import { describe, expect, it } from "vitest";
import { AuthService } from "../../server/services/auth.service";
import type { RegisteredDeviceEntity, SecurityEventEntity, UserEntity } from "@home-assistant/shared";

function createFixtures() {
    const now = new Date().toISOString();
    const users: UserEntity[] = [
        {
            id: "11111111-1111-1111-1111-111111111111",
            email: "user@example.com",
            role: "user",
            status: "active",
            createdAt: now,
            updatedAt: now
        }
    ];
    const devices: RegisteredDeviceEntity[] = [
        {
            id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            userId: "11111111-1111-1111-1111-111111111111",
            fingerprint: "device-fp-001",
            displayName: "Phone",
            trustLevel: "high",
            status: "authorized",
            lastAccessAt: null,
            createdAt: now,
            updatedAt: now
        }
    ];
    const sessions: Array<{ id: string; userId: string; deviceId: string; status: "open" | "closed" | "rejected"; openedAt: string; closedAt: string | null }> = [];
    const securityEvents: SecurityEventEntity[] = [];

    return { users, devices, sessions, securityEvents };
}

describe("AuthService", () => {
    it("creates session for valid user and device", () => {
        const fixtures = createFixtures();
        const service = new AuthService(fixtures.users, fixtures.devices, fixtures.sessions, fixtures.securityEvents);

        const result = service.authenticate({
            email: "user@example.com",
            password: "very-secure-password",
            deviceFingerprint: "device-fp-001"
        });

        expect(result.userId).toBe(fixtures.users[0].id);
        expect(fixtures.sessions).toHaveLength(1);
        expect(fixtures.securityEvents.at(-1)?.eventType).toBe("login");
    });

    it("rejects inactive user", () => {
        const fixtures = createFixtures();
        fixtures.users[0].status = "suspended";
        const service = new AuthService(fixtures.users, fixtures.devices, fixtures.sessions, fixtures.securityEvents);

        expect(() =>
            service.authenticate({
                email: "user@example.com",
                password: "very-secure-password",
                deviceFingerprint: "device-fp-001"
            })
        ).toThrow("User is not authorized");
        expect(fixtures.securityEvents.at(-1)?.eventType).toBe("access_denied");
    });

    it("rejects revoked device", () => {
        const fixtures = createFixtures();
        fixtures.devices[0].status = "revoked";
        const service = new AuthService(fixtures.users, fixtures.devices, fixtures.sessions, fixtures.securityEvents);

        expect(() =>
            service.authenticate({
                email: "user@example.com",
                password: "very-secure-password",
                deviceFingerprint: "device-fp-001"
            })
        ).toThrow("Device is not authorized");
        expect(fixtures.securityEvents.at(-1)?.eventType).toBe("access_denied");
    });
});
