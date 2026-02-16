import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Trash2, CreditCard, ShieldCheck } from "lucide-react";

const cartItems = [
  {
    id: 1,
    title: "باقة شتاء دبي المشرق",
    details: "4 ليالٍ • طيران + فندق + جولة المدينة",
    price: "2,950",
  },
  {
    id: 2,
    title: "نشاط: رحلة غوص خاصة",
    details: "البحر الأحمر • تذكرتان • شامل المواصلات",
    price: "900",
  },
];

export default function Cart() {
  return (
    <Layout>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary-foreground/80">سلة المشتريات</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mt-3">
            راجع طلبك قبل الدفع
          </h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
            أضف أو عدّل الخدمات قبل إتمام الدفع النهائي.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-card rounded-2xl p-6 shadow-card flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.details}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold text-primary">{item.price} ر.س</p>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Trash2 className="w-4 h-4" />
                    حذف
                  </Button>
                </div>
              </div>
            ))}

            <div className="bg-muted rounded-2xl p-6 shadow-card">
              <h4 className="font-semibold mb-2">كوبون خصم</h4>
              <div className="flex gap-3">
                <input className="h-11 rounded-xl border border-input px-4 flex-1" placeholder="أدخل الكود" />
                <Button variant="outline">تفعيل</Button>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-card">
            <h3 className="text-xl font-bold mb-6">ملخص الدفع</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>الإجمالي الفرعي</span>
                <span>3,850 ر.س</span>
              </div>
              <div className="flex items-center justify-between">
                <span>خصم موسمي</span>
                <span>-150 ر.س</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-foreground">
                <span>الإجمالي النهائي</span>
                <span>3,700 ر.س</span>
              </div>
            </div>
            <Button variant="hero" className="mt-6 w-full gap-2">
              <CreditCard className="w-5 h-5" />
              المتابعة للدفع
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
              <ShieldCheck className="w-4 h-4 text-primary" />
              الدفع آمن ومشفر عبر منصة ميسر.
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
