<template>
<UCard :ui="{ header: 'px-5 py-4', body: 'px-5 py-4', footer: 'px-5 py-4' }"
    class="border-slate-200/80 bg-white/95 shadow-sm ring-1 ring-slate-200/70"
    :class="device.accessMode === 'read_only' ? 'opacity-80' : ''">
    <template #header>
        <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
                <h3 class="text-base font-semibold text-slate-950">
                    {{ device.name }}
                </h3>
                <p class="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Equipement connecte
                </p>
            </div>

            <UBadge :color="device.accessMode === 'read_only' ? 'warning' : 'success'" variant="soft">
                {{ device.accessMode === "read_only" ? "Lecture seule" : "Pilotable" }}
            </UBadge>
        </div>
    </template>

    <div class="space-y-3">
        <div class="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">
                Etat actuel
            </p>
            <p class="mt-2 text-sm text-slate-700">
                Power: <span class="font-medium text-slate-950">{{ formatValue(device.state.power) }}</span>
            </p>
        </div>

        <div class="grid gap-2 sm:grid-cols-2">
            <UButton color="primary" variant="solid" :disabled="device.accessMode === 'read_only'"
                @click="$emit('command', 'turn_on')">
                Allumer
            </UButton>
            <UButton color="neutral" variant="outline" :disabled="device.accessMode === 'read_only'"
                @click="$emit('command', 'turn_off')">
                Eteindre
            </UButton>
        </div>
    </div>
</UCard>
</template>

<script setup lang="ts">
defineProps<{
    device: {
        id: string;
        name: string;
        accessMode: "read_write" | "read_only";
        state: Record<string, unknown>;
    };
}>();

defineEmits<{
    command: [action: "turn_on" | "turn_off"];
}>();

function formatValue(value: unknown) {
    return value == null || value === "" ? "unknown" : String(value);
}
</script>
