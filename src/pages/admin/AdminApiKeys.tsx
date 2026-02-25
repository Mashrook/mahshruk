import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Key, Plus, Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminApiKeys() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState("");
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchKeys = async () => {
    const { data, error } = await supabase.from("api_keys").select("*").order("service");
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else setKeys(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchKeys(); }, []);

  const handleAdd = async () => {
    if (!newService || !newKeyName || !newKeyValue) return;
    setSaving(true);
    const { error } = await supabase.from("api_keys").insert({
      service: newService, key_name: newKeyName, key_value: newKeyValue, is_active: true,
    });
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else { toast({ title: "تمت الإضافة" }); setShowAdd(false); setNewService(""); setNewKeyName(""); setNewKeyValue(""); fetchKeys(); }
    setSaving(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from("api_keys").update({ is_active: !current }).eq("id", id);
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else fetchKeys();
  };

  const deleteKey = async (id: string) => {
    const { error } = await supabase.from("api_keys").delete().eq("id", id);
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else { toast({ title: "تم الحذف" }); fetchKeys(); }
  };

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const maskKey = (key: string) => key.slice(0, 4) + "••••••••" + key.slice(-4);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">مفاتيح APIs</h1>
        <Button variant="gold" size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-4 h-4 ml-2" /> إضافة مفتاح
        </Button>
      </div>

      {showAdd && (
        <div className="p-6 rounded-2xl bg-card border border-border/50 mb-6 space-y-4">
          <Input value={newService} onChange={(e) => setNewService(e.target.value)} placeholder="اسم الخدمة (مثل: stripe)" className="bg-muted/30" />
          <Input value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="اسم المفتاح (مثل: secret_key)" className="bg-muted/30" />
          <Input value={newKeyValue} onChange={(e) => setNewKeyValue(e.target.value)} placeholder="قيمة المفتاح" className="bg-muted/30" dir="ltr" type="password" />
          <div className="flex gap-2">
            <Button variant="gold" onClick={handleAdd} disabled={saving}>{saving ? "جاري الحفظ..." : "حفظ"}</Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">جاري التحميل...</p>
      ) : keys.length === 0 ? (
        <div className="p-12 rounded-2xl bg-card border border-border/50 text-center">
          <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">لا توجد مفاتيح APIs</p>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold">{k.service} — {k.key_name}</p>
                <p className="text-xs text-muted-foreground font-mono" dir="ltr">
                  {visibleKeys.has(k.id) ? k.key_value : maskKey(k.key_value)}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${k.is_active ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                {k.is_active ? "نشط" : "معطّل"}
              </span>
              <Button size="sm" variant="ghost" onClick={() => toggleVisibility(k.id)}>
                {visibleKeys.has(k.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => toggleActive(k.id, k.is_active)}>
                {k.is_active ? "تعطيل" : "تفعيل"}
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteKey(k.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}