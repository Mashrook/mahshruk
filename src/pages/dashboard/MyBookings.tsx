import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Plane, Hotel, Car, Map, ArrowRightLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const bookingTypeIcons: Record<string, any> = {
  flight: Plane, hotel: Hotel, car: Car, tour: Map, transfer: ArrowRightLeft,
};
const bookingTypeLabels: Record<string, string> = {
  flight: "رحلة طيران", hotel: "فندق", car: "سيارة", tour: "جولة", transfer: "تحويل",
};
const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار", confirmed: "مؤكد", cancelled: "ملغي", completed: "مكتمل",
};
const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning", confirmed: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive", completed: "bg-primary/10 text-primary",
};

export default function MyBookings() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) toast({ title: "خطأ", description: "تعذر تحميل الحجوزات", variant: "destructive" });
      else setBookings(data || []);
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">حجوزاتي</h1>
        {loading ? (
          <p className="text-muted-foreground">جاري التحميل...</p>
        ) : bookings.length === 0 ? (
          <div className="p-12 rounded-2xl bg-card border border-border/50 text-center">
            <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد حجوزات بعد</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const Icon = bookingTypeIcons[b.booking_type] || CalendarDays;
              return (
                <div key={b.id} className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{bookingTypeLabels[b.booking_type] || b.booking_type}</p>
                    <p className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleDateString("ar-SA")}</p>
                  </div>
                  <span className="font-bold text-primary">{b.total_price} {b.currency}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[b.status] || "bg-muted text-muted-foreground"}`}>
                    {statusLabels[b.status] || b.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
