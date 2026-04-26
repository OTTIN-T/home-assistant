import { describe, expect, it } from "vitest";
import { patchUserRole } from "../../server/api/admin/v1/users/[userId]/roles.patch";

describe("PATCH /admin/v1/users/{userId}/roles", () => {
  it("updates role and returns updated user", () => {
    const result = patchUserRole(
      "22222222-2222-2222-2222-222222222222",
      "11111111-1111-1111-1111-111111111111",
      "admin"
    );

    expect(result.role).toBe("admin");
  });
});
