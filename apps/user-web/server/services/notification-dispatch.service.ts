import type { PushSubscriptionRequest } from "@home-assistant/shared";
import { EventPriorityService, type EventLevel, type NotificationMode } from "./event-priority.service";

export interface PushSubscriptionRecord {
  id: string;
  userId: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  createdAt: string;
}

export class NotificationDispatchService {
  public constructor(
    private readonly subscriptions: PushSubscriptionRecord[],
    private readonly priorityService: EventPriorityService
  ) {}

  public register(userId: string, subscription: PushSubscriptionRequest): PushSubscriptionRecord {
    const existing = this.subscriptions.find((item) => item.endpoint === subscription.endpoint);
    if (existing) {
      return existing;
    }

    const record: PushSubscriptionRecord = {
      id: crypto.randomUUID(),
      userId,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      createdAt: new Date().toISOString()
    };

    this.subscriptions.push(record);
    return record;
  }

  public dispatch(level: EventLevel): { mode: NotificationMode; delivered: number } {
    const mode = this.priorityService.classify(level);
    return {
      mode,
      delivered: this.subscriptions.length
    };
  }
}
