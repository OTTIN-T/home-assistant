import { createError, defineEventHandler, readBody } from "h3";
import type { ProfileCreateRequest, ProfileContract } from "@home-assistant/shared";
import { createRuntimeDeps } from "../../../services/runtime-deps";

export function createProfile(
  userId: string,
  payload: ProfileCreateRequest,
  deps = createRuntimeDeps()
): ProfileContract {
  return deps.userProfileService.create(userId, payload);
}

export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({ statusCode: 401, statusMessage: "Missing authentication context" });
  }

  const payload = await readBody<ProfileCreateRequest>(event);
  if (!payload) {
    throw createError({ statusCode: 400, statusMessage: "Missing request body" });
  }

  return createProfile(event.context.auth.userId, payload);
});
