# Quickstart - Configuration PWA Nuxt

## Objectif
Valider rapidement la configuration PWA de `apps/user-web` avec installation, offline etendu, mise a jour silencieuse, push permission au premier lancement et journalisation des evenements critiques.

## Prerequis
- Node.js 20+
- pnpm 9+
- Navigateur de test: Chrome ou Edge (Safari en verification complementaire)
- Variables d'environnement configurees pour `apps/user-web` (Supabase + VAPID)
- HTTPS en environnement de recette (localhost autorise pour developpement)

## Politique de versions
- Conserver Nuxt 4 (pas de downgrade vers une version precedente).
- Privilegier les dernieres versions stables des librairies lors de l'implementation.

## 1. Installer les dependances
```bash
pnpm install
```

## 2. Aligner les dependances PWA sur les dernieres stables
```bash
pnpm --filter user-web add nuxt@latest @vite-pwa/nuxt@latest
pnpm --filter user-web add -D @vite-pwa/assets-generator@latest
```

## 3. Lancer l'application utilisateur
```bash
pnpm dev:user
```

## 4. Verifier la configuration PWA de base
1. Ouvrir l'application dans le navigateur.
2. Verifier la presence d'un manifest valide et d'un service worker actif (DevTools > Application).
3. Verifier que les icones/metadata d'installation sont presentes et coherentes.

## 5. Valider l'installation (User Story P1)
1. Declencher l'installation depuis le navigateur.
2. Confirmer l'ouverture en mode standalone depuis l'icone locale.
3. Verifier que les controles de session/auth restent appliques apres installation.

## 6. Valider le mode hors-ligne etendu (User Story P2)
1. Charger l'application une premiere fois en ligne.
2. Simuler une coupure reseau (offline dans DevTools).
3. Verifier que l'interface reste navigable avec ressources precachees.
4. Envoyer une commande domotique: elle doit etre en `queued` localement.
5. Restaurer le reseau et verifier la synchronisation ordonnee (`queued -> syncing -> synced|failed|conflict`).

## 7. Valider la mise a jour silencieuse (User Story P3)
1. Deployer une nouvelle version contenant un changement statique.
2. Recharger l'application et verifier que le nouveau service worker s'active automatiquement.
3. Verifier qu'aucune interruption bloquante n'est visible pour l'utilisateur.
4. Verifier la journalisation des events `update_found`/`update_applied`/`activated`.

## 8. Valider le consentement push
1. Au premier lancement, verifier l'affichage de la demande de permission push avec texte explicite.
2. Tester les cas `granted`, `denied`, `default`.
3. Verifier que chaque transition est journalisee et revocable depuis les parametres utilisateur.

## 9. Verifications qualite
```bash
pnpm typecheck
pnpm lint
pnpm test
```

## 10. Tests cibles recommandes
```bash
pnpm --filter user-web test
```

Cas a couvrir obligatoirement:
- succes: installation, activation SW, sync queue, subscription push
- erreur: echec registration SW, echec sync, echec endpoint push
- warning: capacite navigateur indisponible (fallback UX)

## Critere de sortie
La feature est prete pour `speckit.tasks` quand:
- les 3 user stories sont validables independamment
- les contraintes de securite/cache sont verifiees
- les evenements critiques PWA sont tracables
- les tests unitaires/integration/contrat associes sont definis
