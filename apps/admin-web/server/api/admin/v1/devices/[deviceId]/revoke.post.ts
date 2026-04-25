import { createError, defineEventHandler, getRouterParam } from "h3";
import { createAdminRuntimeDeps } from "../../../../../services/runtime-deps";

export function revokeDevice(
  actorId: string,
  deviceId: string,
  deps = createAdminRuntimeDeps()
) {
  return deps.adminDeviceService.revokeDevice(actorId, deviceId);
}

export default defineEventHandler(async (event) => {
  if (!event.context.adminAuth) {
    throw createError({ statusCode: 403, statusMessage: "Admin role required" });
  }

  const deviceId = getRouterParam(event, "deviceId");
  if (!deviceId) {
    throw createError({ statusCode: 400, statusMessage: "Missing device id" });
  }

  try {
    return revokeDevice(event.context.adminAuth.userId, deviceId, createAdminRuntimeDeps());
  } catch {
    throw createError({ statusCode: 404, statusMessage: "Device not found" });
  }
});
