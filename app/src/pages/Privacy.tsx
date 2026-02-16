import { Layout } from "@/components/layout/Layout";
import { Shield, Lock, Database, Eye, UserCheck } from "lucide-react";

export default function Privacy() {
  return (
    <Layout>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
            سياسة الخصوصية
          </h1>
          <p className="text-primary-foreground/80 mt-3">آخر تحديث: فبراير 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-card rounded-3xl p-8 shadow-card space-y-8 text-muted-foreground leading-relaxed">
            <div>
              <div className="flex items-center gap-3 mb-3 text-foreground">
                <Lock className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">مقدمة</h2>
              </div>
              <p>
                نلتزم في مشروك بحماية بيانات المستخدمين واستخدامها وفق أعلى معايير الأمان
                وبما يتوافق مع الأنظمة المعمول بها.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3 text-foreground">
                <Database className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">البيانات التي نجمعها</h2>
              </div>
              <ul className="space-y-2">
                <li>• بيانات الحساب (الاسم، البريد، رقم الجوال).</li>
                <li>• بيانات الحجز (الوجهة، التواريخ، عدد المسافرين).</li>
                <li>• بيانات الدفع عبر بوابات آمنة ومشفرة.</li>
                <li>• بيانات الاستخدام لتحسين تجربة التطبيق.</li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3 text-foreground">
                <Eye className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">كيف نستخدم بياناتك</h2>
              </div>
              <ul className="space-y-2">
                <li>• تنفيذ الحجوزات وتأكيدها.</li>
                <li>• إرسال إشعارات مهمة متعلقة بالرحلة.</li>
                <li>• تخصيص العروض والمحتوى وفق تفضيلاتك.</li>
                <li>• تحسين جودة الخدمة وتجربة المستخدم.</li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3 text-foreground">
                <UserCheck className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">حقوق المستخدم</h2>
              </div>
              <ul className="space-y-2">
                <li>• تحديث بياناتك في أي وقت.</li>
                <li>• طلب حذف الحساب وفق الشروط النظامية.</li>
                <li>• التحكم في الرسائل التسويقية.</li>
              </ul>
            </div>

            <div className="bg-accent rounded-2xl p-6 text-foreground">
              <p>
                لأي استفسار عن سياسة الخصوصية يمكنك التواصل معنا عبر:
                <br />
                البريد الإلكتروني: ibrahemest@outlook.sa
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
