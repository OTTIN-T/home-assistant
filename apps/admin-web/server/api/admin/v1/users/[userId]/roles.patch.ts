import { createError, defineEventHandler, getRouterParam, readBody } from "h3";
import type { UpdateRolesRequest } from "@home-assistant/shared";
import { createAdminRuntimeDeps } from "../../../../../services/runtime-deps";

export function patchUserRole(actorId: string, userId: string, role: "admin" | "user") {
  const deps = createAdminRuntimeDeps();
  return deps.adminUserService.updateRole({ id: actorId, role: "admin" }, userId, role);
}

export default defineEventHandler(async (event) => {
  if (!event.context.adminAuth) {
    throw createError({ statusCode: 403, statusMessage: "Admin role required" });
  }

  const userId = getRouterParam(event, "userId");
  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: "Missing user id" });
  }

  const payload = await readBody<UpdateRolesRequest>(event);
  if (!payload) {
    throw createError({ statusCode: 400, statusMessage: "Missing request body" });
  }

  try {
    return patchUserRole(event.context.adminAuth.userId, userId, payload.role);
  } catch {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }
});
