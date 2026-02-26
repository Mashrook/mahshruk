import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Hotel as HotelIcon, Star, Search, SlidersHorizontal, MapPin,
  Wifi, Coffee, Waves, Car, Dumbbell, Sparkles, Baby, Briefcase, ConciergeBell,
  ChevronLeft, ShoppingCart, Loader2, RefreshCw, Users, Heart, ArrowUpDown,
  Phone, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { hotels as staticHotels } from "@/data/hotelsData";
import { useHotelCartStore } from "@/stores/hotelCartStore";
import CityAutocomplete from "@/components/search/CityAutocomplete";
import {
  searchHotelsByCity,
  getHotelOffers,
  type AmadeusHotelOffer,
  type AmadeusHotelListItem,
  getCityName,
} from "@/lib/amadeusClient";

const cityToIata: Record<string, string> = {
  "الرياض": "RUH", "جدة": "JED", "الدمام": "DMM", "المدينة المنورة": "MED",
  "أبها": "AHB", "تبوك": "TUU", "الطائف": "TIF", "مكة المكرمة": "MKX",
  "دبي": "DXB", "القاهرة": "CAI", "إسطنبول": "IST", "لندن": "LHR", "باريس": "CDG",
};

function resolveIata(input: string): string {
  if (/^[A-Z]{3}$/.test(input.trim())) return input.trim();
  const mapped = cityToIata[input.trim()];
  if (mapped) return mapped;
  const match = input.match(/\(([A-Z]{3})\)/);
  if (match) return match[1];
  return input.trim().toUpperCase().slice(0, 3);
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  coffee: <Coffee className="w-4 h-4" />,
  waves: <Waves className="w-4 h-4" />,
  car: <Car className="w-4 h-4" />,
  dumbbell: <Dumbbell className="w-4 h-4" />,
  sparkles: <Sparkles className="w-4 h-4" />,
  baby: <Baby className="w-4 h-4" />,
  briefcase: <Briefcase className="w-4 h-4" />,
  "concierge-bell": <ConciergeBell className="w-4 h-4" />,
};

const tagColors: Record<string, string> = {
  "فاخر": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "عائلي": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "رجال أعمال": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "الأكثر طلباً": "bg-red-500/20 text-red-400 border-red-500/30",
  "قريب من الحرم": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "إطلالة بحرية": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "إطلالة جبلية": "bg-green-500/20 text-green-400 border-green-500/30",
  "اقتصادي": "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

function getRatingLabel(rating: number) {
  if (rating >= 9) return "ممتاز";
  if (rating >= 8) return "جيد جداً";
  if (rating >= 7) return "جيد";
  return "مقبول";
}

type ViewMode = "static" | "live";
type SortMode = "popular" | "price_asc" | "price_desc" | "rating";

const amenityFilterOptions = [
  { key: "wifi", label: "واي فاي مجاني" },
  { key: "coffee", label: "إفطار شامل" },
  { key: "waves", label: "مسبح" },
  { key: "car", label: "موقف سيارات" },
  { key: "dumbbell", label: "صالة رياضية" },
  { key: "sparkles", label: "سبا" },
];

const quickFilters = [
  { label: "أقل سعر", value: "price_asc" as SortMode },
  { label: "الأكثر طلباً", value: "popular" as SortMode },
  { label: "خيارات مع إفطار", value: "breakfast" },
  { label: "إلغاء مجاني", value: "cancellable" },
  { label: "فنادق عائلية", value: "family" },
];

export default function Hotels() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const cartItems = useHotelCartStore((s) => s.items);

  // Static filters
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [starsFilter, setStarsFilter] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("popular");

  // Live search state
  const [viewMode, setViewMode] = useState<ViewMode>("static");
  const [liveCity, setLiveCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [searching, setSearching] = useState(false);
  const [liveResults, setLiveResults] = useState<AmadeusHotelOffer[]>([]);
  const [searchError, setSearchError] = useState("");

  const cities = useMemo(() => [...new Set(staticHotels.map((h) => h.city))], []);

  const filteredStaticHotels = useMemo(() => {
    let filtered = staticHotels.filter((h) => {
      if (searchQuery && !h.name.includes(searchQuery) && !h.city.includes(searchQuery) && !h.area.includes(searchQuery)) return false;
      if (cityFilter !== "all" && h.city !== cityFilter) return false;
      if (starsFilter.length > 0 && !starsFilter.includes(h.stars)) return false;
      if (h.minPrice < priceRange[0] || h.minPrice > priceRange[1]) return false;
      if (amenityFilters.length > 0) {
        const hotelAmenityKeys = h.amenities.map((a) => a.icon);
        if (!amenityFilters.every((f) => hotelAmenityKeys.includes(f))) return false;
      }
      return true;
    });

    // Sort
    switch (sortMode) {
      case "price_asc":
        filtered = [...filtered].sort((a, b) => a.minPrice - b.minPrice);
        break;
      case "price_desc":
        filtered = [...filtered].sort((a, b) => b.minPrice - a.minPrice);
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
      default:
        filtered = [...filtered].sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
    }

    return filtered;
  }, [searchQuery, cityFilter, starsFilter, priceRange, amenityFilters, sortMode]);

  const { setSelectedOffer, setSearchParams } = useHotelCartStore();

  const handleSelectLiveOffer = (hotel: AmadeusHotelOffer, offerId: string) => {
    setSelectedOffer(hotel, offerId);
    setSearchParams({ cityCode: resolveIata(liveCity), checkIn, checkOut, adults, rooms });
    navigate("/hotel-booking");
  };

  const handleLiveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");

    const cityCode = resolveIata(liveCity);
    if (!cityCode || !checkIn || !checkOut) {
      toast({ title: "بيانات ناقصة", description: "يرجى تحديد المدينة وتواريخ الإقامة", variant: "destructive" });
      return;
    }

    setSearching(true);
    setViewMode("live");
    try {
      const hotelList = await searchHotelsByCity(cityCode);
      const hotelIds = (hotelList.data || []).slice(0, 20).map((h: AmadeusHotelListItem) => h.hotelId);

      if (hotelIds.length === 0) {
        setSearchError("لم يتم العثور على فنادق في هذه المدينة");
        setLiveResults([]);
        return;
      }

      const offersResult = await getHotelOffers({
        hotelIds,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        adults,
        roomQuantity: rooms,
      });

      const offers = (offersResult.data || []).filter((o: AmadeusHotelOffer) => o.available && o.offers?.length > 0);
      setLiveResults(offers);

      if (offers.length === 0) {
        setSearchError("لم يتم العثور على عروض متاحة. جرّب تغيير التواريخ أو المدينة.");
      }
    } catch (err: any) {
      console.error("Hotel search error:", err);
      setSearchError(err.message || "حدث خطأ أثناء البحث");
      setLiveResults([]);
    } finally {
      setSearching(false);
    }
  };

  const toggleStarFilter = (star: number) => {
    setStarsFilter((prev) => prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]);
  };

  const toggleAmenityFilter = (key: string) => {
    setAmenityFilters((prev) => prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]);
  };

  return (
    <div className="min-h-screen">
      {/* Hero + Search */}
      <section className="bg-gradient-to-b from-primary/80 via-primary/50 to-background pt-10 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-primary-foreground/70 text-sm mb-2 flex items-center justify-center gap-2">
              <HotelIcon className="w-4 h-4" />
              أكثر من ٥٠٠ فندق حول العالم
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-3">
              اكتشف أفضل الفنادق واحجز بأقل الأسعار
            </h1>
            <p className="text-primary-foreground/80 text-sm max-w-xl mx-auto">
              قارن الأسعار من مئات المواقع واحصل على أفضل عروض الفنادق
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleLiveSearch} className="max-w-5xl mx-auto p-5 lg:p-6 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-card">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs text-muted-foreground block mb-1 text-right">الوجهة</label>
                <CityAutocomplete value={liveCity} onChange={setLiveCity} placeholder="اختر المدينة" label="" showCode />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1 text-right">تاريخ الوصول</label>
                <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="bg-muted/30 h-10" required />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1 text-right">تاريخ المغادرة</label>
                <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="bg-muted/30 h-10" required />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1 text-right">الضيوف</label>
                <div className="bg-muted/30 border border-border rounded-lg px-3 h-10 flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <select value={adults} onChange={(e) => setAdults(Number(e.target.value))}
                    title="عدد الضيوف"
                    className="bg-transparent w-full text-sm text-foreground outline-none text-right">
                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} ضيف</option>)}
                  </select>
                </div>
              </div>
              <div>
                <Button variant="gold" size="lg" className="w-full h-10" type="submit" disabled={searching}>
                  {searching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <><Search className="w-4 h-4 ml-1" /> أبحث عن فندق</>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 -mt-8">
        {/* Quick Filter Tags */}
        <div className="max-w-5xl mx-auto mb-6">
          <div className="flex flex-wrap items-center gap-2 justify-center">
            {quickFilters.map((f) => (
              <button
                key={f.value}
                className="px-4 py-2 rounded-full text-xs font-medium border border-border/50 bg-card/80 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Error */}
        {searchError && (
          <div className="max-w-5xl mx-auto mb-8 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-center">
            <p className="text-destructive font-medium">{searchError}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => { setSearchError(""); setViewMode("static"); }}>
              <RefreshCw className="w-4 h-4 ml-2" /> عرض الفنادق المميزة
            </Button>
          </div>
        )}

        {/* Live Results */}
        {viewMode === "live" && liveResults.length > 0 && (
          <div className="max-w-5xl mx-auto mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">نتائج البحث ({liveResults.length} فندق)</h3>
              <Button variant="outline" size="sm" onClick={() => setViewMode("static")}>عرض الفنادق المميزة</Button>
            </div>
            <div className="space-y-4">
              {liveResults.map((hotel) => {
                const offer = hotel.offers[0];
                const price = parseFloat(offer.price.total);
                const roomDesc = offer.room?.description?.text || offer.room?.typeEstimated?.category || "غرفة قياسية";
                const bedType = offer.room?.typeEstimated?.bedType;
                const beds = offer.room?.typeEstimated?.beds;
                const cancellable = offer.policies?.cancellations?.[0];

                return (
                  <div key={hotel.hotel.hotelId + offer.id} className="rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-48 lg:w-56 h-40 md:h-auto bg-muted/30 flex items-center justify-center shrink-0">
                        <HotelIcon className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                      <div className="flex-1 p-5 lg:p-6">
                        <h3 className="text-lg font-bold mb-1">{hotel.hotel.name}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4" />
                          <span>{getCityName(hotel.hotel.cityCode || "")}</span>
                          {hotel.hotel.chainCode && (
                            <Badge variant="outline" className="mr-2 text-xs">{hotel.hotel.chainCode}</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-lg">{roomDesc}</span>
                          {bedType && <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-lg">{beds} {bedType}</span>}
                          {cancellable && (
                            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                              إلغاء مجاني
                            </span>
                          )}
                        </div>
                        {hotel.offers.length > 1 && (
                          <p className="text-xs text-muted-foreground mb-2">{hotel.offers.length} عروض متاحة</p>
                        )}
                      </div>
                      <div className="md:border-r border-t md:border-t-0 border-border/30 p-5 lg:p-6 flex flex-row md:flex-col items-center justify-between md:justify-center gap-3 md:min-w-[180px] bg-muted/10">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{price.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{offer.price.currency} / إجمالي</p>
                        </div>
                        <Button variant="gold" className="w-full md:w-auto mt-2" onClick={() => handleSelectLiveOffer(hotel, offer.id)}>
                          احجز الآن
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Static Hotels Section */}
        {viewMode === "static" && (
          <div className="max-w-6xl mx-auto py-8">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">{filteredStaticHotels.length} فندق متاح</h2>
                <p className="text-xs text-muted-foreground">من {priceRange[0].toLocaleString()} إلى {priceRange[1].toLocaleString()} ر.س / ليلة</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={sortMode === "popular" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortMode("popular")}
                  className="text-xs"
                >
                  الأنظر مبيعاً
                </Button>
                <Button
                  variant={sortMode === "price_asc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortMode("price_asc")}
                  className="text-xs"
                >
                  الأقل سعراً
                </Button>
                <Button
                  variant={sortMode === "price_desc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortMode("price_desc")}
                  className="text-xs"
                >
                  الأعلى سعراً
                </Button>
                <Button
                  variant={sortMode === "rating" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortMode("rating")}
                  className="text-xs"
                >
                  الأعلى تقييماً
                </Button>
              </div>
            </div>

            <div className="flex gap-6">
              {/* Sidebar Filters */}
              <aside className="hidden lg:block w-72 shrink-0 space-y-5 sticky top-24 self-start">
                {/* Price Range */}
                <div className="rounded-2xl bg-card border border-border/50 p-5">
                  <h3 className="font-bold text-sm mb-4">ميزانية الليلة (ر.س)</h3>
                  <Slider min={0} max={5000} step={100} value={priceRange} onValueChange={setPriceRange} className="mb-3" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{priceRange[0].toLocaleString()}</span>
                    <span>{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="rounded-2xl bg-card border border-border/50 p-5">
                  <h3 className="font-bold text-sm mb-4">تصنيف النجوم</h3>
                  <div className="flex gap-2">
                    {[2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => toggleStarFilter(star)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                          starsFilter.includes(star)
                            ? "bg-primary/15 border-primary/40 text-primary"
                            : "bg-muted/30 border-border/50 text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="rounded-2xl bg-card border border-border/50 p-5">
                  <h3 className="font-bold text-sm mb-4">المرافق والخدمات</h3>
                  <div className="space-y-3">
                    {amenityFilterOptions.map((a) => (
                      <label key={a.key} className="flex items-center gap-2.5 cursor-pointer group">
                        <Checkbox
                          checked={amenityFilters.includes(a.key)}
                          onCheckedChange={() => toggleAmenityFilter(a.key)}
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{a.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Search by Name */}
                <div className="rounded-2xl bg-card border border-border/50 p-5">
                  <h3 className="font-bold text-sm mb-3">فندق بعينه</h3>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="بالاسم أو المدينة..."
                    className="bg-muted/30 h-9 text-sm"
                  />
                </div>

                {/* City Filter */}
                <div className="rounded-2xl bg-card border border-border/50 p-5">
                  <h3 className="font-bold text-sm mb-3">المدينة</h3>
                  <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger className="bg-muted/30 h-9 text-sm">
                      <SelectValue placeholder="جميع المدن" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المدن</SelectItem>
                      {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cart Button */}
                <Button variant="outline" className="w-full gap-2 relative" onClick={() => navigate("/hotel-cart")}>
                  <ShoppingCart className="w-4 h-4" /> سلة الحجوزات
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {cartItems.length}
                    </span>
                  )}
                </Button>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCityFilter("all");
                    setStarsFilter([]);
                    setPriceRange([0, 5000]);
                    setAmenityFilters([]);
                  }}
                  className="text-xs text-primary hover:underline w-full text-center"
                >
                  مسح جميع الفلاتر
                </button>
              </aside>

              {/* Hotel Cards */}
              <div className="flex-1 space-y-5">
                {filteredStaticHotels.map((hotel, idx) => (
                  <div
                    key={hotel.id}
                    className="group rounded-2xl bg-card border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-card-hover transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${idx * 0.06}s` }}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Hotel Image */}
                      <div className="relative md:w-72 lg:w-80 h-56 md:h-auto shrink-0">
                        <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" loading="lazy" />
                        {/* Tags */}
                        <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
                          {hotel.tags.map((tag) => (
                            <span key={tag} className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border backdrop-blur-sm ${tagColors[tag] || "bg-muted/80 text-foreground border-border"}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        {/* Save Button */}
                        <button aria-label="حفظ الفندق في المفضلة" className="absolute top-3 left-3 w-8 h-8 rounded-full bg-card/70 backdrop-blur flex items-center justify-center hover:bg-primary/20 transition-colors">
                          <Heart className="w-4 h-4 text-foreground/70" />
                        </button>
                        {/* Stars */}
                        <div className="absolute bottom-3 right-3 flex gap-0.5">
                          {Array.from({ length: hotel.stars }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      {/* Hotel Info */}
                      <div className="flex-1 p-5 flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{hotel.name}</h3>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{hotel.city}، {hotel.area}</span>
                            </div>
                          </div>
                          {/* Rating Badge */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-left">
                              <p className="text-xs font-bold">{getRatingLabel(hotel.rating)}</p>
                              <p className="text-[10px] text-muted-foreground">{hotel.reviewsCount.toLocaleString()} تقييم</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center">
                              <span className="text-sm font-bold text-primary-foreground">{hotel.rating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-3 mb-3">
                          {hotel.amenities.slice(0, 4).map((a) => (
                            <div key={a.label} className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span className="text-primary/70">{amenityIcons[a.icon] || <Sparkles className="w-3.5 h-3.5" />}</span>
                              {a.label}
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => navigate(`/hotels/${hotel.id}`)}
                          className="text-xs text-primary hover:underline mb-3 self-start"
                        >
                          عرض التفاصيل والغرف المتاحة →
                        </button>

                        {/* Price + Book */}
                        <div className="mt-auto flex items-end justify-between pt-3 border-t border-border/30">
                          <Button variant="gold" className="gap-2" onClick={() => navigate(`/hotels/${hotel.id}`)}>
                            اعرض العرض
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <div className="text-left">
                            <p className="text-[10px] text-muted-foreground">يبدأ من</p>
                            <p className="text-2xl font-bold text-primary">
                              {hotel.minPrice.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-muted-foreground">ر.س / ليلة</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredStaticHotels.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <HotelIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">لم يتم العثور على فنادق تطابق البحث</p>
                    <button onClick={() => { setSearchQuery(""); setCityFilter("all"); setStarsFilter([]); setPriceRange([0, 5000]); setAmenityFilters([]); }}
                      className="text-sm text-primary hover:underline mt-3">
                      مسح الفلاتر
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
