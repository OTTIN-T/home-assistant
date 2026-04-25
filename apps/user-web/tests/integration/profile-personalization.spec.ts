import { describe, expect, it } from "vitest";
import { activateProfile } from "../../server/api/v1/profiles/[profileId]/activate.post";
import { createProfile } from "../../server/api/v1/profiles/index.post";
import { updateWidgetsLayout } from "../../server/api/v1/widgets/layout.put";
import { createRuntimeDeps } from "../../server/services/runtime-deps";
import { createRuntimeStore } from "../../server/services/runtime-store";

describe("US2 integration: profile personalization", () => {
  it("creates profile, activates it, and persists widget layout", () => {
    const store = createRuntimeStore();
    const deps = createRuntimeDeps(store);
    const userId = store.users[0].id;

    const profile = createProfile(
      userId,
      { name: "Weekend", uiPreferences: { theme: "warm" } },
      deps
    );

    const activated = activateProfile(userId, profile.id, deps);
    expect(activated.isActive).toBe(true);

    const updated = updateWidgetsLayout(
      userId,
      {
        widgets: [
          { widgetType: "status", position: 0, visible: true },
          { widgetType: "button", position: 1, visible: true }
        ]
      },
      deps
    );

    expect(updated.updated).toBe(2);

    const sameStore = createRuntimeDeps(store);
    const persisted = sameStore.widgetConfigurationService.listByProfile(profile.id);
    expect(persisted).toHaveLength(2);
  });
});
