-- Formula Studio auth + progress schema setup
-- Run this in Supabase SQL Editor.

begin;

create table if not exists public.signup_allowlist (
    email text primary key,
    notes text,
    created_at timestamptz not null default timezone('utc', now()),
    constraint signup_allowlist_email_lowercase check (email = lower(email))
);

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null unique,
    role text not null default 'member',
    full_name text,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint profiles_email_lowercase check (email = lower(email)),
    constraint profiles_role_check check (role in ('member', 'admin'))
);

create table if not exists public.step_progress (
    user_id uuid not null references auth.users(id) on delete cascade,
    course_slug text not null default 'formula-studio-core',
    step_id text not null,
    completed_at timestamptz not null default timezone('utc', now()),
    primary key (user_id, course_slug, step_id)
);

create index if not exists step_progress_course_user_idx on public.step_progress(course_slug, user_id);
create index if not exists step_progress_completed_at_idx on public.step_progress(completed_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace function public.handle_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    normalized_email text;
begin
    normalized_email := lower(trim(coalesce(new.email, '')));

    insert into public.profiles (id, email, role)
    values (
        new.id,
        normalized_email,
        case
            when normalized_email = 'tom.leger@clever.com' then 'admin'
            else 'member'
        end
    )
    on conflict (id) do update
    set email = excluded.email;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_auth_user_created();

create or replace function public.handle_auth_user_updated()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if new.email is distinct from old.email then
        update public.profiles
        set email = lower(trim(new.email))
        where id = new.id;
    end if;

    return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update of email on auth.users
for each row
execute function public.handle_auth_user_updated();

create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.profiles p
        where p.id = coalesce(uid, auth.uid())
          and p.role = 'admin'
    );
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.step_progress enable row level security;
alter table public.signup_allowlist enable row level security;

drop policy if exists profiles_select_self_or_admin on public.profiles;
create policy profiles_select_self_or_admin
on public.profiles
for select
using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
on public.profiles
for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists step_progress_select_self_or_admin on public.step_progress;
create policy step_progress_select_self_or_admin
on public.step_progress
for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists step_progress_insert_self on public.step_progress;
create policy step_progress_insert_self
on public.step_progress
for insert
with check (auth.uid() = user_id);

drop policy if exists step_progress_update_self on public.step_progress;
create policy step_progress_update_self
on public.step_progress
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists step_progress_delete_self on public.step_progress;
create policy step_progress_delete_self
on public.step_progress
for delete
using (auth.uid() = user_id);

drop policy if exists signup_allowlist_admin_read on public.signup_allowlist;
create policy signup_allowlist_admin_read
on public.signup_allowlist
for select
using (public.is_admin());

drop policy if exists signup_allowlist_admin_insert on public.signup_allowlist;
create policy signup_allowlist_admin_insert
on public.signup_allowlist
for insert
with check (public.is_admin());

drop policy if exists signup_allowlist_admin_delete on public.signup_allowlist;
create policy signup_allowlist_admin_delete
on public.signup_allowlist
for delete
using (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.step_progress to authenticated;

-- Before User Created auth hook function.
-- Configure this function in Supabase Dashboard:
-- Authentication -> Hooks -> Before user created.
create or replace function public.before_user_created(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    normalized_email text;
    email_domain text;
begin
    -- Supabase hook payload uses event.user.email.
    normalized_email := lower(trim(coalesce(event->'user'->>'email', event->>'email', '')));
    email_domain := split_part(normalized_email, '@', 2);

    if normalized_email = '' then
        return jsonb_build_object(
            'error', jsonb_build_object(
                'http_code', 400,
                'message', 'Email is required.'
            )
        );
    end if;

    if email_domain = 'clever.com' then
        return '{}'::jsonb;
    end if;

    if exists (
        select 1
        from public.signup_allowlist a
        where a.email = normalized_email
    ) then
        return '{}'::jsonb;
    end if;

    return jsonb_build_object(
        'error', jsonb_build_object(
            'http_code', 403,
            'message', 'Signups are limited to @clever.com or approved allowlisted emails.'
        )
    );
end;
$$;

grant usage on schema public to supabase_auth_admin;
grant select on table public.signup_allowlist to supabase_auth_admin;
grant execute on function public.before_user_created(jsonb) to supabase_auth_admin;
revoke execute on function public.before_user_created(jsonb) from anon, authenticated, public;

commit;
