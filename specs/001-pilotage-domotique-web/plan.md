# Implementation Plan: Pilotage Domotique Web

**Branch**: `001-before-specify-hook` | **Date**: 2026-04-25 | **Spec**: `/specs/001-pilotage-domotique-web/spec.md`
**Input**: Feature specification from `/specs/001-pilotage-domotique-web/spec.md`

## Summary

Construire une plateforme web domotique sécurisée, orientée PWA, avec deux périmètres isolés: application utilisateur (pilotage, profils, widgets, notifications) et application d'administration (droits, appareils enregistrés, audit). L'implémentation vise Nuxt 3 + Nuxt UI en TypeScript strict, stockage principal Supabase (PostgreSQL), contrôle d'accès fort utilisateur+appareil, traçabilité sécurité, et résilience en lecture seule lors d'indisponibilité fournisseur.

## Technical Context

**Language Convention**: Documentation narrative can be French, but all code-oriented technical identifiers must be English (fields, schema names, endpoint names, OpenAPI tags/descriptions).

**Language/Version**: TypeScript 5.x (strict), Node.js 20 LTS
**Primary Dependencies**: Nuxt 3, Vue 3, Nuxt UI, Pinia, Zod, Supabase JS, Web Push (VAPID), Rolldown, Oxlint, Oxfmt
**Storage**: Supabase PostgreSQL + stockage objet pour assets widgets (si nécessaire)
**Testing**: Vitest (unitaires), Playwright (intégration/E2E), tests de contrat API (OpenAPI + validation schéma)
**Target Platform**: Web desktop/mobile (PWA installable), navigateurs modernes, backend Nuxt server
**Project Type**: Applications web multi-projets (utilisateur + administration) avec contrats API partagés
**Performance Goals**:
- p95 API de commande équipement <= 400 ms (hors latence fournisseur tiers)
- livraison notification push prioritaire <= 10 s pour 95% des événements
- disponibilité mensuelle >= 99,9%
**Observability Goals**:
- define SLI/SLO for monthly availability and track error budget burn rate
- instrument user action completion time for SC-001 and push latency for SC-004
- publish monthly availability report for SC-006 validation
**Tooling Goals**:
- reduce CI lint/format duration using OXC toolchain
- enforce type-aware linting and multi-file analysis via Oxlint when rules require project context
- standardize formatting with Oxfmt including built-in sorting capabilities
**Constraints**:
- accès réservé aux utilisateurs autorisés et appareils enregistrés
- conservation journaux sécurité/audit 3 mois, puis purge
- résolution des commandes concurrentes par priorité de rôle (admin > user)
- bascule lecture seule des équipements impactés si fournisseur indisponible
**Scale/Scope**:
- V1: foyer unique, dizaines à centaines d'équipements, multi-profils
- extensibilité pour nouveaux fournisseurs/équipements sans refonte

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Stack conforme: Vue 3 + Nuxt 3 + Nuxt UI, TypeScript strict activé
- [x] Architecture composants conforme: `components/bases`, `components/features`, `components/layouts`
- [x] Composants de base sans logique métier; logique en pages/composables/stores
- [x] Stratégie sécurité documentée: authn/authz, appareils autorisés, journalisation
- [x] Périmètre administration isolé (application/projet distinct retenu en V1)
- [x] Stratégie PWA et notifications push définie
- [x] Stratégie qualité définie: tests succès/erreur/warning (unitaires, intégration, contrat)
- [x] Extensibilité validée: widgets, profils, nouveaux équipements sans refonte
- [x] Choix BDD validé (Supabase PostgreSQL retenu)

### Revue Post-Design (Phase 1)

- Statut: conforme, aucune dérogation ouverte
- Impacts vérifiés: modèle de données, contrats API et quickstart alignés avec la constitution

## Project Structure

### Documentation (this feature)

```text
specs/001-pilotage-domotique-web/
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
│   │   ├── pages/
│   │   ├── composables/
│   │   └── stores/
│   ├── server/
│   │   ├── api/
│   │   └── services/
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── contract/
├── admin-web/
│   ├── app/
│   │   ├── components/
│   │   │   ├── bases/
│   │   │   ├── features/
│   │   │   └── layouts/
│   │   ├── pages/
│   │   ├── composables/
│   │   └── stores/
│   ├── server/
│   │   ├── api/
│   │   └── services/
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── contract/
└── shared/
    ├── contracts/
    ├── schemas/
    └── security/
```

**Structure Decision**: architecture web multi-projets retenue pour isoler strictement le périmètre d'administration dès la V1, tout en conservant des contrats et schémas partagés dans `apps/shared`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Aucune | N/A | N/A |
