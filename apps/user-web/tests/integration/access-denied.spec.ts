import { describe, expect, it } from "vitest";
import { createAuthSession } from "../../server/api/v1/auth/session.post";
import { createRuntimeDeps } from "../../server/services/runtime-deps";

describe("US1 integration: access denied audit", () => {
  it("rejects unregistered device and records security event", async () => {
    const deps = createRuntimeDeps();

    const result = await createAuthSession(
      {
        email: "user@example.com",
        password: "very-secure-password",
        deviceFingerprint: "not-registered"
      },
      deps
    );

    expect(result.statusCode).toBe(403);
    expect(deps.store.securityEvents.at(-1)?.eventType).toBe("access_denied");
  });
});
