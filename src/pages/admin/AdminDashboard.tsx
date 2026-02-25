import { useState, useEffect } from "react";
import {
  Users,
  Plane,
  CalendarDays,
  DollarSign,
  Shield,
  Search,
  Crown,
  User,
  Loader2,
  Check,
  X,
  UserPlus,
  BarChart3,
  Activity,
  Settings,
  Eye,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface UserWithRole {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  role: string;
}

interface BookingStats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    total: 0, confirmed: 0, pending: 0, cancelled: 0, revenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const { toast } = useToast();
  const { user: currentUser } = useAuthStore();

  // New user form
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "user",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profilesRes, bookingsRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("bookings").select("id, total_price, status, booking_type, created_at, currency, user_id"),
        supabase.from("user_roles").select("*"),
      ]);

      const profiles = profilesRes.data || [];
      const roles = rolesRes.data || [];
      const usersWithRoles: UserWithRole[] = profiles.map((p) => {
        const userRole = roles.find((r: any) => r.user_id === p.id);
        return {
          id: p.id,
          email: p.email || null,
          full_name: p.full_name,
          avatar_url: p.avatar_url,
          created_at: p.created_at,
          role: userRole?.role || "user",
        };
      });
      setUsers(usersWithRoles);

      const allBookings = bookingsRes.data || [];
      const revenue = allBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
      setBookingStats({
        total: allBookings.length,
        confirmed: allBookings.filter((b) => b.status === "confirmed").length,
        pending: allBookings.filter((b) => b.status === "pending").length,
        cancelled: allBookings.filter((b) => b.status === "cancelled").length,
        revenue,
      });
      setRecentBookings(allBookings.slice(0, 10));
    } catch {
      toast({ title: "خطأ", description: "تعذر تحميل البيانات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === currentUser?.id) {
      toast({ title: "تحذير", description: "لا يمكنك تغيير دورك الخاص", variant: "destructive" });
      return;
    }
    setUpdatingRole(userId);
    try {
      const { error } = await supabase
        .from("user_roles")
        .upsert({ user_id: userId, role: newRole }, { onConflict: "user_id" });
      if (error) throw error;
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      toast({ title: "تم التحديث", description: "تم تغيير دور المستخدم بنجاح" });
    } catch {
      toast({ title: "خطأ", description: "فشل في تحديث الدور", variant: "destructive" });
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserForm.email || !newUserForm.password || !newUserForm.fullName) {
      toast({ title: "خطأ", description: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    if (newUserForm.password.length < 8) {
      toast({ title: "خطأ", description: "كلمة المرور يجب أن تكون 8 أحرف على الأقل", variant: "destructive" });
      return;
    }
    setCreatingUser(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserForm.email,
        password: newUserForm.password,
        options: { data: { full_name: newUserForm.fullName } },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("فشل في إنشاء المستخدم");

      if (newUserForm.role !== "user") {
        await supabase
          .from("user_roles")
          .upsert({ user_id: authData.user.id, role: newUserForm.role }, { onConflict: "user_id" });
      }

      toast({ title: "تم بنجاح", description: "تم إنشاء المستخدم بنجاح" });
      setIsAddUserOpen(false);
      setNewUserForm({ email: "", password: "", fullName: "", role: "user" });
      fetchData();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message || "فشل في إنشاء المستخدم", variant: "destructive" });
    } finally {
      setCreatingUser(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Crown className="w-4 h-4 text-yellow-500" />;
      case "super_admin": return <Shield className="w-4 h-4 text-red-500" />;
      default: return <User className="w-4 h-4 text-green-400" />;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin": return "bg-yellow-500/20 text-yellow-500";
      case "super_admin": return "bg-red-500/20 text-red-500";
      default: return "bg-green-500/20 text-green-400";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "مدير";
      case "super_admin": return "مدير أعلى";
      default: return "مستخدم";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  const statusLabels: Record<string, string> = {
    confirmed: "مؤكد", pending: "قيد الانتظار", cancelled: "ملغي", completed: "مكتمل",
  };

  const bookingTypeLabels: Record<string, string> = {
    flight: "رحلة طيران", hotel: "فندق", car: "سيارة", tour: "جولة", transfer: "تحويل",
  };

  const quickLinks = [
    { icon: CalendarDays, label: "الحجوزات", href: "/admin/bookings", desc: "إدارة جميع الحجوزات", count: bookingStats.total },
    { icon: Users, label: "المستخدمين", href: "/admin/users", desc: "إدارة المستخدمين والأدوار", count: users.length },
    { icon: BarChart3, label: "التقارير", href: "/admin/reports", desc: "تقارير وتحليلات مفصلة" },
    { icon: Activity, label: "صحة النظام", href: "/admin/health", desc: "مراقبة الخدمات" },
    { icon: Shield, label: "الأمان", href: "/admin/security", desc: "إعدادات الأمان والحماية" },
    { icon: Settings, label: "الإعدادات", href: "/admin/settings", desc: "إعدادات النظام" },
  ];

  const statCards = [
    { icon: CalendarDays, label: "إجمالي الحجوزات", value: bookingStats.total.toString(), color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: Users, label: "المستخدمين", value: users.length.toString(), color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: DollarSign, label: "الإيرادات", value: `${bookingStats.revenue.toLocaleString()} ر.س`, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { icon: Check, label: "حجوزات مؤكدة", value: bookingStats.confirmed.toString(), color: "text-green-500", bg: "bg-green-500/10" },
    { icon: Loader2, label: "قيد الانتظار", value: bookingStats.pending.toString(), color: "text-orange-500", bg: "bg-orange-500/10" },
    { icon: X, label: "ملغية", value: bookingStats.cancelled.toString(), color: "text-red-500", bg: "bg-red-500/10" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground text-sm mt-1">نظرة عامة على النظام وإدارة المستخدمين</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 ml-2" />
              إضافة مستخدم
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة مستخدم جديد</DialogTitle>
              <DialogDescription>إنشاء حساب مستخدم جديد في النظام</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>الاسم الكامل</Label>
                <Input value={newUserForm.fullName} onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })} placeholder="أدخل الاسم الكامل" />
              </div>
              <div>
                <Label>البريد الإلكتروني</Label>
                <Input type="email" value={newUserForm.email} onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })} placeholder="example@email.com" dir="ltr" />
              </div>
              <div>
                <Label>كلمة المرور</Label>
                <Input type="password" value={newUserForm.password} onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })} placeholder="8 أحرف على الأقل" dir="ltr" />
              </div>
              <div>
                <Label>الدور</Label>
                <Select value={newUserForm.role} onValueChange={(v) => setNewUserForm({ ...newUserForm, role: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">مستخدم</SelectItem>
                    <SelectItem value="admin">مدير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>إلغاء</Button>
              <Button onClick={handleCreateUser} disabled={creatingUser}>
                {creatingUser ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <UserPlus className="w-4 h-4 ml-2" />}
                إنشاء
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="p-4 rounded-2xl bg-gradient-card border border-border/50">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Navigation */}
      <div>
        <h2 className="font-bold text-lg mb-4">الوصول السريع</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <div className="group p-4 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/30 transition-all text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <link.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{link.label}</h3>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
                {link.count !== undefined && (
                  <span className="text-lg font-bold text-primary mt-1 block">{link.count}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Users Management */}
      <div className="p-6 rounded-2xl bg-gradient-card border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">إدارة المستخدمين</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو البريد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 w-60 bg-muted/30"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="كل الأدوار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأدوار</SelectItem>
                <SelectItem value="user">مستخدم</SelectItem>
                <SelectItem value="admin">مدير</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-right border-b border-border/50">
                <th className="pb-3 text-xs font-semibold text-muted-foreground">المستخدم</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground">البريد</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground">الدور</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground">تاريخ الانضمام</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground">تغيير الدور</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredUsers.slice(0, 20).map((u) => (
                <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {getRoleIcon(u.role)}
                      </div>
                      <span className="font-medium text-sm">{u.full_name || "—"}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground" dir="ltr">{u.email || "—"}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getRoleBadgeClass(u.role)}`}>
                      {getRoleIcon(u.role)}
                      {getRoleLabel(u.role)}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{formatDate(u.created_at)}</td>
                  <td className="py-3">
                    {u.id !== currentUser?.id ? (
                      <Select
                        value={u.role}
                        onValueChange={(val) => handleRoleChange(u.id, val)}
                        disabled={updatingRole === u.id}
                      >
                        <SelectTrigger className="w-28 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">مستخدم</SelectItem>
                          <SelectItem value="admin">مدير</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-xs text-muted-foreground">أنت</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">لا يوجد مستخدمين مطابقين</p>
          )}
          {filteredUsers.length > 20 && (
            <div className="text-center pt-4">
              <Link to="/admin/users">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 ml-2" />
                  عرض جميع المستخدمين ({filteredUsers.length})
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="p-6 rounded-2xl bg-gradient-card border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">آخر الحجوزات</h2>
          <Link to="/admin/bookings">
            <Button variant="link" size="sm">عرض الكل</Button>
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">لا توجد حجوزات بعد</p>
        ) : (
          <div className="space-y-2">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plane className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">{bookingTypeLabels[b.booking_type] || b.booking_type}</span>
                    <p className="text-xs text-muted-foreground">{formatDate(b.created_at)}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-primary">{b.total_price} {b.currency}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  b.status === "confirmed" ? "bg-green-500/10 text-green-500" :
                  b.status === "pending" ? "bg-orange-500/10 text-orange-500" :
                  "bg-red-500/10 text-red-500"
                }`}>
                  {statusLabels[b.status] || b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
