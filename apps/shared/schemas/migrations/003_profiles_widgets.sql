create table if not exists user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  is_active boolean not null default false,
  ui_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists ux_user_profiles_active_per_user
  on user_profiles(user_id)
  where is_active = true;

create table if not exists widget_configurations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references user_profiles(id) on delete cascade,
  widget_type text not null,
  position int not null check (position >= 0),
  parameters jsonb not null default '{}'::jsonb,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists behavior_rules (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references user_profiles(id) on delete cascade,
  context jsonb not null,
  target_action jsonb not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  endpoint text not null unique,
  keys jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_widget_configurations_profile_id on widget_configurations(profile_id);
create index if not exists idx_behavior_rules_profile_id_active on behavior_rules(profile_id, active);
create index if not exists idx_push_subscriptions_user_id on push_subscriptions(user_id);
