import { describe, expect, it } from "vitest";
import type { SecurityEventEntity, UserEntity } from "@home-assistant/shared";
import { AdminUserService } from "../../server/services/admin-user.service";

function fixtures() {
  const now = new Date().toISOString();
  const users: UserEntity[] = [
    { id: "u1", email: "u1@example.com", role: "user", status: "active", createdAt: now, updatedAt: now },
    { id: "a1", email: "a1@example.com", role: "admin", status: "active", createdAt: now, updatedAt: now }
  ];
  const events: SecurityEventEntity[] = [];

  return { users, events };
}

describe("AdminUserService", () => {
  it("changes role and creates security event", () => {
    const data = fixtures();
    const service = new AdminUserService(data.users, data.events);

    const user = service.updateRole({ id: "a1", role: "admin" }, "u1", "admin");
    expect(user.role).toBe("admin");
    expect(data.events.at(-1)?.eventType).toBe("role_change");
  });

  it("denies role change by non-admin and logs event", () => {
    const data = fixtures();
    const service = new AdminUserService(data.users, data.events);

    expect(() => service.updateRole({ id: "u1", role: "user" }, "a1", "user")).toThrow(
      "Admin role required"
    );
    expect(data.events.at(-1)?.eventType).toBe("admin_action");
  });

  it("throws when user does not exist", () => {
    const data = fixtures();
    const service = new AdminUserService(data.users, data.events);

    expect(() => service.updateRole({ id: "a1", role: "admin" }, "missing", "admin")).toThrow(
      "User not found"
    );
  });
});
