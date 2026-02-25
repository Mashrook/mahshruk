import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface Plan {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  max_bookings_per_month: number | null;
  max_members: number | null;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

export interface Subscription {
  id: string;
  tenant_id: string;
  plan_id: string;
  status: string;
  billing_cycle: string;
  current_period_start: string;
  current_period_end: string;
  trial_ends_at: string | null;
  canceled_at: string | null;
  plans?: Plan;
}

export interface Invoice {
  id: string;
  tenant_id: string;
  subscription_id: string | null;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  billing_period_start: string | null;
  billing_period_end: string | null;
  paid_at: string | null;
  created_at: string;
}

interface BillingState {
  plans: Plan[];
  subscription: Subscription | null;
  invoices: Invoice[];
  isActive: boolean;
  isTrial: boolean;
  isExpired: boolean;
  loading: boolean;
  loadPlans: () => Promise<void>;
  loadSubscription: (tenantId: string) => Promise<void>;
  loadInvoices: (tenantId: string) => Promise<void>;
  checkout: (tenantId: string, planSlug: string, billingCycle: string) => Promise<any>;
  cancelSubscription: (tenantId: string) => Promise<void>;
}

export const useBillingStore = create<BillingState>((set, get) => ({
  plans: [],
  subscription: null,
  invoices: [],
  isActive: true, // default allow if no tenant
  isTrial: false,
  isExpired: false,
  loading: false,

  loadPlans: async () => {
    const { data } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    set({ plans: (data || []) as Plan[] });
  },

  loadSubscription: async (tenantId: string) => {
    set({ loading: true });
    try {
      const { data } = await supabase.functions.invoke('billing-subscription', {
        body: null,
        headers: {},
      });
      // Use query params approach - call via direct fetch
      const { data: session } = await supabase.auth.getSession();
      const token = session?.session?.access_token;
      if (!token) { set({ loading: false }); return; }

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/billing-subscription?tenant_id=${tenantId}`,
        { headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
      );
      const result = await res.json();
      set({
        subscription: result.subscription,
        isActive: result.is_active ?? true,
        isTrial: result.is_trial ?? false,
        isExpired: result.is_expired ?? false,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  loadInvoices: async (tenantId: string) => {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;
    if (!token) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/billing-invoices?tenant_id=${tenantId}`,
        { headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
      );
      const result = await res.json();
      set({ invoices: result.invoices || [] });
    } catch {
      // ignore
    }
  },

  checkout: async (tenantId: string, planSlug: string, billingCycle: string) => {
    const { data, error } = await supabase.functions.invoke('billing-checkout', {
      body: { tenant_id: tenantId, plan_slug: planSlug, billing_cycle: billingCycle },
    });
    if (error) throw error;
    // Reload subscription after checkout
    await get().loadSubscription(tenantId);
    return data;
  },

  cancelSubscription: async (tenantId: string) => {
    const { subscription } = get();
    if (!subscription) return;
    await supabase
      .from('subscriptions')
      .update({ status: 'canceled', canceled_at: new Date().toISOString() })
      .eq('id', subscription.id);
    await get().loadSubscription(tenantId);
  },
}));
