import type { RegisteredDeviceEntity, SecurityEventEntity, UserEntity } from "@home-assistant/shared";
import type { AccessSessionRecord } from "./runtime-store";

export interface AuthSuccess {
    token: string;
    userId: string;
    deviceId: string;
}

interface AuthInput {
    email: string;
    password: string;
    deviceFingerprint: string;
}

export class AuthService {
    public constructor(
        private readonly users: UserEntity[],
        private readonly devices: RegisteredDeviceEntity[],
        private readonly sessions: AccessSessionRecord[],
        private readonly securityEvents: SecurityEventEntity[]
    ) { }

    public authenticate(input: AuthInput): AuthSuccess {
        void input.password;

        const user = this.users.find((item) => item.email === input.email);
        if (!user || user.status !== "active") {
            this.logSecurityEvent("access_denied", "warning", user?.id ?? null, null, {
                reason: "user_not_allowed"
            });
            throw new Error("User is not authorized");
        }

        const device = this.devices.find((item) => item.fingerprint === input.deviceFingerprint);
        if (!device || device.userId !== user.id || device.status !== "authorized") {
            this.logSecurityEvent("access_denied", "warning", user.id, device?.id ?? null, {
                reason: "device_not_registered"
            });
            throw new Error("Device is not authorized");
        }

        const now = new Date().toISOString();
        const session: AccessSessionRecord = {
            id: crypto.randomUUID(),
            userId: user.id,
            deviceId: device.id,
            status: "open",
            openedAt: now,
            closedAt: null
        };
        this.sessions.push(session);

        const tokenPayload = {
            sub: user.id,
            role: user.role,
            deviceId: device.id,
            deviceFingerprint: device.fingerprint,
            exp: Math.floor(Date.now() / 1000) + 60 * 60
        };
        const token = this.encodeUnsignedJwt(tokenPayload);

        this.logSecurityEvent("login", "info", user.id, device.id, { sessionId: session.id });

        return {
            token,
            userId: user.id,
            deviceId: device.id
        };
    }

    private encodeUnsignedJwt(payload: Record<string, unknown>): string {
        const header = { alg: "none", typ: "JWT" };
        const encode = (value: unknown) =>
            Buffer.from(JSON.stringify(value), "utf8")
                .toString("base64url")
                .replace(/=/g, "");

        return `${encode(header)}.${encode(payload)}.`;
    }

    private logSecurityEvent(
        eventType: SecurityEventEntity["eventType"],
        severity: SecurityEventEntity["severity"],
        userId: string | null,
        deviceId: string | null,
        details: Record<string, unknown>
    ): void {
        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + 90 * 24 * 60 * 60 * 1000);
        this.securityEvents.push({
            id: crypto.randomUUID(),
            eventType,
            severity,
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
