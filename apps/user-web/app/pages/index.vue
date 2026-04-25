<template>
    <main class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="space-y-3">
                <UBadge color="primary" variant="soft" class="w-fit">
                    Surface utilisateur
                </UBadge>
                <div class="space-y-2">
                    <h1 class="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                        Pilotage domotique securise
                    </h1>
                    <p class="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                        Accedez a vos equipements autorises, suivez leur etat et declenchez vos actions prioritaires depuis une interface optimisee Nuxt UI.
                    </p>
                </div>
            </div>

            <div class="rounded-2xl bg-white/85 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200">
                Session active pour {{ devices.length }} equipement(s)
            </div>
        </section>

        <FeatureDeviceDashboard :devices="devices" :message="lastMessage" @command="onCommand" />
    </main>
</template>

<script setup lang="ts">
import FeatureDeviceDashboard from "../components/features/device/FeatureDeviceDashboard.component.vue";
import { useDeviceControl } from "../composables/useDeviceControl";

const { devices, lastMessage, loadDevices, sendCommand } = useDeviceControl();

async function onCommand(payload: { deviceId: string; action: "turn_on" | "turn_off" }) {
    await sendCommand(payload.deviceId, payload.action);
}

await loadDevices();
</script>
