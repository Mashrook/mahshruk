import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: string;
  plan: string;
  owner_user_id: string;
  contact_email: string | null;
  contact_phone: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface TenantBranding {
  id: string;
  tenant_id: string;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  font_heading: string | null;
  font_body: string | null;
  support_email: string | null;
  support_phone: string | null;
  footer_text: string | null;
  custom_css: string | null;
}

export interface FeatureFlag {
  id: string;
  tenant_id: string;
  flag_key: string;
  is_enabled: boolean;
  metadata: any;
}

interface TenantState {
  tenant: Tenant | null;
  branding: TenantBranding | null;
  features: FeatureFlag[];
  loading: boolean;
  resolved: boolean;
  resolveTenant: () => Promise<void>;
  resolveTenantBySlug: (slug: string) => Promise<void>;
  isFeatureEnabled: (key: string) => boolean;
  setTenant: (tenant: Tenant | null) => void;
  clear: () => void;
}

async function loadTenantData(tenantId: string, set: any) {
  try {
    const [tenantRes, brandingRes, flagsRes] = await Promise.all([
      supabase.from('tenants').select('*').eq('id', tenantId).single(),
      supabase.from('tenant_branding').select('*').eq('tenant_id', tenantId).maybeSingle(),
      supabase.from('feature_flags').select('*').eq('tenant_id', tenantId),
    ]);

    set({
      tenant: tenantRes.data as Tenant | null,
      branding: brandingRes.data as TenantBranding | null,
      features: (flagsRes.data || []) as FeatureFlag[],
      resolved: true,
      loading: false,
    });
  } catch {
    set({ resolved: true, loading: false });
  }
}

export const useTenantStore = create<TenantState>((set, get) => ({
  tenant: null,
  branding: null,
  features: [],
  loading: false,
  resolved: false,

  resolveTenant: async () => {
    if (get().resolved) return;
    set({ loading: true });

    try {
      const hostname = window.location.hostname;

      // Try domain resolution first
      const { data: domainData } = await supabase
        .from('tenant_domains')
        .select('tenant_id')
        .eq('domain', hostname)
        .eq('is_verified', true)
        .maybeSingle();

      if (domainData?.tenant_id) {
        await loadTenantData(domainData.tenant_id, set);
        return;
      }

      // Check path-based resolution /t/:slug
      const pathMatch = window.location.pathname.match(/^\/t\/([^/]+)/);
      if (pathMatch) {
        await get().resolveTenantBySlug(pathMatch[1]);
        return;
      }

      // No tenant = platform mode
      set({ resolved: true, loading: false });
    } catch {
      set({ resolved: true, loading: false });
    }
  },

  resolveTenantBySlug: async (slug: string) => {
    set({ loading: true });
    try {
      const { data: tenant } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .maybeSingle();

      if (tenant) {
        await loadTenantData(tenant.id, set);
      } else {
        set({ resolved: true, loading: false });
      }
    } catch {
      set({ resolved: true, loading: false });
    }
  },

  isFeatureEnabled: (key: string) => {
    const { features, tenant } = get();
    if (!tenant) return true;
    const flag = features.find((f) => f.flag_key === key);
    return flag ? flag.is_enabled : false;
  },

  setTenant: (tenant) => set({ tenant }),

  clear: () => set({ tenant: null, branding: null, features: [], resolved: false }),
}));
