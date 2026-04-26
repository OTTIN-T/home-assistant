import { describe, expect, it } from "vitest";
import { activateProfile } from "../../server/api/v1/profiles/[profileId]/activate.post";
import { createProfile } from "../../server/api/v1/profiles/index.post";
import { createRuntimeDeps } from "../../server/services/runtime-deps";
import { createRuntimeStore } from "../../server/services/runtime-store";

describe("Profiles contracts", () => {
  it("POST /v1/profiles returns profile", () => {
    const store = createRuntimeStore();
    const deps = createRuntimeDeps(store);

    const profile = createProfile(
      store.users[0].id,
      {
        name: "Evening",
        uiPreferences: { theme: "dark" }
      },
      deps
    );

    expect(profile.id).toBeDefined();
    expect(profile.name).toBe("Evening");
  });

  it("POST /v1/profiles/{profileId}/activate sets profile active", () => {
    const store = createRuntimeStore();
    const deps = createRuntimeDeps(store);

    const profile = createProfile(
      store.users[0].id,
      {
        name: "Work",
        uiPreferences: { density: "compact" }
      },
      deps
    );

    const activated = activateProfile(store.users[0].id, profile.id, deps);
    expect(activated.isActive).toBe(true);
  });
});
