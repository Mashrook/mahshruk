import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { getCache, setCache } from '@/lib/cache';

export interface ServiceEndpoint {
  service: string;
  base_url: string;
  status: string;
  notes?: string | null;
}

const CACHE_KEY = 'public_config';

interface ConfigState {
  endpoints: ServiceEndpoint[];
  loaded: boolean;
  loading: boolean;
  fetchEndpoints: () => Promise<void>;
  getEndpoint: (service: string) => ServiceEndpoint | undefined;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  endpoints: [],
  loaded: false,
  loading: false,

  fetchEndpoints: async () => {
    // Try cache first
    const cached = getCache<ServiceEndpoint[]>(CACHE_KEY);
    if (cached) {
      set({ endpoints: cached, loaded: true });
      return;
    }

    set({ loading: true });
    try {
      const { data, error } = await supabase.functions.invoke('public-config');
      if (error) throw error;
      const endpoints = data?.endpoints || [];
      set({ endpoints, loaded: true });
      setCache(CACHE_KEY, endpoints);
    } catch {
      set({ loaded: true });
    } finally {
      set({ loading: false });
    }
  },

  getEndpoint: (service) =>
    get().endpoints.find((e) => e.service === service && e.status === 'enabled'),
}));
