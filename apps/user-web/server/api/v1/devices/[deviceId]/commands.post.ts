import { createError, defineEventHandler, getRouterParam, readBody } from "h3";
import type { CommandRequest, CommandAccepted, CommandArbitrated, ErrorResponse } from "@home-assistant/shared";
import { createRuntimeDeps } from "../../../../services/runtime-deps";

export type CommandEndpointResult =
  | { statusCode: 202; body: CommandAccepted }
  | { statusCode: 409; body: CommandArbitrated }
  | { statusCode: 423; body: ErrorResponse }
  | { statusCode: 404; body: ErrorResponse };

interface RequestAuthContext {
  userId: string;
  userRole: "admin" | "user";
}

export function submitDeviceCommand(
  deviceId: string,
  command: CommandRequest,
  authContext: RequestAuthContext,
  deps = createRuntimeDeps()
): CommandEndpointResult {
  const device = deps.homeDeviceService.getById(deviceId);
  if (!device) {
    return {
      statusCode: 404,
      body: {
        code: "device_not_found",
        message: "Device not found"
      }
    };
  }

  const result = deps.deviceCommandService.submit({
    device,
    issuerUserId: authContext.userId,
    issuerRole: authContext.userRole,
    action: command.action,
    payload: command.payload
  });

  if (result.statusCode === 202) {
    return {
      statusCode: 202,
      body: {
        commandId: result.body.commandId,
        status: result.body.status
      }
    };
  }

  if (result.statusCode === 409) {
    return {
      statusCode: 409,
      body: {
        commandId: result.body.commandId,
        status: "rejected",
        reason: result.body.reason
      }
    };
  }

  return {
    statusCode: 423,
    body: result.body
  };
}

export default defineEventHandler(async (event) => {
  const deviceId = getRouterParam(event, "deviceId");
  if (!deviceId) {
    throw createError({ statusCode: 400, statusMessage: "Missing device id" });
  }

  if (!event.context.auth) {
    throw createError({ statusCode: 401, statusMessage: "Missing authentication context" });
  }

  const command = await readBody<CommandRequest>(event);
  if (!command) {
    throw createError({ statusCode: 400, statusMessage: "Missing request body" });
  }

  const result = submitDeviceCommand(deviceId, command, {
    userId: event.context.auth.userId,
    userRole: event.context.auth.userRole
  });

  if (result.statusCode !== 202) {
    const message = "message" in result.body ? result.body.message : "Command rejected";
    throw createError({
      statusCode: result.statusCode,
      statusMessage: message,
      data: result.body
    });
  }

  return result.body;
});
