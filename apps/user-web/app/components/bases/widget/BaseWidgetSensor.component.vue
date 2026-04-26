<template>
<UCard :ui="{ header: 'px-4 py-3', body: 'px-4 py-4' }"
    class="border-slate-200/80 bg-white/95 shadow-sm ring-1 ring-slate-200/70">
    <template #header>
        <div class="flex items-center justify-between gap-3">
            <h4 class="text-sm font-semibold text-slate-950">
                Sensor
            </h4>
            <UBadge color="warning" variant="soft">
                Mesure
            </UBadge>
        </div>
    </template>

    <div class="space-y-1">
        <p class="text-xs uppercase tracking-[0.2em] text-slate-500">
            {{ label }}
        </p>
        <p class="text-lg font-semibold text-slate-950">
            {{ value }}
        </p>
    </div>
</UCard>
</template>

<script setup lang="ts">
defineProps<{
    label: string;
    value: number | string;
}>();
</script>
