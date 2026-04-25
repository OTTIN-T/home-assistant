<template>
    <main class="container">
        <h1>Home Automation User App</h1>
        <DeviceDashboard :devices="devices" :message="lastMessage" @command="onCommand" />
    </main>
</template>

<script setup lang="ts">
import DeviceDashboard from "../components/features/device/DeviceDashboard.component.vue";
import { useDeviceControl } from "../composables/useDeviceControl";

const { devices, lastMessage, loadDevices, sendCommand } = useDeviceControl();

async function onCommand(payload: { deviceId: string; action: "turn_on" | "turn_off" }) {
    await sendCommand(payload.deviceId, payload.action);
}

await loadDevices();
</script>
