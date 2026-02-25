
-- 1. Audit Logs table
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_admin_id uuid NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  before jsonb DEFAULT '{}'::jsonb,
  after jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON public.audit_logs
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Admins can insert audit logs" ON public.audit_logs
FOR INSERT WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_admin_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- 2. Admin Sessions table
CREATE TABLE public.admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  ip_address text,
  user_agent text,
  is_active boolean NOT NULL DEFAULT true,
  revoked_at timestamptz,
  revoked_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_active_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view sessions" ON public.admin_sessions
FOR SELECT USING (
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Admins can insert own session" ON public.admin_sessions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super admins can update sessions" ON public.admin_sessions
FOR UPDATE USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE INDEX idx_admin_sessions_user ON public.admin_sessions(user_id);
CREATE INDEX idx_admin_sessions_active ON public.admin_sessions(is_active);

-- 3. Admin 2FA table
CREATE TABLE public.admin_2fa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  is_enabled boolean NOT NULL DEFAULT false,
  method text NOT NULL DEFAULT 'totp',
  secret_encrypted text,
  backup_codes jsonb,
  enabled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_2fa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own 2fa" ON public.admin_2fa
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own 2fa" ON public.admin_2fa
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all 2fa" ON public.admin_2fa
FOR SELECT USING (has_role(auth.uid(), 'super_admin'::app_role));

-- 4. Login Attempts table (brute force protection)
CREATE TABLE public.login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  ip_address text,
  success boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Only admins can read login attempts
CREATE POLICY "Admins can view login attempts" ON public.login_attempts
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)
);

-- Anyone can insert (for tracking failed attempts before auth)
CREATE POLICY "Anyone can insert login attempts" ON public.login_attempts
FOR INSERT WITH CHECK (true);

CREATE INDEX idx_login_attempts_email ON public.login_attempts(email, created_at DESC);

-- Add new permissions for security features
INSERT INTO public.permissions (key, name_ar, category, description_ar, is_system) VALUES
  ('security.audit_logs', 'عرض سجل المراجعة', 'security', 'عرض جميع سجلات المراجعة والتغييرات', true),
  ('security.sessions', 'إدارة الجلسات', 'security', 'عرض وإنهاء جلسات المشرفين', true),
  ('security.settings', 'إعدادات الأمان', 'security', 'إدارة إعدادات الأمان والمصادقة الثنائية', true);
