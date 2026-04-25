# Feature Specification: Pilotage Domotique Web

**Feature Branch**: `001-before-specify-hook`
**Created**: 2026-04-25
**Status**: Draft
**Input**: User description: "Application web pour piloter la domotique de la maison, avec interface moderne, profils personnalisables, widgets, administration sécurisée, accès restreint et notifications push"

## Clarifications

### Session 2026-04-25

- Q: Quel niveau d'isolation retenir pour le périmètre d'administration en V1? → A: Admin isolé dans une application/projet distinct dès la V1.
- Q: Quelle stratégie de résolution choisir quand plusieurs commandes arrivent presque en même temps sur le même équipement? → A: Autoriser le parallèle et résoudre par priorité de rôle (admin > user).
- Q: Quelle durée de rétention définir pour les événements de sécurité et d'audit? → A: 3 mois.
- Q: Quel objectif de disponibilité mensuelle retenir pour la plateforme? → A: 99,9% de disponibilité mensuelle.
- Q: Quelle stratégie adopter quand un fournisseur domotique tiers est indisponible? → A: Basculer en mode lecture seule pour les équipements impactés, avec message clair.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Contrôle Domotique Sécurisé (Priority: P1)

En tant qu'utilisateur autorisé, je me connecte de façon sécurisée, je vois mes équipements disponibles et je peux exécuter des actions de contrôle (allumer, éteindre, activer) avec retour d'état clair.

**Why this priority**: Sans accès sécurisé et contrôle de base des équipements, le produit ne délivre pas de valeur principale.

**Independent Test**: Peut être testé de façon autonome en autorisant un utilisateur, en refusant un utilisateur non autorisé, puis en exécutant une action simple sur un équipement et en vérifiant la mise à jour d'état.

**Acceptance Scenarios**:

1. **Given** un utilisateur autorisé et un appareil enregistré, **When** l'utilisateur se connecte puis déclenche une action sur un équipement, **Then** l'action est appliquée et l'état affiché est mis à jour.
2. **Given** un utilisateur non autorisé ou un appareil non enregistré, **When** une tentative d'accès est effectuée, **Then** l'accès est refusé et l'événement de sécurité est tracé.

---

### User Story 2 - Personnalisation Par Profils Et Widgets (Priority: P2)

En tant qu'utilisateur autorisé, je configure des profils personnalisés et un tableau de bord à base de widgets afin d'adapter l'interface et les comportements domotiques à différents contextes d'usage.

**Why this priority**: La personnalisation est un différenciateur clé et conditionne l'adoption à moyen terme.

**Independent Test**: Peut être testé indépendamment en créant un profil, en personnalisant des widgets, puis en vérifiant que le comportement et l'affichage appliquent bien le profil sélectionné.

**Acceptance Scenarios**:

1. **Given** un utilisateur connecté, **When** il crée un profil avec préférences et comportements puis l'active, **Then** le tableau de bord et les règles associées reflètent ce profil.
2. **Given** un tableau de bord existant, **When** l'utilisateur ajoute, retire ou réorganise des widgets, **Then** la nouvelle configuration est conservée et réappliquée lors de la prochaine session.

---

### User Story 3 - Administration Isolée Et Gouvernance (Priority: P3)

En tant qu'administrateur, je gère les autorisations, les appareils enregistrés et les paramètres de sécurité depuis une application d'administration distincte du périmètre utilisateur afin de limiter les risques opérationnels.

**Why this priority**: Cette capacité protège le système, mais peut être livrée après le socle de contrôle utilisateur.

**Independent Test**: Peut être testé séparément en modifiant des autorisations, en enregistrant/révoquant un appareil et en vérifiant l'application immédiate des règles et des traces d'audit.

**Acceptance Scenarios**:

1. **Given** un administrateur authentifié, **When** il modifie les droits d'un utilisateur ou l'état d'enregistrement d'un appareil, **Then** la nouvelle politique est appliquée aux accès suivants.
2. **Given** une action administrative sensible, **When** l'action est validée, **Then** une trace d'audit complète est produite et consultable.

---

### Edge Cases

- En cas de connectivite intermittente pendant une commande, si la reconnexion intervient en moins de 30 secondes, le systeme doit reconcilier la commande et afficher l'etat final avec un statut `reconciled`.
- Lorsqu'un fournisseur domotique tiers est indisponible, les équipements impactés basculent en mode lecture seule avec message explicite.
- En cas de commandes concurrentes sur un même équipement, l'ordre d'application est résolu par priorité de rôle (admin > user), avec journalisation des arbitrages.
- Lorsqu'un profil contient des preferences incompatibles avec un equipement, le systeme doit ignorer uniquement la preference non supportee, afficher un warning utilisateur, et journaliser un `SecurityEvent` de severite `warning`.
- Lorsqu'un appareil est revoque pendant une session active, la session doit etre invalidee en moins de 10 secondes, puis toute action ulterieure doit retourner une erreur d'autorisation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système doit permettre l'accès uniquement aux utilisateurs autorisés et aux appareils enregistrés.
- **FR-002**: Le système doit permettre à un utilisateur autorisé de consulter et contrôler les équipements domotiques disponibles.
- **FR-003**: Le systeme doit afficher apres chaque action de pilotage un statut explicite parmi `accepted`, `executed`, `rejected`, `failed`, `reconciled`, avec horodatage, en moins de 2 secondes dans 95% des cas.
- **FR-004**: Les utilisateurs doit pouvoir créer, modifier et activer des profils personnalisés.
- **FR-005**: Le système doit journaliser les événements de sécurité et d'administration avec une rétention de 3 mois.

### Mandatory Domain Requirements (Home Automation Web App)

- **FR-006**: Le système doit appliquer un contrôle d'accès basé sur rôles pour les usages utilisateur et administration.
- **FR-007**: Le système doit supporter la personnalisation du tableau de bord via des widgets configurables.
- **FR-008**: Le système doit conserver les préférences et agencements personnalisés entre sessions.
- **FR-009**: Le système doit permettre l'exécution de comportements domotiques différents selon le profil actif.
- **FR-010**: Le système doit proposer un périmètre d'administration isolé via une application/projet distinct dès la V1.
- **FR-011**: Le systeme doit classifier les evenements domotiques (`critical`, `warning`, `info`), appliquer des regles de priorisation, et declencher les notifications utilisateur selon la politique active.
- **FR-012**: Le systeme doit maintenir une coherence des donnees et regles entre profils, equipements et droits d'acces, en appliquant des invariants metier explicites.
- **FR-013**: Le systeme doit permettre l'ajout progressif de nouveaux equipements sans remise en cause du parcours utilisateur principal, avec integration d'un nouveau type d'equipement sans modification des parcours US1 ni rupture des contrats API existants.
- **FR-014**: Le système doit autoriser les commandes concurrentes sur un même équipement en appliquant une résolution par priorité de rôle (admin > user) et en traçant chaque arbitrage.
- **FR-015**: En cas d'indisponibilité d'un fournisseur domotique tiers, le système doit basculer les équipements impactés en mode lecture seule avec message utilisateur explicite.

### Consistency Invariants

- **INV-001**: Un seul profil peut etre actif a la fois par utilisateur.
- **INV-002**: Une commande `rejected` ou `arbitrated` doit produire un `SecurityEvent` associe.
- **INV-003**: Un equipement en mode `read_only` ne peut pas accepter de commande de modification d'etat.
- **INV-004**: La revocation d'un appareil invalide les sessions actives associees en moins de 10 secondes.

### Key Entities *(include if feature involves data)*

- **ProfilUtilisateur**: représente l'identité fonctionnelle d'un utilisateur, ses droits, préférences d'interface et comportements domotiques associés.
- **AppareilEnregistre**: représente un terminal autorisé à accéder à l'application, avec état d'enregistrement et niveau de confiance.
- **EquipementDomotique**: représente un équipement pilotable, ses capacités, son état courant et son fournisseur d'intégration.
- **ConfigurationWidget**: représente l'organisation du tableau de bord, les widgets actifs et leurs paramètres.
- **RegleComportement**: représente une règle de comportement qui lie contexte/profil/action.
- **EvenementSecurite**: représente une trace d'audit liée aux accès, refus, actions sensibles et changements de privilèges.

## Security & Access *(mandatory)*

- Le cycle d'accès doit inclure authentification robuste, validation d'autorisation et contrôle de l'appareil utilisé.
- Le périmètre d'administration doit appliquer des contrôles renforcés dans une application/projet distinct du parcours standard.
- Les accès refusés, changements de droits et actions sensibles doivent être journalisés avec traçabilité exploitable.
- Les journaux de sécurité et d'audit doivent être conservés pendant 3 mois, puis purgés selon la politique de conservation.
- Le systeme doit prevoir la revocation d'acces utilisateur/appareil avec invalidation effective en moins de 10 secondes.
- Le système doit protéger les données sensibles en transit et au repos selon les pratiques de sécurité du domaine.

## UX & Personalization *(mandatory)*

- L'interface doit rester claire, moderne, lisible et orientée actions rapides.
- La personnalisation doit couvrir profils, widgets et organisation du tableau de bord.
- Les retours utilisateur doivent être explicites pour les succès, erreurs et indisponibilités.
- Le comportement doit rester cohérent sur desktop et mobile.

## Test Strategy *(mandatory)*

- Chaque user story doit disposer de tests unitaires, d'intégration et de contrats sur les parcours critiques.
- Les tests doivent couvrir les scénarios de succès, d'erreur et de warning.
- Les tests doivent valider l'accès, l'isolation administration/utilisateur, la personnalisation et la traçabilité sécurité.
- Chaque story doit rester testable indépendamment et démontrer une valeur livrable autonome.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% des utilisateurs autorisés réalisent une action de pilotage de base en moins de 60 secondes après connexion.
- **SC-002**: 100% des tentatives d'accès non autorisées sont bloquées et tracées.
- **SC-003**: 90% des utilisateurs configurent un profil et au moins un widget sans assistance lors du premier usage.
- **SC-004**: 95% des notifications d'événements prioritaires sont livrées en moins de 10 secondes.
- **SC-005**: Le taux de réussite des parcours critiques (connexion autorisée, action équipement, application profil) est d'au moins 99% sur l'environnement cible.
- **SC-006**: La disponibilité mensuelle de la plateforme est d'au moins 99,9%.

## Assumptions

- Les utilisateurs disposent d'au moins un équipement domotique compatible à piloter.
- Les utilisateurs cibles acceptent un contrôle d'accès strict (utilisateur + appareil autorisé).
- Les événements domotiques critiques à notifier sont définis avant la mise en production.
- Le périmètre de la première version inclut le pilotage et la personnalisation, avec extensibilité prévue pour de nouveaux équipements.
- Les équipes disposent des accès nécessaires aux systèmes existants de la maison pour connecter les équipements.
