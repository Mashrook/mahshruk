import { useState } from "react";
import { Tag, Sparkles, Check, Calendar, Info, Plane, Hotel, MapPin, Clock, Users, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

import alulaImg from "@/assets/offers/alula-winter.jpg";
import jeddahImg from "@/assets/offers/jeddah-sea.jpg";
import riyadhImg from "@/assets/offers/riyadh-family.jpg";
import taifImg from "@/assets/offers/taif-cool.jpg";

interface OfferPackage {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  season: string;
  discount: number;
  price: number;
  originalPrice: number;
  currency: string;
  validUntil: string;
  destination: string;
  includes: string[];
  beforeTravel: string[];
  duration: string;
}

const offers: OfferPackage[] = [
  {
    id: "winter-ula",
    title: "عرض شتاء العُلا",
    subtitle: "تجربة صحراوية فاخرة مع جولات تاريخية وإقامة مميزة",
    image: alulaImg,
    season: "winter",
    discount: 35,
    price: 2730,
    originalPrice: 4200,
    currency: "ر.س",
    validUntil: "31-03-2026",
    destination: "العُلا، السعودية",
    includes: ["إقامة 3 ليالٍ", "جولة صحراوية مميزة", "تذاكر داخلية", "المنطقة القديمة"],
    beforeTravel: ["احجز قبل أسبوعين", "أفضل وقت: صباحاً", "ملابس مريحة"],
    duration: "4 أيام / 3 ليالٍ",
  },
  {
    id: "jeddah-sea",
    title: "باقة جدة البحرية",
    subtitle: "الإقامة على الكورنيش مع جولة مدينة وأنشطة مائية",
    image: jeddahImg,
    season: "صيفي",
    discount: 25,
    price: 2325,
    originalPrice: 3100,
    currency: "ر.س",
    validUntil: "15-06-2026",
    destination: "جدة، السعودية",
    includes: ["إقامة فاخرة", "جولة بحرية", "رحلة غوص حرّة", "تذكرة شاطئ حي"],
    beforeTravel: ["تأخر المسابح مساءً", "واقي شمسي ضروري", "أضف وجبة بحرية"],
    duration: "3 أيام / 2 ليالٍ",
  },
  {
    id: "riyadh-family",
    title: "عطلة الرياض العائلية",
    subtitle: "باقة عائلية قريبة من الفعاليات والترفيه",
    image: riyadhImg,
    season: "عائلي",
    discount: 20,
    price: 1920,
    originalPrice: 2400,
    currency: "ر.س",
    validUntil: "01-05-2026",
    destination: "الرياض، السعودية",
    includes: ["إقامة 2 ليالٍ", "أحدث عطلة بويلفرد الأسبوع", "تحقق من العروض العائلية", "نظام عائلية"],
    beforeTravel: ["احجز عطلة نهاية الأسبوع", "تذاكر مسبقة للفعاليات", "ملابس مريحة"],
    duration: "3 أيام / 2 ليالٍ",
  },
  {
    id: "taif-cool",
    title: "جولة الطائف الباردة",
    subtitle: "أجواء لطيفة وزيارات المتنزهات والأسواق التراثية",
    image: taifImg,
    season: "ربيعي",
    discount: 15,
    price: 1650,
    originalPrice: 1940,
    currency: "ر.س",
    validUntil: "30-04-2026",
    destination: "الطائف، السعودية",
    includes: ["إقامة 2 ليالٍ", "جولة في حديقة الورود", "زيارة سوق تراثي", "جولة جبلية"],
    beforeTravel: ["ملابس خفيفة ودافئة", "كاميرا للتصوير", "أحذية مريحة للمشي"],
    duration: "3 أيام / 2 ليالٍ",
  },
];

const seasonLabels: Record<string, { label: string; color: string }> = {
  winter: { label: "شتوي", color: "bg-blue-500/20 text-blue-400" },
  "صيفي": { label: "صيفي", color: "bg-amber-500/20 text-amber-400" },
  "عائلي": { label: "عائلي", color: "bg-emerald-500/20 text-emerald-400" },
  "ربيعي": { label: "ربيعي", color: "bg-pink-500/20 text-pink-400" },
};

export default function Offers() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/80 via-primary/50 to-background pt-10 pb-14">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Badge className="bg-primary/20 text-primary-foreground border-primary/30 mb-4 text-sm px-4 py-1.5">
            <Sparkles className="w-4 h-4 ml-1.5" />
            باقات مختارة بعناية لعملائنا
          </Badge>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-3">
            عروض سفر راقية من الخليج إلى العالم
          </h1>
          <p className="text-primary-foreground/80 text-sm lg:text-base max-w-2xl mx-auto">
            باقات متكاملة تجمع بين الطيران والإقامة الفاخرة والتجارب الحصرية — صُممت لتناسب ذوقك العائلي وتوقعاتك المالية
          </p>
        </div>
      </section>

      {/* Offers List */}
      <div className="container mx-auto px-4 lg:px-8 -mt-4">
        <div className="space-y-8 max-w-5xl mx-auto">
          {offers.map((offer, index) => (
            <OfferCard key={offer.id} offer={offer} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
        <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-card/70 border border-border/30">
          <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">لم تجد ما يناسبك؟</h3>
          <p className="text-muted-foreground text-sm mb-5">تواصل معنا لتصميم باقة مخصصة تناسب احتياجاتك وميزانيتك</p>
          <Button variant="gold" size="lg" onClick={() => navigate("/contact")}>
            طلب عرض مخصص
          </Button>
        </div>
      </div>
    </div>
  );
}

function OfferCard({ offer, index }: { offer: OfferPackage; index: number }) {
  const navigate = useNavigate();
  const isEven = index % 2 === 0;
  const season = seasonLabels[offer.season] || { label: offer.season, color: "bg-muted text-muted-foreground" };

  return (
    <div className="rounded-2xl bg-card/70 border border-border/30 overflow-hidden hover:border-primary/20 transition-all">
      <div className={`flex flex-col ${isEven ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
        {/* Image */}
        <div className="relative lg:w-[42%] min-h-[220px] lg:min-h-[340px]">
          <img src={offer.image} alt={offer.title} className="w-full h-full object-cover absolute inset-0" />
          {/* Discount Badge */}
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground font-bold text-lg px-4 py-2 rounded-xl shadow-lg">
            {offer.discount} %
          </div>
          {/* Date */}
          <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>صالح حتى {offer.validUntil}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 lg:p-7 flex flex-col justify-between">
          <div>
            {/* Title + Season */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold mb-1">{offer.title}</h3>
                <p className="text-muted-foreground text-sm">{offer.subtitle}</p>
              </div>
            </div>

            {/* Season + Destination */}
            <div className="flex items-center gap-3 mb-5">
              <Badge className={`${season.color} border-0 text-xs`}>
                <Sparkles className="w-3 h-3 ml-1" />
                {season.label}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {offer.destination}
              </span>
            </div>

            {/* Progress bar decorative */}
            <div className="w-full h-1 rounded-full bg-primary/20 mb-5">
              <div className="h-full rounded-full bg-primary" style={{ width: `${100 - offer.discount}%` }} />
            </div>

            {/* Two columns: Includes + Before Travel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  ما تشمله الباقة:
                </p>
                <ul className="space-y-1.5">
                  {offer.includes.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  قبل رحلتك:
                </p>
                <ul className="space-y-1.5">
                  {offer.beforeTravel.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom: Price + Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border/30">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">{offer.price.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">{offer.currency}</span>
              <span className="text-sm text-muted-foreground line-through">{offer.originalPrice.toLocaleString()} {offer.currency}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="gold" size="lg">
                احجز الآن
              </Button>
              <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/10">
                <Info className="w-4 h-4 ml-1.5" />
                التفاصيل
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
