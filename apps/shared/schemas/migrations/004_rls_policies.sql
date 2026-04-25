alter table users enable row level security;

alter table registered_devices enable row level security;

alter table access_sessions enable row level security;

alter table security_events enable row level security;

alter table providers enable row level security;

alter table home_devices enable row level security;

alter table device_commands enable row level security;

alter table user_profiles enable row level security;

alter table widget_configurations enable row level security;

alter table behavior_rules enable row level security;

alter table push_subscriptions enable row level security;

drop policy if exists users_select_self_or_admin on users;

create policy users_select_self_or_admin on users for
select using (
        id = auth.uid ()
        or coalesce(auth.jwt () ->> 'role', '') = 'admin'
    );

drop policy if exists users_update_self_or_admin on users;

create policy users_update_self_or_admin on users
for update
    using (
        id = auth.uid ()
        or coalesce(auth.jwt () ->> 'role', '') = 'admin'
    )
with
    check (
        id = auth.uid ()
        or coalesce(auth.jwt () ->> 'role', '') = 'admin'
    );

drop policy if exists registered_devices_select_owner_or_admin on registered_devices;

create policy registered_devices_select_owner_or_admin on registered_devices for
select using (
        user_id = auth.uid ()
        or coalesce(auth.jwt () ->> 'role', '') = 'admin'
    );

drop policy if exists registered_devices_write_owner_or_admin on registered_devices;

create policy registered_devices_write_owner_or_admin on registered_devices for all using (
    user_id = auth.uid ()
    or coalesce(auth.jwt () ->> 'role', '') = 'admin'
)
with
    check (
        user_id = auth.uid ()
        or coalesce(auth.jwt () ->> 'role', '') = 'admin'
    );

drop policy if exists access_sessions_select_owner_or_admin on access_sessions;

create policy access_sessions_select_owner_or_admin on access_sessions for
select using (
        user_id = auth.uid ()
        or coalesce(auth.jwt () ->> 'role', '') = 'admin'
    );

drop policy if exists access_sessions_write_owner_or_admin on access_sessions;

create policy access_sessions_write_owner_or_admin on access_sessions for all using (
    user_id = auth.uid ()
    or coalesce(auth.jwt () ->> 'role', '') = 'admin'
)
with
    check (
        user_id = auth.uid ()
        or coalesce(auth.jwt () ->> 'role', '') = 'admin'
    );

drop policy if exists security_events_select_scope_or_admin on security_events;

create policy security_events_select_scope_or_admin on security_events for
select using (
        user_id = auth.uid ()
        or target_id = auth.uid ()
        or coalesce(auth.jwt () ->> 'role', '') = 'admin'
    );

drop policy if exists providers_select_authenticated on providers;

create policy providers_select_authenticated on providers for
select using (auth.uid () is not null);

drop policy if exists home_devices_select_authenticated on home_devices;

create policy home_devices_select_authenticated on home_devices for
select using (auth.uid () is not null);

drop policy if exists device_commands_select_owner_or_admin on device_commands;

create policy device_commands_select_owner_or_admin on device_commands for
select using (
        issuer_user_id = auth.uid ()
        or coalesce(auth.jwt () ->> 'role', '') = 'admin'
    );

drop policy if exists device_commands_insert_authenticated on device_commands;

create policy device_commands_insert_authenticated on device_commands for insert
with
    check (
        issuer_user_id = auth.uid ()
        and (
            issuer_role = 'user'
            or (
                issuer_role = 'admin'
                and coalesce(auth.jwt () ->> 'role', '') = 'admin'
            )
        )
    );

drop policy if exists user_profiles_select_owner_or_admin on user_profiles;

create policy user_profiles_select_owner_or_admin on user_profiles for
select using (
        user_id = auth.uid ()
        or coalesce(auth.jwt () ->> 'role', '') = 'admin'
    );

drop policy if exists user_profiles_write_owner_or_admin on user_profiles;

create policy user_profiles_write_owner_or_admin on user_profiles for all using (
    user_id = auth.uid ()
    or coalesce(auth.jwt () ->> 'role', '') = 'admin'
)
with
    check (
        user_id = auth.uid ()
        or coalesce(auth.jwt () ->> 'role', '') = 'admin'
    );

drop policy if exists widget_configurations_select_owner_or_admin on widget_configurations;

create policy widget_configurations_select_owner_or_admin on widget_configurations for
select using (
        exists (
            select 1
            from user_profiles up
            where
                up.id = widget_configurations.profile_id
                and (
                    up.user_id = auth.uid ()
                    or coalesce(auth.jwt () ->> 'role', '') = 'admin'
                )
        )
    );

drop policy if exists widget_configurations_write_owner_or_admin on widget_configurations;

create policy widget_configurations_write_owner_or_admin on widget_configurations for all using (
    exists (
        select 1
        from user_profiles up
        where
            up.id = widget_configurations.profile_id
            and (
                up.user_id = auth.uid ()
                or coalesce(auth.jwt () ->> 'role', '') = 'admin'
            )
    )
)
with
    check (
        exists (
            select 1
            from user_profiles up
            where
                up.id = widget_configurations.profile_id
                and (
                    up.user_id = auth.uid ()
                    or coalesce(auth.jwt () ->> 'role', '') = 'admin'
                )
        )
    );

drop policy if exists behavior_rules_select_owner_or_admin on behavior_rules;

create policy behavior_rules_select_owner_or_admin on behavior_rules for
select using (
        exists (
            select 1
            from user_profiles up
            where
                up.id = behavior_rules.profile_id
                and (
                    up.user_id = auth.uid ()
                    or coalesce(auth.jwt () ->> 'role', '') = 'admin'
                )
        )
    );

drop policy if exists behavior_rules_write_owner_or_admin on behavior_rules;

create policy behavior_rules_write_owner_or_admin on behavior_rules for all using (
    exists (
        select 1
        from user_profiles up
        where
            up.id = behavior_rules.profile_id
            and (
                up.user_id = auth.uid ()
                or coalesce(auth.jwt () ->> 'role', '') = 'admin'
            )
    )
)
with
    check (
        exists (
            select 1
            from user_profiles up
            where
                up.id = behavior_rules.profile_id
                and (
                    up.user_id = auth.uid ()
                    or coalesce(auth.jwt () ->> 'role', '') = 'admin'
                )
        )
    );

drop policy if exists push_subscriptions_select_owner_or_admin on push_subscriptions;

create policy push_subscriptions_select_owner_or_admin on push_subscriptions for
select using (
        user_id = auth.uid ()
        or coalesce(auth.jwt () ->> 'role', '') = 'admin'
    );

drop policy if exists push_subscriptions_write_owner_or_admin on push_subscriptions;

create policy push_subscriptions_write_owner_or_admin on push_subscriptions for all using (
    user_id = auth.uid ()
    or coalesce(auth.jwt () ->> 'role', '') = 'admin'
)
with
    check (
        user_id = auth.uid ()
        or coalesce(auth.jwt () ->> 'role', '') = 'admin'
    );