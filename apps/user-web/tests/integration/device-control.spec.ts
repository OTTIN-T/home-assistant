import { describe, expect, it } from "vitest";
import { createAuthSession } from "../../server/api/v1/auth/session.post";
import { listUserDevices } from "../../server/api/v1/devices/index.get";
import { submitDeviceCommand } from "../../server/api/v1/devices/[deviceId]/commands.post";
import { createRuntimeDeps } from "../../server/services/runtime-deps";

describe("US1 integration: login and device command", () => {
    it("authenticates and controls a device end-to-end", async () => {
        const deps = createRuntimeDeps();

        const auth = await createAuthSession(
            {
                email: "user@example.com",
                password: "very-secure-password",
                deviceFingerprint: "device-fp-001"
            },
            deps
        );

        expect(auth.statusCode).toBe(201);

        const devices = listUserDevices(deps);
        expect(devices.length).toBeGreaterThan(0);

        const command = submitDeviceCommand(
            devices[0].id,
            { action: "turn_on", payload: {} },
            {
                userId: deps.store.users[0].id,
                userRole: "user"
            },
            deps
        );

        expect(command.statusCode).toBe(202);
    });
});
