import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { logAudit } from "@/lib/auditLog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database, Loader2, Save, RefreshCw } from "lucide-react";

interface RetentionPolicy {
  id: string;
  entity_type: string;
  retention_days: number;
  is_active: boolean;
  description_ar: string | null;
  last_cleanup_at: string | null;
}

export default function AdminRetention() {
  const { toast } = useToast();
  const { roles } = useAuthStore();
  const isSuperAdmin = roles.includes("super_admin");
  const [policies, setPolicies] = useState<RetentionPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [runningCleanup, setRunningCleanup] = useState(false);
  const [edited, setEdited] = useState<Record<string, number>>({});

  useEffect(() => { fetchPolicies(); }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("retention_policies").select("*").order("entity_type");
    if (error) toast({ title: "خطأ", description: "تعذر تحميل السياسات", variant: "destructive" });
    setPolicies((data || []) as RetentionPolicy[]);
    setLoading(false);
  };

  const savePolicies = async () => {
    if (!isSuperAdmin) return;
    setSaving(true);
    try {
      for (const [id, days] of Object.entries(edited)) {
        const { error } = await supabase.from("retention_policies").update({
          retention_days: days,
          updated_at: new Date().toISOString(),
        }).eq("id", id);
        if (error) throw error;
      }
      await logAudit({ action: "update", entity_type: "retention_policy", after: edited });
      toast({ title: "تم", description: "تم حفظ سياسات الاحتفاظ" });
      setEdited({});
      fetchPolicies();
    } catch {
      toast({ title: "خطأ", description: "تعذر الحفظ", variant: "destructive" });
    }
    setSaving(false);
  };

  const runCleanup = async () => {
    setRunningCleanup(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/run-cleanup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Cleanup failed");

      toast({ title: "تم التنظيف", description: `النتائج: ${JSON.stringify(result.results)}` });
      fetchPolicies();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
    setRunningCleanup(false);
  };

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("ar-SA") + " " + new Date(d).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }) : "لم يتم بعد";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">سياسات الاحتفاظ بالبيانات</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={runCleanup} disabled={runningCleanup}>
            {runningCleanup ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <RefreshCw className="w-4 h-4 ml-2" />}
            تشغيل التنظيف
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {policies.map((p) => (
              <div key={p.id} className="rounded-xl bg-card border border-border/50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{p.description_ar || p.entity_type}</h4>
                    <p className="text-xs text-muted-foreground font-mono">{p.entity_type}</p>
                    <p className="text-xs text-muted-foreground mt-1">آخر تنظيف: {formatDate(p.last_cleanup_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={3650}
                      value={edited[p.id] ?? p.retention_days}
                      onChange={(e) => setEdited({ ...edited, [p.id]: parseInt(e.target.value) || p.retention_days })}
                      className="w-20 bg-muted/30 text-center"
                      disabled={!isSuperAdmin}
                    />
                    <span className="text-xs text-muted-foreground">يوم</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isSuperAdmin && Object.keys(edited).length > 0 && (
            <div className="flex justify-end">
              <Button variant="gold" onClick={savePolicies} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
                حفظ التغييرات
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
