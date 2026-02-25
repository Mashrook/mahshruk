import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { logAudit } from "@/lib/auditLog";
import { Button } from "@/components/ui/button";
import { Monitor, Loader2, ShieldX, RefreshCw } from "lucide-react";

interface Session {
  id: string;
  user_id: string;
  ip_address: string | null;
  user_agent: string | null;
  is_active: boolean;
  revoked_at: string | null;
  created_at: string;
  last_active_at: string;
}

export default function AdminSessions() {
  const { toast } = useToast();
  const { roles } = useAuthStore();
  const isSuperAdmin = roles.includes("super_admin");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) {
      toast({ title: "خطأ", description: "تعذر تحميل الجلسات", variant: "destructive" });
    }
    setSessions((data || []) as Session[]);
    setLoading(false);
  };

  useEffect(() => { fetchSessions(); }, []);

  const revokeSession = async (sessionId: string) => {
    if (!isSuperAdmin) return;
    setRevoking(sessionId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("admin_sessions")
        .update({ is_active: false, revoked_at: new Date().toISOString(), revoked_by: user?.id })
        .eq("id", sessionId);
      if (error) throw error;

      await logAudit({ action: "session_revoke", entity_type: "admin_session", entity_id: sessionId });
      toast({ title: "تم", description: "تم إنهاء الجلسة" });
      fetchSessions();
    } catch {
      toast({ title: "خطأ", description: "تعذر إنهاء الجلسة", variant: "destructive" });
    }
    setRevoking(null);
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("ar-SA") + " " + date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
  };

  const parseUA = (ua: string | null) => {
    if (!ua) return "غير معروف";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return ua.slice(0, 30);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Monitor className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">جلسات المشرفين</h1>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSessions} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ml-2 ${loading ? "animate-spin" : ""}`} />
          تحديث
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>لا توجد جلسات</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50">
              <div className={`w-3 h-3 rounded-full shrink-0 ${s.is_active ? "bg-green-500" : "bg-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground font-mono">{s.user_id.slice(0, 8)}...</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {parseUA(s.user_agent)}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.is_active ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"}`}>
                    {s.is_active ? "نشطة" : "منتهية"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>بدأت: {formatDate(s.created_at)}</span>
                  <span>آخر نشاط: {formatDate(s.last_active_at)}</span>
                  {s.revoked_at && <span className="text-destructive">أُنهيت: {formatDate(s.revoked_at)}</span>}
                </div>
              </div>
              {isSuperAdmin && s.is_active && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  disabled={revoking === s.id}
                  onClick={() => revokeSession(s.id)}
                >
                  {revoking === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldX className="w-4 h-4 ml-1" />}
                  إنهاء
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
