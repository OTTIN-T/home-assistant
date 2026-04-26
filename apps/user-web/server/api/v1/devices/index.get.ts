import type { DeviceContract } from "@home-assistant/shared";
import { defineEventHandler } from "h3";
import { createRuntimeDeps } from "../../../services/runtime-deps";

export function listUserDevices(deps = createRuntimeDeps()): DeviceContract[] {
  return deps.homeDeviceService.listVisibleDevices().map((device) => ({
    id: device.id,
    name: device.name,
    accessMode: device.accessMode,
    state: device.currentState
  }));
}

export default defineEventHandler(async () => listUserDevices());
