<template>
<FeatureAdminPageShell title="Centre de gouvernance domotique"
    description="Supervisez les droits, la flotte d'appareils enregistres et les evenements de securite depuis une interface admin isolee construite sur Nuxt UI."
    :stats="stats">
    <div class="grid gap-4 xl:grid-cols-3">
        <FeatureAdminSectionCard title="Utilisateurs"
            description="Pilotez les roles et verifiez les mises a jour de privilege avant la prochaine ouverture de session.">
            <div class="space-y-4">
                <p class="text-sm text-slate-600">
                    {{ store.stats.privilegedUsers }} compte(s) admin sur {{ store.stats.totalUsers }} utilisateur(s)
                    suivis.
                </p>
                <UButton to="/users" color="primary" variant="solid" block>
                    Ouvrir la gestion des utilisateurs
                </UButton>
            </div>
        </FeatureAdminSectionCard>

        <FeatureAdminSectionCard title="Appareils"
            description="Revoquez un terminal suspect et surveillez la propagation de l'invalidation de session.">
            <div class="space-y-4">
                <p class="text-sm text-slate-600">
                    {{ store.stats.revokedDevices }} appareil(s) sont deja bloques dans le registre courant.
                </p>
                <UButton to="/devices" color="error" variant="soft" block>
                    Ouvrir la flotte d'appareils
                </UButton>
            </div>
        </FeatureAdminSectionCard>

        <FeatureAdminSectionCard title="Audit"
            description="Consultez les evenements critiques, warnings et infos relies aux actions d'administration.">
            <div class="space-y-4">
                <p class="text-sm text-slate-600">
                    {{ store.stats.criticalEvents }} evenement(s) critique(s) a traiter en priorite.
                </p>
                <UButton to="/audit" color="neutral" variant="outline" block>
                    Ouvrir l'audit
                </UButton>
            </div>
        </FeatureAdminSectionCard>
    </div>
    </FeatureAdminPageShell>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FeatureAdminPageShell from "../components/features/admin/FeatureAdminPageShell.component.vue";
import FeatureAdminSectionCard from "../components/features/admin/FeatureAdminSectionCard.component.vue";
import { useAdminStore } from "../stores/admin.store";

const store = useAdminStore();

const stats = computed(() => [
    { label: "Utilisateurs suivis", value: store.stats.totalUsers, tone: "neutral" as const },
    { label: "Admins actifs", value: store.stats.privilegedUsers, tone: "warning" as const },
    { label: "Appareils revoques", value: store.stats.revokedDevices, tone: "error" as const },
    { label: "Evenements critiques", value: store.stats.criticalEvents, tone: "primary" as const }
]);
</script>
