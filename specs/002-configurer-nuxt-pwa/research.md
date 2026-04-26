# Research - Configuration PWA Nuxt complete

## Decision 0: Baseline stack Nuxt 4 + dependances en dernieres versions stables
- Decision: Conserver Nuxt 4 comme baseline (`nuxt` deja present en `^4.4.2`) et appliquer une politique explicite de dependances PWA en versions stables les plus recentes (`@latest` au moment de l'implementation).
- Rationale: Respecte la contrainte explicite utilisateur, reste coherent avec le workspace actuel, et limite le risque d'obsolescence immediate.
- Alternatives considered: Revenir a une version Nuxt precedente rejete (non conforme a la demande, dette technique de downgrade); pinner des versions anciennes rejete (surface de maintenance accrue).

## Decision 1: Integrer la PWA via @vite-pwa/nuxt
- Decision: Utiliser le module `@vite-pwa/nuxt` dans `apps/user-web` (installation en version stable la plus recente) plutot qu'une registration manuelle du service worker.
- Rationale: La documentation Nuxt de Vite PWA expose une integration native, l'injection de `$pwa` (status install/update/offline), et une configuration centralisee du manifest et Workbox.
- Alternatives considered: Service worker manual dans `public/sw.js` rejete car plus fragile (moins de coherence build/runtime et plus de code custom a maintenir).

## Decision 2: Politique de mise a jour silencieuse immediate
- Decision: Configurer une strategie `autoUpdate` avec activation immediate (`skipWaiting` + `clientsClaim`) pour respecter la clarification actee.
- Rationale: Repond a FR-003 et a la clarification "mise a jour silencieuse immediate" tout en limitant les interruptions visibles.
- Alternatives considered: Mode "prompt utilisateur" rejete car contraire a la clarification; mode "mise a jour au prochain lancement" rejete car plus lent a diffuser les correctifs.

## Decision 3: Hors-ligne etendu avec file d'attente de commandes
- Decision: Mettre en place une queue locale en IndexedDB pour les commandes hors-ligne, synchronisee des que la connectivite revient.
- Rationale: Repond a la clarification "offline etendu" et a FR-004/FR-012. IndexedDB est adapte aux operations structurees et a la reprise robuste.
- Alternatives considered: LocalStorage rejete (capacite et robustesse insuffisantes); abandon de commandes hors-ligne rejete (perte de fonctionnalite metier).

## Decision 4: Politique de cache restreinte aux etats d'equipements en lecture seule
- Decision: Appliquer une runtime caching strategy limitee aux endpoints de lecture des device states, avec exclusion explicite des routes de session/profil/auth.
- Rationale: Conforme a FR-007 et aux exigences Security & Access (pas de persistance des tokens ni donnees sensibles).
- Alternatives considered: Cache large des reponses API rejete pour risque de fuite de donnees; no-cache complet rejete pour non-respect de SC-002.

## Decision 5: Consentement push au premier lancement
- Decision: Afficher une demande de permission push au premier lancement avec message explicite, puis journaliser le statut (granted/denied/default) cote serveur.
- Rationale: Aligne avec clarification actee et FR-005; conforme aux recommandations PWABuilder (permission explicite, revocable).
- Alternatives considered: Demande uniquement sur action tardive rejete (contraire a la clarification); activation implicite rejete (non conforme aux pratiques de consentement).

## Decision 6: Production des assets via @vite-pwa/assets-generator
- Decision: Generer un set complet d'icones/variantes installables avec `@vite-pwa/assets-generator` en version stable la plus recente et versionner la configuration.
- Rationale: Repond a FR-013 et reduit les erreurs manuelles de tailles/purpose (`any`, `maskable`, Apple touch icons).
- Alternatives considered: Creation manuelle des icones rejetee (risque d'incoherence et de non-conformite installabilite).

## Decision 7: Contrats serveur explicites pour push et sync offline
- Decision: Definir des contrats HTTP pour enregistrer/revoquer les push subscriptions, synchroniser la queue offline, et journaliser les evenements PWA critiques.
- Rationale: Permet de couvrir la strategie de tests de contrat et de garder des interfaces stables entre client PWA et backend Nuxt.
- Alternatives considered: Contrats implicites non documentes rejetes (faible tracabilite, risques de regressions).

## Decision 8: Compatibilite navigateurs ciblee et degradations explicites
- Decision: Supporter Chrome/Edge/Safari avec detection des capacites (install prompt, background sync, push), et messages UX clairs quand une capacite manque.
- Rationale: Conforme aux clarifications plateformes et aux edge cases de la spec.
- Alternatives considered: Exiger toutes les APIs avancees partout rejete (incompatible Safari/variantes mobile); absence de fallback UX rejetee.

## Decision 9: Observabilite PWA orientee incidents
- Decision: Journaliser installation, update SW, echec sync queue, echec push subscription, registrationError SW avec correlation IDs.
- Rationale: Repond a FR-006, FR-008 et SC-005 pour investiguer les incidents support.
- Alternatives considered: Logs uniquement navigateur rejete (inexploitables cote support).

## Decision 10: Strategie de mise a jour des librairies
- Decision: Pour l'implementation, utiliser des commandes d'installation/upgrade qui ciblent explicitement les dernieres versions stables (`pnpm add <package>@latest`), puis valider via `pnpm typecheck`, `pnpm test` et contrats.
- Rationale: Rend la politique de version verifiable et reproductible dans les runs de livraison.
- Alternatives considered: Upgrade opportuniste non documente rejete (derive des environnements et incoherence CI/dev).

## Decision 11: Validation rapide PWA integree aux scripts workspace
- Decision: Exposer `pwa:assets` et `pwa:validate` dans `apps/user-web/package.json`, puis relayer `pwa:validate` et `pwa:assets` au niveau racine du monorepo.
- Rationale: Rend les controles quickstart reproductibles, facilite la verification locale/CI et aligne la validation sur FR-008.
- Alternatives considered: Commandes manuelles non scriptes rejetees (oubli possible, moindre tracabilite).

## Decision 12: Environnement de tests mixte node + jsdom
- Decision: Conserver Vitest en environnement `node` par defaut, avec bascule `jsdom` pour les tests d'integration PWA dependants de `window`, `navigator` et `matchMedia`.
- Rationale: Les routes serveur et contrats restent proches de l'execution Nitro, tandis que les scenarios PWA navigateur ont besoin d'APIs DOM explicites.
- Alternatives considered: Tout basculer en `jsdom` rejete (moins fidele pour les tests serveur); mocks ad hoc dans chaque test rejetes (duplication et maintenance accrue).

## Decision 13: Resolution explicite des imports serveur pour les tests de contrat
- Decision: Ajouter `h3` comme dependance de developpement de `apps/user-web` afin que les tests Vitest resolvent correctement les routes serveur importees directement.
- Rationale: Les tests de contrat/integration importent les handlers Nuxt server routes hors runtime Nitro complet; la resolution de `h3` doit donc etre disponible dans le package cible.
- Alternatives considered: Mocks globaux de `h3` rejetes (faible realisme); deplacement des tests vers un autre package rejete (complexite inutile).

## Decision 14: Politique de cache normalisee pour robustesse de matching
- Decision: Normaliser les URLs de cache policy en minuscules et ignorer query/hash avant evaluation des allowlist/denylist.
- Rationale: Garantit le comportement attendu sur extensions majuscules et URLs parametrees, tout en conservant les interdictions de routes sensibles.
- Alternatives considered: Etendre manuellement toutes les regex pour les variantes de casse et query strings rejete (plus fragile et plus verbeux).

## Decision 15: Audit explicite des refus d'authentification
- Decision: Journaliser les refus dans le middleware `auth.ts` avec raison, chemin, methode et IP cliente avant emission des erreurs 401/403.
- Rationale: Rend T052 verifiable, aligne la mise en oeuvre avec FR-007/FR-006 et facilite l'investigation support/securite.
- Alternatives considered: Compter uniquement sur les erreurs HTTP rejete (signal insuffisant pour l'audit).
