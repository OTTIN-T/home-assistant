import { describe, expect, it } from "vitest";
import type { WidgetConfigurationEntity } from "@home-assistant/shared";
import { WidgetConfigurationService } from "../../server/services/widget-configuration.service";

function fixtures(): WidgetConfigurationEntity[] {
  return [
    {
      id: "w1",
      profileId: "p1",
      widgetType: "status",
      position: 0,
      parameters: {},
      visible: true
    }
  ];
}

describe("WidgetConfigurationService", () => {
  it("saves valid layout", () => {
    const widgets = fixtures();
    const service = new WidgetConfigurationService(widgets);

    const saved = service.saveLayout("p1", [
      { widgetType: "status", position: 0, visible: true },
      { widgetType: "button", position: 1, visible: true }
    ]);

    expect(saved).toHaveLength(2);
  });

  it("rejects invalid position", () => {
    const widgets = fixtures();
    const service = new WidgetConfigurationService(widgets);

    expect(() =>
      service.saveLayout("p1", [{ widgetType: "status", position: -1, visible: true }])
    ).toThrow("Invalid widget position");
  });

  it("rejects unknown widget type", () => {
    const widgets = fixtures();
    const service = new WidgetConfigurationService(widgets);

    expect(() =>
      service.saveLayout("p1", [{ widgetType: "unknown", position: 0, visible: true }])
    ).toThrow("Unknown widget type");
  });
});
