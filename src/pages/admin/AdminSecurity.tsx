import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { logAudit } from "@/lib/auditLog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield, Loader2, Smartphone, KeyRound, Lock } from "lucide-react";

interface TwoFAStatus {
  id: string;
  is_enabled: boolean;
  method: string;
  enabled_at: string | null;
}

export default function AdminSecurity() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [twoFA, setTwoFA] = useState<TwoFAStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchTwoFA();
  }, [user]);

  const fetchTwoFA = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("admin_2fa")
      .select("id, is_enabled, method, enabled_at")
      .eq("user_id", user!.id)
      .maybeSingle();
    setTwoFA(data as TwoFAStatus | null);
    setLoading(false);
  };

  const toggle2FA = async () => {
    if (!user) return;
    setToggling(true);
    try {
      const newState = !twoFA?.is_enabled;

      if (!twoFA) {
        // Create 2FA record
        const { error } = await supabase.from("admin_2fa").insert({
          user_id: user.id,
          is_enabled: true,
          method: "totp",
          enabled_at: new Date().toISOString(),
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("admin_2fa")
          .update({
            is_enabled: newState,
            enabled_at: newState ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", twoFA.id);
        if (error) throw error;
      }

      await logAudit({
        action: newState ? "2fa_enable" : "2fa_disable",
        entity_type: "admin_2fa",
        entity_id: user.id,
      });

      toast({ title: "تم", description: newState ? "تم تفعيل المصادقة الثنائية" : "تم تعطيل المصادقة الثنائية" });
      fetchTwoFA();
    } catch {
      toast({ title: "خطأ", description: "تعذر تحديث حالة المصادقة الثنائية", variant: "destructive" });
    }
    setToggling(false);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">إعدادات الأمان</h1>
      </div>

      <div className="space-y-6">
        {/* 2FA Section */}
        <div className="rounded-2xl bg-card border border-border/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">المصادقة الثنائية (2FA)</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            أضف طبقة حماية إضافية لحسابك عبر تطبيق المصادقة مثل Google Authenticator.
          </p>

          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${twoFA?.is_enabled ? "bg-green-500/10" : "bg-muted"}`}>
                  <KeyRound className={`w-5 h-5 ${twoFA?.is_enabled ? "text-green-500" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="font-medium text-sm">TOTP Authenticator</p>
                  <p className="text-xs text-muted-foreground">
                    {twoFA?.is_enabled
                      ? `مفعّل منذ ${twoFA.enabled_at ? new Date(twoFA.enabled_at).toLocaleDateString("ar-SA") : ""}`
                      : "غير مفعّل"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={twoFA?.is_enabled || false}
                  onCheckedChange={toggle2FA}
                  disabled={toggling}
                />
                {toggling && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
            </div>
          )}

          {twoFA?.is_enabled && (
            <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-xs text-primary">
                ⚠️ هذا نموذج أولي (Placeholder). في الإصدار النهائي سيتم ربطه بتطبيق TOTP فعلي مع رموز QR وأكواد احتياطية.
              </p>
            </div>
          )}
        </div>

        {/* Brute Force Info */}
        <div className="rounded-2xl bg-card border border-border/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">حماية تسجيل الدخول</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
              <div>
                <p className="font-medium text-sm">قفل الحساب بعد محاولات فاشلة</p>
                <p className="text-xs text-muted-foreground">يتم قفل تسجيل الدخول بعد 5 محاولات فاشلة لمدة 15 دقيقة</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-500 font-medium">مفعّل</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
              <div>
                <p className="font-medium text-sm">تسجيل محاولات الدخول</p>
                <p className="text-xs text-muted-foreground">يتم حفظ جميع محاولات الدخول الناجحة والفاشلة</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-500 font-medium">مفعّل</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
              <div>
                <p className="font-medium text-sm">تسجيل جلسات المشرفين</p>
                <p className="text-xs text-muted-foreground">كل تسجيل دخول ينشئ جلسة قابلة للمراقبة والإنهاء</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-500 font-medium">مفعّل</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
