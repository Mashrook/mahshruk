import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { logAudit } from "@/lib/auditLog";

const adminLoginSchema = z.object({
  email: z.string().trim().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [lockMinutes, setLockMinutes] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkBruteForce = async (emailVal: string): Promise<boolean> => {
    const cutoff = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("login_attempts")
      .select("id, success, created_at")
      .eq("email", emailVal)
      .gte("created_at", cutoff)
      .order("created_at", { ascending: false });

    if (error || !data) return false;

    // Count consecutive failures (reset on success)
    let failCount = 0;
    for (const attempt of data) {
      if (attempt.success) break;
      failCount++;
    }

    if (failCount >= MAX_ATTEMPTS) {
      const oldest = data[MAX_ATTEMPTS - 1];
      const unlockAt = new Date(new Date(oldest.created_at).getTime() + LOCKOUT_MINUTES * 60 * 1000);
      const remaining = Math.ceil((unlockAt.getTime() - Date.now()) / 60000);
      if (remaining > 0) {
        setLocked(true);
        setLockMinutes(remaining);
        return true;
      }
    }
    return false;
  };

  const recordAttempt = async (emailVal: string, success: boolean) => {
    await supabase.from("login_attempts").insert({
      email: emailVal,
      success,
      ip_address: null,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = adminLoginSchema.safeParse({ email, password });
    if (!result.success) {
      toast({ title: "خطأ", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }

    // Check brute force lockout
    const isLocked = await checkBruteForce(result.data.email);
    if (isLocked) {
      toast({ title: "الحساب مقفل", description: `حاول مرة أخرى بعد ${lockMinutes} دقيقة`, variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
      });
      if (authError) {
        await recordAttempt(result.data.email, false);
        throw authError;
      }

      // Check if user has admin role
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id);

      if (rolesError) throw rolesError;

      const userRoles = roles?.map(r => r.role) || [];
      const isAdmin = userRoles.includes('admin') || userRoles.includes('super_admin');

      if (!isAdmin) {
        await supabase.auth.signOut();
        await recordAttempt(result.data.email, false);
        toast({ title: "غير مصرح", description: "ليس لديك صلاحيات مدير", variant: "destructive" });
        return;
      }

      // Success
      await recordAttempt(result.data.email, true);

      // Create admin session
      await supabase.from("admin_sessions").insert({
        user_id: authData.user.id,
        user_agent: navigator.userAgent,
        ip_address: null,
      });

      // Audit log
      await logAudit({
        action: "login",
        entity_type: "admin_session",
        entity_id: authData.user.id,
      });

      toast({ title: "مرحباً!", description: "تم تسجيل الدخول كمدير" });
      navigate("/admin");
    } catch (err: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: err.message === "Invalid login credentials" ? "بيانات الدخول غير صحيحة" : err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-gradient-hero">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
            <LayoutDashboard className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground text-sm mt-2">دخول المديرين فقط</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-gradient-card border border-border/50 space-y-4">
          {locked && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30">
              <ShieldAlert className="w-5 h-5 text-destructive shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">الحساب مقفل مؤقتاً</p>
                <p className="text-xs text-destructive/80">تم تجاوز عدد المحاولات المسموح. حاول بعد {lockMinutes} دقيقة.</p>
              </div>
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-1 block">البريد الإلكتروني</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@mashroky.com" className="bg-muted/30" dir="ltr" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">كلمة المرور</label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-muted/30 pl-10" dir="ltr" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button variant="gold" className="w-full" disabled={loading || locked}>
            {loading ? "جاري الدخول..." : "دخول"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/admin/forgot-password" className="text-primary font-medium hover:underline">نسيت كلمة المرور؟</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
