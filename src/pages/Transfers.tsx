import { useState } from "react";
import { ArrowRightLeft, Search, Loader2, Clock, Users, MapPin, Car, CheckCircle, AlertCircle, Luggage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BookingStepper from "@/components/ui/BookingStepper";
import CityAutocomplete from "@/components/search/CityAutocomplete";
import { useAuthStore } from "@/stores/authStore";
import { useTenantStore } from "@/stores/tenantStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  searchTransfers,
  bookTransfer,
  type TransferOffer,
  type TransferSearchParams,
  formatDuration,
  getTransferTypeName,
  getVehicleName,
} from "@/lib/amadeusClient";

const transferSteps = [
  { label: "البحث" },
  { label: "اختيار العرض" },
  { label: "بيانات الراكب" },
  { label: "التأكيد" },
];

const cityToIata: Record<string, string> = {
  "الرياض": "RUH", "جدة": "JED", "الدمام": "DMM", "المدينة المنورة": "MED",
  "أبها": "AHB", "تبوك": "TUU", "دبي": "DXB", "القاهرة": "CAI",
  "اسطنبول": "IST", "لندن": "LHR", "باريس": "CDG", "نيويورك": "JFK",
};

function resolveIata(input: string): string {
  if (/^[A-Z]{3}$/.test(input.trim())) return input.trim();
  const mapped = cityToIata[input.trim()];
  if (mapped) return mapped;
  const match = input.match(/\(([A-Z]{3})\)/);
  if (match) return match[1];
  return input.trim().toUpperCase().slice(0, 3);
}

export default function Transfers() {
  const [currentStep, setCurrentStep] = useState(0);
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [transferTime, setTransferTime] = useState("10:00");
  const [passengers, setPassengers] = useState(2);
  const [transferType, setTransferType] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [offers, setOffers] = useState<TransferOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<TransferOffer | null>(null);

  // Booking form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const { isAuthenticated, user } = useAuthStore();
  const { tenant } = useTenantStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setOffers([]);

    const startCode = resolveIata(fromCity);
    if (!startCode || !transferDate) {
      toast({ title: "بيانات ناقصة", description: "يرجى تحديد موقع الانطلاق والتاريخ", variant: "destructive" });
      return;
    }

    setSearching(true);
    try {
      const params: TransferSearchParams = {
        startLocationCode: startCode,
        startDateTime: `${transferDate}T${transferTime || "10:00"}`,
        passengers,
        currency: "SAR",
      };

      const endCode = resolveIata(toCity);
      if (endCode && endCode !== startCode) {
        params.endLocationCode = endCode;
      }
      if (transferType) params.transferType = transferType;

      const result = await searchTransfers(params);
      const data = result.data || [];
      setOffers(data);
      setCurrentStep(data.length > 0 ? 1 : 0);

      if (data.length === 0) {
        setSearchError("لم يتم العثور على عروض نقل. جرّب تغيير الموقع أو التاريخ.");
      }
    } catch (err: any) {
      console.error("Transfer search error:", err);
      setSearchError(err.message || "حدث خطأ أثناء البحث");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectOffer = (offer: TransferOffer) => {
    if (!isAuthenticated || !user) {
      toast({ title: "يرجى تسجيل الدخول", description: "سجّل دخولك لإتمام الحجز", variant: "destructive" });
      navigate("/login");
      return;
    }
    setSelectedOffer(offer);
    setCurrentStep(2);
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer || !user) return;

    setBookingLoading(true);
    try {
      const result = await bookTransfer({
        offerId: selectedOffer.id,
        passengers: [{
          firstName,
          lastName,
          title: "MR",
          contacts: { phoneNumber: phone, email },
        }],
        payment: { methodOfPayment: "CREDIT_CARD" },
      });

      // Save to bookings table
      await supabase.from("bookings").insert({
        user_id: user.id,
        booking_type: "transfer",
        total_price: parseFloat(selectedOffer.quotation.monetaryAmount),
        currency: selectedOffer.quotation.currencyCode || "SAR",
        status: "confirmed",
        payment_status: "unpaid",
        tenant_id: tenant?.id || null,
        details_json: {
          transfer_type: selectedOffer.transferType,
          provider: selectedOffer.serviceProvider?.name,
          vehicle: selectedOffer.vehicle?.description,
          from: selectedOffer.start?.locationCode || selectedOffer.start?.name,
          to: selectedOffer.end?.locationCode || selectedOffer.end?.name,
          date: selectedOffer.start?.dateTime,
          duration: selectedOffer.duration,
          passengers,
          amadeus_response: result,
        },
      });

      setBookingResult(result);
      setCurrentStep(3);
      toast({ title: "تم الحجز بنجاح! 🚗", description: `${selectedOffer.serviceProvider?.name} - ${selectedOffer.quotation.monetaryAmount} ${selectedOffer.quotation.currencyCode}` });
    } catch (err: any) {
      toast({ title: "خطأ في الحجز", description: err.message || "تعذر إتمام الحجز", variant: "destructive" });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero + Search */}
      <section className="bg-gradient-to-b from-primary/80 via-primary/50 to-background pt-8 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <BookingStepper steps={transferSteps} currentStep={currentStep} className="max-w-2xl mx-auto mb-8" />

          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">النقل والمواصلات</h1>
            <p className="text-primary-foreground/80 text-sm">احجز نقلك من وإلى المطار — سيارة خاصة، تاكسي، فان، ليموزين</p>
          </div>

        {/* Step 0: Search */}
        {currentStep <= 1 && !selectedOffer && (
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto p-6 lg:p-8 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-card">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <CityAutocomplete value={fromCity} onChange={setFromCity} placeholder="مطار الانطلاق (مثال: الرياض)" label="من (كود IATA)" showCode />
              <CityAutocomplete value={toCity} onChange={setToCity} placeholder="الوجهة (مثال: جدة)" label="إلى (اختياري)" showCode />
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">تاريخ الرحلة</label>
                <div className="bg-muted/20 border border-border rounded-lg h-10 px-3 flex items-center">
                  <DatePickerField value={transferDate} onChange={setTransferDate} placeholder="اختر التاريخ" minDate={new Date()} />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">وقت الرحلة</label>
                <Input type="time" value={transferTime} onChange={(e) => setTransferTime(e.target.value)} className="bg-muted/20" required />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">عدد الركاب</label>
                <Input type="number" min={1} max={20} value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} className="bg-muted/20" dir="ltr" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">نوع النقل</label>
                <Select value={transferType} onValueChange={setTransferType}>
                  <SelectTrigger className="bg-muted/20">
                    <SelectValue placeholder="الكل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">الكل</SelectItem>
                    <SelectItem value="PRIVATE">نقل خاص</SelectItem>
                    <SelectItem value="SHARED">نقل مشترك</SelectItem>
                    <SelectItem value="TAXI">تاكسي</SelectItem>
                    <SelectItem value="HOURLY">بالساعة</SelectItem>
                    <SelectItem value="AIRPORT_EXPRESS">قطار المطار</SelectItem>
                    <SelectItem value="AIRPORT_BUS">باص المطار</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="gold" size="lg" className="w-full" type="submit" disabled={searching}>
              {searching ? (
                <><Loader2 className="w-5 h-5 ml-2 animate-spin" />جاري البحث...</>
              ) : (
                <><Search className="w-5 h-5 ml-2" />بحث عن خدمات النقل</>
              )}
            </Button>
          </form>
        )}
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 section-padding">
        {/* Error */}
        {searchError && (
          <div className="max-w-4xl mx-auto mb-8 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-center">
            <AlertCircle className="w-5 h-5 text-destructive mx-auto mb-2" />
            <p className="text-destructive font-medium">{searchError}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => { setSearchError(""); setCurrentStep(0); }}>حاول مرة أخرى</Button>
          </div>
        )}

        {/* Step 1: Results */}
        {currentStep === 1 && offers.length > 0 && !selectedOffer && (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-6">عروض النقل المتاحة ({offers.length} عرض)</h3>
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="flex flex-col lg:flex-row items-stretch rounded-2xl bg-card/70 border border-border/30 hover:border-primary/20 transition-all overflow-hidden group">
                  <div className="flex-1 p-5 lg:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Car className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{offer.serviceProvider?.name || "مزود الخدمة"}</p>
                        <Badge variant="secondary" className="text-xs">{getTransferTypeName(offer.transferType)}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span>{offer.start?.locationCode || offer.start?.name || "نقطة الانطلاق"}</span>
                      </div>
                      {offer.end && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span>{offer.end?.locationCode || offer.end?.name || "الوجهة"}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {offer.vehicle?.code && (
                        <span className="flex items-center gap-1">
                          <Car className="w-3.5 h-3.5" />
                          {getVehicleName(offer.vehicle.code)}
                        </span>
                      )}
                      {offer.vehicle?.description && (
                        <span>{offer.vehicle.description}</span>
                      )}
                      {offer.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(offer.duration)}
                        </span>
                      )}
                      {offer.vehicle?.seats?.[0]?.count && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {offer.vehicle.seats[0].count} مقعد
                        </span>
                      )}
                      {offer.vehicle?.baggages?.[0]?.count && (
                        <span className="flex items-center gap-1">
                          <Luggage className="w-3.5 h-3.5" />
                          {offer.vehicle.baggages[0].count} حقيبة
                        </span>
                      )}
                      {offer.distance && (
                        <span>{offer.distance.value} {offer.distance.unit}</span>
                      )}
                    </div>

                    {offer.cancellationRules && offer.cancellationRules.length > 0 && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">✓ إلغاء مجاني متاح</p>
                    )}
                  </div>

                  {/* Price + Book */}
                  <div className="lg:border-r border-t lg:border-t-0 border-border/30 p-5 lg:p-6 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-3 lg:min-w-[180px] bg-muted/20">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {parseFloat(offer.quotation.monetaryAmount).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{offer.quotation.currencyCode}</p>
                      {offer.quotation.isEstimated && (
                        <p className="text-xs text-amber-500 dark:text-amber-400">سعر تقديري</p>
                      )}
                    </div>
                    <Button variant="gold" onClick={() => handleSelectOffer(offer)} className="w-full lg:w-auto">
                      احجز الآن
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Passenger Details */}
        {currentStep === 2 && selectedOffer && !bookingResult && (
          <div className="max-w-2xl mx-auto">
            <div className="p-6 rounded-2xl bg-card/70 border border-border/30 mb-6">
              <h3 className="font-bold mb-3">ملخص العرض</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">المزود:</span> <span className="font-medium">{selectedOffer.serviceProvider?.name}</span></div>
                <div><span className="text-muted-foreground">النوع:</span> <span className="font-medium">{getTransferTypeName(selectedOffer.transferType)}</span></div>
                <div><span className="text-muted-foreground">المركبة:</span> <span className="font-medium">{selectedOffer.vehicle?.description || getVehicleName(selectedOffer.vehicle?.code || "")}</span></div>
                <div><span className="text-muted-foreground">السعر:</span> <span className="font-bold text-primary">{parseFloat(selectedOffer.quotation.monetaryAmount).toLocaleString()} {selectedOffer.quotation.currencyCode}</span></div>
              </div>
            </div>

            <form onSubmit={handleBook} className="p-6 rounded-2xl bg-card/70 border border-border/30 space-y-4">
              <h3 className="font-bold">بيانات الراكب الرئيسي</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">الاسم الأول (بالإنجليزية)</label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" required dir="ltr" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">اسم العائلة (بالإنجليزية)</label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" required dir="ltr" />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1">البريد الإلكتروني</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required dir="ltr" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1">رقم الهاتف</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+966501234567" required dir="ltr" />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => { setSelectedOffer(null); setCurrentStep(1); }} className="flex-1">
                  رجوع
                </Button>
                <Button type="submit" variant="gold" disabled={bookingLoading} className="flex-1">
                  {bookingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "تأكيد الحجز"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && bookingResult && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-8 rounded-2xl bg-card/70 border border-border/30">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">تم الحجز بنجاح!</h3>
              <p className="text-muted-foreground mb-6">تم تأكيد حجز النقل الخاص بك</p>

              {selectedOffer && (
                <div className="text-sm space-y-2 mb-6 text-right bg-muted/20 p-4 rounded-xl">
                  <p><span className="text-muted-foreground">المزود:</span> {selectedOffer.serviceProvider?.name}</p>
                  <p><span className="text-muted-foreground">النوع:</span> {getTransferTypeName(selectedOffer.transferType)}</p>
                  <p><span className="text-muted-foreground">المبلغ:</span> <span className="font-bold text-primary">{parseFloat(selectedOffer.quotation.monetaryAmount).toLocaleString()} {selectedOffer.quotation.currencyCode}</span></p>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button variant="gold" onClick={() => navigate("/dashboard/bookings")}>عرض حجوزاتي</Button>
                <Button variant="outline" onClick={() => {
                  setCurrentStep(0);
                  setOffers([]);
                  setSelectedOffer(null);
                  setBookingResult(null);
                  setFirstName(""); setLastName(""); setEmail(""); setPhone("");
                }}>حجز جديد</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
