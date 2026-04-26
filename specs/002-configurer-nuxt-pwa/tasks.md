# Tasks: Configuration PWA Nuxt complete

**Input**: Artefacts de conception depuis `/specs/002-configurer-nuxt-pwa/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/openapi.yaml`, `quickstart.md`

**Tests**: Les tests sont OBLIGATOIRES. Chaque story inclut des tests succes/erreur/warning (unitaires, integration, contrats) avec non-regression.

**Organization**: Les taches sont groupees par user story pour permettre implementation et validation independantes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: executable en parallele (fichiers differents, dependances satisfaites)
- **[Story]**: etiquette de story (`[US1]`, `[US2]`, `[US3]`) uniquement en phase User Story
- Chaque tache mentionne un chemin fichier concret

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialiser la base PWA Nuxt 4 et les assets outilles.

- [x] T001 Mettre a jour les dependances PWA en versions stables recentes dans `apps/user-web/package.json` et `pnpm-lock.yaml` (Nuxt 4 uniquement, `@vite-pwa/nuxt`, `@vite-pwa/assets-generator`) (FR-009)
- [ ] T002 [P] Ajouter la configuration module PWA Nuxt 4 dans `apps/user-web/nuxt.config.ts` (`modules`, `pwa`, `workbox`, `devOptions`) (FR-002, FR-003, FR-009)
- [ ] T003 [P] Definir la configuration de generation d'assets PWA dans `apps/user-web/pwa-assets.config.ts` (FR-013)
- [ ] T004 [P] Generer et versionner les icones PWA dans `apps/user-web/public/icons/` via configuration `apps/user-web/pwa-assets.config.ts` (FR-001, FR-013, SC-001)
- [x] T005 Mettre a niveau le manifest installable dans `apps/user-web/public/manifest.webmanifest` (name, short_name, icons, shortcuts, display, theme/background) (FR-001, FR-013)
- [x] T006 [P] Remplacer le service worker custom minimal par la strategie module PWA dans `apps/user-web/public/sw.js` et documenter la source d'autorite SW dans `apps/user-web/nuxt.config.ts` (FR-003, FR-009)
- [x] T007 [P] Creer le point d'entree client PWA dans `apps/user-web/app/plugins/pwa.client.ts` (registration, etat install/update/offline) (FR-001, FR-003)
- [x] T008 Ajouter le script de validation PWA (manifest + assets + SW) dans `apps/user-web/package.json` et `package.json` (FR-008)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Poser les briques transverses bloquees avant les stories.

**CRITICAL**: Aucune validation de story (checkpoint US1/US2/US3) tant que cette phase n'est pas complete.

- [x] T009 Creer les types/validators PWA partages dans `apps/user-web/server/types/pwa.types.ts` et `apps/user-web/app/types/pwa.types.ts` (FR-009)
- [x] T010 [P] Ajouter un service de politique de cache securisee dans `apps/user-web/server/services/pwa-cache-policy.service.ts` (allowlist etats equipements read-only, denylist session/profil/token) (FR-007)
- [x] T011 [P] Creer le service de journalisation operationnelle PWA dans `apps/user-web/server/services/pwa-operational-log.service.ts` (correlationId, categorie, niveau) (FR-006, SC-005)
- [x] T012 [P] Etendre les dependances runtime pour services PWA dans `apps/user-web/server/services/runtime-deps.ts` et `apps/user-web/server/services/runtime-store.ts` (FR-009)
- [x] T013 Ajouter les schemas de contrat PWA dans `apps/shared/contracts/api.types.ts` et `apps/shared/contracts/index.ts` (FR-008, FR-009)
- [x] T014 [P] Creer les endpoints squelette conformes OpenAPI dans `apps/user-web/server/api/pwa/push-subscriptions/index.post.ts`, `apps/user-web/server/api/pwa/push-subscriptions/[subscriptionId].delete.ts`, `apps/user-web/server/api/pwa/offline-command-queue/sync.post.ts`, `apps/user-web/server/api/pwa/lifecycle-events/index.post.ts` (FR-008)
- [x] T015 [P] Ajouter les tests de non-regression securite cache dans `apps/user-web/tests/unit/pwa-cache-policy.service.test.ts` (succes/erreur/warning) (FR-007)
- [ ] T016 Renforcer l'authz des routes PWA dans `apps/user-web/server/middleware/auth.ts` et `apps/user-web/server/middleware/pwa-auth.ts` pour imposer utilisateurs/appareils autorises et audit des refus (FR-009)

**Checkpoint**: Foundation en cours tant que T016 n'est pas complete; les stories peuvent avancer mais ne sont pas validables.

---

## Phase 3: User Story 1 - Installer l'application web (Priority: P1) MVP

**Goal**: Permettre l'installation mobile/desktop avec UX claire et journalisation du parcours.

**Independent Test**: Depuis un navigateur compatible, l'utilisateur installe l'app, l'ouvre en standalone, et les evenements d'installation sont traces.

### Tests for User Story 1 (OBLIGATOIRE)

- [x] T017 [P] [US1] Creer le test de contrat installation/lifecycle dans `apps/user-web/tests/contract/pwa-lifecycle.contract.test.ts` (succes 202, erreur 400/401, warning eventStatus) (FR-006, FR-008)
- [x] T018 [P] [US1] Creer le test d'integration installabilite dans `apps/user-web/tests/integration/pwa-installation.spec.ts` (install prompt visible/masque selon capacite navigateur) (FR-001, FR-011, SC-001)
- [x] T019 [P] [US1] Creer le test unitaire du composable d'installation dans `apps/user-web/tests/unit/usePwaInstall.test.ts` (succes install, erreur prompt, warning unsupported) (FR-001, FR-011)

### Implementation for User Story 1

- [x] T020 [P] [US1] Implementer le composable de statut d'installation dans `apps/user-web/app/composables/usePwaInstall.ts` (eligible/unsupported/installed) (FR-001, FR-011)
- [x] T021 [P] [US1] Creer le composant UX de prompt d'installation dans `apps/user-web/app/components/features/pwa/FeaturePwaInstallPrompt.component.vue` (messages courts actionnables) (FR-001)
- [ ] T022 [US1] Integrer le prompt et l'etat PWA sur l'ecran principal dans `apps/user-web/app/pages/index.vue` (FR-001, FR-011)
- [ ] T023 [US1] Implementer la capture des evenements installation SW dans `apps/user-web/app/composables/usePwaLifecycle.ts` (FR-006)
- [x] T024 [US1] Implementer l'endpoint lifecycle operationnel dans `apps/user-web/server/api/pwa/lifecycle-events/index.post.ts` avec validation stricte des payloads (FR-006, FR-008)
- [x] T025 [US1] Implementer le service lifecycle PWA dans `apps/user-web/server/services/pwa-lifecycle.service.ts` (FR-006, SC-005)
- [ ] T026 [US1] Ajouter la documentation d'exploitation installabilite dans `specs/002-configurer-nuxt-pwa/quickstart.md` (FR-010, SC-001)

**Checkpoint**: US1 partiellement livree; validation complete apres cloture de T022, T023 et T026.

---

## Phase 4: User Story 2 - Charger rapidement en connectivite degradee (Priority: P2)

**Goal**: Offrir un mode hors-ligne etendu avec file d'attente de commandes et synchronisation ordonnee.

**Independent Test**: En offline, une commande est queuee localement; au retour reseau elle se synchronise avec statut explicite et trace.

### Tests for User Story 2 (OBLIGATOIRE)

- [ ] T027 [P] [US2] Creer le test de contrat de sync file hors-ligne dans `apps/user-web/tests/contract/pwa-offline-queue.contract.test.ts` (succes 200, erreur 400/401, warning conflit) (FR-004, FR-012)
- [ ] T028 [P] [US2] Creer le test d'integration offline/sync dans `apps/user-web/tests/integration/pwa-offline-sync.spec.ts` (queued -> syncing -> synced|failed|conflict) (FR-004, FR-012, SC-006)
- [ ] T029 [P] [US2] Creer les tests unitaires queue locale dans `apps/user-web/tests/unit/offline-command-queue.service.test.ts` (succes, erreur quota stockage, warning commande invalide) (FR-004, FR-012)

### Implementation for User Story 2

- [ ] T030 [P] [US2] Implementer le store/composable de file d'attente locale IndexedDB dans `apps/user-web/app/stores/device.store.ts` et `apps/user-web/app/composables/useOfflineQueue.ts` (FR-004)
- [ ] T031 [P] [US2] Implementer le service serveur de synchronisation de queue dans `apps/user-web/server/services/offline-command-queue.service.ts` (retry/backoff/conflit) (FR-012, SC-006)
- [ ] T032 [US2] Implementer l'endpoint de sync offline dans `apps/user-web/server/api/pwa/offline-command-queue/sync.post.ts` (FR-004, FR-012; a valider apres execution de T027-T029)
- [ ] T033 [US2] Appliquer la politique de cache runtime sur endpoints lecture equipements dans `apps/user-web/nuxt.config.ts` et `apps/user-web/server/services/pwa-cache-policy.service.ts` (FR-002, FR-007, SC-002)
- [ ] T034 [US2] Ajouter le composant d'etat de synchronisation et fallback UX dans `apps/user-web/app/components/features/pwa/FeatureOfflineQueueStatus.component.vue` (FR-011)
- [ ] T035 [US2] Integrer les retours UX offline sur l'ecran principal dans `apps/user-web/app/pages/index.vue` (FR-011)
- [ ] T036 [US2] Journaliser les evenements sync offline (started/finished/failed/conflict) dans `apps/user-web/server/services/pwa-operational-log.service.ts` et `apps/user-web/server/services/pwa-lifecycle.service.ts` (FR-006, SC-005)

**Checkpoint**: US2 en cours; validation complete apres cloture des taches T027 a T036.

---

## Phase 5: User Story 3 - Recevoir les mises a jour PWA de maniere fiable (Priority: P3)

**Goal**: Appliquer les mises a jour SW en silencieux et gerer le consentement push au premier lancement.

**Independent Test**: Une nouvelle version SW s'active automatiquement sans interruption, et le consentement push est collecte/revocable avec trace.

### Tests for User Story 3 (OBLIGATOIRE)

- [ ] T037 [P] [US3] Creer le test de contrat des abonnements push dans `apps/user-web/tests/contract/pwa-push-subscriptions.contract.test.ts` (POST/DELETE succes, 401, 409) (FR-005, FR-008)
- [ ] T038 [P] [US3] Creer le test d'integration update silencieuse + push consent dans `apps/user-web/tests/integration/pwa-update-and-push.spec.ts` (FR-003, FR-005, SC-003, SC-004)
- [ ] T039 [P] [US3] Creer les tests unitaires lifecycle update/push dans `apps/user-web/tests/unit/usePwaLifecycle.test.ts` (succes, erreur registration, warning permission default) (FR-003, FR-005)

### Implementation for User Story 3

- [ ] T040 [P] [US3] Implementer la gestion update SW silencieuse dans `apps/user-web/app/plugins/pwa.client.ts` (autoUpdate, skipWaiting, clientsClaim) (FR-003, SC-003)
- [ ] T041 [P] [US3] Implementer le service de souscription push dans `apps/user-web/server/services/push-subscription.service.ts` (FR-005, SC-004)
- [ ] T042 [US3] Implementer les endpoints push dans `apps/user-web/server/api/pwa/push-subscriptions/index.post.ts` et `apps/user-web/server/api/pwa/push-subscriptions/[subscriptionId].delete.ts` (FR-005, FR-008; a valider apres execution de T037-T039)
- [ ] T043 [US3] Creer la modale de consentement push premier lancement dans `apps/user-web/app/components/features/pwa/FeaturePushConsentDialog.component.vue` (FR-005)
- [ ] T044 [US3] Integrer la gestion consentement/revocation push dans `apps/user-web/app/composables/usePushNotifications.ts` et `apps/user-web/app/pages/index.vue` (FR-005, SC-004)
- [ ] T045 [US3] Ajouter un composant UX de notification de cycle update dans `apps/user-web/app/components/features/pwa/FeaturePwaUpdateToast.component.vue` (FR-003)
- [ ] T046 [US3] Journaliser les transitions push/update critiques dans `apps/user-web/server/services/pwa-operational-log.service.ts` (FR-006, SC-005; a valider apres execution de T037-T039)

**Checkpoint**: US3 en cours; validation complete apres cloture des taches T037 a T046.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finaliser qualite, observabilite, UX et tracabilite.

- [x] T047 [P] Mettre a jour la documentation technique PWA dans `specs/002-configurer-nuxt-pwa/plan.md`, `specs/002-configurer-nuxt-pwa/research.md`, `specs/002-configurer-nuxt-pwa/data-model.md` (FR-010)
- [ ] T048 [P] Ajouter la matrice d'alertes/SLI PWA dans `apps/shared/observability/alerts.availability.yml` et `apps/shared/observability/slo.availability.md` (SC-002, SC-003, SC-004, SC-005)
- [ ] T049 Ajouter les tests de non-regression parcours existants touches par la PWA dans `apps/user-web/tests/integration/device-control.spec.ts` et `apps/user-web/tests/integration/profile-personalization.spec.ts` avec seuils FR-009 (success >= 99%, p95 interaction <= 2s sur reseau nominal, 0 regression bloquante) (FR-009)
- [ ] T050 [P] Ajouter un tableau de bord de metriques PWA dans `apps/shared/observability/monthly-availability.report.ts` (SC-002, SC-003, SC-004, SC-005, SC-006)
- [ ] T051 Executer et corriger les validations quickstart/typecheck/lint/tests dans `specs/002-configurer-nuxt-pwa/quickstart.md` et `typecheck_output.txt` (FR-008; a cocher uniquement si les 3 commandes sont vertes dans l'etat courant)
- [x] T052 [P] Verifier la conformite securite (pas de cache session/profil/token + audit des refus) dans `apps/user-web/nuxt.config.ts`, `apps/user-web/server/middleware/auth.ts`, `apps/user-web/server/services/pwa-cache-policy.service.ts` (FR-007)
- [ ] T053 Finaliser la tracabilite FR/SC vers artefacts de test et formaliser les regles de mesure (fenetre glissante 30 jours, population eligible, formules SC-004/SC-006, evidences journaux/tests) dans `specs/002-configurer-nuxt-pwa/tasks.md`, `specs/002-configurer-nuxt-pwa/checklists/requirements.md` et `apps/shared/observability/slo.availability.md` (FR-008, SC-004, SC-006)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: demarrage immediat.
- **Phase 2 (Foundational)**: depend de la Phase 1, bloque toutes les stories.
- **Phase 3 (US1)**: depend de la Phase 2.
- **Phase 4 (US2)**: depend de la Phase 2 (peut avancer en parallele de US1 apres fondations).
- **Phase 5 (US3)**: depend de la Phase 2 (peut avancer en parallele de US1/US2 apres fondations).
- **Phase 6 (Polish)**: depend des stories ciblees completees.

### User Story Dependencies

- **US1 (P1)**: aucune dependance fonctionnelle sur US2/US3 apres fondations.
- **US2 (P2)**: peut etre implementee sans US1, mais reutilise l'infra de lifecycle/log.
- **US3 (P3)**: peut etre implementee sans US2, mais partage le service de logs.

### Task-Level Critical Dependencies

- `T001` avant `T002`, `T005`, `T007`.
- `T010`, `T011`, `T012`, `T014`, `T016` avant la validation complete des stories US (les taches US peuvent etre en cours, mais non valides tant que la fondation n'est pas complete).
- `T017-T019` avant `T020-T026`.
- `T027-T029` avant `T030-T036`.
- `T037-T039` avant `T040-T046`.
- `T051` apres completion des stories ciblees.

---

## Parallel Opportunities

- Setup: `T002`, `T003`, `T004`, `T006`, `T007` en parallele apres `T001`.
- Foundational: `T010`, `T011`, `T012`, `T014`, `T015` en parallele.
- US1: `T017`, `T018`, `T019` puis `T020`, `T021` en parallele.
- US2: `T027`, `T028`, `T029` puis `T030`, `T031` en parallele.
- US3: `T037`, `T038`, `T039` puis `T040`, `T041` en parallele.
- Polish: `T047`, `T048`, `T050`, `T052` en parallele.

### Parallel Example: User Story 1

```bash
# Tests US1 en parallele
T017 + T018 + T019

# Impl PWA client/UX en parallele
T020 + T021
```

### Parallel Example: User Story 2

```bash
# Tests US2 en parallele
T027 + T028 + T029

# Services offline en parallele
T030 + T031
```

### Parallel Example: User Story 3

```bash
# Tests US3 en parallele
T037 + T038 + T039

# Update SW et push backend en parallele
T040 + T041
```

---

## FR/SC Traceability Matrix

### Mapping FR -> Tasks

- **FR-001**: T004, T005, T017, T018, T019, T020, T021, T022
- **FR-002**: T002, T033
- **FR-003**: T002, T006, T037, T039, T040, T045
- **FR-004**: T027, T029, T030, T032
- **FR-005**: T037, T038, T039, T041, T042, T043, T044
- **FR-006**: T011, T017, T023, T024, T025, T036, T046
- **FR-007**: T010, T015, T033, T052
- **FR-008**: T008, T013, T014, T017, T024, T027, T037, T051, T053
- **FR-009**: T001, T002, T006, T009, T012, T016, T049
- **FR-010**: T026, T047
- **FR-011**: T018, T019, T020, T034, T035
- **FR-012**: T027, T029, T031, T032
- **FR-013**: T003, T004, T005

### Mapping SC -> Tasks

- **SC-001**: T004, T018, T026
- **SC-002**: T033, T048, T050
- **SC-003**: T038, T040, T048, T050
- **SC-004**: T038, T041, T044, T048, T050, T053
- **SC-005**: T011, T025, T036, T046, T048, T050
- **SC-006**: T028, T031, T050, T053

---

## Implementation Strategy

### MVP First (US1)

1. Completer Phase 1 (Setup)
2. Completer Phase 2 (Foundational)
3. Completer Phase 3 (US1)
4. Valider US1 independamment (tests + quickstart)

### Incremental Delivery

1. Setup + Foundational
2. US1 (installabilite)
3. US2 (offline etendu)
4. US3 (update silencieuse + push)
5. Polish (observabilite + non-regression + traceabilite)

### Parallel Team Strategy

1. Equipe commune sur Phase 1/2
2. Apres fondations:
	- Developpeur A: US1
	- Developpeur B: US2
	- Developpeur C: US3
3. Integration continue sur endpoints PWA partages

---

## Notes

- Les taches `[P]` ciblent des fichiers distincts et des dependances explicites.
- Les stories restent testables independamment selon leurs criteres.
- Tous les changements .md restent en francais.
- Nuxt 4 est impose, sans proposition de downgrade.