create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'shipment_status'
  ) then
    create type public.shipment_status as enum (
      'placed',
      'confirmed',
      'intransit',
      'nearby',
      'out_for_delivery',
      'delivered'
    );
  end if;
end
$$;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  tracking_id text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  sender_name text not null,
  sender_email text not null,
  sender_country text not null,
  sender_phone text not null,
  receiver_name text not null,
  receiver_email text not null,
  receiver_country text not null,
  receiver_phone text not null,
  pickup text not null,
  destination text not null,
  pickup_date timestamptz,
  delivery_date timestamptz,
  payment_method text not null,
  package_type text not null,
  weight text not null,
  length text not null,
  height text not null,
  width text not null,
  comment text not null default '',
  status public.shipment_status not null default 'placed',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_id text not null unique,
  quote_request_id uuid references public.quotes (id) on delete set null,
  user_id uuid references auth.users (id) on delete set null,
  status public.shipment_status not null default 'placed',
  pickup text not null,
  destination text not null,
  current_location text not null,
  type text not null,
  carrier text not null default 'Inter Express Service',
  price text not null default 'Pending',
  payment_method text not null,
  width text not null,
  height text not null,
  length text not null,
  weight text not null,
  package_name text not null,
  comment text not null default '',
  dispatch_date timestamptz,
  expected_date timestamptz,
  sender_full_name text not null,
  sender_country text not null,
  sender_email text not null,
  sender_phone text not null,
  receiver_full_name text not null,
  receiver_country text not null,
  receiver_email text not null,
  receiver_phone text not null,
  current_lat double precision,
  current_lng double precision,
  destination_lat double precision,
  destination_lng double precision,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments (id) on delete cascade,
  tracking_id text not null,
  status public.shipment_status not null,
  label text not null,
  details text,
  location text,
  event_time timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists quotes_user_id_idx on public.quotes (user_id);
create index if not exists quotes_tracking_id_idx on public.quotes (tracking_id);
create index if not exists shipments_user_id_idx on public.shipments (user_id);
create index if not exists shipments_tracking_id_idx on public.shipments (tracking_id);
create index if not exists tracking_events_shipment_id_idx on public.tracking_events (shipment_id);
create index if not exists tracking_events_tracking_id_idx on public.tracking_events (tracking_id);
create index if not exists tracking_events_event_time_idx on public.tracking_events (event_time desc);
create index if not exists contact_messages_user_id_idx on public.contact_messages (user_id);

drop trigger if exists profiles_handle_updated_at on public.profiles;
create trigger profiles_handle_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();

drop trigger if exists quotes_handle_updated_at on public.quotes;
create trigger quotes_handle_updated_at
before update on public.quotes
for each row
execute function public.handle_updated_at();

drop trigger if exists shipments_handle_updated_at on public.shipments;
create trigger shipments_handle_updated_at
before update on public.shipments
for each row
execute function public.handle_updated_at();

drop trigger if exists contact_messages_handle_updated_at on public.contact_messages;
create trigger contact_messages_handle_updated_at
before update on public.contact_messages
for each row
execute function public.handle_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.quotes enable row level security;
alter table public.shipments enable row level security;
alter table public.tracking_events enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists quotes_insert_public on public.quotes;
create policy quotes_insert_public
on public.quotes
for insert
to anon, authenticated
with check (true);

drop policy if exists quotes_select_own on public.quotes;
create policy quotes_select_own
on public.quotes
for select
to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.profiles
    where profiles.user_id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists shipments_insert_public on public.shipments;
create policy shipments_insert_public
on public.shipments
for insert
to anon, authenticated
with check (true);

drop policy if exists shipments_select_own on public.shipments;
create policy shipments_select_own
on public.shipments
for select
to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.profiles
    where profiles.user_id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists tracking_events_insert_public on public.tracking_events;
create policy tracking_events_insert_public
on public.tracking_events
for insert
to anon, authenticated
with check (true);

drop policy if exists tracking_events_select_own on public.tracking_events;
create policy tracking_events_select_own
on public.tracking_events
for select
to authenticated
using (
  exists (
    select 1
    from public.shipments
    where shipments.id = tracking_events.shipment_id
      and (
        shipments.user_id = auth.uid()
        or exists (
          select 1
          from public.profiles
          where profiles.user_id = auth.uid()
            and profiles.role = 'admin'
        )
      )
  )
);

drop policy if exists contact_messages_insert_public on public.contact_messages;
create policy contact_messages_insert_public
on public.contact_messages
for insert
to anon, authenticated
with check (true);

drop policy if exists contact_messages_select_own on public.contact_messages;
create policy contact_messages_select_own
on public.contact_messages
for select
to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.profiles
    where profiles.user_id = auth.uid()
      and profiles.role = 'admin'
  )
);

create or replace function public.get_tracking_details(input_tracking_id text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', shipments.id,
    'trackingId', shipments.tracking_id,
    'status', shipments.status,
    'carrier', shipments.carrier,
    'pickup', shipments.pickup,
    'destination', shipments.destination,
    'currentLocation', shipments.current_location,
    'type', shipments.type,
    'price', shipments.price,
    'paymentMethod', shipments.payment_method,
    'width', shipments.width,
    'height', shipments.height,
    'length', shipments.length,
    'weight', shipments.weight,
    'packageName', shipments.package_name,
    'comment', shipments.comment,
    'dispatchDate', coalesce(to_char(shipments.dispatch_date, 'YYYY-MM-DD HH24:MI:SS'), ''),
    'expectedDate', coalesce(to_char(shipments.expected_date, 'YYYY-MM-DD HH24:MI:SS'), ''),
    'sender', jsonb_build_object(
      'fullName', shipments.sender_full_name,
      'country', shipments.sender_country,
      'email', shipments.sender_email,
      'phone', shipments.sender_phone
    ),
    'receiver', jsonb_build_object(
      'fullName', shipments.receiver_full_name,
      'country', shipments.receiver_country,
      'email', shipments.receiver_email,
      'phone', shipments.receiver_phone
    ),
    'map', jsonb_build_object(
      'lat', shipments.current_lat,
      'lng', shipments.current_lng,
      'destinationLat', shipments.destination_lat,
      'destinationLng', shipments.destination_lng
    ),
    'events', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'status', tracking_events.status,
            'label', tracking_events.label,
            'location', tracking_events.location,
            'details', tracking_events.details,
            'eventTime', to_char(tracking_events.event_time, 'YYYY-MM-DD HH24:MI:SS')
          )
          order by tracking_events.event_time asc
        )
        from public.tracking_events
        where tracking_events.shipment_id = shipments.id
      ),
      '[]'::jsonb
    )
  )
  from public.shipments
  where upper(shipments.tracking_id) = upper(input_tracking_id)
  limit 1;
$$;

grant execute on function public.get_tracking_details(text) to anon, authenticated;

comment on function public.get_tracking_details(text)
is 'Returns the public tracking payload used by the Next.js tracking page.';

-- Optional seed example:
-- update public.shipments
-- set
--   status = 'intransit',
--   current_location = 'Madrid, Spain',
--   current_lat = 40.4168,
--   current_lng = -3.7038,
--   destination_lat = 52.52,
--   destination_lng = 13.405
-- where tracking_id = 'REPLACE1234';
--
-- insert into public.tracking_events (shipment_id, tracking_id, status, label, location)
-- select id, tracking_id, 'intransit', 'Shipment departed regional facility', 'Madrid, Spain'
-- from public.shipments
-- where tracking_id = 'REPLACE1234';
--
-- Promote an existing auth user to admin:
-- update public.profiles
-- set role = 'admin'
-- where email = 'admin@example.com';
