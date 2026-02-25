import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { logAudit } from "@/lib/auditLog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Loader2, Plus, RefreshCw, CheckCircle2 } from "lucide-react";

interface Incident {
  id: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  reported_by: string;
  assigned_to: string | null;
  resolution: string | null;
  resolved_at: string | null;
  created_at: string;
}

const SEVERITY_COLORS: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-yellow-500/10 text-yellow-500",
  high: "bg-orange-500/10 text-orange-500",
  critical: "bg-destructive/10 text-destructive",
};

const STATUS_LABELS: Record<string, string> = {
  open: "مفتوح",
  investigating: "قيد التحقيق",
  resolved: "تم الحل",
  closed: "مغلق",
};

export default function AdminIncidents() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  // Form
  const [form, setForm] = useState({ title: "", description: "", severity: "medium" });

  useEffect(() => { fetchIncidents(); }, [statusFilter]);

  const fetchIncidents = async () => {
    setLoading(true);
    let query = supabase.from("incidents").select("*").order("created_at", { ascending: false }).limit(200);
    if (statusFilter) query = query.eq("status", statusFilter);
    const { data, error } = await query;
    if (error) toast({ title: "خطأ", description: "تعذر تحميل الحوادث", variant: "destructive" });
    setIncidents((data || []) as Incident[]);
    setLoading(false);
  };

  const createIncident = async () => {
    if (!form.title.trim() || !user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("incidents").insert({
        title: form.title,
        description: form.description || null,
        severity: form.severity,
        reported_by: user.id,
      });
      if (error) throw error;
      await logAudit({ action: "create", entity_type: "incident", after: { title: form.title, severity: form.severity } });
      toast({ title: "تم", description: "تم إنشاء تقرير الحادث" });
      setForm({ title: "", description: "", severity: "medium" });
      setShowForm(false);
      fetchIncidents();
    } catch {
      toast({ title: "خطأ", description: "تعذر إنشاء الحادث", variant: "destructive" });
    }
    setSaving(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus, updated_at: new Date().toISOString() };
      if (newStatus === "resolved") {
        updates.resolved_at = new Date().toISOString();
      }
      const { error } = await supabase.from("incidents").update(updates).eq("id", id);
      if (error) throw error;
      await logAudit({ action: "update", entity_type: "incident", entity_id: id, after: { status: newStatus } });
      fetchIncidents();
    } catch {
      toast({ title: "خطأ", description: "تعذر التحديث", variant: "destructive" });
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("ar-SA") + " " + new Date(d).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">إدارة الحوادث</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchIncidents} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ml-2 ${loading ? "animate-spin" : ""}`} /> تحديث
          </Button>
          <Button variant="gold" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 ml-2" /> حادث جديد
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["", "open", "investigating", "resolved", "closed"].map((s) => (
          <Button key={s} variant={statusFilter === s ? "gold" : "outline"} size="sm" onClick={() => setStatusFilter(s)}>
            {s ? STATUS_LABELS[s] : "الكل"}
          </Button>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="rounded-2xl bg-card border border-border/50 p-6 mb-6 space-y-4">
          <h3 className="font-bold">تقرير حادث جديد</h3>
          <Input placeholder="عنوان الحادث" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-muted/30" />
          <Textarea placeholder="وصف الحادث..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-muted/30" rows={3} />
          <select
            value={form.severity}
            onChange={(e) => setForm({ ...form, severity: e.target.value })}
            className="px-4 py-2 rounded-xl bg-muted border border-border/50 text-foreground text-sm"
          >
            <option value="low">منخفض</option>
            <option value="medium">متوسط</option>
            <option value="high">مرتفع</option>
            <option value="critical">حرج</option>
          </select>
          <div className="flex gap-2">
            <Button variant="gold" onClick={createIncident} disabled={saving || !form.title.trim()}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null} إنشاء
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>إلغاء</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : incidents.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>لا توجد حوادث مسجلة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((inc) => (
            <div key={inc.id} className="rounded-xl bg-card border border-border/50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h4 className="font-semibold text-sm">{inc.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${SEVERITY_COLORS[inc.severity]}`}>
                      {inc.severity}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      inc.status === "resolved" || inc.status === "closed" ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                    }`}>
                      {STATUS_LABELS[inc.status]}
                    </span>
                  </div>
                  {inc.description && <p className="text-xs text-muted-foreground mb-2">{inc.description}</p>}
                  <p className="text-xs text-muted-foreground">{formatDate(inc.created_at)}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {inc.status === "open" && (
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => updateStatus(inc.id, "investigating")}>
                      تحقيق
                    </Button>
                  )}
                  {(inc.status === "open" || inc.status === "investigating") && (
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => updateStatus(inc.id, "resolved")}>
                      <CheckCircle2 className="w-3 h-3 ml-1" /> حل
                    </Button>
                  )}
                  {inc.status === "resolved" && (
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => updateStatus(inc.id, "closed")}>
                      إغلاق
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
