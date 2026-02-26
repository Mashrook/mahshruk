import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plane, Search, Clock, RefreshCw, Loader2, ArrowLeft, Filter,
  Hotel, Car, Compass, Luggage, ChevronDown, AlertCircle, CheckCircle2,
  Calendar, Users, MapPin, Globe
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTenantStore } from "@/stores/tenantStore";
import PaywallGate from "@/components/billing/PaywallGate";
import CityAutocomplete from "@/components/search/CityAutocomplete";
import {
  searchFlights as amadeusSearch,
  type AmadeusFlightOffer,
  formatDuration,
  getAirlineName,
} from "@/lib/amadeusClient";

const cityToIata: Record<string, string> = {
  "الرياض": "RUH", "جدة": "JED", "الدمام": "DMM", "المدينة المنورة": "MED",
  "أبها": "AHB", "تبوك": "TUU", "القصيم": "ELQ", "حائل": "HAS",
  "جازان": "GIZ", "نجران": "EAM", "ينبع": "YNB", "الطائف": "TIF",
  "دبي": "DXB", "القاهرة": "CAI", "اسطنبول": "IST", "لندن": "LHR",
  "باريس": "CDG", "كوالالمبور": "KUL", "الباحة": "ABT",
};

function resolveIata(input: string): string {
  if (/^[A-Z]{3}$/.test(input.trim())) return input.trim();
  const mapped = cityToIata[input.trim()];
  if (mapped) return mapped;
  const match = input.match(/\(([A-Z]{3})\)/);
  if (match) return match[1];
  return input.trim().toUpperCase().slice(0, 3);
}

const domesticDestinations = [
  { name: "الرياض", code: "RUH" }, { name: "جدة", code: "JED" }, { name: "الدمام", code: "DMM" },
  { name: "القصيم", code: "ELQ" }, { name: "أبها", code: "AHB" }, { name: "الطائف", code: "TIF" },
  { name: "المدينة المنورة", code: "MED" }, { name: "تبوك", code: "TUU" },
  { name: "ينبع", code: "YNB" }, { name: "حائل", code: "HAS" },
  { name: "الباحة", code: "ABT" }, { name: "نجران", code: "EAM" },
];
const internationalDestinations = [
  { name: "دبي", code: "DXB" }, { name: "القاهرة", code: "CAI" }, { name: "اسطنبول", code: "IST" },
  { name: "لندن", code: "LHR" }, { name: "باريس", code: "CDG" }, { name: "كوالالمبور", code: "KUL" },
  { name: "جاكرتا", code: "CGK" }, { name: "بانكوك", code: "BKK" },
  { name: "عمّان", code: "AMM" }, { name: "بيروت", code: "BEY" },
  { name: "تونس", code: "TUN" }, { name: "الدار البيضاء", code: "CMN" },
];
const middleEastDestinations = [
  { name: "دبي", code: "DXB" }, { name: "أبوظبي", code: "AUH" }, { name: "الدوحة", code: "DOH" },
  { name: "مسقط", code: "MCT" }, { name: "البحرين", code: "BAH" }, { name: "الكويت", code: "KWI" },
  { name: "عمّان", code: "AMM" }, { name: "بيروت", code: "BEY" },
  { name: "القاهرة", code: "CAI" }, { name: "بغداد", code: "BGW" },
];

const airlines = [
  { name: "الخطوط السعودية", code: "SV", logo: "/images/airlines/saudia.png" },
  { name: "طيران ناس", code: "XY", logo: "/images/airlines/flynas.png" },
  { name: "طيران أديل", code: "F3", logo: "/images/airlines/flyadeal.png" },
  { name: "فلاي دبي", code: "FZ", logo: "/images/airlines/flydubai.png" },
  { name: "الخطوط القطرية", code: "QR", logo: "/images/airlines/qatar.png" },
  { name: "العربية للطيران", code: "G9", logo: "/images/airlines/airarabia.png" },
  { name: "الخطوط التركية", code: "TK", logo: "/images/airlines/turkish.png" },
];

const addOnServices = [
  { icon: Hotel, title: "حجز فندق", desc: "احجز الفنادق بأسعار مخفضة مع خيارات حية.", link: "/hotels" },
  { icon: Car, title: "تأجير سيارة", desc: "سيارات حديثة مع أو بدون سائق.", link: "/cars" },
  { icon: Compass, title: "جولات سياحية", desc: "اكتشف أجمل المعالم مع مرشدين محترفين.", link: "/tours" },
  { icon: Luggage, title: "خدمات المغرة", desc: "مساعدتك في إجراءات السفر والتأشيرات.", link: "/transfers" },
];

type DestTab = "domestic" | "international" | "middleeast";

export default function Flights() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip");
  const [searchResults, setSearchResults] = useState<AmadeusFlightOffer[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [searchError, setSearchError] = useState("");
  const [destTab, setDestTab] = useState<DestTab>("domestic");
  const [selectedOffer, setSelectedOffer] = useState<AmadeusFlightOffer | null>(null);

  const { isAuthenticated, user } = useAuthStore();
  const { tenant } = useTenantStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    const originCode = resolveIata(from);
    const destCode = resolveIata(to);
    if (!originCode || !destCode || !departDate) {
      toast({ title: "بيانات ناقصة", description: "يرجى تحديد مدينة المغادرة والوصول والتاريخ", variant: "destructive" });
      return;
    }
    setSearching(true);
    try {
      const result = await amadeusSearch({
        origin: originCode, destination: destCode, departureDate: departDate,
        returnDate: tripType === "roundtrip" && returnDate ? returnDate : undefined,
        adults: passengers, max: 15,
      });
      const offers = result.data || [];
      setSearchResults(offers);
      if (offers.length === 0) setSearchError("لم يتم العثور على رحلات لهذا المسار. جرّب تغيير التاريخ أو الوجهة.");
    } catch (err: any) {
      setSearchError(err.message || "حدث خطأ أثناء البحث");
      setSearchResults(null);
    } finally {
      setSearching(false);
    }
  };

  const handleBook = async (offer: AmadeusFlightOffer) => {
    if (!isAuthenticated || !user) {
      toast({ title: "يرجى تسجيل الدخول", description: "سجّل دخولك لإتمام الحجز", variant: "destructive" });
      navigate("/login");
      return;
    }
    setBookingLoading(offer.id);
    try {
      const totalPrice = parseFloat(offer.price.grandTotal);
      const outbound = offer.itineraries[0];
      const firstSeg = outbound.segments[0];
      const lastSeg = outbound.segments[outbound.segments.length - 1];
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id, booking_type: "flight", total_price: totalPrice,
        currency: offer.price.currency || "SAR", status: "confirmed", payment_status: "unpaid",
        tenant_id: tenant?.id || null,
        details_json: {
          amadeus_offer_id: offer.id,
          airline: offer.validatingAirlineCodes?.[0] || firstSeg.carrierCode,
          from: firstSeg.departure.iataCode, to: lastSeg.arrival.iataCode,
          depart_date: firstSeg.departure.at,
          return_date: offer.itineraries[1] ? offer.itineraries[1].segments[0].departure.at : null,
          passengers, duration: outbound.duration, stops: outbound.segments.length - 1,
          cabin: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || "ECONOMY",
          segments: outbound.segments.map(s => ({
            from: s.departure.iataCode, to: s.arrival.iataCode, carrier: s.carrierCode,
            flight: `${s.carrierCode}${s.number}`, depart: s.departure.at, arrive: s.arrival.at, duration: s.duration,
          })),
        },
      });
      if (error) throw error;
      toast({ title: "تم الحجز بنجاح! ✈️", description: `${firstSeg.departure.iataCode} → ${lastSeg.arrival.iataCode} | ${totalPrice} ${offer.price.currency}` });
      navigate("/dashboard/bookings");
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message || "تعذر إتمام الحجز", variant: "destructive" });
    } finally {
      setBookingLoading(null);
    }
  };

  const destList = destTab === "domestic" ? domesticDestinations : destTab === "international" ? internationalDestinations : middleEastDestinations;

  return (
    <PaywallGate>
      <div className="min-h-screen">
        {/* Hero + Search */}
        <section className="bg-gradient-to-b from-primary/80 via-primary/50 to-background pt-8 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">احجز رحلتك القادمة</h1>
              <p className="text-primary-foreground/80 text-sm">أفضل أسعار تذاكر الطيران مع خدمات إضافية مميزة</p>
            </div>

            {/* Search Card */}
            <form onSubmit={handleSearch} className="max-w-5xl mx-auto bg-card/95 backdrop-blur-xl rounded-2xl border border-border p-6 lg:p-8 shadow-card">
              {/* Trip Type Toggle */}
              <div className="flex gap-2 justify-end mb-6">
                <button type="button" onClick={() => setTripType("oneway")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${tripType === "oneway" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <Plane className="w-4 h-4" /> ذهاب فقط
                </button>
                <button type="button" onClick={() => setTripType("roundtrip")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${tripType === "roundtrip" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <RefreshCw className="w-4 h-4" /> ذهاب وعودة
                </button>
              </div>

              {/* Row 1: Departure & Arrival */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5 text-right">بلد المغادرة</label>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <CityAutocomplete value={from} onChange={setFrom} placeholder="اختر المدينة أو المطار" label="" showCode />
                    <select title="تصفية بلد المغادرة" className="bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none">
                      <option>الكل</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5 text-right">بلد الوصول</label>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <CityAutocomplete value={to} onChange={setTo} placeholder="اختر المدينة أو المطار" label="" showCode />
                    <select title="تصفية بلد الوصول" className="bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none">
                      <option>الكل</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 2: Dates */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5 text-right">تاريخ المغادرة</label>
                  <div className="bg-muted/50 border border-border rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <Input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} className="bg-transparent border-0 p-0 h-auto shadow-none" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5 text-right">تاريخ العودة</label>
                  <div className="bg-muted/50 border border-border rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
                      className="bg-transparent border-0 p-0 h-auto shadow-none" disabled={tripType === "oneway"} />
                  </div>
                </div>
              </div>

              {/* Row 3: Passengers, Class, Airline */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5 text-right">عدد المسافرين</label>
                  <div className="bg-muted/50 border border-border rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                    <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))}
                      title="عدد المسافرين"
                      className="bg-transparent w-full text-sm text-foreground outline-none text-right">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>مسافر {n}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5 text-right">درجة السفر</label>
                  <div className="bg-muted/50 border border-border rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-muted-foreground shrink-0" />
                    <select title="درجة السفر" className="bg-transparent w-full text-sm text-foreground outline-none text-right">
                      <option>الاقتصادية</option>
                      <option>رجال الأعمال</option>
                      <option>الأولى</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5 text-right">شركة الطيران (اختياري)</label>
                  <div className="bg-muted/50 border border-border rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-muted-foreground shrink-0" />
                    <select title="شركة الطيران" className="bg-transparent w-full text-sm text-foreground outline-none text-right">
                      <option>كل الشركات</option>
                      {airlines.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Search Button + Advanced Filter */}
              <div className="flex items-center justify-between">
                <button type="button" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  <Filter className="w-4 h-4" /> تصفية متقدمة
                </button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 py-3 font-bold text-base" type="submit" disabled={searching}>
                  {searching ? (
                    <><Loader2 className="w-5 h-5 ml-2 animate-spin" /> جاري البحث...</>
                  ) : (
                    <><Plane className="w-5 h-5 ml-2" /> ابحث عن رحلة</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Search Error */}
        {searchError && (
          <div className="container mx-auto px-4 lg:px-8 -mt-6 mb-8">
            <div className="max-w-5xl mx-auto p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-center">
              <p className="text-destructive font-medium flex items-center justify-center gap-2"><AlertCircle className="w-5 h-5" />{searchError}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setSearchError("")}>
                <RefreshCw className="w-4 h-4 ml-2" /> حاول مرة أخرى
              </Button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults && searchResults.length > 0 && (
          <section className="section-padding bg-muted/20">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-5xl mx-auto">
                <h3 className="text-xl font-bold mb-6 text-right">نتائج البحث ({searchResults.length} رحلة)</h3>
                <div className="space-y-4">
                  {searchResults.map((offer) => {
                    const outbound = offer.itineraries[0];
                    const firstSeg = outbound.segments[0];
                    const lastSeg = outbound.segments[outbound.segments.length - 1];
                    const stops = outbound.segments.length - 1;
                    const airline = offer.validatingAirlineCodes?.[0] || firstSeg.carrierCode;
                    return (
                      <div key={offer.id} className="flex flex-col lg:flex-row items-stretch rounded-2xl bg-card border border-border hover:border-primary/40 transition-all overflow-hidden">
                        <div className="flex-1 p-5 lg:p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <Plane className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-sm">{getAirlineName(airline)}</p>
                              <p className="text-xs text-muted-foreground">{airline}{firstSeg.number}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mb-2">
                            <div className="text-center">
                              <p className="text-xl font-bold">{new Date(firstSeg.departure.at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</p>
                              <p className="text-xs text-muted-foreground font-medium">{firstSeg.departure.iataCode}</p>
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-1">
                              <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(outbound.duration)}</p>
                              <div className="w-full h-px bg-border relative"><div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-primary" /></div>
                              <p className="text-xs text-muted-foreground">{stops === 0 ? "مباشر" : `${stops} توقف`}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xl font-bold">{new Date(lastSeg.arrival.at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</p>
                              <p className="text-xs text-muted-foreground font-medium">{lastSeg.arrival.iataCode}</p>
                            </div>
                          </div>
                          {offer.itineraries[1] && (
                            <div className="mt-3 pt-3 border-t border-border/30">
                              <p className="text-xs text-muted-foreground mb-1">العودة</p>
                              <div className="flex items-center gap-3 text-sm">
                                <span className="font-medium">{offer.itineraries[1].segments[0].departure.iataCode}</span>
                                <ArrowLeft className="w-3 h-3 text-muted-foreground" />
                                <span className="font-medium">{offer.itineraries[1].segments[offer.itineraries[1].segments.length - 1].arrival.iataCode}</span>
                                <span className="text-muted-foreground text-xs">• {formatDuration(offer.itineraries[1].duration)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="lg:border-r border-t lg:border-t-0 border-border p-5 lg:p-6 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-3 lg:min-w-[180px] bg-muted/30">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{parseFloat(offer.price.grandTotal).toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{offer.price.currency} / للشخص</p>
                          </div>
                          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl" onClick={() => handleBook(offer)} disabled={bookingLoading === offer.id}>
                            {bookingLoading === offer.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "احجز الآن"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Popular Destinations */}
        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => setDestTab("middleeast")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${destTab === "middleeast" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    أشهر الوجهات في الشرق الأوسط
                  </button>
                  <button onClick={() => setDestTab("international")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${destTab === "international" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    أشهر الوجهات الدولية
                  </button>
                  <button onClick={() => setDestTab("domestic")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${destTab === "domestic" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    أشهر الوجهات الداخلية
                  </button>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground">أشهر الوجهات</h2>
                  <p className="text-sm text-muted-foreground">اختر وجهتك بسرعة من أكثر الوجهات طلباً حسب المنطقة.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-2">
                {destList.map(d => (
                  <button key={d.code} onClick={() => setTo(d.name)}
                    className="flex items-center gap-2 justify-end py-2 text-sm text-foreground hover:text-primary transition-colors group">
                    <span className="group-hover:font-medium">{d.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 group-hover:bg-primary shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Airlines */}
        <section className="section-padding-sm bg-muted/20 border-t border-border/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <Button variant="outline" size="sm" className="rounded-full text-xs">عرض الكل</Button>
                <h2 className="text-2xl font-bold text-foreground text-right">أشهر شركات الطيران</h2>
              </div>
              <div className="flex flex-wrap gap-3 justify-end">
                {airlines.map(a => (
                  <div key={a.code} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/40 transition-colors cursor-pointer">
                    <span className="text-sm font-medium text-foreground">{a.name}</span>
                    <img src={a.logo} alt={a.name} className="w-8 h-8 object-contain" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Add-on Services */}
        <section className="section-padding bg-muted/10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-2">خدمات إضافية برحلتك</h2>
                <p className="text-sm text-muted-foreground">أضف هذه الخدمات لتجعل رحلتك أكثر راحة ومتعة</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {addOnServices.map((s, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-5 text-center hover:border-primary/40 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <s.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{s.title}</h3>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{s.desc}</p>
                    <div className="flex gap-2 justify-center mb-3">
                      <Button variant="outline" size="sm" className="rounded-full text-xs">الوصف</Button>
                      <Button variant="outline" size="sm" className="rounded-full text-xs">التفاصيل</Button>
                    </div>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm" onClick={() => navigate(s.link)}>
                      أضف الخدمة
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Booking Details & Post-Payment Info */}
        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
              {/* Right: Offer Details */}
              <div className="bg-card border border-border rounded-2xl p-6 text-right">
                <h3 className="text-xl font-bold text-foreground mb-3">تفاصيل ووصف العرض</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  عرض متكامل يشمل رحلة الطيران مع إمكانية الفندق والمواصلات والأنشطة في نفس المدينة.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">رقم الرحلة</p>
                    <p className="font-bold text-sm text-foreground">MSH 246</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">المحطة</p>
                    <p className="font-bold text-sm text-foreground">Terminal 2</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">البوابة</p>
                    <p className="font-bold text-sm text-foreground">Gate B12</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">وقت الإقلاع</p>
                    <p className="font-bold text-sm text-foreground">08:00 ص</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3 col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">موعد الوصول</p>
                    <p className="font-bold text-sm text-foreground">10:00 م</p>
                  </div>
                </div>

                {/* Tips */}
                <div className="mt-6 bg-primary/5 border border-primary/10 rounded-xl p-4">
                  <h4 className="font-bold text-sm text-primary mb-2 flex items-center gap-2 justify-end">
                    تنبيهات هامة <AlertCircle className="w-4 h-4" />
                  </h4>
                  <ul className="space-y-1 text-xs text-muted-foreground leading-relaxed list-disc list-inside text-right">
                    <li>تأكد من الحضور للمطار قبل 3 ساعات من الرحلة.</li>
                    <li>تأكد من صلاحية جواز السفر ومتطلبات التأشيرة للوجهة المستهدفة.</li>
                    <li>إمكانية إضافة الحقائب والمقعدات والأنشطة في طلب الحجز.</li>
                  </ul>
                </div>
              </div>

              {/* Left: Post Payment Info */}
              <div className="bg-card border border-border rounded-2xl p-6 text-right">
                <h3 className="text-xl font-bold text-foreground mb-3">بعد الدفع ستحصل على</h3>
                <ul className="space-y-3 mb-6">
                  {[
                    "تذكرة رقمية قابلة للمسح مع كود التحقق أو الباركود.",
                    "موقع حالة الوصول، رقم البوابة وتفاصيل الرحلة كاملة.",
                    "إمكانية حجز خدمات المقعد أو الموقعيات في مرحلة المستخدم.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 justify-end text-sm text-muted-foreground">
                      <span>{item}</span>
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    </li>
                  ))}
                </ul>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full rounded-xl">إضافة للسلة</Button>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold">الدفع المباشر</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PaywallGate>
  );
}
