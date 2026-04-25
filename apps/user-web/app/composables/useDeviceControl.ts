import { storeToRefs } from "pinia";
import { useDeviceStore } from "../stores/device.store";

export function useDeviceControl() {
  const store = useDeviceStore();
  const { devices, lastMessage } = storeToRefs(store);

  async function loadDevices() {
    const response = await fetch("/api/v1/devices");
    const data = (await response.json()) as Array<{
      id: string;
      name: string;
      accessMode: "read_write" | "read_only";
      state: Record<string, unknown>;
    }>;
    store.setDevices(data);
  }

  async function sendCommand(deviceId: string, action: "turn_on" | "turn_off") {
    const token = localStorage.getItem("auth.token");
    const deviceFingerprint = localStorage.getItem("auth.deviceFingerprint") ?? "";

    try {
      const response = await fetch(`/api/v1/devices/${deviceId}/commands`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
          "x-device-fingerprint": deviceFingerprint,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action,
          payload: {}
        })
      });
      if (!response.ok) {
        const error = new Error("Command failed") as Error & { statusCode?: number };
        error.statusCode = response.status;
        throw error;
      }
      store.setMessage("Command executed");
      await loadDevices();
    } catch (error: unknown) {
      const statusCode = (error as { statusCode?: number })?.statusCode;
      if (statusCode === 409) {
        store.setMessage("Command arbitrated by admin priority");
      } else if (statusCode === 423) {
        store.setMessage("Device is read-only");
      } else {
        store.setMessage("Command failed");
      }
    }
  }

  return {
    devices,
    lastMessage,
    loadDevices,
    sendCommand
  };
}
