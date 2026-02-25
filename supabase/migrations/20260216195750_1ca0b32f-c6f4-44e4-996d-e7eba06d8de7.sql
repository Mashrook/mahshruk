
-- ========================
-- Multi-Tenant SaaS Schema
-- ========================

-- Tenants table
CREATE TABLE public.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'active', -- active, suspended, trial
  plan text NOT NULL DEFAULT 'free', -- free, starter, pro, enterprise
  owner_user_id uuid NOT NULL,
  contact_email text,
  contact_phone text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Tenant domains
CREATE TABLE public.tenant_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  domain text NOT NULL UNIQUE,
  is_primary boolean NOT NULL DEFAULT false,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.tenant_domains ENABLE ROW LEVEL SECURITY;

-- Tenant members (users belonging to tenants)
CREATE TABLE public.tenant_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member', -- owner, admin, member
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;

-- Tenant branding (white-label)
CREATE TABLE public.tenant_branding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE UNIQUE,
  logo_url text,
  favicon_url text,
  primary_color text DEFAULT '#D4A017',
  secondary_color text DEFAULT '#24AEFF',
  accent_color text DEFAULT '#C04AFF',
  font_heading text DEFAULT 'Noto Kufi Arabic',
  font_body text DEFAULT 'Cairo',
  support_email text,
  support_phone text,
  footer_text text,
  custom_css text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.tenant_branding ENABLE ROW LEVEL SECURITY;

-- Feature flags per tenant
CREATE TABLE public.feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  flag_key text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, flag_key)
);
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Add tenant_id to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES public.tenants(id);

-- ========================
-- RLS Policies
-- ========================

-- Tenants: super_admin can manage all, tenant owners/admins can view own
CREATE POLICY "Super admins manage all tenants" ON public.tenants FOR ALL
  USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Tenant members can view own tenant" ON public.tenants FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.tenant_members tm WHERE tm.tenant_id = id AND tm.user_id = auth.uid()));

-- Tenant domains
CREATE POLICY "Super admins manage all domains" ON public.tenant_domains FOR ALL
  USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Tenant admins manage own domains" ON public.tenant_domains FOR ALL
  USING (EXISTS (SELECT 1 FROM public.tenant_members tm WHERE tm.tenant_id = tenant_id AND tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin')));

CREATE POLICY "Anyone can read domains for resolution" ON public.tenant_domains FOR SELECT
  USING (true);

-- Tenant members
CREATE POLICY "Super admins manage all members" ON public.tenant_members FOR ALL
  USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Tenant admins manage own members" ON public.tenant_members FOR ALL
  USING (EXISTS (SELECT 1 FROM public.tenant_members tm2 WHERE tm2.tenant_id = tenant_id AND tm2.user_id = auth.uid() AND tm2.role IN ('owner', 'admin')));

CREATE POLICY "Members can view own membership" ON public.tenant_members FOR SELECT
  USING (auth.uid() = user_id);

-- Tenant branding
CREATE POLICY "Super admins manage all branding" ON public.tenant_branding FOR ALL
  USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Tenant admins manage own branding" ON public.tenant_branding FOR ALL
  USING (EXISTS (SELECT 1 FROM public.tenant_members tm WHERE tm.tenant_id = tenant_id AND tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin')));

CREATE POLICY "Anyone can read branding" ON public.tenant_branding FOR SELECT
  USING (true);

-- Feature flags
CREATE POLICY "Super admins manage all flags" ON public.feature_flags FOR ALL
  USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Tenant admins manage own flags" ON public.feature_flags FOR ALL
  USING (EXISTS (SELECT 1 FROM public.tenant_members tm WHERE tm.tenant_id = tenant_id AND tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin')));

CREATE POLICY "Anyone can read flags for resolution" ON public.feature_flags FOR SELECT
  USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_members_updated_at BEFORE UPDATE ON public.tenant_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_branding_updated_at BEFORE UPDATE ON public.tenant_branding
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add new permissions for tenant management
INSERT INTO public.permissions (key, name_ar, category, is_system) VALUES
  ('tenants.view', 'عرض المستأجرين', 'tenants', true),
  ('tenants.manage', 'إدارة المستأجرين', 'tenants', true),
  ('tenants.suspend', 'تعليق المستأجرين', 'tenants', true),
  ('tenant.branding', 'تعديل العلامة التجارية', 'tenant', true),
  ('tenant.features', 'إدارة الميزات', 'tenant', true),
  ('tenant.members', 'إدارة أعضاء المستأجر', 'tenant', true),
  ('tenant.settings', 'إعدادات المستأجر', 'tenant', true)
ON CONFLICT (key) DO NOTHING;
