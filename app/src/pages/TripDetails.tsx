import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  Users,
  Check,
  AlertTriangle,
  FileText,
  Sun,
  CreditCard,
  ArrowLeft,
  Plane,
  Loader2,
} from "lucide-react";

interface Trip {
  id: string;
  title: string;
  destination: string;
  country: string;
  description: string;
  image_url: string;
  price: number;
  original_price: number | null;
  duration_days: number;
  included_services: string[];
  visa_required: boolean;
  visa_info: string;
  travel_procedures: string;
  best_season: string;
  rating: number;
  reviews_count: number;
}

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const [bookingData, setBookingData] = useState({
    travelDate: "",
    numTravelers: 1,
    contactPhone: "",
    specialRequests: "",
  });

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "خطأ",
        description: "لم يتم العثور على الرحلة",
        variant: "destructive",
      });
      navigate("/trips");
    } else {
      setTrip(data as Trip);
    }
    setLoading(false);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "قم بتسجيل الدخول أولاً لإتمام الحجز",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!trip) return;

    setBookingLoading(true);

    const totalPrice = trip.price * bookingData.numTravelers;

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      trip_id: trip.id,
      travel_date: bookingData.travelDate,
      num_travelers: bookingData.numTravelers,
      total_price: totalPrice,
      contact_phone: bookingData.contactPhone,
      special_requests: bookingData.specialRequests,
    });

    setBookingLoading(false);

    if (error) {
      toast({
        title: "خطأ في الحجز",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم الحجز بنجاح! 🎉",
        description: "سنتواصل معك قريباً لتأكيد الحجز",
      });
      setShowBookingForm(false);
      navigate("/profile");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!trip) return null;

  const discount = trip.original_price
    ? Math.round(((trip.original_price - trip.price) / trip.original_price) * 100)
    : 0;

  return (
    <Layout>
      <section className="relative h-[50vh] min-h-[400px]">
        <img src={trip.image_url} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <Button
              variant="ghost"
              className="mb-4 gap-2 bg-background/50 backdrop-blur-sm"
              onClick={() => navigate("/trips")}
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للرحلات
            </Button>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold mb-2">{trip.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {trip.destination}، {trip.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {trip.duration_days} أيام
                  </span>
                  <span className="flex items-center gap-1 text-secondary">
                    <Star className="w-4 h-4 fill-secondary" />
                    {trip.rating} ({trip.reviews_count} تقييم)
                  </span>
                </div>
              </div>
              <div className="text-left">
                {discount > 0 && (
                  <span className="bg-destructive text-destructive-foreground text-sm px-3 py-1 rounded-full">
                    خصم {discount}%
                  </span>
                )}
                <div className="flex items-baseline gap-2 mt-2">
                  {trip.original_price && (
                    <span className="text-xl text-muted-foreground line-through">
                      {trip.original_price.toLocaleString()} ر.س
                    </span>
                  )}
                  <span className="text-4xl font-bold text-primary">
                    {trip.price.toLocaleString()} ر.س
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">للشخص الواحد</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h2 className="text-xl font-bold mb-4">عن الرحلة</h2>
                <p className="text-muted-foreground leading-relaxed">{trip.description}</p>
              </div>

              {trip.included_services && trip.included_services.length > 0 && (
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <h2 className="text-xl font-bold mb-4">الخدمات المشمولة</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {trip.included_services.map((service, index) => (
                      <div key={index} className="flex items-center gap-3 bg-muted p-3 rounded-xl">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        trip.visa_required ? "bg-destructive/10" : "bg-primary/10"
                      }`}
                    >
                      {trip.visa_required ? (
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                      ) : (
                        <Check className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold">متطلبات التأشيرة</h3>
                      <p className={`text-sm ${trip.visa_required ? "text-destructive" : "text-primary"}`}>
                        {trip.visa_required ? "تأشيرة مطلوبة" : "لا تحتاج تأشيرة"}
                      </p>
                    </div>
                  </div>
                  {trip.visa_info && <p className="text-muted-foreground text-sm">{trip.visa_info}</p>}
                </div>

                {trip.travel_procedures && (
                  <div className="bg-card rounded-2xl p-6 shadow-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-secondary" />
                      </div>
                      <h3 className="font-bold">إجراءات السفر</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{trip.travel_procedures}</p>
                  </div>
                )}

                {trip.best_season && (
                  <div className="bg-card rounded-2xl p-6 shadow-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                        <Sun className="w-6 h-6 text-accent-foreground" />
                      </div>
                      <h3 className="font-bold">أفضل موسم للزيارة</h3>
                    </div>
                    <p className="text-muted-foreground">{trip.best_season}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-hover sticky top-24">
                {!showBookingForm ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 hero-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Plane className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-bold">احجز هذه الرحلة</h3>
                      <p className="text-muted-foreground text-sm mt-1">تواصل معنا لتأكيد حجزك</p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-muted-foreground">السعر</span>
                        <span className="font-bold text-primary">{trip.price.toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-muted-foreground">المدة</span>
                        <span className="font-semibold">{trip.duration_days} أيام</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-muted-foreground">الوجهة</span>
                        <span className="font-semibold">{trip.country}</span>
                      </div>
                    </div>

                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        if (!user) {
                          toast({
                            title: "يجب تسجيل الدخول",
                            description: "قم بتسجيل الدخول أولاً لإتمام الحجز",
                          });
                          navigate("/auth");
                        } else {
                          setShowBookingForm(true);
                        }
                      }}
                    >
                      احجز الآن
                    </Button>
                  </>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <h3 className="text-xl font-bold text-center mb-4">نموذج الحجز</h3>

                    <div className="space-y-2">
                      <Label htmlFor="travelDate">تاريخ السفر</Label>
                      <div className="relative">
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="travelDate"
                          type="date"
                          className="pr-10"
                          required
                          value={bookingData.travelDate}
                          onChange={(e) => setBookingData({ ...bookingData, travelDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numTravelers">عدد المسافرين</Label>
                      <div className="relative">
                        <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="numTravelers"
                          type="number"
                          min="1"
                          max="20"
                          className="pr-10"
                          required
                          value={bookingData.numTravelers}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              numTravelers: parseInt(e.target.value) || 1,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">رقم الجوال</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="+966 5X XXX XXXX"
                        required
                        value={bookingData.contactPhone}
                        onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialRequests">طلبات خاصة (اختياري)</Label>
                      <Textarea
                        id="specialRequests"
                        placeholder="أي طلبات أو ملاحظات إضافية..."
                        value={bookingData.specialRequests}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, specialRequests: e.target.value })
                        }
                      />
                    </div>

                    <div className="bg-muted rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span>المجموع</span>
                        <span className="text-2xl font-bold text-primary">
                          {(trip.price * bookingData.numTravelers).toLocaleString()} ر.س
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setShowBookingForm(false)}>
                        إلغاء
                      </Button>
                      <Button type="submit" variant="hero" className="flex-1" disabled={bookingLoading}>
                        {bookingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "تأكيد الحجز"}
                      </Button>
                    </div>
                  </form>
                )}

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">طرق الدفع</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Apple Pay", "مدى", "Visa", "Mastercard"].map((method) => (
                      <span key={method} className="bg-muted px-3 py-1 rounded-full text-xs font-medium">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
