import { describe, expect, it } from "vitest";
import { revokeDevice } from "../../server/api/admin/v1/devices/[deviceId]/revoke.post";
import { createAdminRuntimeDeps } from "../../server/services/runtime-deps";

describe("POST /admin/v1/devices/{deviceId}/revoke", () => {
  it("revokes device", () => {
    const deps = createAdminRuntimeDeps();
    const result = revokeDevice(
      "22222222-2222-2222-2222-222222222222",
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      deps
    );

    expect(result.revoked).toBe(true);
  });

  it("is idempotent when already revoked", () => {
    const deps = createAdminRuntimeDeps();
    revokeDevice(
      "22222222-2222-2222-2222-222222222222",
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      deps
    );
    const second = revokeDevice(
      "22222222-2222-2222-2222-222222222222",
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      deps
    );

    expect(second.revoked).toBe(false);
  });
});
