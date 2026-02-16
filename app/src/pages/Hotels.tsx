import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Hotel, 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Utensils,
  CreditCard,
  Filter
} from "lucide-react";

const hotelNotes = [
  "وقت تسجيل الدخول 3:00 مساءً وتسجيل الخروج 12:00 ظهرًا.",
  "يرجى مراجعة شروط الفندق الخاصة بالإلغاء قبل الدفع.",
  "يمكن إضافة الطيران والمواصلات من نفس الصفحة.",
];

const hotels = [
  {
    id: 1,
    name: "فندق برج العرب جميرا",
    location: "دبي، الإمارات العربية المتحدة",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    rating: 5.0,
    reviews: 2450,
    price: "3,500",
    priceNote: "لليلة الواحدة",
    description: "فندق 7 نجوم يقدم تجربة فاخرة لا مثيل لها مع إطلالات خلابة على الخليج العربي",
    amenities: ["wifi", "parking", "breakfast", "gym", "pool", "restaurant"],
    distances: [
      { name: "المطار", distance: "25 دقيقة" },
      { name: "دبي مول", distance: "15 دقيقة" },
      { name: "برج خليفة", distance: "20 دقيقة" },
    ],
    cuisine: "مأكولات عالمية متنوعة - 9 مطاعم فاخرة",
    tag: "الأكثر فخامة",
  },
  {
    id: 2,
    name: "فندق فور سيزونز البوسفور",
    location: "إسطنبول، تركيا",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    rating: 4.9,
    reviews: 1890,
    price: "1,800",
    priceNote: "لليلة الواحدة",
    description: "فندق تاريخي على ضفاف البوسفور يجمع بين الأصالة العثمانية والفخامة العصرية",
    amenities: ["wifi", "parking", "breakfast", "gym", "pool"],
    distances: [
      { name: "المطار", distance: "40 دقيقة" },
      { name: "البازار الكبير", distance: "10 دقائق" },
      { name: "آيا صوفيا", distance: "5 دقائق" },
    ],
    cuisine: "مأكولات تركية وعالمية - 3 مطاعم",
    tag: "إطلالة البوسفور",
  },
  {
    id: 3,
    name: "منتجع أنانتارا المالديف",
    location: "جزر المالديف",
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800",
    rating: 5.0,
    reviews: 980,
    price: "5,200",
    priceNote: "لليلة الواحدة",
    description: "فيلات فاخرة فوق الماء مع مسابح خاصة وإطلالات لا تُنسى على المحيط الهندي",
    amenities: ["wifi", "breakfast", "gym", "pool", "restaurant"],
    distances: [
      { name: "المطار المائي", distance: "30 دقيقة بالقارب" },
      { name: "مركز الغوص", distance: "في المنتجع" },
    ],
    cuisine: "مأكولات آسيوية وعالمية - 4 مطاعم على الشاطئ",
    tag: "شهر العسل",
  },
  {
    id: 4,
    name: "فندق ريتز كارلتون باريس",
    location: "باريس، فرنسا",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    rating: 4.8,
    reviews: 1560,
    price: "4,200",
    priceNote: "لليلة الواحدة",
    description: "فندق أسطوري في قلب باريس يجسد الأناقة الفرنسية والرفاهية الكلاسيكية",
    amenities: ["wifi", "parking", "breakfast", "gym", "restaurant"],
    distances: [
      { name: "برج إيفل", distance: "10 دقائق" },
      { name: "اللوفر", distance: "5 دقائق" },
      { name: "الشانزليزيه", distance: "دقيقتان" },
    ],
    cuisine: "مأكولات فرنسية راقية - مطعم حائز على نجمة ميشلان",
    tag: "كلاسيكي فاخر",
  },
];

const amenityIcons: Record<string, { icon: React.ComponentType<{ className?: string }>; name: string }> = {
  wifi: { icon: Wifi, name: "واي فاي" },
  parking: { icon: Car, name: "موقف سيارات" },
  breakfast: { icon: Coffee, name: "فطور" },
  gym: { icon: Dumbbell, name: "صالة رياضة" },
  pool: { icon: Waves, name: "مسبح" },
  restaurant: { icon: Utensils, name: "مطعم" },
};

export default function Hotels() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              أفخم الفنادق العالمية
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              اكتشف مجموعة منتقاة من أفضل الفنادق بأسعار حصرية
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-card rounded-2xl p-6 shadow-hover max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="الوجهة أو اسم الفندق" className="pr-10 h-12 bg-muted border-0" />
              </div>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="تاريخ الوصول" className="pr-10 h-12 bg-muted border-0" />
              </div>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="تاريخ المغادرة" className="pr-10 h-12 bg-muted border-0" />
              </div>
              <div className="relative">
                <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="الغرف والضيوف" className="pr-10 h-12 bg-muted border-0" />
              </div>
              <div className="relative">
                <select className="h-12 w-full rounded-xl border-0 bg-muted px-4 text-sm text-muted-foreground">
                  <option>نوع الغرفة</option>
                  <option>غرفة قياسية</option>
                  <option>جناح تنفيذي</option>
                  <option>فيلا خاصة</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <Button variant="ghost" className="gap-2">
                <Filter className="w-4 h-4" />
                تصفية النتائج
              </Button>
              <Button variant="hero" size="lg" className="gap-2">
                <Hotel className="w-5 h-5" />
                ابحث عن فنادق
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">فنادق مميزة</h2>

          <div className="space-y-8">
            {hotels.map((hotel, index) => (
              <div
                key={hotel.id}
                className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image */}
                  <div className="lg:w-96 h-64 lg:h-auto relative">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="gold-gradient text-secondary-foreground text-sm font-semibold px-3 py-1 rounded-full">
                        {hotel.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{hotel.name}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{hotel.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-accent rounded-full px-3 py-1">
                        <Star className="w-4 h-4 fill-secondary text-secondary" />
                        <span className="font-bold">{hotel.rating}</span>
                        <span className="text-sm text-muted-foreground">({hotel.reviews} تقييم)</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">{hotel.description}</p>

                    {/* Distances */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      {hotel.distances.map((dist) => (
                        <div key={dist.name} className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{dist.name}: <strong>{dist.distance}</strong></span>
                        </div>
                      ))}
                    </div>

                    {/* Cuisine */}
                    <div className="flex items-center gap-2 text-sm mb-4 bg-accent/50 rounded-lg px-3 py-2 inline-block">
                      <Utensils className="w-4 h-4 text-primary" />
                      <span>{hotel.cuisine}</span>
                    </div>

                    {/* Amenities */}
                    <div className="flex gap-2 flex-wrap">
                      {hotel.amenities.map((amenity) => {
                        const { icon: Icon, name } = amenityIcons[amenity];
                        return (
                          <div
                            key={amenity}
                            className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2"
                            title={name}
                          >
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="text-sm">{name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="lg:w-64 p-6 bg-muted/50 flex flex-col justify-center items-center border-t lg:border-t-0 lg:border-r border-border">
                    <p className="text-sm text-muted-foreground mb-1">يبدأ من</p>
                    <p className="text-3xl font-bold text-primary mb-1">
                      {hotel.price} <span className="text-base">ر.س</span>
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">{hotel.priceNote}</p>
                    <Button variant="hero" className="w-full">احجز الآن</Button>
                    <Button variant="ghost" className="w-full mt-2">عرض التفاصيل</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Details */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10">
            <div className="bg-card rounded-3xl p-8 shadow-card">
              <h2 className="text-2xl font-bold mb-4">تفاصيل ووصف العرض</h2>
              <p className="text-muted-foreground mb-6">
                اختر الفندق والمدينة ونوع الغرفة، ثم أضف الطيران والأنشطة والمواصلات حسب رغبتك.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-xs text-muted-foreground">نوع الغرفة</p>
                  <p className="font-semibold">جناح تنفيذي بإطلالة بحرية</p>
                </div>
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-xs text-muted-foreground">عدد الليالي</p>
                  <p className="font-semibold">4 ليالٍ</p>
                </div>
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-xs text-muted-foreground">خدمة الإفطار</p>
                  <p className="font-semibold">مشمول يوميًا</p>
                </div>
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-xs text-muted-foreground">الموقع</p>
                  <p className="font-semibold">قريب من المعالم الرئيسية</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-bold mb-3">تنبيهات هامة</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {hotelNotes.map((note) => (
                    <li key={note} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-muted rounded-3xl p-8 shadow-card">
              <h3 className="text-xl font-bold mb-4">بعد الدفع ستحصل على</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="bg-card rounded-xl p-4">
                  تأكيد الحجز مع إحداثيات الموقع وطريقة الوصول.
                </div>
                <div className="bg-card rounded-xl p-4">
                  إرسال تفاصيل الإقامة إلى البريد أو واتساب.
                </div>
                <div className="bg-card rounded-xl p-4">
                  إمكانية تعديل الخدمات الإضافية من لوحة المستخدم.
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Button variant="outline" className="w-full">إضافة للسلة</Button>
                <Button variant="hero" className="w-full">الدفع المباشر</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-bold">طرق الدفع المتاحة</h3>
                <p className="text-sm text-muted-foreground">ادفع بالطريقة التي تناسبك</p>
              </div>
            </div>
            <div className="flex items-center gap-6 flex-wrap justify-center">
              <div className="bg-muted rounded-lg px-6 py-3 font-semibold">Apple Pay</div>
              <div className="bg-muted rounded-lg px-6 py-3 font-semibold">Samsung Pay</div>
              <div className="bg-muted rounded-lg px-6 py-3 font-semibold">Visa</div>
              <div className="bg-muted rounded-lg px-6 py-3 font-semibold">Mastercard</div>
              <div className="bg-muted rounded-lg px-6 py-3 font-semibold">مدى</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
