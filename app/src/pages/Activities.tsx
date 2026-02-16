import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Ticket, MapPin, Users } from "lucide-react";

const activities = [
  {
    id: 1,
    title: "مهرجان البحر الأحمر",
    location: "جدة",
    category: "مهرجانات",
    price: "450",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
  },
  {
    id: 2,
    title: "سباق الصحارى",
    location: "العُلا",
    category: "مغامرات",
    price: "650",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
  },
  {
    id: 3,
    title: "كرنفال الرياض",
    location: "الرياض",
    category: "فعاليات",
    price: "300",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200",
  },
  {
    id: 4,
    title: "رحلة غوص خاصة",
    location: "البحر الأحمر",
    category: "أنشطة بحرية",
    price: "900",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
  },
];

export default function Activities() {
  return (
    <Layout>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary-foreground/80">النشاطات والمهرجانات</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mt-3">
            احجز نشاطك المفضل بسهولة
          </h1>
          <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
            اختر المهرجان أو المسابقة أو النشاط، وأضف الطيران والفندق والمواصلات حسب رغبتك.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-3xl p-8 shadow-card mb-12">
            <h2 className="text-2xl font-bold mb-6">نموذج حجز النشاط</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <input className="h-12 rounded-xl border border-input px-4" placeholder="اختر النشاط أو المهرجان" />
              <input className="h-12 rounded-xl border border-input px-4" placeholder="فئة التذكرة" />
              <input className="h-12 rounded-xl border border-input px-4" placeholder="عدد الأشخاص" />
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <input className="h-12 rounded-xl border border-input px-4" placeholder="إضافة الطيران" />
              <input className="h-12 rounded-xl border border-input px-4" placeholder="إضافة الفندق" />
              <input className="h-12 rounded-xl border border-input px-4" placeholder="إضافة المواصلات" />
            </div>
            <Button variant="hero" className="mt-6">إضافة للسلة</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-card rounded-2xl overflow-hidden shadow-card">
                <div className="h-48 overflow-hidden">
                  <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <span className="text-xs text-secondary font-semibold">{activity.category}</span>
                  <h3 className="text-lg font-bold mt-2">{activity.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4" /> {activity.location}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-lg font-bold text-primary">{activity.price} ر.س</p>
                    <Button variant="hero" size="sm">احجز</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl p-6 shadow-card text-center">
            <CalendarCheck className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">تنبيهات الحضور</h4>
            <p className="text-sm text-muted-foreground">إشعارات فورية بوقت وموقع الفعالية.</p>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-card text-center">
            <Ticket className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">تذاكر رقمية</h4>
            <p className="text-sm text-muted-foreground">إرسال التذكرة عبر البريد أو واتساب.</p>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-card text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">خدمة مخصصة</h4>
            <p className="text-sm text-muted-foreground">اختيارات للعائلة والمجموعات الخاصة.</p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 text-center text-sm text-muted-foreground">
          بعد الدفع سيتم إرسال تفاصيل الموقع وطريقة الوصول مع الإحداثيات عبر البريد أو واتساب.
        </div>
      </section>
    </Layout>
  );
}
