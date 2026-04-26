import type { HomeDeviceEntity, SecurityEventEntity } from "@home-assistant/shared";
import type { DeviceCommandRecord } from "./runtime-store";

interface CommandInput {
    device: HomeDeviceEntity;
    issuerUserId: string;
    issuerRole: "admin" | "user";
    action: string;
    payload: Record<string, unknown>;
    requestId?: string;
}

export type CommandResult =
    | { statusCode: 202; body: { commandId: string; status: "received" | "executed" } }
    | { statusCode: 409; body: { commandId: string; status: "rejected"; reason: string } }
    | { statusCode: 423; body: { code: string; message: string } };

export class DeviceCommandService {
    public constructor(
        private readonly commands: DeviceCommandRecord[],
        private readonly securityEvents: SecurityEventEntity[]
    ) { }

    public submit(input: CommandInput): CommandResult {
        if (input.device.accessMode === "read_only") {
            return {
                statusCode: 423,
                body: {
                    code: "device_read_only",
                    message: "Device is read-only"
                }
            };
        }

        const existingRecent = this.commands.find(
            (item) => item.deviceId === input.device.id && Date.now() - Date.parse(item.createdAt) < 5000
        );

        if (existingRecent && existingRecent.issuerRole === "admin" && input.issuerRole === "user") {
            const arbitratedId = crypto.randomUUID();
            this.logArbitration(input.issuerUserId, input.device.id, {
                reason: "admin_priority",
                action: input.action,
                payload: input.payload
            });
            return {
                statusCode: 409,
                body: {
                    commandId: arbitratedId,
                    status: "rejected",
                    reason: "admin_priority"
                }
            };
        }

        const now = new Date().toISOString();
        const command: DeviceCommandRecord = {
            id: crypto.randomUUID(),
            deviceId: input.device.id,
            issuerUserId: input.issuerUserId,
            issuerRole: input.issuerRole,
            action: input.action,
            priority: input.issuerRole === "admin" ? 100 : 10,
            status: "executed",
            statusReason: null,
            requestId: input.requestId ?? crypto.randomUUID(),
            createdAt: now,
            executedAt: now
        };

        this.commands.push(command);

        if (input.action === "turn_on") {
            input.device.currentState = { ...input.device.currentState, power: "on" };
        }
        if (input.action === "turn_off") {
            input.device.currentState = { ...input.device.currentState, power: "off" };
        }

        return {
            statusCode: 202,
            body: {
                commandId: command.id,
                status: "executed"
            }
        };
    }

    private logArbitration(
        userId: string,
        deviceId: string,
        details: Record<string, unknown>
    ): void {
        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + 90 * 24 * 60 * 60 * 1000);
        this.securityEvents.push({
            id: crypto.randomUUID(),
            eventType: "command_arbitration",
            severity: "warning",
            userId,
            deviceId,
            targetId: null,
            details,
            legalHoldActive: false,
            createdAt: createdAt.toISOString(),
            expiresAt: expiresAt.toISOString()
        });
    }
}
