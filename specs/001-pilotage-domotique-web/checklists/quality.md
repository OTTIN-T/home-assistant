# Checklist Qualite des Exigences: Pilotage Domotique Web

**Purpose**: Evaluer la qualite redactionnelle des exigences (completude, clarte, coherence, mesurabilite, couverture) avant planification.
**Created**: 2026-04-25
**Feature**: [spec.md](../spec.md)

**Note**: Cette checklist est generee par la commande `/speckit.checklist` a partir du contexte feature et des exigences.

## Requirement Completeness

- [ ] CHK001 Les exigences de controle d'acces couvrent-elles explicitement tous les points d'entree utilisateur et administration? [Completeness, Spec §FR-001, Spec §FR-006]
- [ ] CHK002 Les exigences de personnalisation couvrent-elles creation, modification, activation et desactivation de profils? [Completeness, Spec §FR-004, Spec §FR-009, Gap]
- [ ] CHK003 Les exigences de widgets definissent-elles le cycle complet (ajout, suppression, reorganisation, restauration)? [Completeness, Spec §FR-007, Spec §FR-008]
- [ ] CHK004 Les exigences de notification couvrent-elles les evenements prioritaires, non prioritaires et silencieux? [Completeness, Spec §FR-011, Gap]
- [ ] CHK005 Les exigences de retention d'audit couvrent-elles creation, consultation, purge et exception legale? [Completeness, Spec §FR-005, Security & Access, Gap]

## Requirement Clarity

- [ ] CHK006 Le terme "acces uniquement" est-il precise par des criteres decisionnels explicites (utilisateur, appareil, contexte)? [Clarity, Spec §FR-001]
- [ ] CHK007 Le terme "retour d'etat explicite" est-il defini avec un niveau de detail mesurable par type d'action? [Clarity, Spec §FR-003, Ambiguity]
- [ ] CHK008 Le terme "coherence des donnees et regles" est-il formalise par des invariants ou contraintes identifiables? [Clarity, Spec §FR-012, Ambiguity]
- [ ] CHK009 Le terme "ajout progressif" de nouveaux equipements est-il borne par des criteres d'acceptation non ambigus? [Clarity, Spec §FR-013, Ambiguity]
- [ ] CHK010 Le mode "lecture seule" en indisponibilite tiers est-il decrit sans interpretation possible entre equipes? [Clarity, Spec §FR-015]

## Requirement Consistency

- [ ] CHK011 Les exigences d'isolation admin restent-elles coherentes entre User Story 3, FR-010 et Security & Access? [Consistency, Spec §User Story 3, Spec §FR-010, Security & Access]
- [ ] CHK012 Les exigences de concurrence des commandes sont-elles coherentes entre Edge Cases et FR-014? [Consistency, Spec §Edge Cases, Spec §FR-014]
- [ ] CHK013 Les exigences de tests (unitaires/integration/contrats) sont-elles coherentes avec le niveau de detail des FR? [Consistency, Test Strategy, Conflict]
- [ ] CHK014 Les exigences UX "moderne, lisible, orientee actions rapides" sont-elles coherentes avec des criteres mesurables de success criteria? [Consistency, UX & Personalization, SC-001, Ambiguity]
- [ ] CHK015 Les hypotheses ne contredisent-elles aucune contrainte de securite ou d'acces restreint? [Consistency, Assumptions, Security & Access]

## Acceptance Criteria Quality

- [ ] CHK016 Chaque FR prioritaire dispose-t-elle d'au moins un critere d'acceptation objectivement verifiable? [Acceptance Criteria, Spec §FR-001..FR-015, Gap]
- [ ] CHK017 Les seuils de succes (SC-001 a SC-006) sont-ils relies explicitement aux user stories et FR correspondants? [Traceability, Spec §SC-001..SC-006, Gap]
- [ ] CHK018 Les criteres de succes incluent-ils des bornes de mesure, fenetres temporelles et populations de reference? [Measurability, Spec §SC-001..SC-006]
- [ ] CHK019 Les criteres de succes distinguent-ils clairement les objectifs produit des objectifs operationnels? [Clarity, Spec §Success Criteria, Ambiguity]

## Scenario Coverage

- [ ] CHK020 Les exigences couvrent-elles completement les scenarios primaires des 3 user stories sans dependre d'implicites? [Coverage, Spec §User Stories]
- [ ] CHK021 Les scenarios alternatifs (profil incompatible, permissions partielles, session degradee) sont-ils explicitement specifies? [Coverage, Spec §Edge Cases, Gap]
- [ ] CHK022 Les scenarios d'exception (refus acces, indisponibilite tiers, conflit commandes) sont-ils definis avec attendus precis? [Coverage, Spec §FR-014, Spec §FR-015, Spec §User Story 1]
- [ ] CHK023 Les scenarios de recuperation (retour du fournisseur tiers, reprise apres revocation) sont-ils documentes? [Recovery Flow, Gap]

## Edge Case Coverage

- [ ] CHK024 Les exigences definissent-elles les comportements attendus en connectivite intermittente avec etat intermediaire explicite? [Edge Case, Spec §Edge Cases]
- [ ] CHK025 Les exigences definissent-elles les limites de priorite de role en cas de commandes simultanees de meme role? [Edge Case, Spec §FR-014, Gap]
- [ ] CHK026 Les exigences couvrent-elles la gestion des profils avec preferences incompatibles sans ambiguite? [Edge Case, Spec §Edge Cases]
- [ ] CHK027 Les exigences precisent-elles la propagation de revocation d'appareil en session deja ouverte? [Edge Case, Security & Access, Gap]

## Non-Functional Requirements

- [ ] CHK028 Les exigences de disponibilite 99,9% sont-elles declinees par service critique (auth, commande, notifications)? [NFR, Spec §SC-006, Gap]
- [ ] CHK029 Les exigences de performance de notification (<10s) incluent-elles contexte de charge et conditions degradees? [NFR, Spec §SC-004, Gap]
- [ ] CHK030 Les exigences de securite des donnees "en transit et au repos" definissent-elles un niveau minimal attendu? [NFR, Security & Access, Ambiguity]
- [ ] CHK031 Les exigences de coherence desktop/mobile incluent-elles des criteres d'equivalence fonctionnelle mesurables? [NFR, UX & Personalization, Gap]

## Dependencies & Assumptions

- [ ] CHK032 Les dependances externes (fournisseurs domotiques, systemes maison existants) sont-elles decrites avec contraintes contractuelles minimales? [Dependency, Assumptions, Gap]
- [ ] CHK033 Les hypotheses critiques sont-elles qualifiees (validation attendue, date cible, responsable)? [Assumption, Assumptions, Gap]
- [ ] CHK034 Les exigences precisent-elles les consequences metier si une hypothese cle devient fausse? [Dependency, Recovery Flow, Gap]

## Ambiguities & Conflicts

- [ ] CHK035 Les termes "robuste", "moderne", "claire" et "coherent" sont-ils traduits en criteres non subjectifs? [Ambiguity, Security & Access, UX & Personalization]
- [ ] CHK036 L'ordre de priorite admin > user est-il defini pour tous les cas limites (horodatage identique, latence reseau, retried commands)? [Conflict, Spec §FR-014, Gap]
- [ ] CHK037 La separation admin en projet distinct est-elle compatible avec la trace d'audit transverse sans zone grise de responsabilite? [Conflict, Spec §FR-010, Spec §FR-005]

## Notes

- Niveau applique: Renforce.
- Audience cible: Auteur de specification.
- Focalisation: Couverture complete (securite, UX, resilience, NFR, dependances).
