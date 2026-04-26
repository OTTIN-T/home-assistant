<template>
  <UCard :ui="{ header: 'px-6 py-5', body: 'px-6 py-5', footer: 'px-6 py-4' }"
    class="border-slate-200/80 bg-white/95 shadow-sm ring-1 ring-slate-200/70">
    <template #header>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="space-y-1">
          <h2 class="text-lg font-semibold text-slate-950">
            {{ title }}
          </h2>
          <p v-if="description" class="text-sm leading-6 text-slate-600">
            {{ description }}
          </p>
        </div>

        <div v-if="$slots.actions" class="flex flex-wrap gap-2">
          <slot name="actions" />
        </div>
      </div>
    </template>

    <slot />
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>
