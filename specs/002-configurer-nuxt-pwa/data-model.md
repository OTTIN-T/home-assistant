# Data Model - PWA Configuration Nuxt

## Overview
Le modele couvre l'etat PWA client, la politique de cache, la file d'attente hors-ligne, les consentements push et les evenements d'exploitation necessaires au support.

## Entities

### PwaInstallState
- Fields:
  - id (uuid, PK)
  - user_id (uuid, FK User.id, nullable pour navigation anonyme)
  - device_fingerprint (string)
  - eligibility (enum: eligible, ineligible, unsupported)
  - install_status (enum: not_installed, prompt_shown, installed, dismissed)
  - platform (enum: android, ios, windows, macos, linux, unknown)
  - browser (enum: chrome, edge, safari, other)
  - app_version (string)
  - pwa_module_version (string)
  - installed_at (timestamp, nullable)
  - updated_at (timestamp)
- Validation rules:
  - `device_fingerprint` required
  - `install_status=installed` requires `eligibility=eligible`
- State transitions:
  - not_installed -> prompt_shown
  - prompt_shown -> installed | dismissed

### CachePolicyProfile
- Fields:
  - id (uuid, PK)
  - profile_name (string, unique)
  - precache_enabled (boolean)
  - runtime_strategy (enum: stale_while_revalidate, network_first, cache_first)
  - allowed_resource_patterns (jsonb)
  - denied_resource_patterns (jsonb)
  - max_entries (int)
  - max_age_seconds (int)
  - created_at (timestamp)
  - updated_at (timestamp)
- Validation rules:
  - `allowed_resource_patterns` must only include static assets and read-only device state endpoints
  - `denied_resource_patterns` must include auth/session/profile routes
  - URL matching is normalized to lowercase and ignores query string / hash fragments before evaluation

### OfflineCommandQueueItem
- Fields:
  - id (uuid, PK)
  - queue_key (string, indexed)
  - user_id (uuid, FK User.id)
  - device_id (uuid, FK HomeDevice.id)
  - command_name (string)
  - command_payload (jsonb)
  - status (enum: queued, syncing, synced, failed, conflict)
  - retry_count (int)
  - retry_after (timestamp, nullable)
  - conflict_reason (string, nullable)
  - created_at (timestamp)
  - scheduled_at (timestamp)
  - synced_at (timestamp, nullable)
- Validation rules:
  - `command_payload` required and schema-valid
  - `retry_count >= 0`
  - `status=conflict` requires `conflict_reason`
- State transitions:
  - queued -> syncing
  - syncing -> synced | failed | conflict
  - failed -> queued (with backoff)

### ServiceWorkerLifecycleEvent
- Fields:
  - id (uuid, PK)
  - service_worker_version (string)
  - event_type (enum: install_prompt_shown, installed, sw_registered, sw_update_found, sw_update_applied, sw_activated, sw_registration_error, offline_queue_sync_started, offline_queue_sync_finished)
  - event_status (enum: success, warning, error)
  - details (jsonb)
  - created_at (timestamp)
- Validation rules:
  - `service_worker_version` required for all non-error events
  - `details` required for `event_status=error`

### PushSubscriptionPreference
- Fields:
  - id (uuid, PK)
  - user_id (uuid, FK User.id)
  - endpoint (string)
  - p256dh (string)
  - auth (string)
  - permission_status (enum: default, granted, denied)
  - consent_source (enum: first_launch_prompt, settings)
  - revoked_at (timestamp, nullable)
  - created_at (timestamp)
  - updated_at (timestamp)
- Validation rules:
  - unique active subscription per `(user_id, endpoint)`
  - `permission_status=granted` requires cryptographic keys
- State transitions:
  - default -> granted | denied
  - granted -> denied (revocation)

### PwaOperationalLog
- Fields:
  - id (uuid, PK)
  - correlation_id (string)
  - user_id (uuid, nullable)
  - device_fingerprint (string, nullable)
  - category (enum: install, service_worker, offline_queue, push, cache)
  - level (enum: info, warning, error, critical)
  - event_name (string)
  - payload (jsonb)
  - created_at (timestamp)
  - expires_at (timestamp)
- Validation rules:
  - `correlation_id` required
  - `expires_at` aligned with retention policy in shared security services
  - security-related denials may be logged with reason codes such as `missing_auth_context`, `invalid_auth_token`, `expired_auth_token`, `device_not_authorized`

## Main Relationships
- User 1..n PwaInstallState
- User 1..n PushSubscriptionPreference
- User 1..n OfflineCommandQueueItem
- PwaInstallState 1..n ServiceWorkerLifecycleEvent (by device context)
- All PWA entities 1..n PwaOperationalLog (by correlation)

## Consistency Invariants
- No auth/session/profile payload can be persisted in service worker caches.
- Any failed sync or conflict in `OfflineCommandQueueItem` must emit a `PwaOperationalLog` entry.
- Any push permission transition must be journalized with `consent_source`.
- `ServiceWorkerLifecycleEvent.sw_update_applied` must be followed by `sw_activated` for the same `service_worker_version`.
- Les versions `app_version` et `pwa_module_version` doivent etre renseignees sur les evenements d'installation et d'update pour faciliter le diagnostic cross-release.
- Toute reponse 401/403 issue des controles d'acces PWA doit etre associee a un audit exploitable dans les logs operationnels ou de securite.
