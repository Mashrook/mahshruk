import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { usePermissionStore } from '@/stores/permissionStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession, setLoading, fetchProfile, fetchRoles } = useAuthStore();
  const { fetchPermissions, clear: clearPermissions } = usePermissionStore();
  const initialized = useRef(false);

  useEffect(() => {
    // Load profile, roles and permissions — only setLoading(false) when done
    async function loadUserData(userId: string) {
      try {
        await Promise.all([
          fetchProfile(),
          fetchRoles(),
          fetchPermissions(userId),
        ]);
      } catch (err) {
        console.error('[AuthProvider] Error loading user data:', err);
      }
    }

    // 1. Initial session check (runs once)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await loadUserData(session.user.id);
      }
      setLoading(false);
      initialized.current = true;
    });

    // 2. Listen for auth changes (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          // Only refetch on real auth events (not the initial callback)
          if (initialized.current) {
            setLoading(true);
            await loadUserData(session.user.id);
            setLoading(false);
          }
        } else {
          clearPermissions();
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
