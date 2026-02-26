import { useEffect, useState } from "react";
import { CalendarDays, Users, Plane, DollarSign, Key, Link2, CheckCircle, Shield, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { isAmadeusConfigured, testAmadeusConnection } from "@/services/amadeusService";
import { isMoyasarConfigured } from "@/services/moyasarService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ bookings: 0, users: 0, revenue: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [apiKeysCount, setApiKeysCount] = useState(0);
  const [endpointsCount, setEndpointsCount] = useState(0);
  const [amadeusOk, setAmadeusOk] = useState<boolean | null>(null);
  const [moyasarOk, setMoyasarOk] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Create user dialog
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsRes, profilesRes, keysRes, epsRes] = await Promise.all([
          supabase.from("bookings").select("id, total_price, status, booking_type, created_at, currency"),
          supabase.from("profiles").select("id"),
          supabase.from("api_keys").select("id").eq("is_active", true),
          supabase.from("service_endpoints").select("id").eq("status", "enabled"),
        ]);

        const allBookings = bookingsRes.data || [];
        const revenue = allBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);

        setStats({ bookings: allBookings.length, users: profilesRes.data?.length || 0, revenue });
        setRecentBookings(allBookings.slice(0, 10));
        setApiKeysCount(keysRes.data?.length || 0);
        setEndpointsCount(epsRes.data?.length || 0);
      } catch {
        toast({ title: "خطأ", description: "تعذر تحميل البيانات", variant: "destructive" });
      }
    };

    const checkIntegrations = async () => {
      try {
        const [amadeus, moyasar] = await Promise.all([isAmadeusConfigured(), isMoyasarConfigured()]);
        setAmadeusOk(amadeus);
        setMoyasarOk(moyasar);
      } catch {
        setAmadeusOk(false);
        setMoyasarOk(false);
      }
    };

    fetchStats();
    checkIntegrations();
  }, []);

  const handleCreateUser = async () => {
    if (!newEmail || !newPassword) return;
    setCreating(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: newEmail,
        password: newPassword,
        options: { data: { full_name: newFullName } },
      });
      if (error) throw error;
      toast({ title: "تم إنشاء المستخدم", description: `تم تسجيل ${newEmail}` });
      setShowCreateUser(false);
      setNewEmail("");
      setNewPassword("");
      setNewFullName("");
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
    setCreating(false);
  };

  const statCards = [
    { icon: CalendarDays, label: "إجمالي الحجوزات", value: stats.bookings.toString(), href: "/admin/bookings" },
    { icon: Users, label: "المستخدمين", value: stats.users.toString(), href: "/admin/users" },
    { icon: DollarSign, label: "الإيرادات", value: `${stats.revenue.toLocaleString()} ر.س`, href: "/admin/reports" },
    { icon: Plane, label: "حجوزات مؤكدة", value: recentBookings.filter(b => b.status === "confirmed").length.toString(), href: "/admin/bookings" },
    { icon: Key, label: "مفاتيح API نشطة", value: apiKeysCount.toString(), href: "/admin/integrations" },
    { icon: Link2, label: "روابط خدمات مفعّلة", value: endpointsCount.toString(), href: "/admin/integrations" },
  ];

  const quickLinks = [
    { label: "إدارة الحجوزات", href: "/admin/bookings", icon: CalendarDays },
    { label: "إدارة المستخدمين", href: "/admin/users", icon: Users },
    { label: "الاتصالات والمفاتيح", href: "/admin/integrations", icon: Key },
    { label: "الصلاحيات والأدوار", href: "/admin/rbac", icon: Shield },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <Button variant="gold" size="sm" onClick={() => setShowCreateUser(true)}>
          <UserPlus className="w-4 h-4 ml-2" /> تسجيل مستخدم جديد
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {statCards.map((stat) => (
          <Link to={stat.href} key={stat.label}>
            <div className="p-6 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/30 transition-all duration-200 group">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Integration Status + Quick Links */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-card border border-border/50">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            حالة التكاملات
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30">
              <span className="text-sm font-medium">Amadeus API</span>
              {amadeusOk === null ? (
                <span className="text-xs text-muted-foreground">جاري الفحص...</span>
              ) : amadeusOk ? (
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> مُهيّأ
                </span>
              ) : (
                <Link to="/admin/integrations"><Button variant="outline" size="sm" className="text-xs">إعداد</Button></Link>
              )}
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30">
              <span className="text-sm font-medium">Moyasar (دفع)</span>
              {moyasarOk === null ? (
                <span className="text-xs text-muted-foreground">جاري الفحص...</span>
              ) : moyasarOk ? (
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> مُهيّأ
                </span>
              ) : (
                <Link to="/admin/integrations"><Button variant="outline" size="sm" className="text-xs">إعداد</Button></Link>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/50">
          <h3 className="font-bold mb-4">وصول سريع</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all text-center group">
                  <link.icon className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">{link.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="p-6 rounded-2xl bg-gradient-card border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">آخر الحجوزات</h2>
          <Link to="/admin/bookings"><Button variant="outline" size="sm" className="text-xs">عرض الكل</Button></Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="text-muted-foreground text-sm">لا توجد حجوزات بعد</p>
        ) : (
          <div className="space-y-2">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30">
                <span className="text-sm font-medium">{b.booking_type}</span>
                <span className="text-sm text-primary">{b.total_price} {b.currency}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${b.status === "confirmed" ? "bg-primary/10 text-primary" : b.status === "pending" ? "bg-yellow-500/10 text-yellow-600" : "bg-destructive/10 text-destructive"}`}>
                  {b.status === "confirmed" ? "مؤكد" : b.status === "pending" ? "قيد الانتظار" : b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create User Dialog */}
      <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تسجيل مستخدم جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>الاسم الكامل</Label>
              <Input value={newFullName} onChange={(e) => setNewFullName(e.target.value)} placeholder="محمد أحمد" className="bg-muted/30" />
            </div>
            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="user@example.com" className="bg-muted/30" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>كلمة المرور</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="أدخل كلمة المرور" className="bg-muted/30" dir="ltr" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCreateUser(false)}>إلغاء</Button>
            <Button variant="gold" onClick={handleCreateUser} disabled={creating || !newEmail || !newPassword}>
              {creating ? "جاري الإنشاء..." : "إنشاء المستخدم"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
