import type { SecurityEventEntity, SecurityEventSeverity, SecurityEventType } from "../schemas/entities.types";

export interface SecurityEventRepository {
  insert(event: SecurityEventEntity): Promise<void>;
}

export interface SecurityEventCreateInput {
  eventType: SecurityEventType;
  severity: SecurityEventSeverity;
  userId?: string | null;
  deviceId?: string | null;
  targetId?: string | null;
  details: Record<string, unknown>;
  legalHoldActive?: boolean;
  now?: Date;
}

export class SecurityEventService {
  public static readonly retentionDays = 90;

  public constructor(private readonly repository: SecurityEventRepository) {}

  public async create(input: SecurityEventCreateInput): Promise<SecurityEventEntity> {
    const now = input.now ?? new Date();
    const expiresAt = new Date(now.getTime() + SecurityEventService.retentionDays * 24 * 60 * 60 * 1000);

    const event: SecurityEventEntity = {
      id: crypto.randomUUID(),
      eventType: input.eventType,
      severity: input.severity,
      userId: input.userId ?? null,
      deviceId: input.deviceId ?? null,
      targetId: input.targetId ?? null,
      details: input.details,
      legalHoldActive: input.legalHoldActive ?? false,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    await this.repository.insert(event);
    return event;
  }

  public static shouldPurge(event: Pick<SecurityEventEntity, "expiresAt" | "legalHoldActive">, now = new Date()): boolean {
    if (event.legalHoldActive) {
      return false;
    }

    return new Date(event.expiresAt).getTime() <= now.getTime();
  }
}
