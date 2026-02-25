import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link2, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function AdminEndpoints() {
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchEndpoints = async () => {
    const { data, error } = await supabase.from("service_endpoints").select("*").order("service");
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else setEndpoints(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchEndpoints(); }, []);

  const handleAdd = async () => {
    if (!newService || !newUrl) return;
    setSaving(true);
    const { error } = await supabase.from("service_endpoints").insert({
      service: newService, base_url: newUrl, notes: newNotes || null, status: "enabled",
    });
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else { toast({ title: "تمت الإضافة" }); setShowAdd(false); setNewService(""); setNewUrl(""); setNewNotes(""); fetchEndpoints(); }
    setSaving(false);
  };

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === "enabled" ? "disabled" : "enabled";
    const { error } = await supabase.from("service_endpoints").update({ status: newStatus }).eq("id", id);
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else fetchEndpoints();
  };

  const deleteEndpoint = async (id: string) => {
    const { error } = await supabase.from("service_endpoints").delete().eq("id", id);
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else { toast({ title: "تم الحذف" }); fetchEndpoints(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">روابط الخدمات</h1>
        <Button variant="gold" size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-4 h-4 ml-2" /> إضافة رابط
        </Button>
      </div>

      {showAdd && (
        <div className="p-6 rounded-2xl bg-card border border-border/50 mb-6 space-y-4">
          <Input value={newService} onChange={(e) => setNewService(e.target.value)} placeholder="اسم الخدمة (مثل: amadeus)" className="bg-muted/30" />
          <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="رابط الخدمة (https://...)" className="bg-muted/30" dir="ltr" />
          <Input value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="ملاحظات (اختياري)" className="bg-muted/30" />
          <div className="flex gap-2">
            <Button variant="gold" onClick={handleAdd} disabled={saving}>{saving ? "جاري الحفظ..." : "حفظ"}</Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">جاري التحميل...</p>
      ) : endpoints.length === 0 ? (
        <div className="p-12 rounded-2xl bg-card border border-border/50 text-center">
          <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">لا توجد روابط خدمات</p>
        </div>
      ) : (
        <div className="space-y-3">
          {endpoints.map((ep) => (
            <div key={ep.id} className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Link2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold">{ep.service}</p>
                <p className="text-xs text-muted-foreground truncate" dir="ltr">{ep.base_url}</p>
                {ep.notes && <p className="text-xs text-muted-foreground mt-1">{ep.notes}</p>}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${ep.status === "enabled" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                {ep.status === "enabled" ? "مفعّل" : "معطّل"}
              </span>
              <Button size="sm" variant="ghost" onClick={() => toggleStatus(ep.id, ep.status)}>
                {ep.status === "enabled" ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteEndpoint(ep.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}