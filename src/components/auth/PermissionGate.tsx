import { ReactNode } from "react";
import { usePermissionStore } from "@/stores/permissionStore";
import { ShieldOff } from "lucide-react";

interface PermissionGateProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  hide?: boolean; // If true, render nothing instead of fallback
}

export default function PermissionGate({
  permission,
  permissions,
  requireAll = false,
  children,
  fallback,
  hide = false,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, loaded } = usePermissionStore();

  if (!loaded) return null;

  const keys = permissions || (permission ? [permission] : []);
  if (keys.length === 0) return <>{children}</>;

  const allowed = requireAll
    ? keys.every((k) => hasPermission(k))
    : hasAnyPermission(keys);

  if (allowed) return <>{children}</>;

  if (hide) return null;

  if (fallback) return <>{fallback}</>;

  return (
    <div className="p-12 text-center">
      <ShieldOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground font-medium">ليس لديك صلاحية لعرض هذا القسم</p>
    </div>
  );
}
