# Implementation Plan: Configuration PWA Nuxt complete

**Branch**: `002-configurer-nuxt-pwa` | **Date**: 2026-04-26 | **Spec**: `/specs/002-configurer-nuxt-pwa/spec.md`
**Input**: Feature specification from `/specs/002-configurer-nuxt-pwa/spec.md`

## Summary

Mettre en place une configuration PWA complete pour `apps/user-web` avec Nuxt 4, en couvrant l'installabilite mobile/desktop, le hors-ligne etendu (file d'attente de commandes), la mise a jour silencieuse du service worker, la gestion de consentement push au premier lancement, et la journalisation operationnelle. Les choix techniques privilegient les dernieres versions stables des dependances, avec une integration centralisee via `@vite-pwa/nuxt` et des contrats API explicites.

## Technical Context

**Language/Version**: TypeScript strict (5.x), Vue 3.5+, Nuxt 4.x (stable)
**Primary Dependencies**: `nuxt@latest` (stable), `@nuxt/ui@latest` (stable), `@vite-pwa/nuxt@latest` (stable), `@vite-pwa/assets-generator@latest` (stable), `@pinia/nuxt`, `zod`, `@supabase/supabase-js`
**Storage**: IndexedDB (queue offline cote client) + stockage serveur existant (Supabase/PostgreSQL)
**Testing**: Vitest (unit/integration), Playwright (E2E), tests de contrat HTTP dans `apps/user-web/tests/contract`
**Target Platform**: Navigateurs mobile/desktop cibles: Chrome, Edge, Safari
**Project Type**: Web app Nuxt dans un monorepo pnpm
**Performance Goals**: ecran principal < 3s en reseau lent pour 95% des tentatives; sync offline fiable >= 95%
**Constraints**: securite stricte (authn/authz, pas de cache de session/profil/token), updates SW silencieuses, fallback UX explicites
**Scale/Scope**: perimetre V1 limite a `apps/user-web` + endpoints serveur Nuxt associes + observabilite PWA

## Constitution Check (Pre-Phase 0)

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Stack conforme Vue 3 + Nuxt UI + TypeScript strict
- [x] Architecture composants conforme: `components/bases`, `components/features`, `components/layouts`
- [x] Composants de base sans logique metier; logique dans pages/composables/stores
- [x] Strategie securite documentee: authn/authz, appareils autorises, journalisation
- [x] Perimetre administration isole (feature limitee a `apps/user-web`)
- [x] Strategie PWA et notifications push definie
- [x] Strategie qualite definie: tests succes/erreur/warning (unitaires, integration, contrat)
- [x] Extensibilite validee: widgets/profils/nouveaux equipements sans refonte
- [x] Choix BDD valide (stack existante Supabase/PostgreSQL)

Statut de gate pre-recherche: PASS, sans ecart de constitution identifie.

## Project Structure

### Documentation (feature 002)

```text
specs/002-configurer-nuxt-pwa/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
apps/
├── user-web/
│   ├── app/
│   │   ├── components/
│   │   │   ├── bases/
│   │   │   ├── features/
│   │   │   └── layouts/
│   │   ├── composables/
│   │   ├── pages/
│   │   └── stores/
│   ├── public/
│   │   ├── manifest.webmanifest
│   │   └── sw.js
│   ├── server/
│   │   ├── api/
│   │   ├── middleware/
│   │   └── services/
│   └── tests/
│       ├── contract/
│       ├── integration/
│       └── unit/
├── admin-web/
└── shared/
```

**Structure Decision**: conserver l'architecture monorepo existante; implementer la PWA dans `apps/user-web` avec contrats dans `specs/002-configurer-nuxt-pwa/contracts/` et extension eventuelle des services partages si necessaire.

## Phase 0 - Research Output

Toutes les zones precedemment ambiguës sont resolues dans `research.md`:

- Integration PWA: `@vite-pwa/nuxt`
- Strategie update SW: `autoUpdate` + activation immediate
- Hors-ligne etendu: queue commandes en IndexedDB + synchronisation ordonnee
- Caching securise: endpoints lecture seule des etats d'equipements uniquement
- Push: consentement au premier lancement + journalisation
- Assets: generation via `@vite-pwa/assets-generator`
- Compatibilite navigateurs: detection capacites + fallback UX explicites
- Politique dependencies: toujours les dernieres versions stables

Aucun `NEEDS CLARIFICATION` restant.

## Phase 1 - Design & Contracts Output

Artefacts generes/mis a jour:

- `data-model.md`: entites PWA, validations, transitions d'etat, invariants securite
- `contracts/openapi.yaml`: contrats push, synchronisation queue offline, lifecycle PWA
- `quickstart.md`: procedure de verification rapide, y compris politique `@latest`
- `spec.md`: exigences clarifiees avec regles de mesure explicites (fenetre 30 jours, population eligible, formules SC-004/SC-006, evidences)
- `tasks.md`: tracabilite FR/SC alignee avec les regles de mesure

## Constitution Check (Post-Phase 1)

- [x] Architecture et typage strict conserves
- [x] Securite et journalisation couvertes dans modeles et contrats
- [x] Strategie PWA/push/offline definie et testable
- [x] Strategie de test complete (unit/integration/contract)
- [x] Extensibilite preservee via contrats explicites et modeles modulaires

Statut post-design: PASS, sans ecart de constitution identifie.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
