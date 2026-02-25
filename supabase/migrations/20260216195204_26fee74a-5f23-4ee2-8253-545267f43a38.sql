
-- 1. Retention Policies table
CREATE TABLE public.retention_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL UNIQUE,
  retention_days integer NOT NULL DEFAULT 90,
  is_active boolean NOT NULL DEFAULT true,
  description_ar text,
  last_cleanup_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.retention_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view retention policies" ON public.retention_policies
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Super admins can manage retention policies" ON public.retention_policies
FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Seed default retention policies
INSERT INTO public.retention_policies (entity_type, retention_days, description_ar) VALUES
  ('audit_logs', 365, 'سجلات المراجعة'),
  ('login_attempts', 30, 'محاولات تسجيل الدخول'),
  ('notifications', 90, 'الإشعارات المقروءة'),
  ('admin_sessions', 180, 'جلسات المشرفين المنتهية');

-- 2. Admin Alerts table
CREATE TABLE public.admin_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  severity text NOT NULL DEFAULT 'info',
  category text NOT NULL DEFAULT 'system',
  is_resolved boolean NOT NULL DEFAULT false,
  resolved_by uuid,
  resolved_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view alerts" ON public.admin_alerts
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Admins can manage alerts" ON public.admin_alerts
FOR ALL USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE INDEX idx_admin_alerts_severity ON public.admin_alerts(severity);
CREATE INDEX idx_admin_alerts_created ON public.admin_alerts(created_at DESC);

-- 3. Incidents table
CREATE TABLE public.incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  severity text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'open',
  reported_by uuid NOT NULL,
  assigned_to uuid,
  resolution text,
  resolved_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view incidents" ON public.incidents
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Admins can manage incidents" ON public.incidents
FOR ALL USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE INDEX idx_incidents_status ON public.incidents(status);
CREATE INDEX idx_incidents_severity ON public.incidents(severity);
CREATE INDEX idx_incidents_created ON public.incidents(created_at DESC);

-- 4. Add new permissions
INSERT INTO public.permissions (key, name_ar, category, description_ar, is_system) VALUES
  ('reports.read', 'عرض التقارير', 'reports', 'عرض تقارير الحجوزات والمدفوعات', true),
  ('reports.export', 'تصدير التقارير', 'reports', 'تصدير البيانات بصيغة CSV و PDF', true),
  ('retention.write', 'إدارة سياسات الاحتفاظ', 'settings', 'تعديل سياسات الاحتفاظ بالبيانات', true),
  ('incidents.write', 'إدارة الحوادث', 'security', 'إنشاء وتعديل تقارير الحوادث', true),
  ('alerts.read', 'عرض التنبيهات', 'security', 'عرض تنبيهات النظام', true),
  ('ops.read', 'عرض العمليات', 'settings', 'عرض صحة النظام والعمليات', true);
