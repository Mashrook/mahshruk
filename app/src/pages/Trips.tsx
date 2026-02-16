import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Star,
  Filter,
  ArrowLeftRight,
  CreditCard,
  Hotel,
  Car,
  Camera,
  FileText
} from "lucide-react";

const bookingNotes = [
  "يرجى الحضور إلى المطار قبل 3 ساعات من الإقلاع.",
  "تأكد من صلاحية جواز السفر ومتطلبات التأشيرة للدولة المستهدفة.",
  "إمكانية إضافة الفندق والمواصلات والأنشطة من نفس الطلب.",
];

const ticketDetails = [
  { label: "رقم الرحلة", value: "MSH-246" },
  { label: "صالة الوصول", value: "Terminal 2" },
  { label: "بوابة الإقلاع", value: "Gate B12" },
  { label: "موعد الإقلاع", value: "08:00 ص" },
  { label: "موعد الوصول", value: "10:00 ص" },
];

const flights = [
  {
    id: 1,
    from: "الرياض",
    to: "دبي",
    airline: "الخطوط السعودية",
    departTime: "08:00",
    arriveTime: "10:00",
    duration: "2 ساعة",
    price: "650",
    stops: "مباشر",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400",
  },
  {
    id: 2,
    from: "جدة",
    to: "إسطنبول",
    airline: "طيران ناس",
    departTime: "14:30",
    arriveTime: "19:00",
    duration: "4.5 ساعة",
    price: "1,200",
    stops: "مباشر",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400",
  },
  {
    id: 3,
    from: "الرياض",
    to: "القاهرة",
    airline: "مصر للطيران",
    departTime: "06:00",
    arriveTime: "08:30",
    duration: "2.5 ساعة",
    price: "800",
    stops: "مباشر",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=400",
  },
  {
    id: 4,
    from: "الدمام",
    to: "باريس",
    airline: "الخطوط الفرنسية",
    departTime: "22:00",
    arriveTime: "06:00",
    duration: "8 ساعات",
    price: "3,500",
    stops: "محطة واحدة",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400",
  },
];

const additionalServices = [
  { icon: Hotel, name: "حجز فندق", description: "أفضل الفنادق بأسعار مميزة" },
  { icon: Car, name: "تأجير سيارة", description: "سيارات حديثة مع سائق" },
  { icon: Camera, name: "جولات سياحية", description: "اكتشف أجمل المعالم" },
  { icon: FileText, name: "خدمات الفيزا", description: "مساعدة في إجراءات السفر" },
];

export default function Trips() {
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip");

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              احجز رحلتك القادمة
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              أفضل أسعار تذاكر الطيران مع خدمات إضافية مميزة
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-card rounded-2xl p-6 shadow-hover max-w-5xl mx-auto">
            {/* Trip Type */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setTripType("roundtrip")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  tripType === "roundtrip"
                    ? "hero-gradient text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                <ArrowLeftRight className="w-5 h-5" />
                ذهاب وعودة
              </button>
              <button
                onClick={() => setTripType("oneway")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  tripType === "oneway"
                    ? "hero-gradient text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                <Plane className="w-5 h-5" />
                ذهاب فقط
              </button>
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="من أين؟" className="pr-10 h-12 bg-muted border-0" />
              </div>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="إلى أين؟" className="pr-10 h-12 bg-muted border-0" />
              </div>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="تاريخ الذهاب" className="pr-10 h-12 bg-muted border-0" />
              </div>
              {tripType === "roundtrip" && (
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder="تاريخ العودة" className="pr-10 h-12 bg-muted border-0" />
                </div>
              )}
              <div className="relative">
                <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="المسافرون" className="pr-10 h-12 bg-muted border-0" />
              </div>
              <div className="relative">
                <select className="h-12 w-full rounded-xl border-0 bg-muted px-4 text-sm text-muted-foreground">
                  <option>الدرجة الاقتصادية</option>
                  <option>درجة الأعمال</option>
                  <option>الدرجة الأولى</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <Button variant="ghost" className="gap-2">
                <Filter className="w-4 h-4" />
                تصفية النتائج
              </Button>
              <Button variant="hero" size="lg" className="gap-2">
                <Plane className="w-5 h-5" />
                ابحث عن رحلات
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Flights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">الرحلات الأكثر طلباً</h2>

          <div className="space-y-6">
            {flights.map((flight, index) => (
              <div
                key={flight.id}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Flight Image */}
                  <div className="lg:w-48 h-32 rounded-xl overflow-hidden">
                    <img
                      src={flight.image}
                      alt={`${flight.from} إلى ${flight.to}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Flight Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Plane className="w-5 h-5 text-primary" />
                        <span className="font-semibold">{flight.airline}</span>
                        <div className="flex items-center gap-1 bg-accent rounded-full px-2 py-1">
                          <Star className="w-3 h-3 fill-secondary text-secondary" />
                          <span className="text-xs font-semibold">{flight.rating}</span>
                        </div>
                      </div>
                      <span className="bg-accent text-accent-foreground text-sm px-3 py-1 rounded-full">
                        {flight.stops}
                      </span>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{flight.departTime}</p>
                        <p className="text-muted-foreground">{flight.from}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <Clock className="w-4 h-4 text-muted-foreground mb-1" />
                        <div className="w-full h-px bg-border relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary w-3 h-3 rounded-full" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{flight.duration}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{flight.arriveTime}</p>
                        <p className="text-muted-foreground">{flight.to}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="lg:w-48 flex flex-col items-center justify-center lg:border-r border-border lg:pr-6">
                    <p className="text-sm text-muted-foreground">يبدأ من</p>
                    <p className="text-3xl font-bold text-primary">{flight.price} <span className="text-sm">ر.س</span></p>
                    <Button variant="hero" className="w-full mt-4">احجز الآن</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2">خدمات إضافية لرحلتك</h2>
          <p className="text-muted-foreground mb-8">أضف هذه الخدمات لتجعل رحلتك أكثر راحة ومتعة</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.name}
                  className="bg-card rounded-2xl p-6 text-center shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer group animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 hero-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              );
            })}
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
                عرض متكامل يشمل رحلة الطيران مع إمكانية إضافة الفندق والمواصلات والأنشطة في نفس المدينة.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {ticketDetails.map((detail) => (
                  <div key={detail.label} className="bg-muted rounded-xl p-4">
                    <p className="text-xs text-muted-foreground">{detail.label}</p>
                    <p className="font-semibold">{detail.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="font-bold mb-3">تنبيهات هامة</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {bookingNotes.map((note) => (
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
                  تذكرة رقمية قابلة للإرسال عبر البريد الإلكتروني أو واتساب.
                </div>
                <div className="bg-card rounded-xl p-4">
                  موقع صالة الوصول ورقم البوابة وتفاصيل الرحلة كاملة.
                </div>
                <div className="bg-card rounded-xl p-4">
                  إمكانية تعديل خدمات الفندق أو المواصلات من لوحة المستخدم.
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
            <div className="flex items-center gap-6">
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
