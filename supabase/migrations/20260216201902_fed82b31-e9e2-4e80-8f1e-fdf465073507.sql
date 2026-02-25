
-- Fix infinite recursion in tenant_members RLS
DROP POLICY IF EXISTS "Tenant admins manage own members" ON public.tenant_members;
CREATE POLICY "Tenant admins manage own members"
ON public.tenant_members FOR ALL
USING (
  auth.uid() IN (
    SELECT tm2.user_id FROM public.tenant_members tm2
    WHERE tm2.tenant_id = tenant_members.tenant_id
      AND tm2.role IN ('owner', 'admin')
      AND tm2.user_id = auth.uid()
  )
);

-- Fix tenant_branding self-referencing policy
DROP POLICY IF EXISTS "Tenant admins manage own branding" ON public.tenant_branding;
CREATE POLICY "Tenant admins manage own branding"
ON public.tenant_branding FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_members tm
    WHERE tm.tenant_id = tenant_branding.tenant_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
  )
);

-- Fix tenant_domains self-referencing policy
DROP POLICY IF EXISTS "Tenant admins manage own domains" ON public.tenant_domains;
CREATE POLICY "Tenant admins manage own domains"
ON public.tenant_domains FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_members tm
    WHERE tm.tenant_id = tenant_domains.tenant_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
  )
);

-- Fix feature_flags self-referencing policy
DROP POLICY IF EXISTS "Tenant admins manage own flags" ON public.feature_flags;
CREATE POLICY "Tenant admins manage own flags"
ON public.feature_flags FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_members tm
    WHERE tm.tenant_id = feature_flags.tenant_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
  )
);

-- Fix tenants policy
DROP POLICY IF EXISTS "Tenant members can view own tenant" ON public.tenants;
CREATE POLICY "Tenant members can view own tenant"
ON public.tenants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_members tm
    WHERE tm.tenant_id = tenants.id
      AND tm.user_id = auth.uid()
  )
);

-- Fix site_settings tenant admin policy
DROP POLICY IF EXISTS "Tenant admins manage own settings" ON public.site_settings;
CREATE POLICY "Tenant admins manage own settings"
ON public.site_settings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_members tm
    WHERE tm.tenant_id = site_settings.tenant_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
  )
);
