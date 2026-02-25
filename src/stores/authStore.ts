import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupaUser, Session } from '@supabase/supabase-js';

export type AppRole = 'admin' | 'super_admin' | 'editor' | 'support';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface AuthState {
  user: SupaUser | null;
  session: Session | null;
  profile: UserProfile | null;
  roles: AppRole[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setRoles: (roles: AppRole[]) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  fetchRoles: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  roles: [],
  isAuthenticated: false,
  isAdmin: false,
  loading: true,

  setSession: (session) => {
    set({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session?.user,
    });
  },

  setProfile: (profile) => set({ profile }),

  setRoles: (roles) => {
    set({
      roles,
      isAdmin: roles.includes('admin') || roles.includes('super_admin'),
    });
  },

  setLoading: (loading) => set({ loading }),

  logout: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      session: null,
      profile: null,
      roles: [],
      isAuthenticated: false,
      isAdmin: false,
    });
  },

  fetchProfile: async () => {
    const user = get().user;
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (data) set({ profile: data as UserProfile });
  },

  fetchRoles: async () => {
    const user = get().user;
    if (!user) return;
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    if (data) {
      const roles = data.map((r) => r.role) as AppRole[];
      set({
        roles,
        isAdmin: roles.includes('admin') || roles.includes('super_admin'),
      });
    }
  },
}));
