import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Plane,
  ArrowLeft,
} from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "البريد الإلكتروني غير صحيح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
});

const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل" }).max(100, { message: "الاسم طويل جداً" }),
    email: z.string().trim().email({ message: "البريد الإلكتروني غير صحيح" }),
    password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/profile");
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: "خطأ في تسجيل الدخول",
            description:
              error.message === "Invalid login credentials"
                ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
                : error.message,
            variant: "destructive",
          });
        } else {
          toast({ title: "تم تسجيل الدخول بنجاح", description: "مرحباً بك في مشروك!" });
          navigate("/profile");
        }
      } else {
        const result = signupSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) {
          toast({
            title: "خطأ في إنشاء الحساب",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "تم إنشاء الحساب بنجاح",
            description: "تم إرسال رابط التأكيد إلى بريدك الإلكتروني",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-screen bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
              العودة للرئيسية
            </Button>

            <div className="bg-card rounded-2xl p-8 shadow-hover">
              <div className="text-center mb-8">
                <div className="w-16 h-16 hero-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plane className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold">{isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}</h1>
                <p className="text-muted-foreground mt-2">
                  {isLogin ? "أدخل بياناتك للوصول إلى حسابك" : "أنشئ حسابك للاستمتاع بخدماتنا"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">الاسم الكامل</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="أدخل اسمك الكامل"
                        className="pr-10"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      className="pr-10"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10 pl-10"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                  {loading ? "جاري التحميل..." : isLogin ? "تسجيل الدخول" : "إنشاء الحساب"}
                </Button>
              </form>

              <div className="text-center mt-6">
                <p className="text-muted-foreground">
                  {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                      setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
                    }}
                    className="text-primary font-semibold hover:underline"
                  >
                    {isLogin ? "سجل الآن" : "سجل دخولك"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
