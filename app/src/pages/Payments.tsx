import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CreditCard, ShieldCheck, Key, CheckCircle } from "lucide-react";

const paymentMethods = [
  "Samsung Pay",
  "Apple Pay",
  "مدى",
  "Visa",
  "Mastercard",
];

export default function Payments() {
  return (
    <Layout>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary-foreground/80">المدفوعات</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mt-3">
            دفع آمن ومباشر
          </h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
            بوابات دفع متعددة مع لوحة تحكم لإدارة مفاتيح التكامل وصلاحيات الفريق.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10">
            <div className="bg-card rounded-3xl p-8 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-7 h-7 text-primary" />
                <h2 className="text-2xl font-bold">طرق الدفع المتاحة</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {paymentMethods.map((method) => (
                  <span key={method} className="px-4 py-2 rounded-full bg-muted text-sm font-semibold">
                    {method}
                  </span>
                ))}
              </div>
              <div className="mt-8 grid md:grid-cols-2 gap-4">
                <div className="bg-muted rounded-2xl p-5">
                  <ShieldCheck className="w-6 h-6 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">أمان متقدم</h3>
                  <p className="text-sm text-muted-foreground">تشفير المدفوعات ومراقبة العمليات لحماية المستخدمين.</p>
                </div>
                <div className="bg-muted rounded-2xl p-5">
                  <Key className="w-6 h-6 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">إدارة API Key</h3>
                  <p className="text-sm text-muted-foreground">تحكم في مفاتيح الربط مع مزود الدفع من لوحة الإدارة.</p>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-3xl p-8 shadow-card">
              <h3 className="text-xl font-bold mb-4">تكامل منصة ميسر</h3>
              <p className="text-muted-foreground mb-6">
                اربط منصة الدفع مباشرة من لوحة التحكم وحدد صلاحيات الموظفين لإدارة العمليات.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  دعم الدفع المباشر وبطاقات الائتمان.
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  إدارة استرداد المبالغ من نفس اللوحة.
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  تقارير فورية عن المدفوعات والطلبات.
                </div>
              </div>
              <Button variant="hero" className="mt-6 w-full">إعداد بوابة الدفع</Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
