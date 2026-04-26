import { createError, defineEventHandler } from "h3";

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

function decodeBase64Url<T>(input: string): T {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const decoded = Buffer.from(padded, "base64").toString("utf8");
  return JSON.parse(decoded) as T;
}

function decodeJwtPayload<T>(token: string): T {
  const parts = token.split(".");
  const payloadPart = parts[1];
  if (!payloadPart) {
    throw new Error("Invalid token format");
  }

  return decodeBase64Url<T>(payloadPart);
}

function getHeaderValue(event: unknown, name: string): string | undefined {
  const nodeHeaders = (event as { node?: { req?: { headers?: Record<string, string | string[] | undefined> } } }).node?.req?.headers;
  if (!nodeHeaders) {
    return undefined;
  }

  const value = nodeHeaders[name.toLowerCase()];
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getRequestPath(event: unknown): string {
  const rawUrl = (event as { node?: { req?: { url?: string } } }).node?.req?.url ?? "/";
  return rawUrl.split("?")[0] ?? "/";
}

function shouldAuthenticate(requestPath: string): boolean {
  if (!requestPath.startsWith("/api/v1/")) {
    return false;
  }

  return requestPath !== "/api/v1/auth/session";
}

export default defineEventHandler(async (event) => {
  const requestPath = getRequestPath(event);
  if (!shouldAuthenticate(requestPath)) {
    return;
  }

  const bearerToken = parseBearerToken(getHeaderValue(event, "authorization"));
  const deviceFingerprint = getHeaderValue(event, "x-device-fingerprint");

  if (!bearerToken || !deviceFingerprint) {
    throw createError({ statusCode: 401, statusMessage: "Missing authentication context" });
  }

  let payload: {
    sub: string;
    role: "admin" | "user";
    deviceId: string;
    deviceFingerprint: string;
    exp?: number;
  };

  try {
    payload = decodeJwtPayload(bearerToken);
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid authentication token" });
  }

  const nowEpochSeconds = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < nowEpochSeconds) {
    throw createError({ statusCode: 401, statusMessage: "Expired authentication token" });
  }

  if (payload.deviceFingerprint !== deviceFingerprint) {
    throw createError({ statusCode: 403, statusMessage: "Device is not authorized" });
  }

  event.context.auth = {
    userId: payload.sub,
    userRole: payload.role,
    deviceId: payload.deviceId
  } satisfies AuthContext;
});
