import { describe, expect, it } from "vitest";
import { createRuntimeDeps } from "../../server/services/runtime-deps";
import { createRuntimeStore } from "../../server/services/runtime-store";

describe("Notifications priority contract", () => {
  it("routes critical/warning/info to alert/notify/silent", () => {
    const deps = createRuntimeDeps(createRuntimeStore());

    expect(deps.eventPriorityService.classify("critical")).toBe("alert");
    expect(deps.eventPriorityService.classify("warning")).toBe("notify");
    expect(deps.eventPriorityService.classify("info")).toBe("silent");
  });
});
