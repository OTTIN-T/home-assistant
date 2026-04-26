<template>
<UCard :ui="{ header: 'px-4 py-3', body: 'px-4 py-4' }"
    class="border-slate-200/80 bg-white/95 shadow-sm ring-1 ring-slate-200/70">
    <template #header>
        <div class="flex items-center justify-between gap-3">
            <h4 class="text-sm font-semibold text-slate-950">
                Action
            </h4>
            <UBadge color="primary" variant="soft">
                Button
            </UBadge>
        </div>
    </template>

    <UButton block color="primary" variant="solid" @click="$emit('press')">
        {{ label }}
    </UButton>
</UCard>
</template>

<script setup lang="ts">
defineProps<{ label: string }>();
defineEmits<{ press: [] }>();
</script>
