<template>
<UCard :ui="{ header: 'px-5 py-4', body: 'px-5 py-4' }"
    class="border-slate-200/80 bg-white/95 shadow-sm ring-1 ring-slate-200/70">
    <template #header>
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div class="space-y-2">
                <h2 class="text-lg font-semibold text-slate-950">
                    Tableau de bord widgets
                </h2>
                <p class="text-sm text-slate-600">
                    Composez votre surface avec les widgets standards deja disponibles avant d'envisager un composant
                    sur mesure.
                </p>
            </div>

            <div class="flex flex-wrap gap-2">
                <UButton color="neutral" variant="outline" @click="$emit('add', 'status')">
                    Ajouter status
                </UButton>
                <UButton color="neutral" variant="outline" @click="$emit('add', 'button')">
                    Ajouter button
                </UButton>
                <UButton color="neutral" variant="outline" @click="$emit('add', 'sensor')">
                    Ajouter sensor
                </UButton>
                <UButton color="primary" variant="solid" @click="$emit('save')">
                    Enregistrer
                </UButton>
            </div>
        </div>
    </template>

    <div class="space-y-3">
        <article v-for="item in widgets" :key="item.id ?? `${item.widgetType}-${item.position}`"
            class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex flex-wrap items-center gap-3">
                <UBadge color="primary" variant="soft">
                    {{ item.widgetType }}
                </UBadge>
                <p class="text-sm font-medium text-slate-950">
                    Position {{ item.position }}
                </p>
                <UBadge :color="item.visible ? 'success' : 'neutral'" variant="subtle">
                    {{ item.visible ? "Visible" : "Masque" }}
                </UBadge>
            </div>

            <div class="flex flex-wrap gap-2">
                <UButton color="neutral" variant="ghost" @click="$emit('toggle', item.position)">
                    {{ item.visible ? "Masquer" : "Afficher" }}
                </UButton>
                <UButton color="error" variant="soft" @click="$emit('remove', item.position)">
                    Retirer
                </UButton>
            </div>
        </article>
    </div>
</UCard>
</template>

<script setup lang="ts">
defineProps<{
    widgets: Array<{
        id?: string;
        widgetType: string;
        position: number;
        visible: boolean;
        parameters?: Record<string, unknown>;
    }>;
}>();

defineEmits<{
    add: [type: "status" | "button" | "sensor"];
    toggle: [position: number];
    remove: [position: number];
    save: [];
}>();
</script>
