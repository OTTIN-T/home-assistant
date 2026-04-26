<!-- SPECKIT START -->
Pour le contexte complémentaire sur les technologies utilisées, la structure du projet,
les commandes shell et les autres informations importantes, lire le plan courant :
./specs/001-pilotage-domotique-web/plan.md
<!-- SPECKIT END -->

# Instructions Workspace Speckit Home Assistant

Ce dépôt est un espace de travail de workflow Speckit, pas une base de code d'application classique.

## Politique de langue

- À partir de maintenant, rédiger toute documentation en français.
- Cette règle s'applique à tous les fichiers Markdown (.md), y compris les nouvelles instructions, prompts, skills, guides et notes de projet.
- En cas de mise à jour d'un fichier .md existant, privilégier une version en français ou une traduction complète si le contexte le permet.

## Contenu du dépôt

- Configuration et templates Speckit dans [./.specify](./.specify)
- Agents de workflow dans [./.github/agents](./.github/agents)
- Définitions de prompts dans [./.github/prompts](./.github/prompts)

Utiliser ces répertoires comme source de vérité avant toute proposition ou modification.

## Modèle d'exécution

Privilégier les étapes de workflow Speckit plutôt qu'une implémentation ad hoc :

1. `speckit.specify`
2. `speckit.plan`
3. `speckit.tasks`
4. `speckit.implement`

Définition canonique du workflow : [./.specify/workflows/speckit/workflow.yml](./.specify/workflows/speckit/workflow.yml).

## Commandes clés (PowerShell)


- Valider les prérequis et détecter le dossier de fonctionnalité actif :
	- `./.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`
- Créer le squelette d'une nouvelle fonctionnalité :
	- `./.specify/scripts/powershell/create-new-feature.ps1 "Feature description"`
- Initialiser le document de plan à partir du template :
	- `./.specify/scripts/powershell/setup-plan.ps1`

Les fonctions utilitaires partagées sont dans [./.specify/scripts/powershell/common.ps1](./.specify/scripts/powershell/common.ps1).

## Conventions à respecter

- Garder les modifications alignées avec les templates de [./.specify/templates](./.specify/templates).
- Maintenir la synchronisation des paires agent/prompt :
	- [./.github/agents](./.github/agents)
	- [./.github/prompts](./.github/prompts)
- Respecter les hooks d'extensions configurés dans [./.specify/extensions.yml](./.specify/extensions.yml).
- Préférer la mise à jour des artefacts de personnalisation existants plutôt que créer des consignes dupliquées.

## Contraintes produit (constitution)

- Stack cible par défaut : Vue 3 + Nuxt 3 + Nuxt UI.
- Tout code applicatif doit être strictement typé (TypeScript strict), y compris les contrats API.
- Architecture composants obligatoire :
	- `components/bases`
	- `components/features`
	- `components/layouts`
- Les composants dans `components/bases` doivent être des composants de présentation (dumb components), sans logique métier significative.
- La logique métier doit être prioritairement portée par les pages, puis extraite dans des composables/stores quand elle est réutilisable.
- Convention de nommage des composants : refléter l'arborescence et le rôle (ex : `bases/btn/BaseBtn.component.vue`).
- La sécurité est non négociable : accès réservé aux utilisateurs et appareils autorisés/enregistrés, avec authn/authz et journalisation des événements de sécurité.
- Le périmètre d'administration doit être isolé (même projet ou projet indépendant selon le plan validé).
- L'application doit privilégier une approche PWA avec notifications push ; toute alternative doit être justifiée dans le plan.
- Les exigences de test sont obligatoires : couvrir succès, erreurs et warnings (unitaires, intégration, contrats), avec traçabilité vers les exigences.
- L'architecture doit rester modulable pour intégrer facilement widgets, profils et nouveaux équipements domotiques.

## Pièges connus

- Cet espace suppose une automatisation basée sur PowerShell (`script: ps` dans [./.specify/init-options.json](./.specify/init-options.json)).
- L'absence de `plan.md` ou `tasks.md` pour une fonctionnalité bloque les workflows orientés implémentation.
- Un YAML invalide dans [./.specify/extensions.yml](./.specify/extensions.yml) peut casser le comportement des hooks.

## Politique lien d'abord

Ne pas copier de longues documentations dans les instructions. Créer des liens vers les sources existantes :

- Comportement de l'extension Git : [./.specify/extensions/git/README.md](./.specify/extensions/git/README.md)
- Base de gouvernance : [./.specify/memory/constitution.md](./.specify/memory/constitution.md)
