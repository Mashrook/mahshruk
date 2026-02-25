import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Heart, Bell, User, Settings, Plane, Hotel, Car, Map, ArrowRightLeft } from "lucide-react";
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

export default function Dashboard() {
  const { user, profile } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) {
        toast({ title: "خطأ", description: "تعذر تحميل الحجوزات", variant: "destructive" });
      } else {
        setBookings(data || []);
      }
      setLoadingBookings(false);
    };
    fetchBookings();
  }, [user]);

  const dashboardCards = [
    { icon: CalendarDays, title: "حجوزاتي", desc: "عرض وإدارة حجوزاتك", href: "/dashboard/bookings", count: bookings.length },
    { icon: Heart, title: "المحفوظات", desc: "العناصر المحفوظة", href: "/dashboard/saved", count: 0 },
    { icon: Bell, title: "الإشعارات", desc: "آخر التحديثات", href: "/dashboard/notifications", count: 0 },
    { icon: Settings, title: "الإعدادات", desc: "إدارة حسابك", href: "/dashboard/settings", count: null },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">مرحباً، {profile?.full_name || user?.email || "مستخدم"}</h1>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {dashboardCards.map((card) => (
            <Link key={card.href} to={card.href}>
              <div className="group p-6 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <card.icon className="w-6 h-6 text-primary" />
                  </div>
                  {card.count !== null && (
                    <span className="text-2xl font-bold text-primary">{card.count}</span>
                  )}
                </div>
                <h3 className="font-bold mb-1">{card.title}</h3>
                <p className="text-muted-foreground text-sm">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="p-6 rounded-2xl bg-gradient-card border border-border/50">
          <h2 className="font-bold text-lg mb-4">آخر الحجوزات</h2>
          {loadingBookings ? (
            <p className="text-muted-foreground text-sm">جاري التحميل...</p>
          ) : bookings.length === 0 ? (
            <p className="text-muted-foreground text-sm">لا توجد حجوزات بعد</p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => {
                const Icon = bookingTypeIcons[booking.booking_type] || CalendarDays;
                return (
                  <div key={booking.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/30">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{bookingTypeLabels[booking.booking_type] || booking.booking_type}</p>
                      <p className="text-xs text-muted-foreground">{new Date(booking.created_at).toLocaleDateString('ar-SA')}</p>
                    </div>
                    <span className="text-sm font-medium text-primary">{booking.total_price} {booking.currency}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{statusLabels[booking.status] || booking.status}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
