import { describe, expect, it } from "vitest";
import { getAuditEvents } from "../../server/api/admin/v1/audit/events.get";
import { revokeDevice } from "../../server/api/admin/v1/devices/[deviceId]/revoke.post";
import { createAdminRuntimeDeps } from "../../server/services/runtime-deps";

describe("GET /admin/v1/audit/events", () => {
  it("lists audit events with severity filtering", () => {
    const deps = createAdminRuntimeDeps();
    revokeDevice(
      "22222222-2222-2222-2222-222222222222",
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      deps
    );

    const warnings = getAuditEvents("warning", deps);
    expect(Array.isArray(warnings)).toBe(true);
    expect(warnings.length).toBeGreaterThanOrEqual(1);
  });
});
