-- Managed Pages table: allows admin to add/edit/lock pages and attach promo media
create table if not exists public.managed_pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text default '',
  content text default '',
  status text not null default 'active' check (status in ('active', 'locked', 'draft', 'hidden')),
  is_system boolean default false,
  sort_order int default 0,
  media_type text default null check (media_type in ('video', 'image', null)),
  media_url text default null,
  icon text default 'FileText',
  route text default null,
  tenant_id uuid references public.tenants(id) on delete cascade,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.managed_pages enable row level security;

-- Anyone can read active pages
create policy "Anyone can read active pages"
  on public.managed_pages for select
  using (status = 'active' or status = 'locked');

-- Super admins can manage all pages
create policy "Super admins manage pages"
  on public.managed_pages for all
  using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid()
      and user_roles.role in ('super_admin', 'admin')
    )
  );

-- Seed system pages from existing routes
insert into public.managed_pages (title, slug, route, is_system, status, icon, sort_order) values
  ('الرئيسية', 'home', '/', true, 'active', 'Home', 1),
  ('الطيران', 'flights', '/flights', true, 'active', 'Plane', 2),
  ('الفنادق', 'hotels', '/hotels', true, 'active', 'Hotel', 3),
  ('السيارات', 'cars', '/cars', true, 'active', 'Car', 4),
  ('الجولات', 'tours', '/tours', true, 'active', 'Map', 5),
  ('الأنشطة', 'activities', '/activities', true, 'active', 'Activity', 6),
  ('التحويلات', 'transfers', '/transfers', true, 'active', 'ArrowRightLeft', 7),
  ('الدراسة بالخارج', 'study-abroad', '/study-abroad', true, 'active', 'GraduationCap', 8),
  ('العروض', 'offers', '/offers', true, 'active', 'Tag', 9),
  ('الوجهات', 'destinations', '/destinations', true, 'active', 'Globe', 10),
  ('المقالات', 'articles', '/articles', true, 'active', 'Newspaper', 11),
  ('المهرجانات', 'festivals', '/festivals', true, 'active', 'PartyPopper', 12),
  ('السياحة السعودية', 'saudi-tourism', '/saudi-tourism', true, 'active', 'Landmark', 13),
  ('الأخبار', 'news', '/news', true, 'active', 'Newspaper', 14),
  ('من نحن', 'about', '/about', true, 'active', 'Info', 15),
  ('اتصل بنا', 'contact', '/contact', true, 'active', 'Phone', 16),
  ('سياسة الخصوصية', 'privacy', '/privacy', true, 'active', 'Shield', 17),
  ('الشروط والأحكام', 'terms', '/terms', true, 'active', 'ScrollText', 18)
on conflict (slug) do nothing;

-- Create storage bucket for page media if not exists
insert into storage.buckets (id, name, public)
values ('page-media', 'page-media', true)
on conflict (id) do nothing;

-- Storage policies for page-media
create policy "Anyone can view page media"
  on storage.objects for select
  using (bucket_id = 'page-media');

create policy "Admins can upload page media"
  on storage.objects for insert
  with check (
    bucket_id = 'page-media'
    and exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid()
      and user_roles.role in ('super_admin', 'admin')
    )
  );

create policy "Admins can update page media"
  on storage.objects for update
  using (
    bucket_id = 'page-media'
    and exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid()
      and user_roles.role in ('super_admin', 'admin')
    )
  );

create policy "Admins can delete page media"
  on storage.objects for delete
  using (
    bucket_id = 'page-media'
    and exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid()
      and user_roles.role in ('super_admin', 'admin')
    )
  );
