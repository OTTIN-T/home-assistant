import { createError, defineEventHandler, getRequestHeader } from "h3";

export interface AdminAuthContext {
  userId: string;
  userRole: "admin" | "user";
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

export default defineEventHandler(async (event) => {
  const bearerToken = parseBearerToken(getRequestHeader(event, "authorization"));
  if (!bearerToken) {
    throw createError({ statusCode: 401, statusMessage: "Missing authentication token" });
  }

  let payload: { sub: string; role: "admin" | "user"; exp?: number };
  try {
    payload = decodeJwtPayload(bearerToken);
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid authentication token" });
  }

  const nowEpochSeconds = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < nowEpochSeconds) {
    throw createError({ statusCode: 401, statusMessage: "Expired authentication token" });
  }

  if (payload.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Admin role required" });
  }

  event.context.adminAuth = {
    userId: payload.sub,
    userRole: payload.role
  } satisfies AdminAuthContext;
});
