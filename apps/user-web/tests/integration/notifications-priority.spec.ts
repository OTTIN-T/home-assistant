import { describe, expect, it } from "vitest";
import { registerPushSubscription } from "../../server/api/v1/notifications/subscriptions.post";
import { createRuntimeDeps } from "../../server/services/runtime-deps";
import { createRuntimeStore } from "../../server/services/runtime-store";

describe("US2 integration: notifications priority", () => {
  it("dispatches notifications with expected mode and delivery count", () => {
    const store = createRuntimeStore();
    const deps = createRuntimeDeps(store);

    registerPushSubscription(
      store.users[0].id,
      {
        endpoint: "https://push.example/subscription-a",
        keys: { p256dh: "a", auth: "b" }
      },
      deps
    );

    const result = deps.notificationDispatchService.dispatch("critical");
    expect(result.mode).toBe("alert");
    expect(result.delivered).toBe(1);
  });
});
