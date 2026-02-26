import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { usePermissionStore } from '@/stores/permissionStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  /** Optional granular permission key, e.g. "manage_pages" */
  requiredPermission?: string;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requiredPermission,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading } = useAuthStore();
  const { hasPermission, loading: permLoading } = usePermissionStore();

  if (loading || (requireAdmin && permLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={requireAdmin ? '/admin/login' : '/login'} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8">
        <div>
          <h2 className="text-xl font-bold text-red-400 mb-2">غير مصرح</h2>
          <p className="text-muted-foreground">ليس لديك صلاحية للوصول إلى هذه الصفحة.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
