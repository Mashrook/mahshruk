import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, UserPlus } from "lucide-react";

export default function Register() {
  return (
    <Layout>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary-foreground/80">تسجيل مستخدم جديد</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mt-3">
            أنشئ حسابك في مشروك
          </h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
            حساب واحد للوصول إلى العروض، الحجوزات، والمتابعة عبر لوحة المستخدم.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div className="bg-card rounded-3xl p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-6">بيانات الحساب</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="الاسم الكامل" />
              <Input placeholder="رقم الجوال" />
              <Input type="email" placeholder="البريد الإلكتروني" />
              <Input type="password" placeholder="كلمة المرور" />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Input placeholder="المدينة" />
              <Input placeholder="الدولة" />
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" />
                أوافق على الشروط والأحكام وسياسات الخصوصية.
              </label>
            </div>
            <Button variant="hero" className="mt-6 gap-2">
              <UserPlus className="w-5 h-5" />
              إنشاء حساب
            </Button>
          </div>

          <div className="bg-muted rounded-3xl p-8 shadow-card">
            <h3 className="text-xl font-bold mb-4">مزايا الحساب</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              {[
                "متابعة الحجوزات والفواتير بسهولة.",
                "حفظ تفضيلات السفر والعروض المفضلة.",
                "إشعارات فورية بالعروض الموسمية.",
                "إمكانية التواصل السريع مع المساعد الذكي.",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
