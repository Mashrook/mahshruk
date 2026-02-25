
-- Site settings key-value store for dynamic content like promo media
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value text,
  setting_type text NOT NULL DEFAULT 'text',
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Super admins manage site settings" ON public.site_settings
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Tenant admins manage own settings" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tenant_members tm
      WHERE tm.tenant_id = site_settings.tenant_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('owner','admin')
    )
  );

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for promo media
INSERT INTO storage.buckets (id, name, public) VALUES ('promo-media', 'promo-media', true);

CREATE POLICY "Anyone can view promo media" ON storage.objects
  FOR SELECT USING (bucket_id = 'promo-media');

CREATE POLICY "Admins can upload promo media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'promo-media'
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  );

CREATE POLICY "Admins can update promo media" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'promo-media'
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  );

CREATE POLICY "Admins can delete promo media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'promo-media'
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  );
