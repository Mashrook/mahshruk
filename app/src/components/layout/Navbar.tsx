import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Plane,
  Hotel,
  Tag,
  Menu,
  X,
  MessageCircle,
  Home,
  Shield,
  GraduationCap,
  CalendarCheck,
  ShoppingCart,
  MapPinned,
  Newspaper,
  CreditCard,
  User,
  LogIn,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "الرئيسية", path: "/", icon: Home },
  { name: "الرحلات", path: "/trips", icon: Plane },
  { name: "الفنادق", path: "/hotels", icon: Hotel },
  { name: "العروض", path: "/offers", icon: Tag },
  { name: "النشاطات", path: "/activities", icon: CalendarCheck },
  { name: "الدراسة بالخارج", path: "/study", icon: GraduationCap },
];

const secondaryItems = [
  { name: "عن المنصة", path: "/about", icon: Shield },
  { name: "السياحة في السعودية", path: "/saudi", icon: MapPinned },
  { name: "المواصلات", path: "/transport", icon: Plane },
  { name: "المدفوعات", path: "/payments", icon: CreditCard },
  { name: "المقالات", path: "/articles", icon: Newspaper },
  { name: "تواصل معنا", path: "/support", icon: MessageCircle },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="مشروك" className="w-12 h-12 object-contain" />
              <div className="leading-tight">
                <span className="text-lg font-bold font-changa text-gradient block">مشروك</span>
                <span className="text-xs text-muted-foreground">للسفر والسياحة</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button variant={isActive ? "default" : "ghost"} size="sm" className="gap-2">
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/cart">
                <Button variant="outline" size="sm" className="gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  السلة
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="hero" size="sm" className="gap-2">
                  تسجيل جديد
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline" size="sm" className="gap-2">
                  <Shield className="w-4 h-4" />
                  لوحة التحكم
                </Button>
              </Link>
              {user ? (
                <>
                  <Link to="/profile">
                    <Button variant="hero" size="sm" className="gap-2">
                      <User className="w-4 h-4" />
                      {profile?.full_name || "حسابي"}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="gap-2" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                    خروج
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    دخول
                  </Button>
                </Link>
              )}
            </div>

            <button
              className="md:hidden p-2 z-50 relative"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

        <div
          className={`absolute top-0 right-0 h-full w-72 max-w-[80vw] bg-card shadow-2xl transform transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-bold text-lg text-gradient">مشروك</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100%-60px)] space-y-2">
            {[...navItems, ...secondaryItems].map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                  <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start gap-3">
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}

            <div className="h-px bg-border my-2" />

            <Link to="/cart" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-start gap-3">
                <ShoppingCart className="w-5 h-5" />
                السلة
              </Button>
            </Link>
            <Link to="/register" onClick={() => setIsOpen(false)}>
              <Button variant="hero" className="w-full justify-start gap-3 mt-2">
                تسجيل جديد
              </Button>
            </Link>
            <Link to="/admin" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Shield className="w-5 h-5" />
                لوحة التحكم
              </Button>
            </Link>

            {user ? (
              <>
                <Link to="/profile" onClick={() => setIsOpen(false)}>
                  <Button
                    variant={location.pathname === "/profile" ? "default" : "ghost"}
                    className="w-full justify-start gap-3"
                  >
                    <User className="w-5 h-5" />
                    {profile?.full_name || "حسابي"}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-5 h-5" />
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
