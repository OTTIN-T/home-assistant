import { defineStore } from "pinia";

export interface DeviceView {
  id: string;
  name: string;
  accessMode: "read_write" | "read_only";
  state: Record<string, unknown>;
}

export const useDeviceStore = defineStore("device", {
  state: () => ({
    devices: [] as DeviceView[],
    lastMessage: ""
  }),
  actions: {
    setDevices(devices: DeviceView[]) {
      this.devices = devices;
    },
    setMessage(message: string) {
      this.lastMessage = message;
    },
    updateDeviceState(deviceId: string, nextState: Record<string, unknown>) {
      const target = this.devices.find((device) => device.id === deviceId);
      if (target) {
        target.state = nextState;
      }
    }
  }
});
