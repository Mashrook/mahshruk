import { Layout } from "@/components/layout/Layout";

export default function Cookies() {
  return (
    <Layout>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary-foreground/80">سياسة الكوكيز</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mt-3">
            استخدام ملفات تعريف الارتباط
          </h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
            نستخدم الكوكيز لتحسين تجربة المستخدم وتحليل الأداء.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-3xl p-8 shadow-card space-y-6 text-muted-foreground leading-relaxed">
            <p>
              ملفات تعريف الارتباط (Cookies) هي ملفات صغيرة تُخزن على جهازك لمساعدتنا على تحسين
              تجربة الاستخدام وتذكر تفضيلاتك.
            </p>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">أنواع الكوكيز</h2>
              <ul className="space-y-2">
                <li>• كوكيز أساسية: لضمان عمل الموقع والتطبيق بشكل صحيح.</li>
                <li>• كوكيز تحليلية: لفهم سلوك المستخدم وتحسين الواجهة.</li>
                <li>• كوكيز تفضيلات: لحفظ اللغة والخيارات المفضلة.</li>
              </ul>
            </div>
            <p>
              يمكنك تعطيل الكوكيز من إعدادات المتصفح، لكن قد تتأثر بعض وظائف التطبيق.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
