import { Layout } from "@/components/layout/Layout";

export default function Refund() {
  return (
    <Layout>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary-foreground/80">سياسة الاسترجاع</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mt-3">
            الاسترجاع والإلغاء
          </h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
            نوضح لك آلية الاسترجاع بحسب نوع الخدمة ومواعيد الإلغاء.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-3xl p-8 shadow-card space-y-6 text-muted-foreground leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">1) الحجوزات القابلة للاسترجاع</h2>
              <p>يمكن استرجاع كامل المبلغ إذا تم الإلغاء ضمن الفترة المحددة لكل خدمة.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">2) الحجوزات غير القابلة للاسترجاع</h2>
              <p>تخضع لشروط مزود الخدمة، وقد لا تكون مؤهلة للاسترداد.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">3) رسوم التعديل</h2>
              <p>قد تطبق رسوم عند تغيير التواريخ أو الأسماء حسب سياسة الناقل أو الفندق.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">4) طرق الاسترجاع</h2>
              <p>يتم رد المبالغ عبر نفس وسيلة الدفع خلال الفترة المحددة من مزود الدفع.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
