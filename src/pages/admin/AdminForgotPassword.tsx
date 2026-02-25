import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("بريد إلكتروني غير صالح"),
});

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ email });
    if (!result.success) {
      toast({ title: "خطأ", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(result.data.email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast({ title: "تم الإرسال", description: "تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور" });
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
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
          <h1 className="text-2xl font-bold">استعادة كلمة المرور</h1>
          <p className="text-muted-foreground text-sm mt-2">أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور</p>
        </div>

        {sent ? (
          <div className="p-6 rounded-2xl bg-gradient-card border border-border/50 space-y-4 text-center">
            <p className="text-foreground">تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.</p>
            <p className="text-sm text-muted-foreground">يرجى التحقق من صندوق الوارد واتباع التعليمات.</p>
            <Link to="/admin/login">
              <Button variant="outline" className="mt-4 gap-2">
                <ArrowRight className="w-4 h-4" />
                العودة لتسجيل الدخول
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-gradient-card border border-border/50 space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">البريد الإلكتروني</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@mashroky.com" className="bg-muted/30" dir="ltr" />
            </div>
            <Button variant="gold" className="w-full" disabled={loading}>
              {loading ? "جاري الإرسال..." : "إرسال رابط الاستعادة"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link to="/admin/login" className="text-primary font-medium hover:underline">العودة لتسجيل الدخول</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
