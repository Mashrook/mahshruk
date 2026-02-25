import { useEffect } from 'react';
import { useTenantStore } from '@/stores/tenantStore';

export default function TenantProvider({ children }: { children: React.ReactNode }) {
  const { resolveTenant, resolved, loading, branding } = useTenantStore();

  useEffect(() => {
    resolveTenant();
  }, []);

  // Apply tenant branding CSS variables
  useEffect(() => {
    if (!branding) return;

    const root = document.documentElement;
    if (branding.primary_color) {
      root.style.setProperty('--tenant-primary', branding.primary_color);
    }
    if (branding.secondary_color) {
      root.style.setProperty('--tenant-secondary', branding.secondary_color);
    }
    if (branding.custom_css) {
      const style = document.createElement('style');
      style.id = 'tenant-custom-css';
      style.textContent = branding.custom_css;
      document.head.appendChild(style);
      return () => {
        document.getElementById('tenant-custom-css')?.remove();
      };
    }
  }, [branding]);

  if (!resolved && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
