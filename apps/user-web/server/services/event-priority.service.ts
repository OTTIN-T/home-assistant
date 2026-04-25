export type EventLevel = "critical" | "warning" | "info";
export type NotificationMode = "alert" | "notify" | "silent";

export class EventPriorityService {
  public classify(level: EventLevel): NotificationMode {
    if (level === "critical") {
      return "alert";
    }
    if (level === "warning") {
      return "notify";
    }
    return "silent";
  }
}
