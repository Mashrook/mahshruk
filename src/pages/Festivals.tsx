import { useState } from "react";
import { Search, Star, MapPin, Clock, Users, Calendar, Sparkles, Mountain, Tent, TreePine, Compass, Music, Flame, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import desertImg from "@/assets/tours/desert-safari.jpg";
import tabukImg from "@/assets/tours/tabuk-adventure.jpg";
import riyadhImg from "@/assets/tours/riyadh-night.jpg";
import redSeaImg from "@/assets/tours/red-sea.jpg";
import jeddahImg from "@/assets/tours/jeddah-history.jpg";
import umrahImg from "@/assets/tours/umrah-tour.jpg";
import alulaImg from "@/assets/destinations/alula.jpg";
import abhaImg from "@/assets/destinations/abha.jpg";

interface FestivalEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  location: string;
  date: string;
  price: number;
  currency: string;
  duration: string;
  rating: number;
  reviews: number;
  featured?: boolean;
}

const events: FestivalEvent[] = [
  {
    id: "riyadh-season",
    title: "موسم الرياض 2026",
    description: "أكبر موسم ترفيهي في المملكة يضم فعاليات متنوعة من حفلات وعروض مسرحية ومطاعم عالمية ومناطق ألعاب.",
    image: riyadhImg,
    category: "مهرجانات",
    location: "الرياض",
    date: "أكتوبر - مارس",
    price: 150,
    currency: "ر.س",
    duration: "يوم كامل",
    rating: 4.9,
    reviews: 1250,
    featured: true,
  },
  {
    id: "mountain-climbing",
    title: "تسلق جبال الحجاز",
    description: "مغامرة تسلق الجبال في منطقة الحجاز مع مرشدين محترفين ومعدات احترافية. مناسبة لجميع المستويات.",
    image: tabukImg,
    category: "مغامرات",
    location: "تبوك",
    date: "متاح طوال العام",
    price: 950,
    currency: "ر.س",
    duration: "يومان",
    rating: 4.7,
    reviews: 89,
  },
  {
    id: "desert-camping",
    title: "رحلة برية في الربع الخالي",
    description: "تجربة التخييم في أكبر صحراء رملية في العالم مع سفاري ومخيم فاخر تحت النجوم وعشاء تقليدي.",
    image: desertImg,
    category: "رحلات برية",
    location: "الربع الخالي",
    date: "نوفمبر - مارس",
    price: 2200,
    currency: "ر.س",
    duration: "3 أيام",
    rating: 4.8,
    reviews: 156,
    featured: true,
  },
  {
    id: "red-sea-diving",
    title: "غوص في البحر الأحمر",
    description: "اكتشف عالم ما تحت البحر الأحمر مع الشعاب المرجانية والأسماك الملونة. يشمل معدات الغوص والتدريب.",
    image: redSeaImg,
    category: "بحرية",
    location: "جدة - ينبع",
    date: "متاح طوال العام",
    price: 1100,
    currency: "ر.س",
    duration: "يوم كامل",
    rating: 4.9,
    reviews: 234,
  },
  {
    id: "alula-festival",
    title: "مهرجان العلا للفنون",
    description: "مهرجان فني وثقافي في قلب العلا التاريخية. عروض موسيقية وفنية ومعارض ضوئية وسط المناظر الصخرية.",
    image: alulaImg,
    category: "مهرجانات",
    location: "العلا",
    date: "يناير - مارس",
    price: 350,
    currency: "ر.س",
    duration: "يوم كامل",
    rating: 4.8,
    reviews: 412,
    featured: true,
  },
  {
    id: "abha-hiking",
    title: "مشي جبلي في أبها والسودة",
    description: "رحلة مشي في المرتفعات الجبلية الخضراء بأبها والسودة مع إطلالات ساحرة على الضباب والوديان.",
    image: abhaImg,
    category: "مغامرات",
    location: "أبها",
    date: "يونيو - سبتمبر",
    price: 680,
    currency: "ر.س",
    duration: "يوم كامل",
    rating: 4.6,
    reviews: 178,
  },
  {
    id: "jeddah-heritage",
    title: "مهرجان جدة التاريخية",
    description: "جولة ثقافية في حارات جدة التاريخية مع فعاليات فنية ومسرحية وأسواق شعبية وأطعمة تراثية.",
    image: jeddahImg,
    category: "مهرجانات",
    location: "جدة",
    date: "رمضان",
    price: 120,
    currency: "ر.س",
    duration: "مسائي",
    rating: 4.7,
    reviews: 567,
  },
  {
    id: "desert-rally",
    title: "رالي الصحراء - تجربة الدفع الرباعي",
    description: "قيادة سيارات الدفع الرباعي في الكثبان الرملية مع مرشدين محترفين. تشمل الوجبات والمعدات.",
    image: desertImg,
    category: "رحلات برية",
    location: "حائل",
    date: "أكتوبر - أبريل",
    price: 1800,
    currency: "ر.س",
    duration: "يومان",
    rating: 4.5,
    reviews: 93,
  },
];

const categories = ["الكل", "مهرجانات", "مغامرات", "رحلات برية", "بحرية"];

const categoryIcons: Record<string, React.ReactNode> = {
  "مهرجانات": <Music className="w-4 h-4" />,
  "مغامرات": <Mountain className="w-4 h-4" />,
  "رحلات برية": <Tent className="w-4 h-4" />,
  "بحرية": <Compass className="w-4 h-4" />,
};

export default function Festivals() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = events.filter((e) => {
    if (selectedCategory !== "الكل" && e.category !== selectedCategory) return false;
    if (searchQuery && !e.title.includes(searchQuery) && !e.location.includes(searchQuery)) return false;
    return true;
  });

  const featured = events.filter(e => e.featured);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/80 via-primary/50 to-background pt-10 pb-14">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Flame className="w-6 h-6 text-primary-foreground" />
            <p className="text-primary-foreground/70 text-sm">المهرجانات والفعاليات</p>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-3">
            اكتشف أجمل الفعاليات والمغامرات
          </h1>
          <p className="text-primary-foreground/80 text-sm lg:text-base max-w-2xl mx-auto">
            مهرجانات ترفيهية، رحلات تسلق جبال، سفاري صحراوي، وأنشطة بحرية — تجارب لا تُنسى في المملكة
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="container mx-auto px-4 lg:px-8 -mt-6">
        <div className="max-w-5xl mx-auto p-5 lg:p-7 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-card">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground block mb-1 text-right">ابحث عن فعالية</label>
              <div className="flex items-center gap-2 bg-muted/30 border border-input rounded-md px-3 h-10">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="اسم الفعالية أو المدينة..."
                  className="bg-transparent border-0 p-0 h-auto shadow-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1 text-right">التصنيف</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-muted/30 h-10">
                  <SelectValue placeholder="كل الفئات" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border/30"
                }`}
              >
                {categoryIcons[cat]}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Events */}
      {selectedCategory === "الكل" && (
        <section className="container mx-auto px-4 lg:px-8 py-12">
          <h2 className="text-xl lg:text-2xl font-bold mb-8 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            فعاليات مميزة
          </h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {featured.map((event) => (
              <EventCard key={event.id} event={event} featured />
            ))}
          </div>
        </section>
      )}

      {/* All Events */}
      <section className="container mx-auto px-4 lg:px-8 pb-12">
        <h2 className="text-xl lg:text-2xl font-bold mb-8 flex items-center gap-2">
          <TreePine className="w-6 h-6 text-primary" />
          {selectedCategory === "الكل" ? "جميع الفعاليات والرحلات" : selectedCategory}
          <span className="text-sm font-normal text-muted-foreground">({filtered.length})</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">لا توجد فعاليات مطابقة للبحث</p>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-primary/20 border-t border-primary/10">
        <div className="container mx-auto px-4 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="text-center md:text-right">
              <h3 className="text-xl font-bold mb-1">لا تفوّت الفعاليات الجديدة</h3>
              <p className="text-muted-foreground text-sm">اشترك لتصلك آخر الفعاليات والعروض</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                dir="ltr"
              />
              <Button variant="gold">اشترك</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function EventCard({ event, featured = false }: { event: FestivalEvent; featured?: boolean }) {
  return (
    <div className="rounded-2xl bg-card/70 border border-border/30 overflow-hidden hover:border-primary/20 transition-all group">
      <div className="relative h-48 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <Badge className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm text-foreground border-0 text-xs">
          {event.category}
        </Badge>
        {featured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-0 text-xs">
            مميز
          </Badge>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 mb-2">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="text-sm font-semibold">{event.rating}</span>
          <span className="text-xs text-muted-foreground">({event.reviews} تقييم)</span>
        </div>

        <h3 className="font-bold text-base mb-2">{event.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{event.description}</p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {event.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {event.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {event.duration}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div>
            <span className="text-lg font-bold text-primary">{event.price.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground mr-1">{event.currency}</span>
          </div>
          <Button variant="gold" size="sm">احجز الآن</Button>
        </div>
      </div>
    </div>
  );
}
