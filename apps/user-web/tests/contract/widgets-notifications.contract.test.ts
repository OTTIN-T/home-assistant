import { describe, expect, it } from "vitest";
import { registerPushSubscription } from "../../server/api/v1/notifications/subscriptions.post";
import { updateWidgetsLayout } from "../../server/api/v1/widgets/layout.put";
import { createRuntimeDeps } from "../../server/services/runtime-deps";
import { createRuntimeStore } from "../../server/services/runtime-store";

describe("Widgets and notifications contracts", () => {
  it("PUT /v1/widgets/layout saves layout", () => {
    const store = createRuntimeStore();
    const deps = createRuntimeDeps(store);

    const result = updateWidgetsLayout(
      store.users[0].id,
      {
        widgets: [
          { widgetType: "status", position: 0, visible: true },
          { widgetType: "sensor", position: 1, visible: true, parameters: { sensor: "temp" } }
        ]
      },
      deps
    );

    expect(result.updated).toBe(2);
  });

  it("POST /v1/notifications/subscriptions registers subscription", () => {
    const store = createRuntimeStore();
    const deps = createRuntimeDeps(store);

    const result = registerPushSubscription(
      store.users[0].id,
      {
        endpoint: "https://push.example/sub-1",
        keys: { p256dh: "abc", auth: "def" }
      },
      deps
    );

    expect(result.id).toBeDefined();
  });
});
