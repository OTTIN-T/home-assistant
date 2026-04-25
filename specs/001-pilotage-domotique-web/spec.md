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
- **FR-004**: Les utilisateurs doit pouvoir creer, modifier, activer et desactiver des profils personnalises.
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

### Access Decision Policy

- **ADP-001**: Une decision d'acces doit evaluer explicitement `user_status` (active, suspended, revoked), `device_status` (registered, pending, revoked), `session_context` (ip_risk_level, geo_distance_km, last_seen_at) et `requested_scope` (user, admin).
- **ADP-002**: L'acces est accorde uniquement si `user_status=active`, `device_status=registered`, `requested_scope` autorise par role et `ip_risk_level` inferieur ou egal au seuil de politique active.
- **ADP-003**: Toute decision de refus doit retourner un `deny_reason` normalise (`user_not_allowed`, `device_not_registered`, `scope_not_allowed`, `context_risk_too_high`) et creer un `SecurityEvent`.

### Notification Policy

- **NTP-001**: Les evenements `critical` doivent produire une notification push immediate (mode `alert`) pour les utilisateurs abonnes et autorises.
- **NTP-002**: Les evenements `warning` doivent produire une notification standard (mode `notify`) selon les preferences utilisateur.
- **NTP-003**: Les evenements `info` doivent pouvoir etre traites en mode silencieux (mode `silent`) sans popup, avec stockage dans le centre de notifications.
- **NTP-004**: La politique de notification doit pouvoir desactiver explicitement un canal pour un type d'evenement sans perdre la trace d'audit associee.

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
- Les journaux de securite et d'audit doivent supporter un legal hold explicite par enregistrement: un evenement sous legal hold ne peut pas etre purge tant que `legal_hold_active=true`.
- Le systeme doit prevoir la revocation d'acces utilisateur/appareil avec invalidation effective en moins de 10 secondes.
- Le systeme doit proteger les donnees sensibles en transit avec TLS 1.3 minimum et au repos avec chiffrement AES-256, avec rotation des cles au moins tous les 90 jours.

## UX & Personalization *(mandatory)*

- L'interface doit rester claire, moderne, lisible et orientée actions rapides.
- La personnalisation doit couvrir profils, widgets et organisation du tableau de bord.
- Les retours utilisateur doivent être explicites pour les succès, erreurs et indisponibilités.
- Le comportement doit rester cohérent sur desktop et mobile.
- L'equivalence fonctionnelle desktop/mobile est obligatoire pour 100% des parcours critiques US1 et US2, avec un ecart de temps median de completion inferieur ou egal a 15%.

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

### Measurement Rules

- **MR-001**: Les mesures SC-001, SC-003 et SC-005 sont calculees sur une fenetre glissante de 28 jours, sur les utilisateurs actifs hebdomadaires.
- **MR-002**: Les mesures SC-002 et SC-004 sont calculees sur l'ensemble des evenements produits en production, hors environnements de test.
- **MR-003**: La mesure SC-006 est calculee mensuellement, par service critique (`auth`, `device_command`, `notification_dispatch`), puis agregee pour la plateforme.
- **MR-004**: En mode degrade fournisseur tiers, la latence SC-004 est mesuree separativement pour distinguer la performance nominale et degradee.

### Product vs Operational Goals

- **Product goals**: SC-001, SC-003, SC-005 (experience utilisateur, adoption, succes parcours).
- **Operational goals**: SC-002, SC-004, SC-006 (securite, delivery, disponibilite).

### FR Acceptance Mapping

| FR | Critere d'acceptation verifiable |
|----|----------------------------------|
| FR-001 | 100% des acces avec `user_status!=active` ou `device_status!=registered` retournent 403 et un `SecurityEvent`. |
| FR-002 | Un utilisateur autorise recupere sa liste d'equipements avec etat courant sur 100% des requetes valides. |
| FR-003 | 95% des actions de pilotage retournent un statut enumere + horodatage en moins de 2 secondes. |
| FR-004 | Creation, modification, activation et desactivation d'un profil sont realisables via API/UI et persistes. |
| FR-005 | Chaque action securite/admin cree un evenement consultable; purge automatique >90 jours sauf legal hold. |
| FR-006 | Tout endpoint utilisateur/admin applique un role check explicite et refuse les scopes non autorises. |
| FR-007 | Ajout, suppression, reorganisation et restauration widgets sont disponibles et persistes par utilisateur. |
| FR-008 | Le layout widgets est restaure a la reconnexion sans perte pour 99% des sessions. |
| FR-009 | Les regles de comportement changent effectivement selon le profil actif sans effet de bord sur les autres profils. |
| FR-010 | Les parcours admin sont servis uniquement par l'application admin isolee et non exposes dans l'app utilisateur. |
| FR-011 | Les evenements `critical`/`warning`/`info` sont classes et routent respectivement vers `alert`/`notify`/`silent`. |
| FR-012 | Les invariants INV-001 a INV-004 sont verifies par tests unitaires et integration. |
| FR-013 | L'ajout d'un nouveau type d'equipement ne casse aucun contrat API existant valide. |
| FR-014 | En concurrence, l'arbitrage applique admin>user, puis tie-break deterministic (priorite, horodatage, request_id). |
| FR-015 | Si fournisseur indisponible, tout equipement impacte passe `read_only` avec message explicite et blocage des commandes mutation. |

### SC Traceability

| SC | User Stories | FR relies |
|----|--------------|-----------|
| SC-001 | US1 | FR-001, FR-002, FR-003 |
| SC-002 | US1, US3 | FR-001, FR-005, FR-006, FR-010 |
| SC-003 | US2 | FR-004, FR-007, FR-008, FR-009 |
| SC-004 | US2 | FR-011 |
| SC-005 | US1, US2 | FR-002, FR-003, FR-004, FR-007, FR-009 |
| SC-006 | US1, US2, US3 | FR-005, FR-006, FR-010, FR-011 |

## Assumptions

- Les utilisateurs disposent d'au moins un équipement domotique compatible à piloter.
- Les utilisateurs cibles acceptent un contrôle d'accès strict (utilisateur + appareil autorisé).
- Les événements domotiques critiques à notifier sont définis avant la mise en production.
- Le périmètre de la première version inclut le pilotage et la personnalisation, avec extensibilité prévue pour de nouveaux équipements.
- Les équipes disposent des accès nécessaires aux systèmes existants de la maison pour connecter les équipements.

### Assumption Validation Plan

| Assumption ID | Hypothese | Validation attendue | Echeance cible | Responsable |
|---------------|-----------|---------------------|----------------|-------------|
| ASM-001 | Les utilisateurs disposent d'un equipement compatible | Inventaire de compatibilite valide >= 95% des equipements cibles | Avant fin Sprint 1 | Product + Tech Lead |
| ASM-002 | Controle d'acces strict accepte par les utilisateurs cibles | Validation UX/legal et accord parties prenantes | Avant revue Sprint 1 | Product + Security |
| ASM-003 | Evenements critiques bien identifies avant go-live | Catalogue d'evenements signe par ops + produit | Avant release candidate | Product + Ops |
| ASM-004 | Extensibilite V1 suffisante pour nouveaux equipements | PoC d'ajout d'un type equipement sans changement parcours US1 | Avant fin Sprint 2 | Tech Lead |
| ASM-005 | Acces systemes maison disponibles | Validation des credentials et reseaux inter-systemes | Avant integration SIT | Ops |

### Assumption Failure Impact

- Si ASM-001 est invalide: reduction du perimetre d'equipements supportes en V1 et report des equipements non conformes en backlog priorise.
- Si ASM-002 est invalide: blocage release production jusqu'a validation conjointe securite/legal et ajustement des politiques d'acces.
- Si ASM-003 est invalide: notifications critiques limitees au mode conservateur (`critical` only) jusqu'a finalisation du catalogue.
- Si ASM-004 est invalide: gel des integrations fournisseurs additionnels et correction de l'architecture d'extension avant nouvelle livraison.
- Si ASM-005 est invalide: execution en mode degrade read-only et report des parcours de commande sur les equipements non relies.

## Additional Scenario Coverage

- Permissions partielles: un utilisateur avec role limite peut consulter les equipements mais ne peut executer que les actions explicitement autorisees par politique.
- Session degradee: en cas de fournisseur tiers indisponible, la session reste active en consultation, les actions de mutation retournent 423 et un message explicite.
- Recuperation fournisseur: au retour du heartbeat fournisseur stable pendant 60 secondes, le systeme repasse les equipements impactes en `read_write` avec notification d'information.
- Reprise apres revocation: une session invalidee par revocation doit exiger une nouvelle authentification complete et ne peut pas etre reactualisee par simple refresh token.

## Concurrency Arbitration Rules

- Priorite principale: `admin` > `user`.
- Tie-break role identique: tri par `command_priority` (desc), puis `created_at` (asc), puis `request_id` (asc) pour garantir une decision deterministe.
- Latence reseau et retries: une commande retry reutilise le meme `request_id` et ne doit pas dupliquer l'execution si deja `executed` ou `rejected`.
- Horodatage identique: le tie-break `request_id` est obligatoire pour eviter les conflits non deterministes.

## Availability & NFR Breakdown

- Disponibilite cible par service critique:
	- `auth` >= 99.95% mensuel
	- `device_command` >= 99.90% mensuel
	- `notification_dispatch` >= 99.50% mensuel
- Performance notifications:
	- nominal: 95% des `critical` livrees <= 10 secondes pour un lot de 10k evenements/heure
	- degrade: 95% des `critical` livrees <= 20 secondes sous indisponibilite partielle fournisseur

## Dependencies & External Constraints

- Fournisseurs domotiques tiers: contrat minimal requis sur disponibilite webhook/event >= 99.5% et SLA incident P1 < 4h.
- Systeme maison existant: interface d'authentification federable (OIDC ou equivalent), journal d'acces exportable, horodatage synchronise NTP.
- Service push: support VAPID, retour statut de livraison, quota defini par environnement.

## Terminology Normalization

- "robuste": taux de succes des parcours critiques >= 99% (SC-005) et absence de perte d'etat sur reconnexion.
- "moderne": support PWA installable + responsive mobile/desktop + feedback visuel en moins de 300 ms.
- "claire": chaque action utilisateur affiche un statut normalise (`accepted`, `executed`, `rejected`, `failed`, `reconciled`).
- "coherent": invariants INV-001 a INV-004 verifies a chaque release via tests automatises.

## Admin Isolation & Audit Responsibility

- L'application admin est isolee au niveau deploiement, domaine et pipeline de livraison.
- Les evenements d'audit utilisent un schema transversal unique pour conserver la tracabilite entre applications user/admin.
- La responsabilite de production d'evenements est portee par chaque application source; la responsabilite de conservation et d'investigation est portee par la plateforme securite commune.
