import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Plane, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(100),
  email: z.string().trim().email("بريد إلكتروني غير صالح").max(255),
  phone: z.string().optional(),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse({ name, email, phone, password });
    if (!result.success) {
      toast({ title: "خطأ", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          data: { full_name: result.data.name, phone: result.data.phone },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      toast({
        title: "تم إنشاء الحساب!",
        description: "يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب",
      });
      navigate("/login");
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-background">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
            <Plane className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">إنشاء حساب جديد</h1>
          <p className="text-primary/80 text-sm mt-2">سجّل الآن واستمتع بأفضل عروض السفر</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-card/80 backdrop-blur border border-primary/20 shadow-gold/10 shadow-lg space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">الاسم الكامل *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="محمد أحمد" className="bg-muted/30" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">البريد الإلكتروني *</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" className="bg-muted/30" dir="ltr" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">رقم الهاتف</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+966 5X XXX XXXX" className="bg-muted/30" dir="ltr" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">كلمة المرور *</label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-muted/30 pl-10" dir="ltr" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button variant="gold" className="w-full text-base font-bold py-3" disabled={loading}>
            {loading ? "جاري التسجيل..." : "إنشاء الحساب"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">تسجيل الدخول</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
