import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Calendar, Moon, Users, Tag, CreditCard, ChevronLeft, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useHotelCartStore } from "@/stores/hotelCartStore";
import { useAuthStore } from "@/stores/authStore";
import { useTenantStore } from "@/stores/tenantStore";
import { supabase } from "@/integrations/supabase/client";
import BookingStepper from "@/components/ui/BookingStepper";

const bookingSteps = [
  { label: "اختيار الغرفة" },
  { label: "مراجعة السلة" },
  { label: "الدفع" },
  { label: "التأكيد" },
];

export default function HotelCart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuthStore();
  const { tenant } = useTenantStore();
  const { items, coupon, discount, removeItem, setCoupon, applyCoupon, getSubtotal, getTotal, clearCart } = useHotelCartStore();

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      toast({ title: "يرجى تسجيل الدخول", description: "سجّل دخولك لإتمام الحجز", variant: "destructive" });
      navigate("/login");
      return;
    }

    try {
      for (const item of items) {
        const { error } = await supabase.from("bookings").insert({
          user_id: user.id,
          booking_type: "hotel",
          total_price: item.totalPrice,
          currency: "SAR",
          status: "pending",
          payment_status: "unpaid",
          tenant_id: tenant?.id || null,
          details_json: {
            hotel_name: item.hotelName,
            room_name: item.roomName,
            check_in: item.checkIn,
            check_out: item.checkOut,
            nights: item.nights,
            price_per_night: item.pricePerNight,
            guests: item.guests,
          },
        });
        if (error) throw error;
      }
      toast({ title: "تم الحجز بنجاح! 🏨", description: `${items.length} حجز تم إنشاؤه` });
      clearCart();
      navigate("/dashboard/bookings");
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message || "تعذر إتمام الحجز", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen section-padding">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Stepper */}
        <BookingStepper steps={bookingSteps} currentStep={1} className="max-w-2xl mx-auto mb-12" />

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">سلة الحجوزات</h2>
                <p className="text-sm text-muted-foreground">{items.length} عنصر</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => navigate("/hotels")} className="gap-2">
              متابعة التصفح
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 rounded-3xl bg-card/50 border border-border/30">
              <Hotel className="w-20 h-20 mx-auto mb-4 text-muted-foreground/20" />
              <p className="text-xl font-bold mb-2">السلة فارغة</p>
              <p className="text-muted-foreground mb-6">لم تقم بإضافة أي حجوزات بعد</p>
              <Button variant="gold" size="lg" onClick={() => navigate("/hotels")}>تصفح الفنادق</Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.roomId} className="rounded-2xl bg-card/70 border border-border/30 overflow-hidden hover:border-primary/20 transition-all">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-44 h-36 sm:h-auto shrink-0 overflow-hidden">
                        <img src={item.roomImage} alt={item.roomName} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{item.hotelName}</h3>
                            <p className="text-sm text-muted-foreground">{item.roomName}</p>
                          </div>
                          <Button variant="ghost" size="icon-sm" onClick={() => removeItem(item.roomId)} className="text-destructive hover:text-destructive/80 hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1.5 bg-muted/30 px-2.5 py-1 rounded-lg"><Calendar className="w-3.5 h-3.5" /> {item.checkIn}</span>
                          <span className="flex items-center gap-1.5 bg-muted/30 px-2.5 py-1 rounded-lg"><Calendar className="w-3.5 h-3.5" /> {item.checkOut}</span>
                          <span className="flex items-center gap-1.5 bg-muted/30 px-2.5 py-1 rounded-lg"><Moon className="w-3.5 h-3.5" /> {item.nights} {item.nights > 1 ? "ليالي" : "ليلة"}</span>
                          <span className="flex items-center gap-1.5 bg-muted/30 px-2.5 py-1 rounded-lg"><Users className="w-3.5 h-3.5" /> {item.guests}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-primary">{item.totalPrice.toLocaleString()}</span>
                          <span className="text-sm text-muted-foreground">ر.س</span>
                          <span className="text-xs text-muted-foreground mr-1">({item.pricePerNight.toLocaleString()} × {item.nights})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Sidebar */}
              <div className="space-y-4">
                {/* Coupon */}
                <div className="rounded-2xl bg-card/70 border border-border/30 p-5">
                  <h3 className="font-bold mb-3 flex items-center gap-2"><Tag className="w-4 h-4 text-primary" /> كوبون الخصم</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="أدخل الكوبون"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="bg-muted/20"
                    />
                    <Button variant="outline" onClick={applyCoupon} className="shrink-0">تطبيق</Button>
                  </div>
                  {discount > 0 && (
                    <p className="text-sm text-emerald-400 mt-2">✓ خصم {discount}% مطبق</p>
                  )}
                </div>

                {/* Total */}
                <div className="rounded-2xl bg-card/70 border border-border/30 p-5">
                  <h3 className="font-bold mb-4">ملخص الحجز</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الإجمالي الفرعي</span>
                      <span>{getSubtotal().toLocaleString()} ر.س</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>الخصم ({discount}%)</span>
                        <span>- {((getSubtotal() * discount) / 100).toLocaleString()} ر.س</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>الضرائب</span>
                      <span>شاملة</span>
                    </div>
                    <div className="border-t border-border/30 pt-3 flex justify-between text-lg font-bold">
                      <span>الإجمالي</span>
                      <span className="text-primary">{getTotal().toLocaleString()} ر.س</span>
                    </div>
                  </div>
                  <Button variant="gold" size="lg" className="w-full mt-5 gap-2" onClick={handleCheckout}>
                    <CreditCard className="w-5 h-5" />
                    المتابعة للدفع
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">🔒 الدفع آمن ومشفّر</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
