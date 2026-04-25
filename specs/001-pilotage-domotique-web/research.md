# Research - Pilotage Domotique Web

## Decision 1: Architecture applicative isolée (user-web + admin-web)
- Decision: Implémenter deux applications Nuxt 3 distinctes, une pour l'usage résident et une pour l'administration.
- Rationale: L'isolation du périmètre admin est une exigence explicite de la spec (FR-010) et de la constitution; cela réduit la surface d'attaque et clarifie les responsabilités.
- Alternatives considered: Application unique avec zone admin interne rejetée car l'isolation logique est plus faible et augmente le risque de régression d'autorisations.

## Decision 2: Contrôle d'accès fort combinant utilisateur + appareil
- Decision: Exiger authentification utilisateur, vérification RBAC et contrôle d'enregistrement appareil à chaque session sensible.
- Rationale: Répond directement à FR-001, FR-006 et aux exigences Security & Access avec traçabilité des refus.
- Alternatives considered: Contrôle uniquement utilisateur rejeté car ne couvre pas la compromission d'appareil; contrôle uniquement appareil rejeté car insuffisant pour l'identité.

## Decision 3: Persistance Supabase PostgreSQL (choix par défaut constitution)
- Decision: Utiliser Supabase (PostgreSQL) pour données métiers, audit, préférences et règles de comportement.
- Rationale: Conforme à la constitution, supporte contraintes transactionnelles, indexation, RLS et auditabilité.
- Alternatives considered: Base NoSQL rejetée car plus complexe pour cohérence forte profils/equipements/droits (FR-012); stockage fichiers seul rejeté pour absence de requêtage robuste.

## Decision 4: Stratégie PWA + notifications push Web
- Decision: Livrer le client utilisateur en PWA avec Service Worker et notifications push VAPID.
- Rationale: Exigence constitutionnelle et FR-011; bon compromis UX mobile/desktop sans dépendance store natif.
- Alternatives considered: Application mobile native uniquement rejetée en V1 car allonge le délai et complexifie la maintenance multi-plateformes.

## Decision 5: Concurrence des commandes par priorité de rôle
- Decision: Autoriser les commandes concurrentes et arbitrer par priorité de rôle admin > user, avec journalisation explicite des arbitrages.
- Rationale: Clarification fonctionnelle validée; répond à FR-014 et améliore prédictibilité opérationnelle.
- Alternatives considered: File FIFO stricte rejetée car ne respecte pas la priorité de rôle; verrouillage global rejeté car dégrade la réactivité.

## Decision 6: Résilience fournisseur tiers indisponible
- Decision: Basculer les équipements liés au fournisseur indisponible en lecture seule avec message utilisateur explicite.
- Rationale: Aligné avec clarification validée et FR-015; évite les actions incohérentes pendant incident.
- Alternatives considered: Masquer totalement les équipements rejeté car perte de visibilité; maintien des commandes en mode dégradé rejeté car risque d'échec silencieux.

## Decision 7: Stratégie de tests traçable par exigence
- Decision: Mettre en place un triple niveau de tests (unitaires, intégration, contrat) couvrant succès, erreurs et warnings pour chaque user story.
- Rationale: Exigence constitutionnelle IV + section Test Strategy de la spec.
- Alternatives considered: E2E seuls rejetés car diagnostic insuffisant; unitaires seuls rejetés car ne valident pas les interfaces ni la sécurité bout-en-bout.

## Decision 8: Cibles de performance et disponibilité
- Decision: Adopter comme objectifs opérationnels p95 commande <= 400 ms (hors latence fournisseur), push <= 10 s pour 95% des événements, disponibilité mensuelle >= 99,9%.
- Rationale: Dérivé des Success Criteria SC-004 et SC-006, avec marge opérationnelle réaliste pour V1.
- Alternatives considered: Objectifs plus stricts en V1 rejetés car coût d'infrastructure disproportionné sans preuve de charge initiale.
