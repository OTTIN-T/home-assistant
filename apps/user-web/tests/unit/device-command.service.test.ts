import { describe, expect, it } from "vitest";
import { DeviceCommandService } from "../../server/services/device-command.service";
import type { HomeDeviceEntity, SecurityEventEntity } from "@home-assistant/shared";

function baseDevice(): HomeDeviceEntity {
    return {
        id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        providerId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        name: "Living Room Light",
        category: "light",
        capabilities: { actions: ["turn_on", "turn_off"] },
        currentState: { power: "off" },
        accessMode: "read_write",
        updatedAt: new Date().toISOString()
    };
}

describe("DeviceCommandService", () => {
    it("accepts and executes command on writable device", () => {
        const commands = [];
        const events: SecurityEventEntity[] = [];
        const service = new DeviceCommandService(commands, events);
        const device = baseDevice();

        const result = service.submit({
            device,
            issuerUserId: "11111111-1111-1111-1111-111111111111",
            issuerRole: "user",
            action: "turn_on",
            payload: {}
        });

        expect(result.statusCode).toBe(202);
        expect(device.currentState.power).toBe("on");
    });

    it("arbitrates user command when recent admin command exists", () => {
        const commands = [
            {
                id: crypto.randomUUID(),
                deviceId: "cccccccc-cccc-cccc-cccc-cccccccccccc",
                issuerUserId: "22222222-2222-2222-2222-222222222222",
                issuerRole: "admin" as const,
                action: "turn_on",
                priority: 100,
                status: "executed" as const,
                statusReason: null,
                requestId: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                executedAt: new Date().toISOString()
            }
        ];
        const events: SecurityEventEntity[] = [];
        const service = new DeviceCommandService(commands, events);

        const result = service.submit({
            device: baseDevice(),
            issuerUserId: "11111111-1111-1111-1111-111111111111",
            issuerRole: "user",
            action: "turn_off",
            payload: {}
        });

        expect(result.statusCode).toBe(409);
        expect(events.at(-1)?.eventType).toBe("command_arbitration");
    });

    it("rejects command on read-only device", () => {
        const commands = [];
        const events: SecurityEventEntity[] = [];
        const service = new DeviceCommandService(commands, events);
        const device = baseDevice();
        device.accessMode = "read_only";

        const result = service.submit({
            device,
            issuerUserId: "11111111-1111-1111-1111-111111111111",
            issuerRole: "user",
            action: "turn_on",
            payload: {}
        });

        expect(result.statusCode).toBe(423);
    });
});
