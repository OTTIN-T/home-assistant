import { createError, defineEventHandler, readBody } from "h3";
import type { SessionCreateRequest, SessionCreateResponse } from "@home-assistant/shared";
import { createRuntimeDeps } from "../../../services/runtime-deps";

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
  const payload = await readBody<SessionCreateRequest>(event);
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
