import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const schema = z.object({
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين",
  path: ["confirmPassword"],
});

export default function AdminResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ password, confirmPassword });
    if (!result.success) {
      toast({ title: "خطأ", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: result.data.password });
      if (error) throw error;
      toast({ title: "تم التحديث", description: "تم تغيير كلمة المرور بنجاح" });
      navigate("/admin/login");
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 bg-gradient-hero">
        <div className="w-full max-w-md mx-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
            <LayoutDashboard className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">رابط غير صالح</h1>
          <p className="text-muted-foreground text-sm">يرجى طلب رابط جديد لإعادة تعيين كلمة المرور.</p>
          <Button variant="gold" className="mt-6" onClick={() => navigate("/admin/forgot-password")}>
            طلب رابط جديد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-gradient-hero">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
            <LayoutDashboard className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">تعيين كلمة مرور جديدة</h1>
          <p className="text-muted-foreground text-sm mt-2">أدخل كلمة المرور الجديدة</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-gradient-card border border-border/50 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">كلمة المرور الجديدة</label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-muted/30 pl-10" dir="ltr" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">تأكيد كلمة المرور</label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="bg-muted/30" dir="ltr" />
          </div>
          <Button variant="gold" className="w-full" disabled={loading}>
            {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
          </Button>
        </form>
      </div>
    </div>
  );
}
