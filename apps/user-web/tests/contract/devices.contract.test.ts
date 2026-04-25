import { describe, expect, it } from "vitest";
import { listUserDevices } from "../../server/api/v1/devices/index.get";
import { submitDeviceCommand } from "../../server/api/v1/devices/[deviceId]/commands.post";
import { createRuntimeDeps } from "../../server/services/runtime-deps";

describe("Devices contracts", () => {
    it("GET /v1/devices returns visible devices", () => {
        const deps = createRuntimeDeps();
        const result = listUserDevices(deps);

        expect(result.length).toBeGreaterThan(0);
    });

    it("POST /v1/devices/{deviceId}/commands returns 202 on accepted command", () => {
        const deps = createRuntimeDeps();
        const deviceId = deps.store.homeDevices[0].id;

        const result = submitDeviceCommand(
            deviceId,
            { action: "turn_on", payload: {} },
            {
                userId: deps.store.users[0].id,
                userRole: "user"
            },
            deps
        );

        expect(result.statusCode).toBe(202);
    });

    it("POST /v1/devices/{deviceId}/commands returns 423 for read-only device", () => {
        const deps = createRuntimeDeps();
        deps.store.homeDevices[0].accessMode = "read_only";

        const result = submitDeviceCommand(
            deps.store.homeDevices[0].id,
            { action: "turn_on", payload: {} },
            {
                userId: deps.store.users[0].id,
                userRole: "user"
            },
            deps
        );

        expect(result.statusCode).toBe(423);
    });

    it("POST /v1/devices/{deviceId}/commands returns 409 when admin command has priority", () => {
        const deps = createRuntimeDeps();
        const deviceId = deps.store.homeDevices[0].id;

        submitDeviceCommand(
            deviceId,
            { action: "turn_on", payload: {} },
            {
                userId: deps.store.users[1].id,
                userRole: "admin"
            },
            deps
        );

        const result = submitDeviceCommand(
            deviceId,
            { action: "turn_off", payload: {} },
            {
                userId: deps.store.users[0].id,
                userRole: "user"
            },
            deps
        );

        expect(result.statusCode).toBe(409);
    });
});
