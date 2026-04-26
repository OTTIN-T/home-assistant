# Data Model - Home Automation Web Control

## Overview
The model covers identities (user + device), device control, personalization (profiles/widgets), behavior rules, and security auditing.

## Entities

### User
- Fields:
  - id (uuid, PK)
  - email (string, unique)
  - role (enum: admin, user)
  - status (enum: active, suspended)
  - created_at (timestamp)
  - updated_at (timestamp)
- Validation rules:
  - email must be valid and unique
  - role is required
  - status is required
- State transitions:
  - active -> suspended (revocation)
  - suspended -> active (reactivation)

### RegisteredDevice
- Fields:
  - id (uuid, PK)
  - user_id (uuid, FK User.id)
  - fingerprint (string, unique)
  - display_name (string)
  - trust_level (enum: low, medium, high)
  - status (enum: pending, authorized, revoked)
  - last_access_at (timestamp, nullable)
- Validation rules:
  - fingerprint must be unique and non-empty
  - a revoked device cannot open a session
- State transitions:
  - pending -> authorized
  - authorized -> revoked

### AccessSession
- Fields:
  - id (uuid, PK)
  - user_id (uuid, FK)
  - device_id (uuid, FK)
  - authn_level (enum: password, mfa)
  - ip (string)
  - status (enum: open, closed, rejected)
  - opened_at (timestamp)
  - closed_at (timestamp, nullable)
- Validation rules:
  - an open session must reference an active user and an authorized device

### UserProfile
- Fields:
  - id (uuid, PK)
  - user_id (uuid, FK)
  - name (string)
  - is_active (boolean)
  - ui_preferences (jsonb)
  - created_at (timestamp)
  - updated_at (timestamp)
- Validation rules:
  - name is required per user
  - at most one active profile per user
- State transitions:
  - inactive -> active
  - active -> inactive

### WidgetConfiguration
- Fields:
  - id (uuid, PK)
  - profile_id (uuid, FK UserProfile.id)
  - widget_type (string)
  - position (int)
  - parameters (jsonb)
  - visible (boolean)
- Validation rules:
  - position >= 0
  - widget_type must exist in the supported catalog

### HomeDevice
- Fields:
  - id (uuid, PK)
  - provider_id (uuid, FK Provider.id)
  - name (string)
  - category (enum: light, shutter, heating, security, other)
  - capabilities (jsonb)
  - current_state (jsonb)
  - access_mode (enum: read_write, read_only)
  - updated_at (timestamp)
- Validation rules:
  - capabilities must not be empty
  - access_mode = read_only when provider is unavailable
- State transitions:
  - read_write -> read_only (provider incident)
  - read_only -> read_write (recovery)

### DeviceCommand
- Fields:
  - id (uuid, PK)
  - device_id (uuid, FK HomeDevice.id)
  - issuer_user_id (uuid, FK User.id)
  - issuer_role (enum: admin, user)
  - action (string)
  - priority (int)
  - status (enum: received, arbitrated, executed, rejected, failed)
  - status_reason (string, nullable)
  - created_at (timestamp)
  - executed_at (timestamp, nullable)
- Validation rules:
  - priority is derived from issuer_role (admin > user)
  - action must exist in device capabilities
- State transitions:
  - received -> arbitrated
  - arbitrated -> executed | rejected | failed

### BehaviorRule
- Fields:
  - id (uuid, PK)
  - profile_id (uuid, FK UserProfile.id)
  - context (jsonb)
  - target_action (jsonb)
  - active (boolean)
- Validation rules:
  - context and target_action are required

### Provider
- Fields:
  - id (uuid, PK)
  - name (string, unique)
  - status (enum: available, unavailable, maintenance)
  - last_heartbeat_at (timestamp)
- Validation rules:
  - status is required

### SecurityEvent
- Fields:
  - id (uuid, PK)
  - event_type (enum: login, access_denied, privilege_escalation, role_change, admin_action, command_arbitration)
  - severity (enum: info, warning, critical)
  - user_id (uuid, nullable)
  - device_id (uuid, nullable)
  - target_id (uuid, nullable)
  - details (jsonb)
  - created_at (timestamp)
  - expires_at (timestamp)
- Validation rules:
  - expires_at = created_at + 3 months
  - details are required for warning/critical

## Main Relationships
- User 1..n RegisteredDevice
- User 1..n UserProfile
- UserProfile 1..n WidgetConfiguration
- UserProfile 1..n BehaviorRule
- Provider 1..n HomeDevice
- HomeDevice 1..n DeviceCommand
- User/RegisteredDevice 1..n AccessSession
- User/RegisteredDevice 1..n SecurityEvent

## Consistency Invariants
- Only one active profile is allowed per user.
- Any rejected or arbitrated command must produce a SecurityEvent of type command_arbitration.
- A read_only device blocks any DeviceCommand that mutates state.
- Any device revocation invalidates related open sessions.
