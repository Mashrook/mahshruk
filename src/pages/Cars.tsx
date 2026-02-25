import { useState } from "react";
import { Car, Star, MapPin, Users, Fuel, Settings2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CityAutocomplete from "@/components/search/CityAutocomplete";
import carOffer1 from "@/assets/offers/car-offer-1.jpg";
import hotelOffer2 from "@/assets/offers/hotel-offer-2.jpg";

const carCategories = [
  { name: "اقتصادي", image: carOffer1, price: 120, seats: 5, fuel: "بنزين", transmission: "أوتوماتيك", models: ["تويوتا يارس", "هيونداي أكسنت", "نيسان صني"] },
  { name: "متوسط", image: hotelOffer2, price: 200, seats: 5, fuel: "بنزين", transmission: "أوتوماتيك", models: ["تويوتا كامري", "هيونداي سوناتا", "كيا K5"] },
  { name: "SUV", image: carOffer1, price: 350, seats: 7, fuel: "بنزين", transmission: "أوتوماتيك", models: ["تويوتا فورتشنر", "هيونداي سانتافي", "كيا سورينتو"] },
  { name: "فاخر", image: hotelOffer2, price: 600, seats: 5, fuel: "بنزين", transmission: "أوتوماتيك", models: ["مرسيدس E-Class", "BMW الفئة 5", "لكزس ES"] },
  { name: "عائلي", image: carOffer1, price: 280, seats: 8, fuel: "بنزين", transmission: "أوتوماتيك", models: ["تويوتا إنوفا", "هيونداي ستاريا", "كيا كرنفال"] },
  { name: "رياضي", image: hotelOffer2, price: 800, seats: 2, fuel: "بنزين", transmission: "أوتوماتيك", models: ["فورد موستانج", "شيفروليه كامارو", "دودج تشالنجر"] },
];

export default function Cars() {
  const [city, setCity] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  return (
    <div className="min-h-screen">
      {/* Hero + Search */}
      <section className="bg-gradient-to-b from-primary/80 via-primary/50 to-background pt-8 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">تأجير السيارات</h1>
            <p className="text-primary-foreground/80 text-sm">استأجر سيارتك المفضلة بأفضل الأسعار في جميع مدن المملكة</p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-card">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <CityAutocomplete value={city} onChange={setCity} placeholder="مدينة الاستلام" label="مدينة الاستلام" />
            <div>
              <label className="text-sm text-muted-foreground block mb-1">تاريخ الاستلام</label>
              <Input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="bg-muted/30" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">تاريخ الإرجاع</label>
              <Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="bg-muted/30" />
            </div>
          </div>
          <Button variant="gold" size="lg" className="w-full">
            <Search className="w-5 h-5 ml-2" />
            بحث عن السيارات
          </Button>
        </div>
        </div>
      </section>

      {/* Car Categories */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-6">فئات السيارات المتاحة</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carCategories.map((car, i) => (
              <div key={i} className="group rounded-2xl bg-card border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-card-hover transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">{car.name}</Badge>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" />{car.seats} مقاعد</span>
                    <span className="flex items-center gap-1"><Fuel className="w-4 h-4" />{car.fuel}</span>
                    <span className="flex items-center gap-1"><Settings2 className="w-4 h-4" />{car.transmission}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {car.models.join(" • ")}
                  </p>
                  <div className="flex items-end justify-between pt-3 border-t border-border/30">
                    <div>
                      <p className="text-xs text-muted-foreground">يبدأ من</p>
                      <p className="text-2xl font-bold text-primary">{car.price} <span className="text-sm font-normal">ر.س / يوم</span></p>
                    </div>
                    <Button variant="gold" size="sm">احجز الآن</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
