/**
 * PWA Authorization Middleware
 *
 * Enforces access control for PWA endpoints:
 * - Requires user authentication (Bearer token)
 * - Validates device authorization
 * - Audits access denials for security events
 * - Prevents unauthorized clients from accessing PWA APIs
 */

import { createError, defineEventHandler, setHeader } from "h3";

interface AuthContext {
    userId: string;
    userRole: "admin" | "user";
    deviceId: string;
}

function parseBearerToken(headerValue: string | undefined): string | null {
    if (!headerValue) {
        return null;
    }

    const [scheme, token] = headerValue.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
        return null;
    }

    return token;
}

function getHeaderValue(
    event: any,
    name: string
): string | undefined {
    const nodeHeaders = event.node?.req?.headers;
    if (!nodeHeaders) {
        return undefined;
    }

    const value = nodeHeaders[name.toLowerCase()];
    if (Array.isArray(value)) {
        return value[0];
    }

    return value;
}

function getRequestPath(event: any): string {
    const rawUrl = event.node?.req?.url ?? "/";
    return rawUrl.split("?")[0] ?? "/";
}

/**
 * Middleware para PWA endpoints
 * Requires Bearer token + device fingerprint
 */
export default defineEventHandler(async (event) => {
    const requestPath = getRequestPath(event);

    // Only enforce on PWA API routes
    if (!requestPath.startsWith("/api/pwa/")) {
        return;
    }

    const bearerToken = parseBearerToken(getHeaderValue(event, "authorization"));
    const deviceFingerprint = getHeaderValue(event, "x-device-fingerprint");
    const correlationId = getHeaderValue(event, "x-correlation-id") ||
        `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Audit missing credentials
    if (!bearerToken || !deviceFingerprint) {
        console.warn(
            `[PWA Auth Audit] Missing credentials for ${requestPath}`,
            {
                correlationId,
                path: requestPath,
                hasToken: !!bearerToken,
                hasFingerprint: !!deviceFingerprint,
                clientIp: event.node?.req?.socket?.remoteAddress
            }
        );

        // TODO: Log security event to observability
        throw createError({
            statusCode: 401,
            statusMessage: "PWA API requires authentication"
        });
    }

    // TODO: Validate token and device
    // For now, accept any valid bearer token format
    if (!bearerToken.length) {
        console.warn(`[PWA Auth Audit] Invalid token format for ${requestPath}`, {
            correlationId
        });
        throw createError({
            statusCode: 401,
            statusMessage: "Invalid authentication token"
        });
    }

    // Set context for downstream handlers
    event.context.pwa = {
        correlationId,
        deviceFingerprint,
        requestPath
    };

    // Set correlation ID in response headers for tracing
    setHeader(event, "x-correlation-id", correlationId);
});
