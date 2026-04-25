# Quickstart - Pilotage Domotique Web

## Objectif
Valider rapidement la feature en environnement local avec les scénarios critiques: accès sécurisé, pilotage, personnalisation, administration isolée et audit.

## Pré-requis
- Node.js 20+
- pnpm 9+
- Projet Supabase configuré (URL + clés)
- Clés VAPID pour notifications push

## Variables d'environnement minimales

### Application utilisateur (apps/user-web)
- NUXT_PUBLIC_SUPABASE_URL
- NUXT_PUBLIC_SUPABASE_ANON_KEY
- NUXT_PUSH_PUBLIC_VAPID_KEY

### Application administration (apps/admin-web)
- NUXT_PUBLIC_SUPABASE_URL
- NUXT_PUBLIC_SUPABASE_ANON_KEY
- ADMIN_ALLOWED_ROLES=admin

### Services communs
- SUPABASE_SERVICE_ROLE_KEY
- AUDIT_RETENTION_DAYS=90

## Démarrage local
1. Installer les dépendances.
2. Démarrer l'application utilisateur.
3. Démarrer l'application d'administration sur un port distinct.
4. Vérifier que les deux surfaces sont accessibles séparément.

## Parcours de validation manuelle (minimum)
1. Succès: connexion avec utilisateur autorisé + appareil autorisé, puis commande simple sur équipement.
2. Erreur: tentative avec appareil non enregistré, accès refusé et événement d'audit produit.
3. Warning: indisponibilité fournisseur simulée, équipement visible en lecture seule avec message explicite.
4. Personnalisation: création d'un profil, activation, ajout/réorganisation de widgets, persistance après reconnexion.
5. Administration isolée: modification de droits utilisateur depuis l'app admin et effet visible à la session suivante.

## Tests automatisés attendus
- Unitaires (Vitest): règles métier de priorité de rôle, validations de schémas, calcul des transitions d'état.
- Intégration (Playwright): parcours user story P1/P2/P3, y compris cas d'erreur et warning.
- Contrat (OpenAPI): validation des endpoints documentés dans contracts/openapi.yaml.

## Critères de sortie
- Tous les tests automatisés passent.
- Les scénarios succès/erreur/warning sont couverts et traçables vers les exigences FR.
- La journalisation sécurité conserve bien une politique de rétention de 90 jours.
