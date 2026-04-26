create extension if not exists "pgcrypto";

create table if not exists users (
    id uuid primary key default gen_random_uuid (),
    email text not null unique,
    role text not null check (role in ('admin', 'user')),
    status text not null check (
        status in ('active', 'suspended')
    ),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists registered_devices (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references users (id) on delete cascade,
    fingerprint text not null unique,
    display_name text not null,
    trust_level text not null check (
        trust_level in ('low', 'medium', 'high')
    ),
    status text not null check (
        status in (
            'pending',
            'authorized',
            'revoked'
        )
    ),
    last_access_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists access_sessions (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references users (id) on delete cascade,
    device_id uuid not null references registered_devices (id) on delete cascade,
    authn_level text not null check (
        authn_level in ('password', 'mfa')
    ),
    ip inet not null,
    status text not null check (
        status in ('open', 'closed', 'rejected')
    ),
    opened_at timestamptz not null default now(),
    closed_at timestamptz
);

create table if not exists security_events (
    id uuid primary key default gen_random_uuid (),
    event_type text not null check (
        event_type in (
            'login',
            'access_denied',
            'privilege_escalation',
            'role_change',
            'admin_action',
            'command_arbitration'
        )
    ),
    severity text not null check (
        severity in ('info', 'warning', 'critical')
    ),
    user_id uuid references users (id) on delete set null,
    device_id uuid references registered_devices (id) on delete set null,
    target_id uuid,
    details jsonb not null default '{}'::jsonb,
    legal_hold_active boolean not null default false,
    created_at timestamptz not null default now(),
    expires_at timestamptz not null
);

create index if not exists idx_registered_devices_user_id on registered_devices (user_id);

create index if not exists idx_access_sessions_user_id_status on access_sessions (user_id, status);

create index if not exists idx_access_sessions_device_id_status on access_sessions (device_id, status);

create index if not exists idx_security_events_created_at on security_events (created_at);

create index if not exists idx_security_events_expires_at on security_events (expires_at);