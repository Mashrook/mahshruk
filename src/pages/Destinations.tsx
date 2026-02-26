import { useState } from "react";
import { Globe, MapPin, Star, Calendar, Users, Plane, Search, Smartphone, CalendarCheck, Mail, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

import jeddahImg from "@/assets/destinations/jeddah.jpg";
import riyadhImg from "@/assets/destinations/riyadh.jpg";
import alulaImg from "@/assets/destinations/alula.jpg";
import dubaiImg from "@/assets/destinations/dubai.jpg";
import abhaImg from "@/assets/destinations/abha.jpg";
import medinaImg from "@/assets/destinations/medina.jpg";

const regionTabs = [
  { id: "popular", label: "أشهر الوجهات الشائعة" },
  { id: "domestic", label: "أشهر الوجهات المحلية" },
  { id: "mideast", label: "أشهر الوجهات في الشرق الأوسط" },
  { id: "intl", label: "أشهر الوجهات الدولية" },
];

const quickCities = [
  "الرياض", "جدة", "المدينة المنورة", "الدمام", "أبها", "تبوك",
  "دبي", "القاهرة", "اسطنبول", "لندن", "باريس", "كوالالمبور",
];

const airlines = [
  { name: "الخطوط السعودية", logo: "/images/airlines/saudia.png" },
  { name: "طيران ناس", logo: "/images/airlines/flynas.png" },
  { name: "فلاي أديل", logo: "/images/airlines/flyadeal.png" },
  { name: "القطرية", logo: "/images/airlines/qatar.png" },
  { name: "التركية", logo: "/images/airlines/turkish.png" },
  { name: "فلاي دبي", logo: "/images/airlines/flydubai.png" },
  { name: "العربية للطيران", logo: "/images/airlines/airarabia.png" },
];

interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  price: number;
  rating: number;
  duration: string;
  description: string;
  tag?: string;
}

const destinations: Destination[] = [
  {
    id: "jeddah",
    name: "جدة",
    country: "السعودية",
    image: jeddahImg,
    price: 2600,
    rating: 4.8,
    duration: "3 أيام",
    description: "واجهة بحرية ساحرة والبلد التاريخية ومعالم حديثة تجعل من جدة وجهة مثالية لعطلة لا تُنسى.",
  },
  {
    id: "riyadh",
    name: "الرياض",
    country: "السعودية",
    image: riyadhImg,
    price: 2300,
    rating: 4.7,
    duration: "3 أيام",
    description: "العاصمة النابضة بالحياة تجمع بين المعالم التراثية والمشاريع العملاقة والمطاعم والفعاليات.",
  },
  {
    id: "alula",
    name: "العلا",
    country: "السعودية",
    image: alulaImg,
    price: 3300,
    rating: 4.9,
    duration: "4 أيام",
    description: "كنز أثري يعود لآلاف السنين، مدائن صالح والمناظر الصخرية الفريدة في قلب الصحراء.",
    tag: "مميز",
  },
  {
    id: "dubai",
    name: "دبي",
    country: "الإمارات",
    image: dubaiImg,
    price: 4200,
    rating: 4.8,
    duration: "4 أيام",
    description: "مدينة المستقبل بناطحات السحاب والمولات الضخمة والشواطئ والترفيه الذي لا ينتهي.",
    tag: "الأكثر طلباً",
  },
  {
    id: "abha",
    name: "أبها",
    country: "السعودية",
    image: abhaImg,
    price: 2500,
    rating: 4.6,
    duration: "3 أيام",
    description: "جنة الجنوب السعودي بطقسها المعتدل وجبالها الخضراء والضباب الساحر على المرتفعات.",
  },
  {
    id: "medina",
    name: "المدينة المنورة",
    country: "السعودية",
    image: medinaImg,
    price: 3500,
    rating: 4.9,
    duration: "4 أيام",
    description: "المدينة المنورة طيبة الطيبة، زيارة المسجد النبوي الشريف والمعالم الإسلامية التاريخية.",
    tag: "روحاني",
  },
];

function DestinationCard({ dest }: { dest: Destination }) {
  return (
    <div className="group rounded-2xl overflow-hidden bg-card border border-border/30 hover:border-primary/30 transition-all hover:shadow-lg">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={dest.image}
          alt={dest.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <h3 className="absolute bottom-3 right-4 text-xl font-bold text-white">{dest.name}</h3>
        {dest.tag && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs">{dest.tag}</Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{dest.country}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="font-medium">{dest.rating}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {dest.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {dest.duration}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div>
            <span className="text-xs text-muted-foreground">يبدأ من</span>
            <p className="text-lg font-bold text-primary">{dest.price.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">ر.س</span></p>
          </div>
          <Button variant="gold" size="sm" asChild>
            <Link to={`/flights?to=${dest.name}`}>
              استكشف
              <ChevronLeft className="w-4 h-4 mr-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Destinations() {
  const [activeRegion, setActiveRegion] = useState("popular");
  const [emailSub, setEmailSub] = useState("");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/80 via-primary/50 to-background pt-10 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">استكشف الوجهات</h1>
            <p className="text-primary-foreground/80 text-sm">اكتشف أفضل الوجهات حسب اهتماماتك واحجز رحلتك بسهولة</p>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {regionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveRegion(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeRegion === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/60 text-muted-foreground hover:bg-card/80 border border-border/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Cities */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {quickCities.map((city) => (
              <Link
                key={city}
                to={`/flights?to=${city}`}
                className="flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Plane className="w-3.5 h-3.5" />
                {city}
              </Link>
            ))}
          </div>

          {/* Show All */}
          <div className="text-center">
            <Button variant="outline" size="sm" className="bg-card/40 border-border/30 text-primary-foreground hover:bg-card/60">
              <Globe className="w-4 h-4 ml-1.5" />
              عرض الكل
            </Button>
          </div>
        </div>
      </section>

      {/* Airlines */}
      <section className="py-10 border-b border-border/20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-xl font-bold text-center mb-6">أشهر شركات الطيران</h2>
          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10">
            {airlines.map((airline) => (
              <div key={airline.name} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-14 h-14 rounded-xl bg-card border border-border/30 flex items-center justify-center p-2 group-hover:border-primary/30 transition-all">
                  <img src={airline.logo} alt={airline.name} className="w-10 h-10 object-contain" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{airline.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">وجهات موصى بها لهذا الموسم</h2>
            <p className="text-muted-foreground text-sm">رحلات مختارة بعناية وأسعار تنافسية مع باقات سفر متكاملة</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} dest={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* App Download / Features */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Smartphone,
                title: "حمّل تطبيق مشروك",
                desc: "احجز رحلاتك بسهولة من هاتفك في أي وقت ومن أي مكان. واستمتع بعروض حصرية.",
                cta: "تحميل التطبيق",
              },
              {
                icon: CalendarCheck,
                title: "إدارة حجوزاتك",
                desc: "تابع جميع حجوزاتك وتعديلاتها بسهولة وسلاسة من حسابك الشخصي.",
                cta: "إدارة حجوزاتي",
              },
              {
                icon: Plane,
                title: "إتمام إجراءات السفر",
                desc: "أنجز إجراءات السفر المسبقة قبل موعد رحلتك لتوفير الوقت في المطار.",
                cta: "بدء الآن",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-card border border-border/30 text-center hover:border-primary/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.desc}</p>
                <Button variant="gold" size="sm">{item.cta}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-10 bg-primary/90">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-bold text-primary-foreground mb-2">اشترك في نشرتنا البريدية</h3>
            <p className="text-primary-foreground/70 text-sm mb-5">احصل على أفضل العروض والتخفيضات المميزة</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="بريدك الإلكتروني"
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                className="bg-foreground/10 border-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
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
