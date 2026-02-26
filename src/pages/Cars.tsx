import { useState } from "react";
import { Car, Star, MapPin, Users, Fuel, Settings2, Search, Loader2, Clock, ArrowRightLeft, DollarSign, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CityAutocomplete from "@/components/search/CityAutocomplete";
import { searchTransfers, TransferOffer, getTransferTypeName, getVehicleName, formatDuration } from "@/lib/amadeusClient";
import carOffer1 from "@/assets/offers/car-offer-1.jpg";
import hotelOffer2 from "@/assets/offers/hotel-offer-2.jpg";

const cityToIata: Record<string, string> = {
  "الرياض": "RUH", "جدة": "JED", "الدمام": "DMM", "مكة": "MKX", "المدينة": "MED",
  "أبها": "AHB", "تبوك": "TUU", "الطائف": "TIF", "دبي": "DXB", "القاهرة": "CAI",
  "إسطنبول": "IST", "لندن": "LHR", "باريس": "CDG",
};

function resolveIata(city: string): string {
  if (/^[A-Z]{3}$/i.test(city.trim())) return city.trim().toUpperCase();
  return cityToIata[city] || city.trim().toUpperCase().slice(0, 3);
}

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
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transferResults, setTransferResults] = useState<TransferOffer[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!city || !pickupDate) {
      setError("يرجى إدخال مدينة الاستلام وتاريخ الاستلام");
      return;
    }
    setError("");
    setLoading(true);
    setSearched(true);
    try {
      const originCode = resolveIata(city);
      const dateTime = `${pickupDate}T10:00:00`;
      const params: any = {
        startLocationCode: originCode,
        startDateTime: dateTime,
        passengers,
      };
      if (destination) {
        const destCode = resolveIata(destination);
        params.endLocationCode = destCode;
      }
      const result = await searchTransfers(params);
      setTransferResults(result.data || []);
    } catch (err: any) {
      setError(err.message || "فشل البحث — تأكد من إعداد Amadeus API في لوحة التحكم");
      setTransferResults([]);
    }
    setLoading(false);
  };

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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <CityAutocomplete value={city} onChange={setCity} placeholder="مدينة الاستلام" label="مدينة الاستلام" />
            <CityAutocomplete value={destination} onChange={setDestination} placeholder="الوجهة (اختياري)" label="الوجهة" />
            <div>
              <label className="text-sm text-muted-foreground block mb-1">تاريخ الاستلام</label>
              <Input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="bg-muted/30" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">عدد الركاب</label>
              <Input type="number" min={1} max={20} value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} className="bg-muted/30" />
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm mb-3 p-2 rounded-lg bg-destructive/10">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
          <Button variant="gold" size="lg" className="w-full" onClick={handleSearch} disabled={loading}>
            {loading ? <><Loader2 className="w-5 h-5 ml-2 animate-spin" /> جاري البحث...</> : <><Search className="w-5 h-5 ml-2" /> بحث عن السيارات والتنقلات</>}
          </Button>
        </div>
        </div>
      </section>

      {/* Live Transfer Results */}
      {searched && (
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-primary" />
              نتائج البحث المباشر
              {transferResults.length > 0 && <Badge variant="default" className="mr-2">{transferResults.length} نتيجة</Badge>}
            </h2>

            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">جاري البحث في Amadeus...</p>
              </div>
            ) : transferResults.length === 0 ? (
              <div className="p-8 rounded-2xl bg-card border border-border/50 text-center">
                <Car className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">لا توجد نتائج. جرب تغيير المدينة أو التاريخ.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {transferResults.map((offer) => (
                  <div key={offer.id} className="p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all">
                    <div className="flex items-start gap-4">
                      {offer.vehicle.imageURL ? (
                        <img src={offer.vehicle.imageURL} alt="" className="w-20 h-16 rounded-xl object-cover shrink-0 bg-muted" />
                      ) : (
                        <div className="w-20 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Car className="w-8 h-8 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="text-[10px]">{getTransferTypeName(offer.transferType)}</Badge>
                          {offer.vehicle.code && (
                            <Badge variant="outline" className="text-[10px]">{getVehicleName(offer.vehicle.code)}</Badge>
                          )}
                        </div>
                        <p className="font-bold text-sm">{offer.serviceProvider.name}</p>
                        {offer.vehicle.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{offer.vehicle.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {offer.duration && (
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(offer.duration)}</span>
                          )}
                          {offer.vehicle.seats?.[0] && (
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{offer.vehicle.seats[0].count} مقعد</span>
                          )}
                          {offer.distance && (
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{offer.distance.value} {offer.distance.unit}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-left shrink-0">
                        <p className="text-xl font-bold text-primary">{Number(offer.quotation.monetaryAmount).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{offer.quotation.currencyCode}</p>
                        <Button variant="gold" size="sm" className="mt-2 text-xs w-full">احجز</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
