create table if not exists providers (
    id uuid primary key default gen_random_uuid (),
    name text not null unique,
    status text not null check (
        status in (
            'available',
            'unavailable',
            'maintenance'
        )
    ),
    last_heartbeat_at timestamptz not null default now(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists home_devices (
    id uuid primary key default gen_random_uuid (),
    provider_id uuid not null references providers (id) on delete restrict,
    name text not null,
    category text not null check (
        category in (
            'light',
            'shutter',
            'heating',
            'security',
            'other'
        )
    ),
    capabilities jsonb not null,
    current_state jsonb not null,
    access_mode text not null check (
        access_mode in ('read_write', 'read_only')
    ),
    updated_at timestamptz not null default now()
);

create table if not exists device_commands (
    id uuid primary key default gen_random_uuid (),
    device_id uuid not null references home_devices (id) on delete cascade,
    issuer_user_id uuid not null references users (id) on delete cascade,
    issuer_role text not null check (
        issuer_role in ('admin', 'user')
    ),
    action text not null,
    priority int not null,
    status text not null check (
        status in (
            'received',
            'arbitrated',
            'executed',
            'rejected',
            'failed'
        )
    ),
    status_reason text,
    request_id text not null,
    created_at timestamptz not null default now(),
    executed_at timestamptz,
    unique (device_id, request_id)
);

create index if not exists idx_home_devices_provider_id on home_devices (provider_id);

create index if not exists idx_device_commands_device_id_created_at on device_commands (device_id, created_at);