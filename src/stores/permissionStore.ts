import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

interface PermissionState {
  permissions: string[];
  loaded: boolean;
  loading: boolean;
  fetchPermissions: (userId: string) => Promise<void>;
  hasPermission: (key: string) => boolean;
  hasAnyPermission: (keys: string[]) => boolean;
  clear: () => void;
}

export const usePermissionStore = create<PermissionState>((set, get) => ({
  permissions: [],
  loaded: false,
  loading: false,

  fetchPermissions: async (userId) => {
    if (get().loaded) return;
    set({ loading: true });
    try {
      // Get user roles first
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (!roles || roles.length === 0) {
        set({ permissions: [], loaded: true, loading: false });
        return;
      }

      const userRoles = roles.map((r) => r.role);

      // super_admin gets all permissions
      if (userRoles.includes("super_admin")) {
        const { data: allPerms } = await supabase
          .from("permissions")
          .select("key");
        set({
          permissions: (allPerms || []).map((p) => p.key),
          loaded: true,
          loading: false,
        });
        return;
      }

      // Fetch permission IDs for user's roles
      const { data: rp } = await supabase
        .from("role_permissions")
        .select("permission_id")
        .in("role", userRoles as any);

      const permIds = (rp || []).map((r) => r.permission_id);
      if (permIds.length === 0) {
        set({ permissions: [], loaded: true, loading: false });
        return;
      }

      const { data: perms } = await supabase
        .from("permissions")
        .select("key")
        .in("id", permIds);

      const permKeys = (perms || []).map((p) => p.key);

      set({ permissions: [...new Set(permKeys)], loaded: true, loading: false });
    } catch {
      set({ loaded: true, loading: false });
    }
  },

  hasPermission: (key) => get().permissions.includes(key),
  hasAnyPermission: (keys) => keys.some((k) => get().permissions.includes(k)),
  clear: () => set({ permissions: [], loaded: false }),
}));
