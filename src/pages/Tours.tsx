import { useState } from "react";
import { Sparkles, Check, Calendar, MapPin, Clock, Users, Star, ChevronLeft, Plane, Hotel, Bus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

import hajjImg from "@/assets/seasonal/hajj-programs.jpg";
import ramadanImg from "@/assets/seasonal/ramadan-offers.jpg";
import summerImg from "@/assets/seasonal/summer-abha.jpg";

interface SeasonProgram {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  tagColor: string;
  price: number;
  currency: string;
  features: string[];
  highlights: string[];
  duration: string;
}

const programs: SeasonProgram[] = [
  {
    id: "hajj",
    title: "برامج الحج المميزة",
    subtitle: "باقات حج متكاملة من حجز الطيران إلى السكن مع خدمات نقل وإعاشة — بيئة مخصصة لراحة الحاج. معتمد من وزارة الحج والعمرة.",
    image: hajjImg,
    tag: "حجّ",
    tagColor: "bg-amber-500/20 text-amber-400",
    price: 7500,
    currency: "ر.س",
    features: ["سكن قريب من الحرم", "نقل مكيّف", "إعاشة كاملة", "مرشد ديني"],
    highlights: ["مسار شخصي مرن", "دعم طبي 24/7", "مظلات وتبريد", "فريق مساعد"],
    duration: "حسب البرنامج",
  },
  {
    id: "ramadan",
    title: "عروض رمضان في مكة والمدينة",
    subtitle: "باقات عمرة مميزة خلال شهر رمضان المبارك. إقامة قريبة من الحرمين مع خدمات نقل وإعاشة. استمتع بأجواء روحانية فريدة مع عروض مخفضة لجميع الأعمار.",
    image: ramadanImg,
    tag: "رمضان",
    tagColor: "bg-emerald-500/20 text-emerald-400",
    price: 2500,
    currency: "ر.س",
    features: ["إقامة قريبة من الحرم", "إفطار وسحور يومي", "نقل من/إلى المطار", "جولات دينية"],
    highlights: ["حجز مبكر أوفر", "عائلات وأفراد", "دعم متواصل", "رحلة تاريخية"],
    duration: "حسب الاختيار",
  },
  {
    id: "summer",
    title: "مصايف أبها والباحة",
    subtitle: "استمتع بالأجواء الجبلية المعتدلة والطبيعة الخلابة في جنوب المملكة. جولات في مرتفعات السودة والباحة مع إقامة فاخرة وأنشطة متنوعة.",
    image: summerImg,
    tag: "صيف",
    tagColor: "bg-blue-500/20 text-blue-400",
    price: 4500,
    currency: "ر.س",
    features: ["إقامة 4 ليالٍ", "جولات جبلية", "زيارة متنزهات", "تلفريك"],
    highlights: ["طقس معتدل", "طبيعة خلابة", "أنشطة عائلية", "مأكولات محلية"],
    duration: "5 أيام / 4 ليالٍ",
  },
];

const whyChooseUs = [
  "باقات فريدة ترضي جميع العائلات مع خيارات الإقامة الفاخرة والأنشطة المتنوعة",
  "تنسيق مثالي للرحلات الداخلية والدولية من مكان واحد مريح",
  "خدمات إضافية مثل التأمين والمطاعم وإنشاء جداول زمنية خاصة",
  "أسعار تنافسية بدون رسوم مخفية — قيمة حقيقية لكل ريال",
];

const seasonHighlights = [
  "برامج رمضان المبتدئة والمحترفة والمتطورة / أجواء روحانية مميزة",
  "صيف مشروك يشمل جميع مناطق المملكة الجنوبية — أبها، الباحة، الطائف",
];

export default function Tours() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/80 via-primary/50 to-background pt-10 pb-14">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-primary-foreground/70 text-sm mb-2">مواسم مشروك المميزة</p>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-3">
            سافر في الوقت المناسب بأفضل قيمة
          </h1>
          <p className="text-primary-foreground/80 text-sm lg:text-base max-w-2xl mx-auto">
            برامج رمضان والحج والإجازة الصيفية وموسم الشتاء — باقات متكاملة للإقامة والنقل والخدمات تناسب العائلة الخليجية
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 -mt-4">
        {/* Top Grid: Why Choose Us + First Two Programs */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-8">
          {/* Why Choose Us Card */}
          <div className="rounded-2xl bg-card/70 border border-border/30 p-6 lg:p-8 flex flex-col justify-between order-2 lg:order-1">
            <div>
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-primary" />
                لماذا تختار مواسم مشروك؟
              </h2>
              <ul className="space-y-3 mb-6">
                {whyChooseUs.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-border/30 pt-5 mb-5">
                <p className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  وجهات الموسم
                </p>
                {seasonHighlights.map((h, i) => (
                  <p key={i} className="text-xs text-muted-foreground mb-2 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    {h}
                  </p>
                ))}
              </div>
            </div>

            <Button variant="gold" size="lg" className="w-full" onClick={() => navigate("/contact")}>
              ابدأ التخطيط الآن
            </Button>
          </div>

          {/* First Program (Hajj) - Large */}
          <div className="order-1 lg:order-2">
            <ProgramCard program={programs[0]} variant="large" />
          </div>
        </div>

        {/* Second Row: Ramadan + Summer */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-8">
          <ProgramCard program={programs[1]} variant="large" />
          <ProgramCard program={programs[2]} variant="large" />
        </div>
      </div>

      {/* Newsletter CTA */}
      <section className="bg-primary/20 border-t border-primary/10">
        <div className="container mx-auto px-4 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="text-center md:text-right">
              <h3 className="text-xl font-bold mb-1">اشترك في نشرتنا البريدية</h3>
              <p className="text-muted-foreground text-sm">احصل على أفضل العروض والخصومات الحصرية</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                dir="ltr"
              />
              <Button variant="gold">اشترك الآن</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProgramCard({ program, variant = "large" }: { program: SeasonProgram; variant?: "large" | "compact" }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-card/70 border border-border/30 overflow-hidden hover:border-primary/20 transition-all flex flex-col">
      {/* Image */}
      <div className="relative h-52 lg:h-56">
        <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
        <Badge className={`absolute top-3 right-3 ${program.tagColor} border-0 text-xs`}>
          {program.tag}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 lg:p-6 flex-1 flex flex-col">
        <h3 className="text-lg lg:text-xl font-bold mb-2">{program.title}</h3>
        <p className="text-muted-foreground text-xs leading-relaxed mb-4">{program.subtitle}</p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
          <div>
            <p className="text-xs font-semibold mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              ما تشمله الباقة:
            </p>
            {program.features.map((f, i) => (
              <p key={i} className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Check className="w-3 h-3 text-primary shrink-0" />
                {f}
              </p>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold mb-1.5 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-muted-foreground" />
              مميزات إضافية:
            </p>
            {program.highlights.map((h, i) => (
              <p key={i} className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Check className="w-3 h-3 text-muted-foreground shrink-0" />
                {h}
              </p>
            ))}
          </div>
        </div>

        {/* Price + Actions */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
          <div>
            <span className="text-2xl font-bold text-primary">{program.price.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground mr-1">{program.currency}</span>
          </div>
          <Button variant="gold" onClick={() => navigate("/contact")}>
            اعرف المزيد
          </Button>
        </div>
      </div>
    </div>
  );
}
