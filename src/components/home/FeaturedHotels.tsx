import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Wifi, Coffee, Dumbbell, Car, Waves } from "lucide-react";
import hotelOffer1 from "@/assets/offers/hotel-offer-1.jpg";
import hotelOffer2 from "@/assets/offers/hotel-offer-2.jpg";
import riyadhImg from "@/assets/riyadh-hero.jpg";
import destOffer1 from "@/assets/offers/destination-offer-1.jpg";

const hotels = [
  {
    name: "فندق كورنيش جدة",
    location: "جدة - الكورنيش",
    category: "اقتصادي",
    categoryColor: "bg-primary",
    tags: ["واي فاي مجاني", "مسبح", "موقف سيارات"],
    price: "1,800",
    image: hotelOffer1,
    href: "/hotels",
  },
  {
    name: "فندق الأعمال بالرياض",
    location: "الرياض - العليا",
    category: "رجال أعمال",
    categoryColor: "bg-primary",
    tags: ["واي فاي عالي السرعة", "مركز أعمال", "صالة رياضية"],
    price: "1,250",
    image: riyadhImg,
    href: "/hotels",
  },
  {
    name: "منتجع العلا الصحراوي",
    location: "العلا - وادي عشار",
    category: "فاخر",
    categoryColor: "bg-primary",
    tags: ["منتجع صحي", "جولات خاصة", "مسبح"],
    price: "2,900",
    image: destOffer1,
    href: "/hotels",
  },
  {
    name: "فندق المدينة سنتر",
    location: "المدينة المنورة - المنطقة المركزية",
    category: "عائلي",
    categoryColor: "bg-primary",
    tags: ["واي فاي مجاني", "إفطار", "خدمة غرف"],
    price: "1,100",
    image: hotelOffer2,
    href: "/hotels",
  },
];

export default function FeaturedHotels() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/hotels">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 rounded-xl">
              عرض المزيد
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
          <div className="text-right">
            <span className="text-sm text-primary font-medium flex items-center gap-1 justify-end mb-2">
              <Heart className="w-4 h-4" />
              الفنادق المميزة
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">فنادق مختارة بعناية لراحتك</h2>
            <p className="text-muted-foreground mt-1">إقامات موثوقة للعائلات ورجال الأعمال، مع مواقع مركزية وخدمات متكاملة</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {hotels.map((hotel) => (
            <div key={hotel.name} className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/40 transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute top-3 right-3">
                  <span className={`${hotel.categoryColor} text-primary-foreground text-xs font-bold px-3 py-1 rounded-full`}>{hotel.category}</span>
                </div>
              </div>
              <div className="p-4 text-right">
                <h3 className="font-bold text-foreground mb-1">{hotel.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{hotel.location}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {hotel.tags.map((tag) => (
                    <span key={tag} className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <Link to={hotel.href}>
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs">احجز</Button>
                  </Link>
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground">يبدأ من</p>
                    <p className="font-bold text-primary">{hotel.price} <span className="text-xs">ر.س</span></p>
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
