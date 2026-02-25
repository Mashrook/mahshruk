import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV, exportToPDF } from "@/lib/exportUtils";
import PermissionGate from "@/components/auth/PermissionGate";
import { Button } from "@/components/ui/button";
import { BarChart3, Loader2, Download, FileText, DollarSign, CalendarDays, TrendingUp } from "lucide-react";

interface BookingStats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  revenue: number;
  byType: Record<string, number>;
}

export default function AdminReports() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BookingStats>({ total: 0, confirmed: 0, pending: 0, cancelled: 0, revenue: 0, byType: {} });
  const [bookings, setBookings] = useState<any[]>([]);
  const [period, setPeriod] = useState<"7" | "30" | "90" | "all">("30");

  useEffect(() => { fetchData(); }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let query = supabase.from("bookings").select("*").order("created_at", { ascending: false });

      if (period !== "all") {
        const cutoff = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte("created_at", cutoff);
      }

      const { data, error } = await query;
      if (error) throw error;

      const all = data || [];
      setBookings(all);

      const byType: Record<string, number> = {};
      let revenue = 0, confirmed = 0, pending = 0, cancelled = 0;

      all.forEach((b) => {
        byType[b.booking_type] = (byType[b.booking_type] || 0) + 1;
        revenue += b.total_price || 0;
        if (b.status === "confirmed") confirmed++;
        else if (b.status === "pending") pending++;
        else if (b.status === "cancelled") cancelled++;
      });

      setStats({ total: all.length, confirmed, pending, cancelled, revenue, byType });
    } catch {
      toast({ title: "خطأ", description: "تعذر تحميل التقارير", variant: "destructive" });
    }
    setLoading(false);
  };

  const exportBookingsCSV = () => {
    exportToCSV(bookings.map((b) => ({
      id: b.id,
      type: b.booking_type,
      status: b.status,
      total: b.total_price,
      currency: b.currency,
      payment: b.payment_status,
      created: b.created_at,
    })), "bookings-report", {
      id: "المعرف",
      type: "النوع",
      status: "الحالة",
      total: "المبلغ",
      currency: "العملة",
      payment: "الدفع",
      created: "التاريخ",
    });
    toast({ title: "تم", description: "تم تصدير CSV" });
  };

  const exportBookingsPDF = () => {
    exportToPDF("تقرير الحجوزات", bookings.map((b) => ({
      id: b.id.slice(0, 8),
      type: b.booking_type,
      status: b.status,
      total: `${b.total_price} ${b.currency}`,
      payment: b.payment_status,
      created: new Date(b.created_at).toLocaleDateString("ar-SA"),
    })), {
      id: "المعرف",
      type: "النوع",
      status: "الحالة",
      total: "المبلغ",
      payment: "الدفع",
      created: "التاريخ",
    });
  };

  const exportAuditCSV = async () => {
    const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(500);
    if (!data?.length) { toast({ title: "فارغ", description: "لا توجد سجلات" }); return; }
    exportToCSV(data.map((l: any) => ({
      action: l.action,
      entity: l.entity_type,
      entity_id: l.entity_id || "",
      actor: l.actor_admin_id,
      created: l.created_at,
    })), "audit-logs", {
      action: "الإجراء",
      entity: "الكيان",
      entity_id: "معرف الكيان",
      actor: "المنفذ",
      created: "التاريخ",
    });
    toast({ title: "تم", description: "تم تصدير سجلات المراجعة" });
  };

  const exportIncidentsCSV = async () => {
    const { data } = await supabase.from("incidents").select("*").order("created_at", { ascending: false }).limit(500);
    if (!data?.length) { toast({ title: "فارغ", description: "لا توجد حوادث" }); return; }
    exportToCSV(data.map((i: any) => ({
      title: i.title,
      severity: i.severity,
      status: i.status,
      description: i.description || "",
      created: i.created_at,
    })), "incidents", {
      title: "العنوان",
      severity: "الخطورة",
      status: "الحالة",
      description: "الوصف",
      created: "التاريخ",
    });
    toast({ title: "تم", description: "تم تصدير الحوادث" });
  };

  const statCards = [
    { icon: CalendarDays, label: "إجمالي الحجوزات", value: stats.total, color: "text-primary" },
    { icon: TrendingUp, label: "مؤكدة", value: stats.confirmed, color: "text-green-500" },
    { icon: DollarSign, label: "الإيرادات", value: `${stats.revenue.toLocaleString()} ر.س`, color: "text-primary" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">التقارير</h1>
        </div>
        <div className="flex gap-2">
          {(["7", "30", "90", "all"] as const).map((p) => (
            <Button key={p} variant={period === p ? "gold" : "outline"} size="sm" onClick={() => setPeriod(p)}>
              {p === "all" ? "الكل" : `${p} يوم`}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {statCards.map((s) => (
              <div key={s.label} className="p-6 rounded-2xl bg-card border border-border/50">
                <s.icon className={`w-6 h-6 ${s.color} mb-3`} />
                <div className="text-2xl font-bold mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Booking Types */}
          <div className="rounded-2xl bg-card border border-border/50 p-6 mb-8">
            <h3 className="font-bold mb-4">حسب النوع</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30">
                  <span className="text-sm font-medium">{type}</span>
                  <span className="text-sm text-primary font-bold">{count}</span>
                </div>
              ))}
              {Object.keys(stats.byType).length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full">لا توجد بيانات</p>
              )}
            </div>
          </div>

          {/* Status breakdown */}
          <div className="rounded-2xl bg-card border border-border/50 p-6 mb-8">
            <h3 className="font-bold mb-4">حسب الحالة</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/30 text-center">
                <div className="text-xl font-bold text-yellow-500">{stats.pending}</div>
                <div className="text-xs text-muted-foreground mt-1">قيد الانتظار</div>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border/30 text-center">
                <div className="text-xl font-bold text-green-500">{stats.confirmed}</div>
                <div className="text-xs text-muted-foreground mt-1">مؤكدة</div>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border/30 text-center">
                <div className="text-xl font-bold text-destructive">{stats.cancelled}</div>
                <div className="text-xs text-muted-foreground mt-1">ملغاة</div>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <PermissionGate permission="reports.export">
            <div className="rounded-2xl bg-card border border-border/50 p-6">
              <h3 className="font-bold mb-4">تصدير البيانات</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Button variant="outline" className="justify-start gap-2" onClick={exportBookingsCSV}>
                  <Download className="w-4 h-4" /> حجوزات CSV
                </Button>
                <Button variant="outline" className="justify-start gap-2" onClick={exportBookingsPDF}>
                  <FileText className="w-4 h-4" /> حجوزات PDF
                </Button>
                <Button variant="outline" className="justify-start gap-2" onClick={exportAuditCSV}>
                  <Download className="w-4 h-4" /> سجل المراجعة CSV
                </Button>
                <Button variant="outline" className="justify-start gap-2" onClick={exportIncidentsCSV}>
                  <Download className="w-4 h-4" /> الحوادث CSV
                </Button>
              </div>
            </div>
          </PermissionGate>
        </>
      )}
    </div>
  );
}
