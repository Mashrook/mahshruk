import { Layout } from "@/components/layout/Layout";
import { FileText, CheckCircle, AlertTriangle, Scale } from "lucide-react";

export default function Terms() {
  return (
    <Layout>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
            الشروط والأحكام
          </h1>
          <p className="text-primary-foreground/80 mt-3">آخر تحديث: فبراير 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-card rounded-3xl p-8 shadow-card space-y-8 text-muted-foreground leading-relaxed">
            <div>
              <div className="flex items-center gap-3 mb-3 text-foreground">
                <CheckCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">القبول بالشروط</h2>
              </div>
              <p>
                باستخدامك لخدمات مشروك، فإنك توافق على الالتزام بهذه الشروط وعلى سياسات الخصوصية.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3 text-foreground">
                <Scale className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">شروط الحجز</h2>
              </div>
              <ul className="space-y-2">
                <li>• يجب تقديم بيانات صحيحة عند الحجز.</li>
                <li>• الأسعار قابلة للتغيير حتى إتمام الدفع.</li>
                <li>• تأكيد الحجز يعتمد على توفر الخدمة لدى المزود.</li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3 text-foreground">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">المسؤولية</h2>
              </div>
              <ul className="space-y-2">
                <li>• مشروك وسيط بين المستخدم ومزودي الخدمات.</li>
                <li>• يتأكد المستخدم من التأشيرات والشروط الصحية قبل السفر.</li>
                <li>• تخضع جميع الخدمات لشروط مقدميها.</li>
              </ul>
            </div>

            <div className="bg-accent rounded-2xl p-6 text-foreground">
              <p>
                يحتفظ مشروك بالحق في تحديث الشروط عند الحاجة. سيتم إشعار المستخدمين بالتغييرات الجوهرية.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
