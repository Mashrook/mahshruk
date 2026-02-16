import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Car, Bus, Train, Plane, MapPin } from "lucide-react";

const transportOptions = [
  {
    title: "سيارة خاصة مع سائق",
    description: "تنقلات مرنة داخل المدينة مع خيارات استقبال مطار.",
    icon: Car,
  },
  {
    title: "خدمة النقل المشتركة",
    description: "خيارات اقتصادية للمطارات والفنادق والمهرجانات.",
    icon: Bus,
  },
  {
    title: "قطارات داخلية",
    description: "احجز خطوط القطارات بين المدن الكبرى بسهولة.",
    icon: Train,
  },
  {
    title: "رحلات داخلية",
    description: "تنسيق رحلات داخل السعودية ضمن باقات السفر.",
    icon: Plane,
  },
];

export default function Transport() {
  return (
    <Layout>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary-foreground/80">المواصلات</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mt-3">
            تنقل بمرونة في كل مدينة
          </h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
            اختر وسيلة النقل المناسبة وأضفها تلقائيًا إلى رحلتك أو عرضك.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {transportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div key={option.title} className="bg-card rounded-2xl p-6 shadow-card text-center">
                  <div className="w-14 h-14 hero-gradient rounded-2xl flex items-center justify-center text-primary-foreground mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-card mt-12">
            <h2 className="text-2xl font-bold mb-6">نموذج حجز المواصلات</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <input className="h-12 rounded-xl border border-input px-4" placeholder="مدينة الانطلاق" />
              <input className="h-12 rounded-xl border border-input px-4" placeholder="الوجهة" />
              <input className="h-12 rounded-xl border border-input px-4" placeholder="نوع المواصلات" />
              <input className="h-12 rounded-xl border border-input px-4" placeholder="تاريخ الرحلة" />
              <input className="h-12 rounded-xl border border-input px-4" placeholder="عدد الركاب" />
              <input className="h-12 rounded-xl border border-input px-4" placeholder="ملاحظات إضافية" />
            </div>
            <Button variant="hero" className="mt-6">إضافة للمسار</Button>
            <p className="text-xs text-muted-foreground mt-3">
              سيتم إرسال تفاصيل الوصول ونقطة الالتقاء بعد إتمام الدفع مباشرة.
            </p>
          </div>

          <div className="bg-muted rounded-3xl p-8 shadow-card mt-12 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold">تنبيهات الوصول</h3>
              <p className="text-muted-foreground">
                بعد الدفع سنرسل تفاصيل الوصول، موقع التجمع، ووقت التحرك عبر البريد أو واتساب.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
