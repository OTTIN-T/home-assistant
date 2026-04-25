# SLI/SLO disponibilite mensuelle

## Objectif produit
- Disponibilite mensuelle globale cible: >= 99.9%.
- Surface couverte: API auth, devices, profiles, admin.

## SLI retenu
- SLI principal: taux de requetes reussies.
- Formule: requetes HTTP avec status < 500 / requetes totales.
- Fenetre: mensuelle glissante.

## SLO
- SLO-001: disponibilite globale mensuelle >= 99.9%.
- SLO-002: chaque surface API (auth/devices/profiles/admin) >= 99.5% mensuel.

## Error budget
- Budget mensuel autorise pour SLO-001: 0.1% d'indisponibilite.
- Burn rate d'alerte rapide: 2x budget sur 1h.
- Burn rate d'alerte soutenue: 1x budget sur 6h.

## Sources de mesure
- Collecte in-process via [apps/shared/observability/uptime.collector.ts](apps/shared/observability/uptime.collector.ts).
- Reporting mensuel via [apps/shared/observability/monthly-availability.report.ts](apps/shared/observability/monthly-availability.report.ts).
- Regles d'alerte via [apps/shared/observability/alerts.availability.yml](apps/shared/observability/alerts.availability.yml).
