import { createError, defineEventHandler, getRouterParam } from "h3";
import type { ProfileContract } from "@home-assistant/shared";
import { createRuntimeDeps } from "../../../../services/runtime-deps";

export function activateProfile(
  userId: string,
  profileId: string,
  deps = createRuntimeDeps()
): ProfileContract {
  return deps.userProfileService.activate(userId, profileId);
}

export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({ statusCode: 401, statusMessage: "Missing authentication context" });
  }

  const profileId = getRouterParam(event, "profileId");
  if (!profileId) {
    throw createError({ statusCode: 400, statusMessage: "Missing profile id" });
  }

  try {
    return activateProfile(event.context.auth.userId, profileId);
  } catch {
    throw createError({ statusCode: 404, statusMessage: "Profile not found" });
  }
});
