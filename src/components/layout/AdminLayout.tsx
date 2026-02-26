import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionStore } from "@/stores/permissionStore";
import { Button } from "@/components/ui/button";
import khattahLogo from "@/assets/khattah-logo.png";
import {
  LayoutDashboard, Users, Plane, Hotel, Car, Map, ArrowRightLeft,
  Tag, Globe, FileText, Settings, LogOut, Newspaper, Handshake,
  PlaneTakeoff, CalendarDays, Key, ShieldCheck, ScrollText, Monitor, Shield,
  BarChart3, AlertTriangle, Bell, Database, Activity, Building2, Palette, ToggleLeft,
  CreditCard, Package, Film, ChevronRight, ChevronLeft, PanelRightClose, PanelRightOpen,
} from "lucide-react";

interface AdminGroup {
  label: string;
  links: typeof adminLinks;
}

const adminLinks = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, permission: "dashboard.view" },
  { href: "/admin/bookings", label: "الحجوزات", icon: CalendarDays, permission: "bookings.view" },
  { href: "/admin/users", label: "المستخدمين", icon: Users, permission: "users.view" },
];

const adminGroups: AdminGroup[] = [
  {
    label: "الخدمات",
    links: [
      { href: "/admin/flights", label: "الطيران", icon: Plane, permission: "services.view" },
      { href: "/admin/hotels", label: "الفنادق", icon: Hotel, permission: "services.view" },
      { href: "/admin/cars", label: "السيارات", icon: Car, permission: "services.view" },
      { href: "/admin/tours", label: "الجولات", icon: Map, permission: "services.view" },
      { href: "/admin/transfers", label: "التحويلات", icon: ArrowRightLeft, permission: "services.view" },
    ],
  },
  {
    label: "المحتوى",
    links: [
      { href: "/admin/offers", label: "العروض", icon: Tag, permission: "offers.view" },
      { href: "/admin/destinations", label: "الوجهات", icon: Globe, permission: "content.view" },
      { href: "/admin/articles", label: "المقالات", icon: Newspaper, permission: "content.view" },
      { href: "/admin/pages", label: "الصفحات", icon: FileText, permission: "content.view" },
      { href: "/admin/promo-media", label: "المحتوى الدعائي", icon: Film, permission: "content.view" },
    ],
  },
  {
    label: "المستأجرين والفواتير",
    links: [
      { href: "/admin/tenants", label: "إدارة المستأجرين", icon: Building2, permission: "tenants.manage" },
      { href: "/admin/tenant-branding", label: "العلامة التجارية", icon: Palette, permission: "tenant.branding" },
      { href: "/admin/feature-flags", label: "إدارة الميزات", icon: ToggleLeft, permission: "tenant.features" },
      { href: "/admin/tenant-settings", label: "إعدادات المستأجر", icon: Settings, permission: "tenant.settings" },
      { href: "/admin/billing", label: "الفواتير والاشتراك", icon: CreditCard, permission: "billing.read" },
      { href: "/admin/plans", label: "إدارة الخطط", icon: Package, permission: "plans.manage" },
    ],
  },
  {
    label: "العمليات والأمان",
    links: [
      { href: "/admin/integrations", label: "الاتصالات والمفاتيح", icon: Key, permission: "endpoints.manage" },
      { href: "/admin/rbac", label: "الصلاحيات والأدوار", icon: ShieldCheck, permission: "roles.view" },
      { href: "/admin/reports", label: "التقارير", icon: BarChart3, permission: "reports.read" },
      { href: "/admin/incidents", label: "الحوادث", icon: AlertTriangle, permission: "incidents.write" },
      { href: "/admin/alerts", label: "التنبيهات", icon: Bell, permission: "alerts.read" },
      { href: "/admin/retention", label: "سياسات الاحتفاظ", icon: Database, permission: "retention.write" },
      { href: "/admin/health", label: "صحة النظام", icon: Activity, permission: "ops.read" },
      { href: "/admin/audit-logs", label: "سجل المراجعة", icon: ScrollText, permission: "security.audit_logs" },
      { href: "/admin/sessions", label: "الجلسات", icon: Monitor, permission: "security.sessions" },
      { href: "/admin/security", label: "إعدادات الأمان", icon: Shield, permission: "security.settings" },
      { href: "/admin/settings", label: "الإعدادات", icon: Settings, permission: "settings.view" },
    ],
  },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, profile, roles } = useAuthStore();
  const { hasPermission } = usePermissionStore();
  const isSuperAdmin = roles.includes("super_admin");

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const canSee = (permission: string) => isSuperAdmin || hasPermission(permission);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const NavItem = ({ href, icon: Icon, label, permission }: typeof adminLinks[0]) => {
    if (!canSee(permission)) return null;
    const isActive = location.pathname === href;
    return (
      <Link to={href}>
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
            collapsed && "justify-center px-2",
            isActive
              ? "bg-primary/10 text-primary font-semibold border border-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
          title={collapsed ? label : undefined}
        >
          <Icon className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="truncate">{label}</span>}
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card/60 backdrop-blur-xl border-l border-border/50 flex flex-col fixed top-0 right-0 bottom-0 overflow-y-auto transition-all duration-300 z-40",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* Logo + collapse toggle */}
        <div className="p-3 border-b border-border/50 flex items-center justify-between gap-2">
          <Link to="/admin" className="flex items-center gap-2.5 min-w-0">
            <img src={khattahLogo} alt="خته" className="w-9 h-9 rounded-lg object-contain shrink-0" />
            {!collapsed && (
              <div className="min-w-0">
                <h3 className="font-bold text-foreground text-sm truncate">لوحة التحكم</h3>
                <span className="text-[10px] text-muted-foreground">خته</span>
              </div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed(!collapsed)}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            {collapsed ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
          </Button>
        </div>

        {/* Top-level links */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {adminLinks.map((link) => (
            <NavItem key={link.href} {...link} />
          ))}

          {/* Grouped sections */}
          {adminGroups.map((group) => {
            const visibleLinks = group.links.filter((l) => canSee(l.permission));
            if (visibleLinks.length === 0) return null;
            const isOpen = openGroups[group.label] !== false; // default open
            const hasActiveChild = visibleLinks.some((l) => location.pathname === l.href);

            return (
              <div key={group.label} className="pt-2">
                {!collapsed ? (
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
                      hasActiveChild ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>{group.label}</span>
                    <ChevronRight className={cn("w-3 h-3 transition-transform duration-200", isOpen && "rotate-90")} />
                  </button>
                ) : (
                  <div className="border-t border-border/30 mx-2 my-1" />
                )}
                <div className={cn(
                  "space-y-0.5 overflow-hidden transition-all duration-200",
                  !collapsed && !isOpen && "max-h-0",
                  (!collapsed && isOpen) && "max-h-[1000px]",
                  collapsed && "max-h-[1000px]"
                )}>
                  {visibleLinks.map((link) => (
                    <NavItem key={link.href} {...link} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-border/50">
          {!collapsed ? (
            <>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || "مدير"}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={handleLogout}>
                <LogOut className="w-3.5 h-3.5 ml-1.5" />
                تسجيل الخروج
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="icon-sm" className="w-full" onClick={handleLogout} title="تسجيل الخروج">
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </aside>

      {/* Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 p-4 lg:p-8",
        collapsed ? "mr-[68px]" : "mr-64"
      )}>
        {children}
      </main>
    </div>
  );
}
