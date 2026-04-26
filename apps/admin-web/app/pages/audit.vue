<template>
<FeatureAdminPageShell title="Evenements d'audit"
    description="Inspectez les evenements de securite et d'administration avec un filtrage rapide par niveau de severite."
    :stats="stats">
    <FeatureAdminSectionCard title="Journal de securite"
        description="Le filtre reproduit le besoin du endpoint d'audit cote admin avec une lecture immediate des details utiles.">
        <template #actions>
            <USelect :model-value="selectedSeverity" :items="severityItems" class="min-w-48"
                @update:model-value="onSeverityUpdate" />
        </template>

        <div class="space-y-4">
            <article v-for="event in audit" :key="event.id"
                class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div class="space-y-2">
                        <div class="flex flex-wrap items-center gap-2">
                            <p class="text-sm font-semibold text-slate-950">
                                {{ event.eventType }}
                            </p>
                            <UBadge :color="severityTone(event.severity)" variant="soft">
                                {{ event.severity }}
                            </UBadge>
                        </div>

                        <p class="text-xs uppercase tracking-[0.2em] text-slate-500">
                            {{ formatDateTime(event.createdAt) }}
                        </p>
                    </div>

                    <div class="rounded-xl bg-white px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200">
                        {{ summarizeDetails(event.details) }}
                    </div>
                </div>
            </article>

            <UAlert color="neutral" variant="subtle" title="Retention"
                description="Les evenements restent consultables pendant 90 jours avant purge automatique, sauf retention legale explicite." />
        </div>
    </FeatureAdminSectionCard>
</FeatureAdminPageShell>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FeatureAdminPageShell from "../components/features/admin/FeatureAdminPageShell.component.vue";
import FeatureAdminSectionCard from "../components/features/admin/FeatureAdminSectionCard.component.vue";
import { useAdminStore } from "../stores/admin.store";

const store = useAdminStore();

const audit = computed(() => store.filteredAudit);
const selectedSeverity = computed(() => store.selectedSeverity);
const stats = computed(() => [
    { label: "Utilisateurs suivis", value: store.stats.totalUsers, tone: "neutral" as const },
    { label: "Admins actifs", value: store.stats.privilegedUsers, tone: "warning" as const },
    { label: "Appareils revoques", value: store.stats.revokedDevices, tone: "error" as const },
    { label: "Evenements critiques", value: store.stats.criticalEvents, tone: "primary" as const }
]);

const severityItems = [
    { label: "Tous les niveaux", value: "all" },
    { label: "Info", value: "info" },
    { label: "Warning", value: "warning" },
    { label: "Critical", value: "critical" }
] as const;

function onSeverityChange(value: string | undefined) {
    if (value === "all" || value === "info" || value === "warning" || value === "critical") {
        store.setAuditSeverity(value);
    }
}

function onSeverityUpdate(value: unknown) {
    onSeverityChange(typeof value === "string" ? value : undefined);
}

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
}

function severityTone(severity: "info" | "warning" | "critical") {
    if (severity === "critical") {
        return "error" as const;
    }

    if (severity === "warning") {
        return "warning" as const;
    }

    return "primary" as const;
}

function summarizeDetails(details: Record<string, unknown>) {
    return Object.entries(details)
        .map(([key, value]) => `${key}: ${String(value)}`)
        .join(" • ");
}
</script>
