import { Layout } from "@/components/layout/Layout";

export default function Usage() {
  return (
    <Layout>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary-foreground/80">طريقة الاستخدام</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mt-3">
            دليل استخدام مشروك
          </h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
            خطوات واضحة للحجز وإدارة الطلبات والدفع والمتابعة.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-3xl p-8 shadow-card space-y-6 text-muted-foreground leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">1) إنشاء حساب</h2>
              <p>ابدأ بإنشاء حساب جديد وإدخال بيانات التواصل لتتمكن من إدارة حجوزاتك بسهولة.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">2) اختيار الخدمة</h2>
              <p>اختر من الطيران أو الفنادق أو العروض أو النشاطات، وحدد وجهتك ومدة الرحلة.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">3) إضافة الخدمات</h2>
              <p>يمكنك إضافة الفندق أو المواصلات أو التأمين حسب رغبتك من نفس الصفحة.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">4) الدفع</h2>
              <p>ادفع عبر Samsung Pay أو Apple Pay أو البطاقات البنكية من خلال منصة دفع آمنة.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">5) استلام التذاكر</h2>
              <p>سيتم إرسال التذكرة وخطة الرحلة على بريدك الإلكتروني أو عبر واتساب.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
