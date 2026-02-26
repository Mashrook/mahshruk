import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollText, Loader2, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AuditLog {
  id: string;
  actor_admin_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  before: any;
  after: any;
  user_agent: string | null;
  created_at: string;
}

const ACTION_LABELS: Record<string, string> = {
  create: "إنشاء",
  update: "تعديل",
  delete: "حذف",
  login: "تسجيل دخول",
  logout: "تسجيل خروج",
  role_assign: "تعيين دور",
  role_remove: "إزالة دور",
  permission_update: "تحديث صلاحيات",
  session_revoke: "إنهاء جلسة",
  "2fa_enable": "تفعيل 2FA",
  "2fa_disable": "تعطيل 2FA",
};

const ENTITY_LABELS: Record<string, string> = {
  booking: "حجز",
  offer: "عرض",
  destination: "وجهة",
  api_key: "مفتاح API",
  service_endpoint: "رابط خدمة",
  role_permission: "صلاحية",
  user_role: "دور مستخدم",
  admin_session: "جلسة",
  admin_2fa: "مصادقة ثنائية",
};

export default function AdminAuditLogs() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (entityFilter) query = query.eq("entity_type", entityFilter);

      const { data, error } = await query;
      if (error) throw error;
      setLogs((data || []) as AuditLog[]);
    } catch {
      toast({ title: "خطأ", description: "تعذر تحميل السجلات", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, [entityFilter]);

  const filtered = logs.filter((l) =>
    !search || l.action.includes(search) || l.entity_type.includes(search) || l.entity_id?.includes(search) || l.actor_admin_id.includes(search)
  );

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("ar-SA") + " " + date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ScrollText className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">سجل المراجعة</h1>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ml-2 ${loading ? "animate-spin" : ""}`} />
          تحديث
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="بحث في السجلات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 bg-muted/30"
          />
        </div>
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          title="تصفية حسب الكيان"
          className="px-4 py-2 rounded-xl bg-muted border border-border/50 text-foreground text-sm"
        >
          <option value="">كل الكيانات</option>
          {Object.entries(ENTITY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <ScrollText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>لا توجد سجلات</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((log) => (
            <div
              key={log.id}
              className="rounded-xl bg-card border border-border/50 overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                className="w-full flex items-center gap-4 p-4 text-right hover:bg-muted/20 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  log.action === "delete" ? "bg-destructive" :
                  log.action === "create" ? "bg-green-500" :
                  "bg-primary"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {ACTION_LABELS[log.action] || log.action}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {ENTITY_LABELS[log.entity_type] || log.entity_type}
                    </span>
                    {log.entity_id && (
                      <span className="text-xs text-muted-foreground font-mono truncate max-w-32">
                        {log.entity_id.slice(0, 8)}...
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{formatDate(log.created_at)}</span>
              </button>

              {expandedId === log.id && (
                <div className="px-4 pb-4 border-t border-border/30 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3 pt-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">المنفذ</p>
                      <p className="text-xs font-mono bg-muted/30 px-2 py-1 rounded">{log.actor_admin_id}</p>
                    </div>
                    {log.user_agent && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">المتصفح</p>
                        <p className="text-xs font-mono bg-muted/30 px-2 py-1 rounded truncate">{log.user_agent.slice(0, 60)}...</p>
                      </div>
                    )}
                  </div>
                  {log.before && Object.keys(log.before).length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">قبل التغيير</p>
                      <pre className="text-xs bg-muted/30 p-2 rounded overflow-x-auto max-h-32 text-foreground" dir="ltr">
                        {JSON.stringify(log.before, null, 2)}
                      </pre>
                    </div>
                  )}
                  {log.after && Object.keys(log.after).length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">بعد التغيير</p>
                      <pre className="text-xs bg-muted/30 p-2 rounded overflow-x-auto max-h-32 text-foreground" dir="ltr">
                        {JSON.stringify(log.after, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
