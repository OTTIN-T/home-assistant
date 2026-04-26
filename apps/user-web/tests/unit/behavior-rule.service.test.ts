import { describe, expect, it } from "vitest";
import type { BehaviorRuleEntity, UserProfileEntity } from "@home-assistant/shared";
import { BehaviorRuleService } from "../../server/services/behavior-rule.service";

function fixtures() {
  const rules: BehaviorRuleEntity[] = [
    {
      id: "r1",
      profileId: "p1",
      context: { mode: "home" },
      targetAction: { temp: 21 },
      active: true
    },
    {
      id: "r2",
      profileId: "p1",
      context: { mode: "away" },
      targetAction: { alarm: true },
      active: false
    }
  ];

  const profiles: UserProfileEntity[] = [
    {
      id: "p1",
      userId: "u1",
      name: "Home",
      isActive: true,
      uiPreferences: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  return { rules, profiles };
}

describe("BehaviorRuleService", () => {
  it("returns matching active rules for active profile", () => {
    const data = fixtures();
    const service = new BehaviorRuleService(data.rules, data.profiles);

    const result = service.evaluate("u1", { mode: "home" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("r1");
  });

  it("ignores rules when profile is inactive", () => {
    const data = fixtures();
    data.profiles[0].isActive = false;
    const service = new BehaviorRuleService(data.rules, data.profiles);

    const result = service.evaluate("u1", { mode: "home" });
    expect(result).toHaveLength(0);
  });
});
