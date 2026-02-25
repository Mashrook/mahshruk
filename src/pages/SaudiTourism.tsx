import { MapPin, Star, Calendar, Mountain, Palmtree, Landmark, Waves, ChevronLeft, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState } from "react";

import jeddahImg from "@/assets/destinations/jeddah.jpg";
import riyadhImg from "@/assets/destinations/riyadh.jpg";
import alulaImg from "@/assets/destinations/alula.jpg";
import abhaImg from "@/assets/destinations/abha.jpg";
import medinaImg from "@/assets/destinations/medina.jpg";
import dubaiImg from "@/assets/destinations/dubai.jpg";
import redSeaImg from "@/assets/tours/red-sea.jpg";
import desertImg from "@/assets/tours/desert-safari.jpg";

interface TourismDestination {
  id: string;
  name: string;
  region: string;
  image: string;
  description: string;
  highlights: string[];
  bestTime: string;
  rating: number;
  category: string;
}

const destinations: TourismDestination[] = [
  {
    id: "riyadh",
    name: "الرياض",
    region: "المنطقة الوسطى",
    image: riyadhImg,
    description: "العاصمة النابضة بالحياة — بوليفرد سيتي، الدرعية التاريخية، موسم الرياض، ومراكز التسوق العالمية.",
    highlights: ["بوليفرد سيتي", "الدرعية التاريخية", "برج المملكة", "حي الطريف"],
    bestTime: "أكتوبر - مارس",
    rating: 4.8,
    category: "مدن",
  },
  {
    id: "jeddah",
    name: "جدة",
    region: "المنطقة الغربية",
    image: jeddahImg,
    description: "عروس البحر الأحمر — واجهة جدة البحرية، البلد التاريخية، نافورة الملك فهد، وأسواق تراثية.",
    highlights: ["الواجهة البحرية", "جدة التاريخية", "نافورة الملك فهد", "كورنيش أبحر"],
    bestTime: "نوفمبر - أبريل",
    rating: 4.7,
    category: "مدن",
  },
  {
    id: "alula",
    name: "العلا",
    region: "المنطقة الشمالية الغربية",
    image: alulaImg,
    description: "كنز أثري يعود لآلاف السنين — مدائن صالح (الحِجر)، جبل إكمة، البلدة القديمة، والمناظر الصخرية.",
    highlights: ["مدائن صالح", "جبل إكمة", "مرايا", "واحة العلا"],
    bestTime: "أكتوبر - مارس",
    rating: 4.9,
    category: "تراث",
  },
  {
    id: "abha",
    name: "أبها والسودة",
    region: "منطقة عسير",
    image: abhaImg,
    description: "جنة الجنوب — مرتفعات السودة، قرية المفتاحة، حديقة أبو خيال، والضباب الساحر على الجبال.",
    highlights: ["مرتفعات السودة", "التلفريك", "قرية المفتاحة", "حديقة أبو خيال"],
    bestTime: "يونيو - سبتمبر",
    rating: 4.6,
    category: "طبيعة",
  },
  {
    id: "medina",
    name: "المدينة المنورة",
    region: "المنطقة الغربية",
    image: medinaImg,
    description: "طيبة الطيبة — المسجد النبوي الشريف، مسجد قباء، جبل أحد، ومعالم إسلامية تاريخية عظيمة.",
    highlights: ["المسجد النبوي", "مسجد قباء", "جبل أحد", "سوق المناخة"],
    bestTime: "طوال العام",
    rating: 4.9,
    category: "روحاني",
  },
  {
    id: "red-sea",
    name: "ساحل البحر الأحمر",
    region: "المنطقة الغربية",
    image: redSeaImg,
    description: "مشروع البحر الأحمر — شواطئ بكر، غوص مع الشعاب المرجانية، جزر خلابة، وتجارب فاخرة.",
    highlights: ["جزيرة أملج", "شواطئ ينبع", "رأس الشعبان", "محمية فرسان"],
    bestTime: "مارس - نوفمبر",
    rating: 4.8,
    category: "شواطئ",
  },
  {
    id: "tabuk",
    name: "تبوك ونيوم",
    region: "المنطقة الشمالية الغربية",
    image: desertImg,
    description: "أرض المستقبل — مشروع نيوم، وادي ديسة، جبال حسمى، والمناظر الطبيعية الخلابة.",
    highlights: ["وادي ديسة", "جبال حسمى", "مغاير شعيب", "شاطئ حقل"],
    bestTime: "أكتوبر - أبريل",
    rating: 4.7,
    category: "طبيعة",
  },
  {
    id: "diriyah",
    name: "الدرعية",
    region: "المنطقة الوسطى",
    image: riyadhImg,
    description: "عاصمة الدولة السعودية الأولى — حي الطريف (موقع تراث عالمي)، بوليفرد الدرعية، ومتاحف تاريخية.",
    highlights: ["حي الطريف", "بوليفرد الدرعية", "متحف الدرعية", "سوق الطريف"],
    bestTime: "أكتوبر - مارس",
    rating: 4.8,
    category: "تراث",
  },
];

const categoryFilters = ["الكل", "مدن", "تراث", "طبيعة", "روحاني", "شواطئ"];

const categoryIconMap: Record<string, React.ReactNode> = {
  "مدن": <Landmark className="w-4 h-4" />,
  "تراث": <Globe className="w-4 h-4" />,
  "طبيعة": <Mountain className="w-4 h-4" />,
  "روحاني": <Star className="w-4 h-4" />,
  "شواطئ": <Waves className="w-4 h-4" />,
};

export default function SaudiTourism() {
  const [activeCategory, setActiveCategory] = useState("الكل");

  const filtered = activeCategory === "الكل"
    ? destinations
    : destinations.filter(d => d.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/80 via-primary/50 to-background pt-10 pb-14">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-primary-foreground/70 text-sm mb-2">السياحة في السعودية</p>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-3">
            اكتشف جمال المملكة العربية السعودية
          </h1>
          <p className="text-primary-foreground/80 text-sm lg:text-base max-w-2xl mx-auto">
            من الصحاري الذهبية إلى الجبال الخضراء، ومن الشواطئ البكر إلى المعالم التاريخية — تجارب سفر لا تُنسى
          </p>
        </div>
      </section>

      {/* Statistics */}
      <div className="container mx-auto px-4 lg:px-8 -mt-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "وجهة سياحية", value: "50+" },
            { label: "موقع تراث عالمي", value: "6" },
            { label: "منطقة إدارية", value: "13" },
            { label: "كم ساحل", value: "3,400" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-2xl bg-card/95 backdrop-blur-xl border border-border text-center">
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categoryFilters.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border/30"
              }`}
            >
              {categoryIconMap[cat]}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <section className="container mx-auto px-4 lg:px-8 pb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((dest) => (
            <div key={dest.id} className="group rounded-2xl bg-card/70 border border-border/30 overflow-hidden hover:border-primary/20 transition-all">
              <div className="relative h-52 overflow-hidden">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <h3 className="absolute bottom-3 right-4 text-xl font-bold text-white">{dest.name}</h3>
                <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-0 text-xs">
                  {dest.category}
                </Badge>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{dest.region}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span className="font-medium">{dest.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                  {dest.description}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {dest.highlights.slice(0, 3).map((h) => (
                    <span key={h} className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
                      {h}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{dest.bestTime}</span>
                  </div>
                  <Button variant="gold" size="sm" asChild>
                    <Link to={`/flights?to=${dest.name}`}>
                      استكشف <ChevronLeft className="w-4 h-4 mr-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary/20 border-t border-primary/10">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">خطط لرحلتك القادمة في المملكة</h3>
            <p className="text-muted-foreground text-sm mb-6">
              تواصل معنا لتصميم برنامج سياحي مخصص يناسب اهتماماتك وميزانيتك
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="gold" size="lg" asChild>
                <Link to="/contact">تواصل معنا</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/festivals">تصفح الفعاليات</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
