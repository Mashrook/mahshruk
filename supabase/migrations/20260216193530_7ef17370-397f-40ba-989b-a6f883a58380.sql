
-- Permissions table: stores all granular permissions
CREATE TABLE public.permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  category TEXT NOT NULL,
  description_ar TEXT,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read permissions" ON public.permissions
  FOR SELECT USING (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)
  );

CREATE POLICY "Super admins can manage permissions" ON public.permissions
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Role permissions junction table
CREATE TABLE public.role_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role app_role NOT NULL,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role, permission_id)
);

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read role_permissions" ON public.role_permissions
  FOR SELECT USING (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)
  );

CREATE POLICY "Super admins can manage role_permissions" ON public.role_permissions
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission_key TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role = ur.role
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = _user_id AND p.key = _permission_key
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'super_admin'
  )
$$;

-- Seed permissions grouped by category
INSERT INTO public.permissions (key, name_ar, category, description_ar, is_system) VALUES
  -- Dashboard
  ('dashboard.view', 'عرض لوحة التحكم', 'dashboard', 'عرض لوحة التحكم الرئيسية', true),
  -- Bookings
  ('bookings.view', 'عرض الحجوزات', 'bookings', 'عرض جميع الحجوزات', true),
  ('bookings.edit', 'تعديل الحجوزات', 'bookings', 'تعديل حالة الحجوزات', false),
  ('bookings.delete', 'حذف الحجوزات', 'bookings', 'حذف الحجوزات', false),
  -- Users
  ('users.view', 'عرض المستخدمين', 'users', 'عرض قائمة المستخدمين', true),
  ('users.edit', 'تعديل المستخدمين', 'users', 'تعديل بيانات المستخدمين', false),
  ('users.delete', 'حذف المستخدمين', 'users', 'حذف المستخدمين', false),
  -- Content
  ('content.view', 'عرض المحتوى', 'content', 'عرض المقالات والصفحات', true),
  ('content.edit', 'تعديل المحتوى', 'content', 'تعديل المقالات والصفحات', false),
  ('content.delete', 'حذف المحتوى', 'content', 'حذف المقالات والصفحات', false),
  -- Services (flights, hotels, etc.)
  ('services.view', 'عرض الخدمات', 'services', 'عرض الطيران والفنادق والسيارات والجولات', true),
  ('services.edit', 'تعديل الخدمات', 'services', 'تعديل تفاصيل الخدمات', false),
  -- Offers
  ('offers.view', 'عرض العروض', 'offers', 'عرض العروض الحصرية', true),
  ('offers.edit', 'تعديل العروض', 'offers', 'إنشاء وتعديل العروض', false),
  -- Settings & Config
  ('settings.view', 'عرض الإعدادات', 'settings', 'عرض إعدادات النظام', true),
  ('settings.edit', 'تعديل الإعدادات', 'settings', 'تعديل إعدادات النظام', false),
  ('endpoints.manage', 'إدارة روابط الخدمات', 'settings', 'إدارة روابط APIs', false),
  ('apikeys.manage', 'إدارة مفاتيح APIs', 'settings', 'إدارة مفاتيح الربط', false),
  -- RBAC
  ('roles.view', 'عرض الأدوار', 'rbac', 'عرض الأدوار والصلاحيات', true),
  ('roles.manage', 'إدارة الأدوار', 'rbac', 'إنشاء وتعديل الأدوار والصلاحيات', false),
  ('admin_users.view', 'عرض المشرفين', 'rbac', 'عرض قائمة المشرفين', true),
  ('admin_users.manage', 'إدارة المشرفين', 'rbac', 'تعيين وإزالة أدوار المشرفين', false);

-- Seed default permissions for admin role (everything except rbac.manage and admin_users.manage)
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin'::app_role, id FROM public.permissions
WHERE key NOT IN ('roles.manage', 'admin_users.manage');

-- Seed editor role permissions
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'editor'::app_role, id FROM public.permissions
WHERE category IN ('dashboard', 'content', 'offers') AND key LIKE '%.view' OR key LIKE '%.edit';

-- Seed support role permissions
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'support'::app_role, id FROM public.permissions
WHERE key IN ('dashboard.view', 'bookings.view', 'bookings.edit', 'users.view');
