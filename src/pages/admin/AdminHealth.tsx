import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, Loader2, RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";

interface HealthData {
  status: string;
  timestamp: string;
  version: string;
  services: {
    database: { status: string; latency_ms: number };
  };
  stats: {
    total_bookings: number;
    total_users: number;
    open_alerts: number;
    open_incidents: number;
  };
}

export default function AdminHealth() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health`);
      const data = await res.json();
      if (!res.ok && !data.status) throw new Error("Health check failed");
      setHealth(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchHealth(); }, []);

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "healthy" || status === "up")
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === "degraded")
      return <Clock className="w-5 h-5 text-yellow-500" />;
    return <XCircle className="w-5 h-5 text-destructive" />;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">صحة النظام</h1>
        </div>
        <Button variant="outline" size="sm" onClick={fetchHealth} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ml-2 ${loading ? "animate-spin" : ""}`} /> تحديث
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : error ? (
        <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-8 text-center">
          <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="font-bold text-destructive mb-2">خطأ في الاتصال</h3>
          <p className="text-sm text-destructive/80">{error}</p>
        </div>
      ) : health ? (
        <div className="space-y-6">
          {/* Main Status */}
          <div className={`rounded-2xl p-8 text-center border ${
            health.status === "healthy" ? "bg-green-500/5 border-green-500/30" : "bg-yellow-500/5 border-yellow-500/30"
          }`}>
            <StatusIcon status={health.status} />
            <h2 className="text-xl font-bold mt-3 mb-1">
              {health.status === "healthy" ? "النظام يعمل بشكل طبيعي" : "النظام يعمل بشكل جزئي"}
            </h2>
            <p className="text-sm text-muted-foreground">الإصدار: {health.version}</p>
            <p className="text-xs text-muted-foreground mt-1">
              آخر فحص: {new Date(health.timestamp).toLocaleString("ar-SA")}
            </p>
          </div>

          {/* Services */}
          <div className="rounded-2xl bg-card border border-border/50 p-6">
            <h3 className="font-bold mb-4">الخدمات</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
                <div className="flex items-center gap-3">
                  <StatusIcon status={health.services.database.status} />
                  <div>
                    <p className="font-medium text-sm">قاعدة البيانات</p>
                    <p className="text-xs text-muted-foreground">زمن الاستجابة: {health.services.database.latency_ms}ms</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  health.services.database.status === "up" ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
                }`}>
                  {health.services.database.status === "up" ? "يعمل" : "متوقف"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "الحجوزات", value: health.stats.total_bookings },
              { label: "المستخدمين", value: health.stats.total_users },
              { label: "تنبيهات مفتوحة", value: health.stats.open_alerts },
              { label: "حوادث مفتوحة", value: health.stats.open_incidents },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-xl bg-card border border-border/50 text-center">
                <div className="text-2xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
