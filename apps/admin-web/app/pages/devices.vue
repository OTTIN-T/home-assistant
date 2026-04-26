<template>
<FeatureAdminPageShell title="Appareils enregistres"
    description="Revoquez un appareil compromis et exposez immediatement le statut attendu pour l'invalidation des sessions en cours."
    :stats="stats">
    <FeatureAdminSectionCard title="Inventaire de confiance"
        description="Le statut de chaque terminal doit refleter l'etat du registre et permettre une action de revocation idempotente.">
        <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <article v-for="device in devices" :key="device.id"
                class="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div class="space-y-3">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <h3 class="text-sm font-semibold text-slate-950">
                                {{ device.displayName }}
                            </h3>
                            <p class="text-xs text-slate-500">
                                {{ device.id }}
                            </p>
                        </div>
                        <UBadge :color="statusTone(device.status)" variant="soft">
                            {{ device.status }}
                        </UBadge>
                    </div>

                    <dl class="grid gap-2 text-sm text-slate-600">
                        <div class="flex items-center justify-between gap-3">
                            <dt>Proprietaire</dt>
                            <dd class="font-medium text-slate-900">{{ device.userId }}</dd>
                        </div>
                        <div class="flex items-center justify-between gap-3">
                            <dt>Trust level</dt>
                            <dd class="font-medium capitalize text-slate-900">{{ device.trustLevel }}</dd>
                        </div>
                        <div class="flex items-center justify-between gap-3">
                            <dt>Dernier acces</dt>
                            <dd class="font-medium text-slate-900">
                                {{ device.lastAccessAt ? formatDateTime(device.lastAccessAt) : "Aucun" }}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div class="mt-auto flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Invalidation cible &lt; 10 s
                    </p>
                    <UButton color="error" variant="soft" :disabled="device.status === 'revoked'"
                        @click="store.revokeDevice(device.id)">
                        {{ device.status === "revoked" ? "Deja revoque" : "Revoquer" }}
                    </UButton>
                </div>
            </article>
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

const devices = computed(() => store.devices);
const stats = computed(() => [
    { label: "Utilisateurs suivis", value: store.stats.totalUsers, tone: "neutral" as const },
    { label: "Admins actifs", value: store.stats.privilegedUsers, tone: "warning" as const },
    { label: "Appareils revoques", value: store.stats.revokedDevices, tone: "error" as const },
    { label: "Evenements critiques", value: store.stats.criticalEvents, tone: "primary" as const }
]);

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
}

function statusTone(status: "pending" | "authorized" | "revoked") {
    if (status === "authorized") {
        return "success" as const;
    }

    if (status === "pending") {
        return "warning" as const;
    }

    return "error" as const;
}
</script>
