import { describe, expect, it } from "vitest";
import type { UserProfileEntity } from "@home-assistant/shared";
import { UserProfileService } from "../../server/services/user-profile.service";

function fixtures(): UserProfileEntity[] {
  const now = new Date().toISOString();
  return [
    {
      id: "1",
      userId: "u1",
      name: "Default",
      isActive: true,
      uiPreferences: {},
      createdAt: now,
      updatedAt: now
    },
    {
      id: "2",
      userId: "u1",
      name: "Evening",
      isActive: false,
      uiPreferences: {},
      createdAt: now,
      updatedAt: now
    }
  ];
}

describe("UserProfileService", () => {
  it("creates profile", () => {
    const profiles = fixtures();
    const service = new UserProfileService(profiles);

    const created = service.create("u1", { name: "Away", uiPreferences: { lock: true } });
    expect(created.name).toBe("Away");
    expect(profiles.length).toBe(3);
  });

  it("activates selected profile and deactivates others", () => {
    const profiles = fixtures();
    const service = new UserProfileService(profiles);

    const activated = service.activate("u1", "2");
    expect(activated.id).toBe("2");
    expect(profiles.find((item) => item.id === "1")?.isActive).toBe(false);
    expect(profiles.find((item) => item.id === "2")?.isActive).toBe(true);
  });
});
