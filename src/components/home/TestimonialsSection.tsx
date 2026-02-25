import { Star } from "lucide-react";

const testimonials = [
  {
    name: "أحمد العتيبي",
    location: "الرياض",
    text: "حجزت رحلة عائلية إلى دبي وكانت كل التفاصيل جاهزة — من المطار إلى الفندق والتنقلات. الأسعار شفافة والخدمة احترافية.",
    rating: 5,
  },
  {
    name: "سارة المطيري",
    location: "جدة",
    text: "اخترنا باقة شهر عسل في المالديف وكانت تجربة لا تُنسى. فريق الدعم ساعدنا في كل خطوة باهتمام وخصوصية. شكراً مشروك!",
    rating: 5,
  },
  {
    name: "محمد الشهري",
    location: "الدمام",
    text: "سهولة في الحجز وتأكيد فوري. الباقات شاملة فعلاً وبدون رسوم خفية وقدرت على الباقات الموسمية مبلغاً ممتازاً. أنصح الجميع!",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-sm text-primary font-medium">آراء العملاء</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-2">ثقة عملائنا هي أكبر إنجازاتنا</h2>
          <p className="text-muted-foreground">آراء حقيقية من مسافرين خليجيين جربوا خدماتنا</p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card rounded-2xl border border-border p-6 text-right relative">
              {/* Quote icon */}
              <span className="text-5xl font-serif text-primary/30 absolute top-4 right-6 leading-none">٩٩</span>

              {/* Stars */}
              <div className="flex gap-1 justify-end mb-4 mt-2">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-foreground/90 text-sm leading-relaxed mb-6 mt-2">"{t.text}"</p>

              <div className="border-t border-border pt-4">
                <p className="font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
