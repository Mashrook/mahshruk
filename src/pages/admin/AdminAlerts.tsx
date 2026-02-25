import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logAudit } from "@/lib/auditLog";
import { Button } from "@/components/ui/button";
import { Bell, Loader2, RefreshCw, CheckCircle2 } from "lucide-react";

interface AdminAlert {
  id: string;
  title: string;
  body: string | null;
  severity: string;
  category: string;
  is_resolved: boolean;
  resolved_at: string | null;
  created_at: string;
}

const SEVERITY_STYLES: Record<string, string> = {
  info: "border-l-primary bg-primary/5",
  warning: "border-l-yellow-500 bg-yellow-500/5",
  error: "border-l-destructive bg-destructive/5",
  critical: "border-l-destructive bg-destructive/10",
};

export default function AdminAlerts() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResolved, setShowResolved] = useState(false);

  const fetchAlerts = async () => {
    setLoading(true);
    let query = supabase.from("admin_alerts").select("*").order("created_at", { ascending: false }).limit(200);
    if (!showResolved) query = query.eq("is_resolved", false);
    const { data, error } = await query;
    if (error) toast({ title: "خطأ", description: "تعذر تحميل التنبيهات", variant: "destructive" });
    setAlerts((data || []) as AdminAlert[]);
    setLoading(false);
  };

  useEffect(() => { fetchAlerts(); }, [showResolved]);

  const resolveAlert = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("admin_alerts").update({
        is_resolved: true,
        resolved_by: user?.id,
        resolved_at: new Date().toISOString(),
      }).eq("id", id);
      if (error) throw error;
      await logAudit({ action: "update", entity_type: "admin_alert", entity_id: id, after: { is_resolved: true } });
      fetchAlerts();
    } catch {
      toast({ title: "خطأ", description: "تعذر حل التنبيه", variant: "destructive" });
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("ar-SA") + " " + new Date(d).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">تنبيهات النظام</h1>
        </div>
        <div className="flex gap-2">
          <Button variant={showResolved ? "gold" : "outline"} size="sm" onClick={() => setShowResolved(!showResolved)}>
            {showResolved ? "إخفاء المحلولة" : "عرض المحلولة"}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchAlerts} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ml-2 ${loading ? "animate-spin" : ""}`} /> تحديث
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>لا توجد تنبيهات</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <div key={a.id} className={`rounded-xl border-r-4 p-4 ${SEVERITY_STYLES[a.severity] || SEVERITY_STYLES.info} ${a.is_resolved ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{a.title}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{a.category}</span>
                    {a.is_resolved && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">محلول</span>
                    )}
                  </div>
                  {a.body && <p className="text-xs text-muted-foreground mb-2">{a.body}</p>}
                  <p className="text-xs text-muted-foreground">{formatDate(a.created_at)}</p>
                </div>
                {!a.is_resolved && (
                  <Button variant="outline" size="sm" className="shrink-0 text-xs" onClick={() => resolveAlert(a.id)}>
                    <CheckCircle2 className="w-3 h-3 ml-1" /> حل
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
