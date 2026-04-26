import { describe, expect, it } from "vitest";
import { createAuthSession } from "../../server/api/v1/auth/session.post";
import { createRuntimeDeps } from "../../server/services/runtime-deps";

describe("POST /v1/auth/session contract", () => {
    it("returns 201 for valid user and device", async () => {
        const deps = createRuntimeDeps();
        const result = await createAuthSession(
            {
                email: "user@example.com",
                password: "very-secure-password",
                deviceFingerprint: "device-fp-001"
            },
            deps
        );

        expect(result.statusCode).toBe(201);
    });

    it("returns 403 for unauthorized device", async () => {
        const deps = createRuntimeDeps();
        const result = await createAuthSession(
            {
                email: "user@example.com",
                password: "very-secure-password",
                deviceFingerprint: "unknown-device"
            },
            deps
        );

        expect(result.statusCode).toBe(403);
    });
});
