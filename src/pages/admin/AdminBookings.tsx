import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Plane, Hotel, Car, Map, ArrowRightLeft, CheckCircle, XCircle, Clock } from "lucide-react";

const typeIcons: Record<string, any> = { flight: Plane, hotel: Hotel, car: Car, tour: Map, transfer: ArrowRightLeft };
const typeLabels: Record<string, string> = { flight: "طيران", hotel: "فندق", car: "سيارة", tour: "جولة", transfer: "تنقل" };
const statusLabels: Record<string, string> = { pending: "قيد الانتظار", confirmed: "مؤكد", cancelled: "ملغي", completed: "مكتمل" };
const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning", confirmed: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive", completed: "bg-primary/10 text-primary",
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBookings = async () => {
    const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else { toast({ title: "تم التحديث" }); fetchBookings(); }
    setUpdatingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">إدارة الحجوزات</h1>
        <span className="text-sm text-muted-foreground">{bookings.length} حجز</span>
      </div>

      {loading ? (
        <p className="text-muted-foreground">جاري التحميل...</p>
      ) : bookings.length === 0 ? (
        <div className="p-12 rounded-2xl bg-card border border-border/50 text-center">
          <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">لا توجد حجوزات</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const Icon = typeIcons[b.booking_type] || CalendarDays;
            const details = b.details_json || {};
            return (
              <div key={b.id} className="p-5 rounded-2xl bg-card border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{typeLabels[b.booking_type] || b.booking_type}</p>
                    {details.from && <p className="text-sm text-muted-foreground">{details.from} → {details.to}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(b.created_at).toLocaleDateString("ar-SA")} • المستخدم: {b.user_id?.slice(0, 8)}...
                    </p>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="font-bold text-primary">{b.total_price} {b.currency}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[b.status] || "bg-muted"}`}>
                      {statusLabels[b.status] || b.status}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {b.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "confirmed")} disabled={updatingId === b.id}>
                          <CheckCircle className="w-4 h-4 ml-1" /> تأكيد
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "cancelled")} disabled={updatingId === b.id} className="text-destructive">
                          <XCircle className="w-4 h-4 ml-1" /> إلغاء
                        </Button>
                      </>
                    )}
                    {b.status === "confirmed" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "completed")} disabled={updatingId === b.id}>
                        <CheckCircle className="w-4 h-4 ml-1" /> إتمام
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}