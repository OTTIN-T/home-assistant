import { describe, expect, it } from "vitest";
import { createAdminRuntimeDeps } from "../../server/services/runtime-deps";
import { createAdminRuntimeStore } from "../../server/services/runtime-store";

describe("US3 integration: device revocation latency", () => {
  it("invalidates open sessions immediately (<= 10s target)", () => {
    const store = createAdminRuntimeStore();
    const deps = createAdminRuntimeDeps(store);

    const start = Date.now();
    const result = deps.adminDeviceService.revokeDevice(
      "22222222-2222-2222-2222-222222222222",
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    );
    const durationMs = Date.now() - start;

    expect(result.invalidatedSessions).toBeGreaterThanOrEqual(1);
    expect(durationMs).toBeLessThanOrEqual(10_000);
  });
});
