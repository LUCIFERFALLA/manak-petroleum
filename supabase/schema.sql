-- ============================================================
-- Manak Petroleum — enquiries table + RLS for anonymous submissions
-- Run this once in your Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

create table if not exists public.enquiries (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  form_type           text,          -- contact | private-label | distributor
  name                text,
  company             text,
  business_name       text,
  email               text,
  phone               text,
  location            text,
  enquiry_type        text,
  product_category    text,
  annual_volume       text,
  territory           text,
  brand_interest      text,
  years_in_trade      text,
  existing_categories text,
  message             text,
  page                text,          -- which page it was sent from
  raw                 jsonb          -- full submitted payload, just in case
);

-- Row Level Security: lock the table down, then allow ONLY inserts from
-- anonymous (and authenticated) visitors. No one can read rows with the
-- public key — you view submissions in the dashboard / with the service role.
alter table public.enquiries enable row level security;

-- allow ANY role (anon, authenticated, and the new sb_publishable_ key role)
-- to insert; "to public" is the most permissive target and avoids role-name mismatches.
drop policy if exists "public can submit enquiries" on public.enquiries;
create policy "public can submit enquiries"
  on public.enquiries
  for insert
  to public
  with check (true);

-- table-level privilege (RLS still governs the rows)
grant insert on table public.enquiries to anon, authenticated;

-- (Optional) helpful index for sorting newest-first in the dashboard
create index if not exists enquiries_created_at_idx
  on public.enquiries (created_at desc);
