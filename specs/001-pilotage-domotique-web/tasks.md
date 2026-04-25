---
description: "Liste des tâches d'implémentation — Pilotage Domotique Web"
---

# Tasks: Pilotage Domotique Web

**Input**: Documents de conception dans `/specs/001-pilotage-domotique-web/`
**Prérequis**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/openapi.yaml ✅, quickstart.md ✅

**Tests**: Obligatoires. Chaque story inclut des tests de succès, d'erreur et de warning sur les parcours critiques (Vitest unitaires, Playwright intégration, validation contrat OpenAPI).

**Organisation**: Tâches groupées par user story pour permettre une implémentation et des tests indépendants par story.

## Format: `- [ ] T### [P] [US#] Description avec chemin`

- **[P]** : Peut s'exécuter en parallèle (fichiers différents, sans dépendance sur une tâche incomplète de la même phase)
- **[US#]** : User story concernée (US1, US2, US3 — phases stories uniquement)
- Chaque description inclut le chemin exact du fichier cible

---

## Phase 1 : Setup (Infrastructure Partagée)

**Objectif** : Initialisation du monorepo, scaffolding des applications, outillage de base

- [ ] T001 Initialiser le monorepo pnpm avec workspaces — `package.json`, `pnpm-workspace.yaml` à la racine
- [ ] T002 [P] Scaffolding de l'application utilisateur Nuxt 3 + Nuxt UI + TypeScript strict dans `apps/user-web/`
- [ ] T003 [P] Scaffolding de l'application administration Nuxt 3 + Nuxt UI + TypeScript strict dans `apps/admin-web/`
- [ ] T004 [P] Créer le package partagé `apps/shared/` avec structure `contracts/`, `schemas/`, `security/`
- [ ] T005 [P] Configurer TypeScript strict (`tsconfig.json`) pour `apps/user-web/`, `apps/admin-web/` et `apps/shared/`
- [ ] T006 [P] Configurer ESLint + Prettier pour l'ensemble du monorepo (`eslint.config.mjs`, `.prettierrc`)
- [ ] T007 [P] Configurer Vitest dans `apps/user-web/vitest.config.ts` et `apps/admin-web/vitest.config.ts`
- [ ] T008 [P] Configurer Playwright dans `apps/user-web/playwright.config.ts` et `apps/admin-web/playwright.config.ts`
- [ ] T009 [P] Créer les fichiers d'environnement types `apps/user-web/.env.example` et `apps/admin-web/.env.example` (variables du quickstart.md)

**Checkpoint** : Monorepo fonctionnel, les deux applications démarrent, les outils de qualité sont opérationnels.

---

## Phase 2 : Foundational (Prérequis Bloquants)

**Objectif** : Infrastructure de base qui DOIT être complète avant toute user story.

**⚠️ CRITIQUE** : Aucune user story ne peut démarrer avant la fin de cette phase.

- [ ] T010 Créer les migrations Supabase pour les entités `User`, `RegisteredDevice`, `AccessSession` dans `apps/shared/schemas/migrations/001_auth_core.sql`
- [ ] T011 [P] Créer les migrations Supabase pour `HomeDevice`, `Provider`, `DeviceCommand` dans `apps/shared/schemas/migrations/002_devices_core.sql`
- [ ] T012 [P] Définir les types TypeScript partagés pour toutes les entités du data-model dans `apps/shared/schemas/entities.types.ts`
- [ ] T013 [P] Implémenter les schémas Zod de validation pour les entités partagées dans `apps/shared/schemas/entities.schemas.ts`
- [ ] T014 [P] Générer les types TypeScript depuis `contracts/openapi.yaml` dans `apps/shared/contracts/api.types.ts`
- [ ] T015 Implémenter le middleware d'authentification + vérification d'appareil enregistré dans `apps/user-web/server/middleware/auth.ts`
- [ ] T016 [P] Implémenter le service de journalisation `SecurityEvent` (création, rétention 90 j) dans `apps/shared/security/security-event.service.ts`
- [ ] T017 [P] Mettre en place la structure de composants (`bases/`, `features/`, `layouts/`) dans `apps/user-web/app/components/` et `apps/admin-web/app/components/`

**Checkpoint** : Authentification, contrôle appareil et journalisation opérationnels — les user stories peuvent démarrer en parallèle.

---

## Phase 3 : User Story 1 — Contrôle Domotique Sécurisé (Priorité : P1) 🎯 MVP

**Objectif** : Accès sécurisé combinant utilisateur + appareil, visualisation et pilotage des équipements avec retour d'état, gestion des commandes concurrentes et résilience fournisseur.

**Test Indépendant** : Autoriser un utilisateur/appareil, se connecter, déclencher une action sur un équipement et vérifier la mise à jour d'état ; puis refuser un appareil non enregistré et vérifier la trace d'audit.

### Tests — User Story 1

> **NOTE : Écrire ces tests EN PREMIER et vérifier qu'ils ÉCHOUENT avant l'implémentation**

- [ ] T018 [P] [US1] Tests de contrat `POST /v1/auth/session` (succès 201, refus 403 appareil/utilisateur) dans `apps/user-web/tests/contract/auth-session.contract.test.ts`
- [ ] T019 [P] [US1] Tests de contrat `GET /v1/devices` et `POST /v1/devices/{deviceId}/commands` (202, 409 arbitration, 423 read-only) dans `apps/user-web/tests/contract/devices.contract.test.ts`
- [ ] T020 [P] [US1] Tests unitaires succès/erreur/warning `AuthService` (connexion valide, refus utilisateur inactif, refus appareil révoqué) dans `apps/user-web/tests/unit/auth.service.test.ts`
- [ ] T021 [P] [US1] Tests unitaires succès/erreur/warning `DeviceCommandService` (commande acceptée, arbitrage rôle admin > user, commande rejetée read-only) dans `apps/user-web/tests/unit/device-command.service.test.ts`
- [ ] T022 [P] [US1] Tests unitaires `ProviderService` (bascule read-only lors d'indisponibilité, retour read-write à la récupération) dans `apps/user-web/tests/unit/provider.service.test.ts`
- [ ] T023 [P] [US1] Tests d'intégration parcours connexion + commande équipement (succès bout-en-bout) dans `apps/user-web/tests/integration/device-control.spec.ts`
- [ ] T024 [P] [US1] Tests d'intégration refus d'accès appareil non enregistré + vérification trace d'audit produite dans `apps/user-web/tests/integration/access-denied.spec.ts`

### Implémentation — User Story 1

- [ ] T025 [P] [US1] Implémenter `ProviderService` (état heartbeat, bascule `access_mode`) dans `apps/user-web/server/services/provider.service.ts`
- [ ] T026 [P] [US1] Implémenter `HomeDeviceService` (liste des équipements, état courant, filtrage par `access_mode`) dans `apps/user-web/server/services/home-device.service.ts`
- [ ] T027 [US1] Implémenter `AuthService` (authentification, vérification `RegisteredDevice`, création `AccessSession`, émission `SecurityEvent`) dans `apps/user-web/server/services/auth.service.ts`
- [ ] T028 [US1] Implémenter `DeviceCommandService` (réception commande, arbitrage priorité de rôle, émission `SecurityEvent` sur arbitrage) dans `apps/user-web/server/services/device-command.service.ts`
- [ ] T029 [US1] Implémenter l'endpoint `POST /v1/auth/session` dans `apps/user-web/server/api/v1/auth/session.post.ts`
- [ ] T030 [US1] Implémenter l'endpoint `GET /v1/devices` dans `apps/user-web/server/api/v1/devices/index.get.ts`
- [ ] T031 [US1] Implémenter l'endpoint `POST /v1/devices/{deviceId}/commands` dans `apps/user-web/server/api/v1/devices/[deviceId]/commands.post.ts`
- [ ] T032 [P] [US1] Créer la page de connexion dans `apps/user-web/app/pages/login.vue`
- [ ] T033 [P] [US1] Créer le composant `DeviceDashboard` (liste équipements + état) dans `apps/user-web/app/components/features/device/DeviceDashboard.component.vue`
- [ ] T034 [P] [US1] Créer le composant de présentation `DeviceCard` (état, bouton action, badge read-only) dans `apps/user-web/app/components/bases/device/DeviceCard.component.vue`
- [ ] T035 [US1] Implémenter le store Pinia `useDeviceStore` (liste équipements, état, dispatch commande) dans `apps/user-web/app/stores/device.store.ts`
- [ ] T036 [US1] Implémenter le composable `useDeviceControl` (appel API, gestion retour 409/423, feedback utilisateur) dans `apps/user-web/app/composables/useDeviceControl.ts`
- [ ] T037 [US1] Configurer la PWA (Service Worker, manifest, icônes) dans `apps/user-web/nuxt.config.ts` et `apps/user-web/public/manifest.webmanifest`

**Checkpoint** : L'application utilisateur permet la connexion sécurisée, la visualisation et le pilotage des équipements. Les scénarios succès/erreur/warning du quickstart sont validables.

---

## Phase 4 : User Story 2 — Personnalisation Par Profils Et Widgets (Priorité : P2)

**Objectif** : Création et activation de profils personnalisés, configuration du tableau de bord par widgets, persistence inter-sessions, notifications push VAPID.

**Test Indépendant** : Créer un profil, l'activer, ajouter/réorganiser des widgets, se déconnecter puis se reconnecter et vérifier que la configuration est restituée à l'identique.

### Tests — User Story 2

> **NOTE : Écrire ces tests EN PREMIER et vérifier qu'ils ÉCHOUENT avant l'implémentation**

- [ ] T038 [P] [US2] Tests de contrat `POST /v1/profiles` et `POST /v1/profiles/{profileId}/activate` (succès 201/200, conflit si double activation) dans `apps/user-web/tests/contract/profiles.contract.test.ts`
- [ ] T039 [P] [US2] Tests de contrat `PUT /v1/widgets/layout` et `POST /v1/notifications/subscriptions` (succès 200/201, schéma validé) dans `apps/user-web/tests/contract/widgets-notifications.contract.test.ts`
- [ ] T040 [P] [US2] Tests unitaires succès/erreur/warning `UserProfileService` (création, activation (désactive autres profils), invariant un seul profil actif) dans `apps/user-web/tests/unit/user-profile.service.test.ts`
- [ ] T041 [P] [US2] Tests unitaires `WidgetConfigurationService` (sauvegarde layout, position >= 0, type dans catalogue) dans `apps/user-web/tests/unit/widget-configuration.service.test.ts`
- [ ] T042 [P] [US2] Tests unitaires `BehaviorRuleService` (règle appliquée selon profil actif, règle ignorée si profil inactif) dans `apps/user-web/tests/unit/behavior-rule.service.test.ts`
- [ ] T043 [P] [US2] Tests d'intégration parcours création profil + activation + personnalisation widgets + persistance après reconnexion dans `apps/user-web/tests/integration/profile-personalization.spec.ts`

### Implémentation — User Story 2

- [ ] T044 [P] [US2] Créer les migrations Supabase pour `UserProfile`, `WidgetConfiguration`, `BehaviorRule` dans `apps/shared/schemas/migrations/003_profiles_widgets.sql`
- [ ] T045 [P] [US2] Implémenter `UserProfileService` (CRUD profil, activation exclusive, mise à jour `is_active`) dans `apps/user-web/server/services/user-profile.service.ts`
- [ ] T046 [P] [US2] Implémenter `WidgetConfigurationService` (sauvegarde layout, validation position/type) dans `apps/user-web/server/services/widget-configuration.service.ts`
- [ ] T047 [US2] Implémenter `BehaviorRuleService` (évaluation règle selon profil actif, contexte/action requis) dans `apps/user-web/server/services/behavior-rule.service.ts`
- [ ] T048 [US2] Implémenter l'endpoint `POST /v1/profiles` dans `apps/user-web/server/api/v1/profiles/index.post.ts`
- [ ] T049 [US2] Implémenter l'endpoint `POST /v1/profiles/{profileId}/activate` dans `apps/user-web/server/api/v1/profiles/[profileId]/activate.post.ts`
- [ ] T050 [US2] Implémenter l'endpoint `PUT /v1/widgets/layout` dans `apps/user-web/server/api/v1/widgets/layout.put.ts`
- [ ] T051 [US2] Implémenter l'endpoint `POST /v1/notifications/subscriptions` (enregistrement abonnement push VAPID) dans `apps/user-web/server/api/v1/notifications/subscriptions.post.ts`
- [ ] T052 [P] [US2] Créer le composant `ProfileManager` (liste profils, création, activation) dans `apps/user-web/app/components/features/profile/ProfileManager.component.vue`
- [ ] T053 [P] [US2] Créer le composant `WidgetDashboard` (grille de widgets, drag-and-drop, ajout/suppression) dans `apps/user-web/app/components/features/widget/WidgetDashboard.component.vue`
- [ ] T054 [P] [US2] Créer les composants de base de widgets (état, bouton, capteur) dans `apps/user-web/app/components/bases/widget/`
- [ ] T055 [US2] Implémenter le store Pinia `useProfileStore` (profil actif, liste, activation) dans `apps/user-web/app/stores/profile.store.ts`
- [ ] T056 [US2] Implémenter le composable `useProfilePersonalization` (appel API, synchronisation store) dans `apps/user-web/app/composables/useProfilePersonalization.ts`
- [ ] T057 [US2] Implémenter le composable `usePushNotifications` (abonnement VAPID, gestion permission) dans `apps/user-web/app/composables/usePushNotifications.ts`

**Checkpoint** : L'application utilisateur permet la gestion complète des profils et widgets. La personnalisation persiste entre sessions. Les notifications push sont enregistrables.

---

## Phase 5 : User Story 3 — Administration Isolée Et Gouvernance (Priorité : P3)

**Objectif** : Application d'administration distincte permettant la gestion des droits utilisateurs, la révocation d'appareils (avec invalidation de sessions), et la consultation des événements d'audit avec traçabilité.

**Test Indépendant** : Modifier les droits d'un utilisateur depuis l'app admin et vérifier l'effet à la session suivante ; révoquer un appareil et vérifier l'invalidation des sessions en cours + trace d'audit.

### Tests — User Story 3

> **NOTE : Écrire ces tests EN PREMIER et vérifier qu'ils ÉCHOUENT avant l'implémentation**

- [ ] T058 [P] [US3] Tests de contrat `PATCH /admin/v1/users/{userId}/roles` (succès 200, refus 403 non-admin) dans `apps/admin-web/tests/contract/admin-users.contract.test.ts`
- [ ] T059 [P] [US3] Tests de contrat `POST /admin/v1/devices/{deviceId}/revoke` (succès 202, idempotence) dans `apps/admin-web/tests/contract/admin-devices.contract.test.ts`
- [ ] T060 [P] [US3] Tests de contrat `GET /admin/v1/audit/events` (succès 200, filtrage par severity) dans `apps/admin-web/tests/contract/admin-audit.contract.test.ts`
- [ ] T061 [P] [US3] Tests unitaires succès/erreur/warning `AdminUserService` (changement de rôle, tentative par non-admin, `SecurityEvent` produit) dans `apps/admin-web/tests/unit/admin-user.service.test.ts`
- [ ] T062 [P] [US3] Tests unitaires `AdminDeviceService` (révocation, invalidation sessions actives, idempotence si déjà révoqué) dans `apps/admin-web/tests/unit/admin-device.service.test.ts`
- [ ] T063 [P] [US3] Tests d'intégration parcours modification droits + effet à la session suivante + révocation appareil + trace d'audit dans `apps/admin-web/tests/integration/admin-governance.spec.ts`

### Implémentation — User Story 3

- [ ] T064 [P] [US3] Implémenter le middleware d'authentification admin renforcé (rôle `admin` requis, `SecurityEvent` sur refus) dans `apps/admin-web/server/middleware/admin-auth.ts`
- [ ] T065 [P] [US3] Implémenter `AdminUserService` (changement de rôle, émission `SecurityEvent` de type `role_change`) dans `apps/admin-web/server/services/admin-user.service.ts`
- [ ] T066 [P] [US3] Implémenter `AdminDeviceService` (révocation `RegisteredDevice`, invalidation `AccessSession` ouvertes, émission `SecurityEvent`) dans `apps/admin-web/server/services/admin-device.service.ts`
- [ ] T067 [US3] Implémenter l'endpoint `PATCH /admin/v1/users/{userId}/roles` dans `apps/admin-web/server/api/admin/v1/users/[userId]/roles.patch.ts`
- [ ] T068 [US3] Implémenter l'endpoint `POST /admin/v1/devices/{deviceId}/revoke` dans `apps/admin-web/server/api/admin/v1/devices/[deviceId]/revoke.post.ts`
- [ ] T069 [US3] Implémenter l'endpoint `GET /admin/v1/audit/events` (avec filtre `severity`, pagination) dans `apps/admin-web/server/api/admin/v1/audit/events.get.ts`
- [ ] T070 [P] [US3] Créer la page de gestion des utilisateurs dans `apps/admin-web/app/pages/users.vue`
- [ ] T071 [P] [US3] Créer la page de gestion des appareils enregistrés dans `apps/admin-web/app/pages/devices.vue`
- [ ] T072 [P] [US3] Créer la page de consultation des événements d'audit dans `apps/admin-web/app/pages/audit.vue`
- [ ] T073 [US3] Implémenter le store Pinia `useAdminStore` (utilisateurs, appareils, audit) dans `apps/admin-web/app/stores/admin.store.ts`

**Checkpoint** : L'application d'administration est fonctionnelle et isolée. La gouvernance (droits, appareils, audit) est opérationnelle avec traçabilité complète.

---

## Phase 6 : Polish & Préoccupations Transverses

**Objectif** : Qualité finale, conformité constitution, validation quickstart, purge des événements expirés.

- [ ] T074 [P] Implémenter la politique de rétention et purge automatique des `SecurityEvent` à 90 jours dans `apps/shared/security/retention.service.ts`
- [ ] T075 [P] Valider la conformité à la constitution : architecture composants, TypeScript strict, isolation admin, PWA, tests traçables par exigence FR
- [ ] T076 [P] Ajouter les politiques RLS Supabase pour toutes les tables (accès limité aux utilisateurs authentifiés et aux rôles autorisés) dans `apps/shared/schemas/migrations/004_rls_policies.sql`
- [ ] T077 [P] Configurer le monitoring des performances (p95 commande <= 400 ms, push <= 10 s) dans `apps/user-web/server/plugins/performance.plugin.ts`
- [ ] T078 Valider les 5 parcours du quickstart.md (succès connexion/commande, refus appareil, warning fournisseur, personnalisation, administration isolée)
- [ ] T079 [P] Mettre à jour le README monorepo et les guides de développement dans `README.md`

---

## Dépendances & Ordre d'Exécution

### Dépendances entre Phases

```
Phase 1 (Setup)
    └─► Phase 2 (Foundational)  ← BLOQUE toutes les user stories
            ├─► Phase 3 (US1 — P1)  ⟵ peut démarrer dès Phase 2 terminée
            ├─► Phase 4 (US2 — P2)  ⟵ peut démarrer dès Phase 2 terminée
            └─► Phase 5 (US3 — P3)  ⟵ peut démarrer dès Phase 2 terminée
                        └─► Phase 6 (Polish)  ← toutes les stories souhaitées complètes
```

### Dépendances par User Story

| Story | Dépend de | Dépendances sur d'autres stories |
|-------|-----------|----------------------------------|
| US1 (P1) | Phase 2 complète | Aucune — testable indépendamment |
| US2 (P2) | Phase 2 complète | Utilise `AccessSession` de US1 (optionnel pour tests isolés) |
| US3 (P3) | Phase 2 complète | Lit `SecurityEvent` produits par US1 (données d'audit) |

### Dépendances Internes par Story

**US1** : Tests (T018–T024) ⇒ Services Provider+Device (T025–T026) ⇒ AuthService (T027) ⇒ DeviceCommandService (T028) ⇒ Endpoints (T029–T031) ⇒ UI + Store (T032–T037)

**US2** : Tests (T038–T043) ⇒ Migrations (T044) ⇒ Services Profile+Widget (T045–T046) ⇒ BehaviorRuleService (T047) ⇒ Endpoints (T048–T051) ⇒ UI + Store (T052–T057)

**US3** : Tests (T058–T063) ⇒ Middleware admin (T064) ⇒ Services Admin (T065–T066) ⇒ Endpoints (T067–T069) ⇒ UI + Store (T070–T073)

---

## Opportunités de Parallélisation

### Phase 1 — Setup

T002, T003, T004 peuvent démarrer en parallèle dès T001 terminé.
T005 à T009 peuvent tous s'exécuter en parallèle dès T002–T004 terminés.

### Phase 2 — Foundational

T010 et T011 (migrations) en parallèle.
T012, T013, T014 (types, schémas Zod, contrats API) en parallèle avec les migrations.
T015, T016, T017 en parallèle avec les migrations (fichiers différents).

### Phases 3, 4, 5 — User Stories

Dès la Phase 2 terminée, les trois phases de stories peuvent démarrer **simultanément** si l'équipe le permet :
- US1 : `apps/user-web/` côté serveur + UI
- US2 : `apps/user-web/` profils/widgets (fichiers distincts de US1)
- US3 : `apps/admin-web/` entièrement isolée

Dans chaque story, tous les tests marqués `[P]` peuvent s'écrire en parallèle.
Les modèles/services marqués `[P]` peuvent être développés simultanément (fichiers distincts).

---

## Stratégie MVP

### MVP = Phase 1 + Phase 2 + Phase 3 (US1 uniquement)

| Périmètre MVP | Tâches | Ce qui est livré |
|---------------|--------|------------------|
| Setup | T001–T009 | Monorepo opérationnel, outillage qualité |
| Foundational | T010–T017 | BDD, auth, journalisation sécurité |
| US1 (P1) | T018–T037 | Connexion sécurisée, pilotage équipements, PWA |

**Le MVP permet** : connexion utilisateur + appareil autorisé, visualisation des équipements, envoi de commandes avec retour d'état, gestion de la concurrence par priorité, résilience fournisseur (read-only), journalisation des événements de sécurité.

**Livraisons incrémentales suggérées** :
1. **MVP** : US1 — valeur produit principale démontrée
2. **Incrément 2** : US2 — différenciateur adoption (profils, widgets, push)
3. **Incrément 3** : US3 — gouvernance et conformité sécurité complète
4. **Polish** : Rétention, monitoring, validation quickstart complète

---

## Critères de Validation Indépendante par Story

| Story | Critère d'acceptance indépendant |
|-------|----------------------------------|
| US1 | Connexion avec utilisateur+appareil autorisés → commande exécutée, état affiché ; refus avec appareil inconnu → `SecurityEvent` tracé |
| US2 | Création profil → activation → widgets configurés → reconnexion → configuration restituée |
| US3 | Changement de rôle admin → effet à la session suivante ; révocation appareil → sessions invalidées + trace d'audit consultable |
