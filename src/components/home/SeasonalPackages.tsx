import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";
import hajjImg from "@/assets/seasonal/hajj.jpg";
import ramadanImg from "@/assets/seasonal/ramadan.jpg";
import summerImg from "@/assets/seasonal/summer.jpg";

const packages = [
  {
    title: "عروض رمضان في مكة والمدينة",
    season: "رمضان",
    desc: "باقة روحانية متكاملة تشمل إقامة فاخرة قريبة من الحرمين الشريفين مع خدمات نقل مريحة وإفطار يومي. استمتع بأجواء رمضان الروحانية مع جولات تعريفية للمعالم المقدسة وبرنامج ديني مميز.",
    image: ramadanImg,
    tags: ["إقامة 4 نجوم", "إفطار يومي", "تنقلات داخلية", "جولة للمعالم", "مرشد ديني"],
    price: "2,500",
    href: "/tours",
  },
  {
    title: "برامج الحج المميزة",
    season: "الحج",
    desc: "برامج حج متكاملة بإدارة احترافية تشمل السكن القريب من الحرم والمشاعر المقدسة، مع إعاشة كاملة وخدمات إرشاد ديني متخصصة. نوفر لك تجربة حج آمنة ومريحة بأعلى معايير الجودة والخدمة.",
    image: hajjImg,
    tags: ["سكن قريب من الحرم", "إعاشة كاملة", "خدمة المشاعر", "مرشد ديني معتمد", "حقيبة حاج", "نقل مكيف"],
    price: "7,500",
    href: "/tours",
  },
  {
    title: "مصايف أبها والباحة",
    season: "الصيف",
    desc: "استمتع بالأجواء المعتدلة والطبيعة الخلابة في جنوب المملكة. جولات في منتزه السودة والحبلة مع إقامة فندقية فاخرة وأنشطة عائلية ممتعة تشمل التلفريك والمشي في الغابات.",
    image: summerImg,
    tags: ["إقامة 5 ليالي", "جولات طبيعية", "مرشد محلي", "تنقلات داخلية", "أنشطة عائلية", "وجبات يومية"],
    price: "4,500",
    href: "/tours",
  },
];

export default function SeasonalPackages() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/offers">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 rounded-xl">
              استعرض المواسم
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-2">
              <span className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                عروض مواسم
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">سافر في الموسم المناسب بأفضل قيمة</h2>
            <p className="text-muted-foreground mt-2">باقات مخصصة لرمضان والحج والصيف مع إقامة مريحة وتنقلات وأنشطة بأسعار شفافة.</p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {packages.map((pkg) => (
            <div key={pkg.title} className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-card-hover group">
              <div className="relative h-64 overflow-hidden">
                <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute top-3 right-3">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">{pkg.season}</span>
                </div>
              </div>
              <div className="p-6 text-right">
                <h3 className="text-xl font-bold text-foreground mb-2">{pkg.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{pkg.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {pkg.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <Link to={pkg.href}>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 font-bold">احجز الآن</Button>
                  </Link>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">يبدأ من</p>
                    <p className="text-xl font-bold text-primary">{pkg.price} <span className="text-sm">ر.س</span></p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
