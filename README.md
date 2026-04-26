# Home Assistant Monorepo

Monorepo Speckit pour une plateforme web domotique securisee avec deux surfaces isolees:
- application utilisateur (pilotage, profils, widgets, notifications)
- application administration (droits, revocation appareils, audit)

## Stack
- Vue 3 + Nuxt 3 + Nuxt UI
- TypeScript strict
- Supabase PostgreSQL
- OXC: Oxlint + Oxfmt
- Rolldown pour le package partage

## Structure
- [apps/user-web](apps/user-web): application utilisateur
- [apps/admin-web](apps/admin-web): application administration
- [apps/shared](apps/shared): schemas, contrats et services transverses
- [specs/001-pilotage-domotique-web](specs/001-pilotage-domotique-web): artefacts Speckit

## Commandes principales
A la racine du depot:

```bash
pnpm install
pnpm dev:user
pnpm dev:admin
pnpm build:shared
pnpm lint
pnpm format:check
pnpm test
pnpm typecheck
```

## Workflow Speckit
Ordre recommande:
1. speckit.specify
2. speckit.plan
3. speckit.tasks
4. speckit.implement

## Qualite et validation
- Tests unitaires, integration et contrat obligatoires
- Couverture des cas succes/erreur/warning
- Traçabilite des tests vers exigences FR/SC dans [specs/001-pilotage-domotique-web/tasks.md](specs/001-pilotage-domotique-web/tasks.md)

## Observabilite
- SLI/SLO de disponibilite: [apps/shared/observability/slo.availability.md](apps/shared/observability/slo.availability.md)
- Alerting burn-rate: [apps/shared/observability/alerts.availability.yml](apps/shared/observability/alerts.availability.yml)
- Rapport mensuel: [apps/shared/observability/monthly-availability.report.ts](apps/shared/observability/monthly-availability.report.ts)
