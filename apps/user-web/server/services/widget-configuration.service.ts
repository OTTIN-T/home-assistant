import type { WidgetConfigurationEntity } from "@home-assistant/shared";
import type { WidgetLayoutItem } from "@home-assistant/shared";

const widgetCatalog = new Set(["status", "button", "sensor"]);

export class WidgetConfigurationService {
  public constructor(private readonly widgets: WidgetConfigurationEntity[]) {}

  public saveLayout(profileId: string, layout: WidgetLayoutItem[]): WidgetConfigurationEntity[] {
    for (const item of layout) {
      if (item.position < 0) {
        throw new Error("Invalid widget position");
      }
      if (!widgetCatalog.has(item.widgetType)) {
        throw new Error("Unknown widget type");
      }
    }

    const kept = this.widgets.filter((item) => item.profileId !== profileId);
    const next = layout.map((item) => ({
      id: crypto.randomUUID(),
      profileId,
      widgetType: item.widgetType,
      position: item.position,
      parameters: item.parameters ?? {},
      visible: item.visible
    }));

    this.widgets.splice(0, this.widgets.length, ...kept, ...next);
    return this.widgets.filter((item) => item.profileId === profileId);
  }

  public listByProfile(profileId: string): WidgetConfigurationEntity[] {
    return this.widgets.filter((item) => item.profileId === profileId);
  }
}
