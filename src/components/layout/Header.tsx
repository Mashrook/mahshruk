import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useTenantStore } from "@/stores/tenantStore";
import khattahLogo from "@/assets/khattah-logo.png";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/flights", label: "الطيران" },
  { href: "/hotels", label: "الفنادق" },
  { href: "/cars", label: "السيارات" },
  { href: "/activities", label: "الجولات" },
  { href: "/tours", label: "المواسم" },
  { href: "/festivals", label: "الفعاليات" },
  { href: "/saudi-tourism", label: "سياحة السعودية" },
  { href: "/transfers", label: "المواصلات" },
  { href: "/offers", label: "العروض" },
];

const moreLinks = [
  { href: "/news", label: "الأخبار" },
  { href: "/destinations", label: "الوجهات" },
  { href: "/study-abroad", label: "الدراسة" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "اتصل بنا" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, profile, logout } = useAuthStore();
  const { branding, tenant } = useTenantStore();

  const logoUrl = branding?.logo_url || khattahLogo;
  const brandName = tenant?.name || "خته";
  const brandNameEn = tenant?.slug?.toUpperCase() || "KHATTAH";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        scrolled
          ? "glass-strong border-b border-border/50 shadow-card"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src={logoUrl}
              alt={brandName}
              className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl object-contain shadow-gold group-hover:shadow-gold-lg transition-all duration-300"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-base lg:text-lg font-bold text-foreground whitespace-nowrap">{brandName}</span>
              <span className="text-[9px] lg:text-[10px] text-muted-foreground tracking-widest whitespace-nowrap">{brandNameEn}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <Button
                  variant={location.pathname === link.href ? "nav-active" : "nav"}
                  size="sm"
                  className="text-[13px]"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="text-[13px]">
                    <User className="w-4 h-4 ml-1.5" />
                    {profile?.full_name || user?.email || "حسابي"}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="text-[13px]" onClick={() => logout()}>
                  <LogOut className="w-4 h-4 ml-1.5" />
                  خروج
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="text-[13px]">تسجيل الدخول</Button>
                </Link>
                <Link to="/register">
                  <Button variant="gold" size="sm" className="text-[13px]">إنشاء حساب</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-[600px] pb-6" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-1 pt-3 border-t border-border/30">
            {[...navLinks, ...moreLinks].map((link) => (
              <Link key={link.href} to={link.href}>
                <Button
                  variant={location.pathname === link.href ? "nav-active" : "nav"}
                  className="w-full justify-start text-sm"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-border/30">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <User className="w-4 h-4 ml-2" />
                      حسابي
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start text-sm" onClick={() => logout()}>
                    <LogOut className="w-4 h-4 ml-2" />
                    خروج
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="w-full">تسجيل الدخول</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="gold" className="w-full">إنشاء حساب</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
