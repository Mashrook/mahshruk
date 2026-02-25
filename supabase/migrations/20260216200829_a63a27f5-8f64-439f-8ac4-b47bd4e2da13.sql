
-- Plans table
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ar text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price_monthly numeric NOT NULL DEFAULT 0,
  price_yearly numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'SAR',
  max_bookings_per_month integer,
  max_members integer DEFAULT 5,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active plans" ON public.plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Super admins manage plans" ON public.plans
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.plans(id),
  status text NOT NULL DEFAULT 'trial' CHECK (status IN ('trial','active','past_due','canceled','expired')),
  billing_cycle text NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly','yearly')),
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  trial_ends_at timestamptz DEFAULT (now() + interval '14 days'),
  canceled_at timestamptz,
  payment_provider text,
  payment_provider_subscription_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id)
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant members can view own subscription" ON public.subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenant_members tm
      WHERE tm.tenant_id = subscriptions.tenant_id
        AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins manage all subscriptions" ON public.subscriptions
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Tenant owners can update own subscription" ON public.subscriptions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tenant_members tm
      WHERE tm.tenant_id = subscriptions.tenant_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('owner','admin')
    )
  );

-- Invoices table
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES public.subscriptions(id),
  invoice_number text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'SAR',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending','paid','failed','refunded','void')),
  billing_period_start timestamptz,
  billing_period_end timestamptz,
  paid_at timestamptz,
  payment_method text,
  payment_provider_invoice_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant members can view own invoices" ON public.invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tenant_members tm
      WHERE tm.tenant_id = invoices.tenant_id
        AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins manage all invoices" ON public.invoices
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Add billing permissions
INSERT INTO public.permissions (key, name_ar, category, is_system) VALUES
  ('billing.read', 'عرض الفواتير', 'billing', true),
  ('billing.write', 'إدارة الاشتراكات', 'billing', true),
  ('plans.manage', 'إدارة الخطط', 'billing', true);

-- Seed default plans
INSERT INTO public.plans (name, name_ar, slug, description, price_monthly, price_yearly, max_bookings_per_month, max_members, features, sort_order) VALUES
  ('Free', 'مجاني', 'free', 'Basic plan with limited features', 0, 0, 10, 2, '["flights.enabled"]'::jsonb, 0),
  ('Starter', 'المبتدئ', 'starter', 'For small agencies', 199, 1990, 100, 5, '["flights.enabled","hotels.enabled","transfers.enabled"]'::jsonb, 1),
  ('Professional', 'المحترف', 'professional', 'For growing agencies', 499, 4990, 500, 15, '["flights.enabled","hotels.enabled","transfers.enabled","tours.enabled","cars.enabled"]'::jsonb, 2),
  ('Enterprise', 'المؤسسات', 'enterprise', 'Unlimited everything', 999, 9990, null, null, '["flights.enabled","hotels.enabled","transfers.enabled","tours.enabled","cars.enabled","payments.enabled","whitelabel.enabled"]'::jsonb, 3);

-- Triggers
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
