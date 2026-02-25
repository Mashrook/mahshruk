import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ToggleLeft, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import PermissionGate from "@/components/auth/PermissionGate";

const DEFAULT_FLAGS = [
  { key: "flights.enabled", label: "الطيران" },
  { key: "hotels.enabled", label: "الفنادق" },
  { key: "cars.enabled", label: "السيارات" },
  { key: "tours.enabled", label: "الجولات" },
  { key: "transfers.enabled", label: "التنقلات" },
  { key: "payments.enabled", label: "المدفوعات" },
  { key: "offers.enabled", label: "العروض" },
  { key: "articles.enabled", label: "المقالات" },
];

interface Flag {
  id: string;
  tenant_id: string;
  flag_key: string;
  is_enabled: boolean;
}

export default function AdminFeatureFlags() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [flags, setFlags] = useState<Flag[]>([]);
  const [newFlagKey, setNewFlagKey] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("tenants").select("id, name, slug").order("name").then(({ data }) => {
      setTenants(data || []);
    });
  }, []);

  const fetchFlags = async (tenantId: string) => {
    setLoading(true);
    const { data } = await supabase.from("feature_flags").select("*").eq("tenant_id", tenantId);
    setFlags((data || []) as Flag[]);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedTenantId) fetchFlags(selectedTenantId);
  }, [selectedTenantId]);

  const toggleFlag = async (flag: Flag) => {
    await supabase.from("feature_flags").update({ is_enabled: !flag.is_enabled }).eq("id", flag.id);
    fetchFlags(selectedTenantId);
  };

  const initDefaults = async () => {
    if (!selectedTenantId) return;
    const existingKeys = flags.map((f) => f.flag_key);
    const toInsert = DEFAULT_FLAGS.filter((d) => !existingKeys.includes(d.key)).map((d) => ({
      tenant_id: selectedTenantId,
      flag_key: d.key,
      is_enabled: true,
    }));
    if (toInsert.length > 0) {
      await supabase.from("feature_flags").insert(toInsert);
      fetchFlags(selectedTenantId);
      toast({ title: `تم إضافة ${toInsert.length} ميزات افتراضية` });
    }
  };

  const addCustomFlag = async () => {
    if (!selectedTenantId || !newFlagKey) return;
    await supabase.from("feature_flags").insert({
      tenant_id: selectedTenantId,
      flag_key: newFlagKey,
      is_enabled: false,
    });
    setNewFlagKey("");
    fetchFlags(selectedTenantId);
  };

  const deleteFlag = async (id: string) => {
    await supabase.from("feature_flags").delete().eq("id", id);
    fetchFlags(selectedTenantId);
  };

  const getFlagLabel = (key: string) => DEFAULT_FLAGS.find((d) => d.key === key)?.label || key;

  return (
    <PermissionGate permission="tenant.features">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3 mb-2">
          <ToggleLeft className="w-7 h-7 text-primary" /> إدارة الميزات
        </h1>
        <p className="text-muted-foreground text-sm mb-8">تفعيل وتعطيل الميزات لكل مستأجر</p>

        <div className="flex items-center gap-4 mb-6">
          <select
            className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
          >
            <option value="">اختر مستأجر...</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>{t.name} ({t.slug})</option>
            ))}
          </select>
          {selectedTenantId && (
            <Button variant="outline" size="sm" onClick={initDefaults}>
              <Plus className="w-4 h-4 ml-1" /> تهيئة الميزات الافتراضية
            </Button>
          )}
        </div>

        {selectedTenantId && (
          <>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : flags.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد ميزات. اضغط "تهيئة الميزات الافتراضية" للبدء.
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {flags.map((flag) => (
                  <div key={flag.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50">
                    <div>
                      <p className="font-medium text-foreground">{getFlagLabel(flag.flag_key)}</p>
                      <p className="text-xs text-muted-foreground" dir="ltr">{flag.flag_key}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={flag.is_enabled} onCheckedChange={() => toggleFlag(flag)} />
                      <Button variant="ghost" size="icon" onClick={() => deleteFlag(flag.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 rounded-xl bg-card border border-border/50">
              <h3 className="font-bold text-sm mb-3">إضافة ميزة مخصصة</h3>
              <div className="flex gap-3">
                <Input
                  placeholder="مفتاح الميزة (مثل: custom.feature)"
                  value={newFlagKey}
                  onChange={(e) => setNewFlagKey(e.target.value)}
                  dir="ltr"
                />
                <Button onClick={addCustomFlag} disabled={!newFlagKey}>إضافة</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </PermissionGate>
  );
}
