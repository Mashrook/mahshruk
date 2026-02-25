import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { usePermissionStore } from '@/stores/permissionStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession, setLoading, fetchProfile, fetchRoles } = useAuthStore();
  const { fetchPermissions, clear: clearPermissions } = usePermissionStore();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          setTimeout(() => {
            fetchProfile();
            fetchRoles();
            fetchPermissions(session.user.id);
          }, 0);
        } else {
          clearPermissions();
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile();
        fetchRoles();
        fetchPermissions(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
