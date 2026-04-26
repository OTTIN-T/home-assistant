<!--
Sync Impact Report
- Version change: 0.0.0 -> 1.0.0
- Modified principles:
	- [PRINCIPLE_1_NAME] -> I. Architecture Nuxt modulaire et strictement typée
	- [PRINCIPLE_2_NAME] -> II. UX claire, moderne et personnalisable
	- [PRINCIPLE_3_NAME] -> III. Sécurité par défaut et contrôle d'accès fort
	- [PRINCIPLE_4_NAME] -> IV. Qualité par tests exhaustifs et traçables
	- [PRINCIPLE_5_NAME] -> V. Extensibilité domotique et widgets évolutifs
- Added sections:
	- Standards Techniques et Architecture
	- Workflow Qualité et Livraison
- Removed sections:
	- Aucune
- Templates requiring updates:
	- ✅ .specify/templates/plan-template.md
	- ✅ .specify/templates/spec-template.md
	- ✅ .specify/templates/tasks-template.md
	- ⚠ pending (non applicable, dossier absent): .specify/templates/commands/*.md
	- ✅ .github/copilot-instructions.md
- Follow-up TODOs:
	- Aucun
-->

# Home Assistant Web Constitution

## Core Principles

### I. Architecture Nuxt modulaire et strictement typée
L'application doit utiliser Vue 3, Nuxt 3 et Nuxt UI comme socle principal.
Le code frontend et backend Nuxt doit rester strictement typé (TypeScript strict).
La structure des composants doit suivre l'arborescence `components/bases`,
`components/features`, `components/layouts`.
Les composants de base doit être des composants de présentation (dumb components),
sans logique métier significative. La logique métier doit être portée par les pages,
puis extraite dans des composables ou stores dès qu'elle est réutilisable.
Rationale: cette discipline réduit le couplage et facilite maintenance, relecture et
évolutivité.

### II. UX claire, moderne et personnalisable
Chaque fonctionnalité utilisateur doit préserver une interface claire, moderne et
simple à utiliser, avec priorité à l'expérience utilisateur.
Le système doit supporter la personnalisation de l'interface et des profils
utilisateur, y compris des comportements domotiques différenciés par profil.
Toute évolution visuelle doit conserver cohérence, lisibilité et accessibilité
opérationnelle (navigation, feedback d'état, erreurs explicites).
Rationale: une UX pilotée par la clarté améliore l'adoption et réduit les erreurs de
commande domotique.

### III. Sécurité par défaut et contrôle d'accès fort
L'accès à l'application doit être limité aux personnes et appareils autorisés ou
enregistrés.
L'authentification et l'autorisation doit être appliquées sur toutes les surfaces
(UI, API, actions sensibles, administration).
Le périmètre d'administration doit être isolé logiquement et peut être déployé dans
un projet indépendant si cela renforce la sécurité et l'opérabilité.
Les événements de sécurité (connexion, refus, changement de privilèges) doit être
journalisés de manière exploitable.
Rationale: la domotique expose des capacités physiques et nécessite un niveau de
protection élevé.

### IV. Qualité par tests exhaustifs et traçables
Toute fonctionnalité doit être livrée avec des tests couvrant les chemins de succès,
d'erreur et de warning.
La couverture de tests doit être intégrale sur les parcours critiques et élevée sur
le reste du système, incluant unitaires, intégration et contrats API.
Aucune implémentation ne peut être considérée terminée sans preuve de tests
automatisés passants et traçables aux exigences.
Rationale: la fiabilité est indispensable pour des automatisations domestiques
répétables.

### V. Extensibilité domotique et widgets évolutifs
L'architecture doit permettre l'intégration incrémentale de nouveaux équipements,
widgets et fournisseurs domotiques sans refonte globale.
Le modèle de données et les API doit être conçus pour évoluer (profils, appareils,
scènes, règles) avec compatibilité ascendante par défaut.
Le produit cible doit prioriser une PWA avec support des notifications push; une
alternative applicative n'est acceptable que si elle justifie un gain net sur les
contraintes de sécurité, UX et maintenance.
Rationale: le parc domotique et les usages évoluent continuellement.

## Standards Techniques et Architecture

- Stack normative: Vue 3 + Nuxt 3 + Nuxt UI + Zod.
- Langue des artefacts techniques: les identifiants techniques doivent etre en anglais pour tout artefact oriente code (exemples: noms de champs, schemas, tags OpenAPI, payloads, noms d'entites, noms d'endpoints). La narration documentaire peut rester en francais.
- API: endpoints Nuxt server routes en priorité, avec séparation claire des couches.
- Données: Supabase est le choix par défaut si les contraintes de sécurité,
	conformité et scalabilité sont respectées; toute alternative doit être motivée
	dans le plan et validée avant implémentation.
- Nommage composants: le nom de fichier doit refléter l'arborescence et le rôle,
	par exemple `bases/btn/BaseBtn.component.vue`.
- Modularité: chaque nouveau module doit éviter les dépendances cycliques et expliciter
	ses contrats d'entrée/sortie.

## Workflow Qualité et Livraison

- Le flux Speckit doit être respecté: `speckit.specify` -> `speckit.plan` ->
	`speckit.tasks` -> `speckit.implement`.
- Le plan doit inclure un contrôle de conformité à cette constitution avant et après
	conception.
- Les tâches doit identifier explicitement: sécurité, test, UX, observabilité et
	extensibilité des widgets/profils.
- Toute déviation doit être documentée dans le suivi de complexité avec justification
	technique et alternative rejetée.

## Governance

Cette constitution prévaut sur les autres consignes opérationnelles du dépôt.
Toute modification doit:

1. Documenter la proposition, l'impact, et les artefacts à synchroniser.
2. Définir le niveau de version SemVer:
	 - MAJOR: suppression ou redéfinition incompatible d'un principe,
	 - MINOR: ajout d'un principe/section normative,
	 - PATCH: clarification sans changement de norme.
3. Mettre à jour les templates impactés et vérifier la cohérence des instructions
	 agent (notamment `.github/copilot-instructions.md`).
4. Être revue avec une vérification explicite de conformité en plan et en tâches.

Une revue de conformité doit être effectuée pour chaque feature à la création du plan,
à la génération des tâches, puis avant livraison.

**Version**: 1.2.0 | **Ratified**: 2026-04-25 | **Last Amended**: 2026-04-25
