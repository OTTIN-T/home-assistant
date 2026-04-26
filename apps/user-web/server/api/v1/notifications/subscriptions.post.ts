import { createError, defineEventHandler, readBody } from "h3";
import type { PushSubscriptionRequest } from "@home-assistant/shared";
import { createRuntimeDeps } from "../../../services/runtime-deps";

export function registerPushSubscription(
  userId: string,
  payload: PushSubscriptionRequest,
  deps = createRuntimeDeps()
): { id: string } {
  const record = deps.notificationDispatchService.register(userId, payload);
  return { id: record.id };
}

export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({ statusCode: 401, statusMessage: "Missing authentication context" });
  }

  const payload = await readBody<PushSubscriptionRequest>(event);
  if (!payload) {
    throw createError({ statusCode: 400, statusMessage: "Missing request body" });
  }

  return registerPushSubscription(event.context.auth.userId, payload);
});
