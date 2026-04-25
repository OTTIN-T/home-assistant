# Validation Quickstart

## Perimetre
Validation des 5 parcours defines dans [specs/001-pilotage-domotique-web/quickstart.md](specs/001-pilotage-domotique-web/quickstart.md).

## Parcours verifies
1. Succes connexion + commande equipement: couvert par tests integration user-web (device-control).
2. Refus appareil non enregistre + audit: couvert par tests integration user-web (access-denied).
3. Warning fournisseur indisponible et read-only: couvert par tests unitaires provider + contrats devices.
4. Personnalisation profils/widgets persistante: couvert par tests integration user-web (profile-personalization).
5. Administration isolee (roles/revocation/audit): couvert par tests admin-web contrat + integration.

## Commandes executees
```bash
pnpm --filter user-web test
pnpm --filter admin-web test
pnpm --filter user-web typecheck
pnpm --filter admin-web typecheck
```

## Verdict
Tous les parcours quickstart critiques sont valides via evidence automatisee (tests + typecheck).
