<template>
  <section class="space-y-5">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div class="space-y-2">
        <UBadge color="primary" variant="soft" class="w-fit">
          Pilotage securise
        </UBadge>
        <div>
          <h2 class="text-2xl font-semibold tracking-tight text-slate-950">
            Mes equipements
          </h2>
          <p class="text-sm leading-6 text-slate-600">
            Controlez vos appareils autorises avec un retour d'etat immediat et des alertes en cas d'arbitrage ou de mode degrade.
          </p>
        </div>
      </div>

      <div class="rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200">
        {{ devices.length }} equipement(s) exposes
      </div>
    </div>

    <UAlert
      v-if="message"
      color="info"
      variant="soft"
      title="Retour systeme"
      :description="message"
    />

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <BaseDeviceCard
        v-for="device in devices"
        :key="device.id"
        :device="device"
        @command="onDeviceCommand(device.id, $event)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseDeviceCard from "../../bases/device/BaseDeviceCard.component.vue";

defineProps<{
  devices: Array<{
    id: string;
    name: string;
    accessMode: "read_write" | "read_only";
    state: Record<string, unknown>;
  }>;
  message?: string;
}>();

const emit = defineEmits<{
  command: [payload: { deviceId: string; action: "turn_on" | "turn_off" }];
}>();

function onDeviceCommand(deviceId: string, action: "turn_on" | "turn_off") {
  emit("command", { deviceId, action });
}
</script>
