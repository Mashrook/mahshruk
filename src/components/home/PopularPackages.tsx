import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Eye } from "lucide-react";
import riyadhImg from "@/assets/riyadh-hero.jpg";
import hotelOffer1 from "@/assets/offers/hotel-offer-1.jpg";
import hotelOffer2 from "@/assets/offers/hotel-offer-2.jpg";
import tourOffer1 from "@/assets/offers/tour-offer-1.jpg";
import destOffer1 from "@/assets/offers/destination-offer-1.jpg";
import flightOffer1 from "@/assets/offers/flight-offer-1.jpg";

const packages = [
  {
    title: "عطلة الرياض العائلية",
    season: "الربيع",
    seasonColor: "bg-primary",
    discount: "خصم 20%",
    location: "الرياض",
    validUntil: "2026-05-01",
    price: "1,920",
    tags: ["إقامة 2 ليالي", "تنقلات", "تذاكر فعالية"],
    image: riyadhImg,
    href: "/tours",
  },
  {
    title: "باقة جدة البحرية",
    season: "الربيع",
    seasonColor: "bg-primary",
    discount: "خصم 25%",
    location: "جدة",
    validUntil: "2026-04-15",
    price: "2,325",
    tags: ["رحلة بحرية", "تذاكر نشاط بحري", "إقامة ليلتي"],
    image: hotelOffer1,
    href: "/tours",
  },
  {
    title: "عرض شتاء العلا",
    season: "الشتاء",
    seasonColor: "bg-primary",
    discount: "خصم 35%",
    location: "العلا",
    validUntil: "2026-03-31",
    price: "2,730",
    tags: ["إقامة 3 ليالي", "تنقلات داخلية", "جولة مجاني صالح"],
    image: tourOffer1,
    href: "/tours",
  },
  {
    title: "زيارة المدينة المنورة",
    season: "رمضان",
    seasonColor: "bg-primary",
    discount: "خصم 15%",
    location: "المدينة",
    validUntil: "2026-03-20",
    price: "1,615",
    tags: ["إقامة ليلتي", "خدمة نقل", "إفطار"],
    image: hotelOffer2,
    href: "/tours",
  },
  {
    title: "رحلة أبها الجبلية",
    season: "الصيف",
    seasonColor: "bg-primary",
    discount: "خصم 22%",
    location: "أبها",
    validUntil: "2026-07-15",
    price: "2,184",
    tags: ["إقامة 3 ليالي", "جولات طبيعية", "تنقلات"],
    image: destOffer1,
    href: "/tours",
  },
  {
    title: "جولة الطائف الباردة",
    season: "الصيف",
    seasonColor: "bg-primary",
    discount: "خصم 18%",
    location: "الطائف",
    validUntil: "2026-06-10",
    price: "1,640",
    tags: ["إقامة ليلة", "جولة مزارع ورد", "مرشد محلي"],
    image: flightOffer1,
    href: "/tours",
  },
];

export default function PopularPackages() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">باقات مختارة لأكثر الوجهات طلباً</h2>
          <p className="text-muted-foreground">
            باقات متكاملة تشمل الطيران والإقامة والأنشطة والتنقلات بأسعار شفافة
          </p>
        </div>
        <div className="flex justify-start mb-8">
          <Link to="/offers">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 rounded-xl">
              عرض جميع العروض
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.title} className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/40 transition-all duration-300 group">
              <div className="relative h-52 overflow-hidden">
                <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute top-3 right-3">
                  <span className={`${pkg.seasonColor} text-primary-foreground text-xs font-bold px-3 py-1 rounded-full`}>{pkg.season}</span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="bg-card/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full">{pkg.discount}</span>
                </div>
              </div>
              <div className="p-5 text-right">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">يبدأ من</p>
                    <p className="text-lg font-bold text-primary">{pkg.price} <span className="text-xs">ر.س</span></p>
                  </div>
                  <h3 className="font-bold text-foreground">{pkg.title}</h3>
                </div>
                <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground mb-1">
                  <span>{pkg.season}</span>
                  <MapPin className="w-3 h-3" />
                </div>
                <p className="text-xs text-muted-foreground mb-3">ساري حتى {pkg.validUntil}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {pkg.tags.map((tag) => (
                    <span key={tag} className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Link to={pkg.href} className="flex-1">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm">احجز الآن</Button>
                  </Link>
                  <Link to={pkg.href}>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 rounded-xl text-sm px-4">
                      <Eye className="w-4 h-4 ml-1" />
                      التفاصيل
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
