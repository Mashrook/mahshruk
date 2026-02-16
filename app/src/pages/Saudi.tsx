import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";
import { saudiHighlights, saudiHeritage } from "@/data/content";

export default function Saudi() {
  return (
    <Layout>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary-foreground/80">السياحة في السعودية</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mt-3">
            اكتشف جمال المملكة
          </h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
            وجهات متنوعة تجمع بين التراث العريق والطبيعة الخلابة والمشاريع السياحية الحديثة.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10">
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <h2 className="text-2xl font-bold mb-4">لماذا السعودية؟</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• تنوع جغرافي من الشواطئ إلى الجبال والصحارى.</li>
                  <li>• مواقع تاريخية مسجلة ضمن التراث العالمي.</li>
                  <li>• تجارب ثقافية وأسواق شعبية ومطابخ محلية مميزة.</li>
                  <li>• مواسم وفعاليات على مدار العام تناسب العائلات والأصدقاء.</li>
                </ul>
              </div>
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="text-xl font-bold mb-4">مواقع تراث عالمي في المملكة</h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  {saudiHeritage.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-secondary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-3xl p-8 shadow-card">
              <h3 className="text-xl font-bold mb-4">نصائح موسم السفر</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="bg-card rounded-xl p-4 shadow-soft">
                  <p className="font-semibold text-foreground">الشتاء والربيع</p>
                  <p>أفضل وقت لزيارة العُلا والدرعية والرياض للاستمتاع بالطقس المعتدل.</p>
                </div>
                <div className="bg-card rounded-xl p-4 shadow-soft">
                  <p className="font-semibold text-foreground">الصيف</p>
                  <p>توجه إلى أبها وعسير للأجواء الجبلية الباردة نسبياً.</p>
                </div>
                <div className="bg-card rounded-xl p-4 shadow-soft">
                  <p className="font-semibold text-foreground">على مدار العام</p>
                  <p>سواحل البحر الأحمر مثالية للغوص والمنتجعات الفاخرة.</p>
                </div>
              </div>
              <Button variant="hero" className="mt-6 w-full">خطط لرحلتك داخل السعودية</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            أفضل الوجهات السعودية لهذا الموسم
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {saudiHighlights.map((dest) => (
              <div key={dest.title} className="bg-card rounded-2xl overflow-hidden shadow-card">
                <div className="h-48 overflow-hidden">
                  <img src={dest.image} alt={dest.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{dest.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{dest.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
