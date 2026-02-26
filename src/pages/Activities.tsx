import { useState, useMemo } from "react";
import { Search, Star, MapPin, Clock, Users, Filter, Calendar, Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CityAutocomplete from "@/components/search/CityAutocomplete";

import redSeaImg from "@/assets/tours/red-sea.jpg";
import desertImg from "@/assets/tours/desert-safari.jpg";
import jeddahImg from "@/assets/tours/jeddah-history.jpg";
import tabukImg from "@/assets/tours/tabuk-adventure.jpg";
import riyadhImg from "@/assets/tours/riyadh-night.jpg";
import umrahImg from "@/assets/tours/umrah-tour.jpg";

interface Tour {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  price: number;
  currency: string;
  duration: string;
  destination: string;
}

const tours: Tour[] = [
  {
    id: "red-sea",
    title: "جولة بحرية في البحر الأحمر",
    description: "تجربة غوص وسباحة مع الشعاب المرجانية على الشاطئ، تشمل قارب خاص وإفطار بحري.",
    image: redSeaImg,
    category: "بحرية",
    rating: 4.8,
    reviews: 124,
    price: 870,
    currency: "SAR",
    duration: "يوم كامل",
    destination: "جدة",
  },
  {
    id: "desert-safari",
    title: "تجربة الصحراء والواحات",
    description: "سفاري صحراوي مع مخيم خاص، رحلة بالأنشطة الصحراوية والطعام التقليدي.",
    image: desertImg,
    category: "مغامرات",
    rating: 4.9,
    reviews: 98,
    price: 1500,
    currency: "SAR",
    duration: "يومان",
    destination: "العُلا",
  },
  {
    id: "jeddah-history",
    title: "جولة تاريخية في جدة",
    description: "زيارة المنطقة التاريخية حارة المظلوم مع مرشد سياحي وتذوق أطعمة تقليدية.",
    image: jeddahImg,
    category: "ثقافية",
    rating: 4.7,
    reviews: 156,
    price: 180,
    currency: "SAR",
    duration: "نصف يوم",
    destination: "جدة",
  },
  {
    id: "tabuk-adventure",
    title: "مغامرة جبال تبوك",
    description: "رحلة إلى السودة وحصل، جولة للحويل ومشي في المرتفعات الجبلية واستكشاف أجمل المناظر.",
    image: tabukImg,
    category: "مغامرات",
    rating: 4.6,
    reviews: 67,
    price: 2800,
    currency: "SAR",
    duration: "3 أيام",
    destination: "تبوك",
  },
  {
    id: "riyadh-night",
    title: "جولة ليلية في الرياض",
    description: "جولة مسائية باستكشاف معالم الرياض الحديثة مع زيارة بوليفرد من المملكة والفعاليات وصالة الدرعية.",
    image: riyadhImg,
    category: "ترفيهية",
    rating: 4.5,
    reviews: 203,
    price: 150,
    currency: "SAR",
    duration: "مسائي",
    destination: "الرياض",
  },
  {
    id: "umrah-tour",
    title: "جولة عمرة مميزة",
    description: "باقة عمرة متكاملة مع الإقامة القريبة من الحرم المكي. تشمل نقل مكيّف ومرشد ديني وإفطار يومي.",
    image: umrahImg,
    category: "دينية",
    rating: 4.9,
    reviews: 312,
    price: 1300,
    currency: "SAR",
    duration: "3 أيام",
    destination: "مكة",
  },
];

const categories = ["الكل", "بحرية", "مغامرات", "ثقافية", "ترفيهية", "دينية"];

export default function Activities() {
  const [destination, setDestination] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filteredTours = useMemo(() => {
    return tours.filter((t) => {
      if (selectedCategory !== "الكل" && t.category !== selectedCategory) return false;
      if (priceMin && t.price < Number(priceMin)) return false;
      if (priceMax && t.price > Number(priceMax)) return false;
      return true;
    });
  }, [selectedCategory, priceMin, priceMax]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/80 via-primary/50 to-background pt-10 pb-14">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-primary-foreground/70 text-sm mb-2">الأنشطة والجولات</p>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-3">
            احجز جولتك المفضلة بسهولة
          </h1>
          <p className="text-primary-foreground/80 text-sm lg:text-base max-w-xl mx-auto">
            اكتشف أجمل التجارب السياحية واحجزها مباشرة من منصة مشروك
          </p>
        </div>
      </section>

      {/* Search Form */}
      <div className="container mx-auto px-4 lg:px-8 -mt-6">
        <div className="max-w-5xl mx-auto p-5 lg:p-7 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-card">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <CityAutocomplete value={destination} onChange={setDestination} placeholder="اختر المدينة" label="المدينة" />
            <div>
              <label className="text-xs text-muted-foreground block mb-1 text-right">تاريخ الجولة</label>
              <div className="bg-muted/30 border border-border rounded-lg h-10 px-3 flex items-center">
                <DatePickerField value={tourDate} onChange={setTourDate} placeholder="اختر التاريخ" minDate={new Date()} />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1 text-right">عدد الأشخاص</label>
              <div className="flex items-center gap-2 bg-muted/30 border border-input rounded-md px-3 h-10">
                <Users className="w-4 h-4 text-muted-foreground" />
                <Input type="number" min={1} max={20} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="bg-transparent border-0 p-0 h-auto shadow-none" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1 text-right">نوع الجولة</label>
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

          {/* Advanced filters toggle */}
          <div className="flex items-center justify-between">
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-xs text-muted-foreground flex items-center gap-1.5 hover:text-foreground transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              تصفية متقدمة
            </button>
          </div>

          {showAdvanced && (
            <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/30">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">السعر الأدنى</label>
                <Input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="0" className="bg-muted/30" dir="ltr" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">السعر الأقصى</label>
                <Input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="10000" className="bg-muted/30" dir="ltr" />
              </div>
              <div className="flex items-end">
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
          )}

          <Button variant="gold" className="w-full md:w-auto mt-4">
            <Search className="w-4 h-4 ml-2" />
            ابحث عن جولات
          </Button>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <h2 className="text-xl lg:text-2xl font-bold mb-8 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          أفضل الجولات المتاحة
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">لا توجد جولات مطابقة للبحث</p>
          </div>
        )}
      </div>

      {/* Newsletter */}
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

function TourCard({ tour }: { tour: Tour }) {
  return (
    <div className="rounded-2xl bg-card/70 border border-border/30 overflow-hidden hover:border-primary/20 transition-all group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <Badge className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm text-foreground border-0 text-xs">
          {tour.category}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="text-sm font-semibold">{tour.rating}</span>
          <span className="text-xs text-muted-foreground">({tour.reviews} تقييم)</span>
        </div>

        <h3 className="font-bold text-base mb-2">{tour.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{tour.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {tour.destination}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {tour.duration}
          </span>
        </div>

        {/* Price + Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div>
            <span className="text-lg font-bold text-primary">{tour.price.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground mr-1">{tour.currency}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="gold" size="sm">عرض التفاصيل</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
