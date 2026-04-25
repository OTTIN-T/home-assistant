import { createError, defineEventHandler, readBody } from "h3";
import type { WidgetsConfigurationRequest } from "@home-assistant/shared";
import { createRuntimeDeps } from "../../../services/runtime-deps";

export function updateWidgetsLayout(
  userId: string,
  payload: WidgetsConfigurationRequest,
  deps = createRuntimeDeps()
): { updated: number } {
  const activeProfile = deps.userProfileService.getActiveProfile(userId);
  if (!activeProfile) {
    throw new Error("Active profile not found");
  }

  const saved = deps.widgetConfigurationService.saveLayout(activeProfile.id, payload.widgets);
  return { updated: saved.length };
}

export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({ statusCode: 401, statusMessage: "Missing authentication context" });
  }

  const payload = await readBody<WidgetsConfigurationRequest>(event);
  if (!payload) {
    throw createError({ statusCode: 400, statusMessage: "Missing request body" });
  }

  try {
    return updateWidgetsLayout(event.context.auth.userId, payload);
  } catch (error) {
    throw createError({ statusCode: 400, statusMessage: (error as Error).message });
  }
});
