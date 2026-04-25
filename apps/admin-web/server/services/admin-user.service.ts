import type { SecurityEventEntity, UserEntity, UserRole } from "@home-assistant/shared";

export class AdminUserService {
  public constructor(
    private readonly users: UserEntity[],
    private readonly securityEvents: SecurityEventEntity[]
  ) {}

  public updateRole(
    actor: { id: string; role: "admin" | "user" },
    userId: string,
    role: UserRole
  ): UserEntity {
    if (actor.role !== "admin") {
      this.securityEvents.push({
        id: crypto.randomUUID(),
        eventType: "admin_action",
        severity: "warning",
        userId: actor.id,
        deviceId: null,
        targetId: userId,
        details: { action: "role_change_denied", reason: "admin_role_required" },
        legalHoldActive: false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      });
      throw new Error("Admin role required");
    }

    const target = this.users.find((item) => item.id === userId);
    if (!target) {
      throw new Error("User not found");
    }

    target.role = role;
    target.updatedAt = new Date().toISOString();

    this.securityEvents.push({
      id: crypto.randomUUID(),
      eventType: "role_change",
      severity: "warning",
      userId: actor.id,
      deviceId: null,
      targetId: userId,
      details: { role },
      legalHoldActive: false,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    });

    return target;
  }
}
