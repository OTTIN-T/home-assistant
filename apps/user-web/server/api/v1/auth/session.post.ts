import { createError, defineEventHandler } from "h3";
import type { SessionCreateRequest, SessionCreateResponse } from "@home-assistant/shared";
import { createRuntimeDeps } from "../../../services/runtime-deps";

async function readJsonBody<T>(event: unknown): Promise<T | null> {
  const req = (event as { node?: { req?: AsyncIterable<Buffer | string> } }).node?.req;
  if (!req) {
    return null;
  }

  let raw = "";
  for await (const chunk of req) {
    raw += typeof chunk === "string" ? chunk : chunk.toString("utf8");
  }

  if (!raw.trim()) {
    return null;
  }

  return JSON.parse(raw) as T;
}

export async function createAuthSession(
  payload: SessionCreateRequest,
  deps = createRuntimeDeps()
): Promise<{ statusCode: 201; body: SessionCreateResponse } | { statusCode: 403; body: { code: string; message: string } }> {
  try {
    const body = deps.authService.authenticate(payload);
    return { statusCode: 201, body };
  } catch {
    return {
      statusCode: 403,
      body: {
        code: "access_denied",
        message: "User or device is not authorized"
      }
    };
  }
}

export default defineEventHandler(async (event) => {
  let payload: SessionCreateRequest | null;
  try {
    payload = await readJsonBody<SessionCreateRequest>(event);
  } catch {
    throw createError({ statusCode: 400, statusMessage: "Invalid JSON body" });
  }

  if (!payload) {
    throw createError({ statusCode: 400, statusMessage: "Missing request body" });
  }

  const result = await createAuthSession(payload);

  if (result.statusCode === 403) {
    const errorBody = result.body as { code: string; message: string };
    throw createError({
      statusCode: 403,
      statusMessage: errorBody.message,
      data: errorBody
    });
  }

  return result.body;
});
