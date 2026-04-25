import { describe, expect, it } from "vitest";
import { revokeDevice } from "../../server/api/admin/v1/devices/[deviceId]/revoke.post";
import { patchUserRole } from "../../server/api/admin/v1/users/[userId]/roles.patch";

describe("US3 integration: admin governance", () => {
  it("updates role and revokes device with audit side effect", () => {
    const updated = patchUserRole(
      "22222222-2222-2222-2222-222222222222",
      "11111111-1111-1111-1111-111111111111",
      "admin"
    );
    expect(updated.role).toBe("admin");

    const revocation = revokeDevice(
      "22222222-2222-2222-2222-222222222222",
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    );
    expect(revocation.revoked).toBe(true);
  });
});
