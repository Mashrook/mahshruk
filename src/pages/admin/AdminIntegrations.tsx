import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Key, Plus, Trash2, Eye, EyeOff, Link2, CheckCircle, XCircle,
  Pencil, Save, X, Search, RefreshCw, Shield, Globe, Copy, Check,
  Zap, Plane, Hotel, Car, Map, CreditCard, Loader2, AlertCircle, Rocket
} from "lucide-react";
import { isAmadeusConfigured, testAmadeusConnection } from "@/services/amadeusService";
import { isMoyasarConfigured } from "@/services/moyasarService";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// ── Types ──
interface ServiceEndpoint {
  id: string;
  service: string;
  base_url: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiKey {
  id: string;
  service: string;
  key_name: string;
  key_value: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Endpoint Form ──
function EndpointForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: ServiceEndpoint;
  onSave: (data: Partial<ServiceEndpoint>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [service, setService] = useState(initial?.service || "");
  const [baseUrl, setBaseUrl] = useState(initial?.base_url || "");
  const [notes, setNotes] = useState(initial?.notes || "");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>اسم الخدمة</Label>
          <Input value={service} onChange={(e) => setService(e.target.value)} placeholder="مثال: amadeus, stripe" className="bg-muted/30" />
        </div>
        <div className="space-y-2">
          <Label>رابط الخدمة (Base URL)</Label>
          <Input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://api.example.com/v1" className="bg-muted/30" dir="ltr" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>ملاحظات</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات إضافية عن الخدمة..." className="bg-muted/30 resize-none" rows={2} />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={saving}>
          <X className="w-4 h-4 ml-1" /> إلغاء
        </Button>
        <Button
          variant="gold"
          size="sm"
          onClick={() => onSave({ service, base_url: baseUrl, notes: notes || null })}
          disabled={saving || !service || !baseUrl}
        >
          <Save className="w-4 h-4 ml-1" /> {saving ? "جاري الحفظ..." : initial ? "تحديث" : "إضافة"}
        </Button>
      </div>
    </div>
  );
}

// ── API Key Form ──
function ApiKeyForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: ApiKey;
  onSave: (data: Partial<ApiKey>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [service, setService] = useState(initial?.service || "");
  const [keyName, setKeyName] = useState(initial?.key_name || "");
  const [keyValue, setKeyValue] = useState(initial?.key_value || "");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>اسم الخدمة</Label>
          <Input value={service} onChange={(e) => setService(e.target.value)} placeholder="مثال: amadeus, google_maps" className="bg-muted/30" />
        </div>
        <div className="space-y-2">
          <Label>اسم المفتاح</Label>
          <Input value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder="مثال: client_id, secret_key" className="bg-muted/30" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>قيمة المفتاح</Label>
        <Input
          value={keyValue}
          onChange={(e) => setKeyValue(e.target.value)}
          placeholder="أدخل قيمة المفتاح..."
          className="bg-muted/30 font-mono"
          dir="ltr"
          type={initial ? "text" : "password"}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={saving}>
          <X className="w-4 h-4 ml-1" /> إلغاء
        </Button>
        <Button
          variant="gold"
          size="sm"
          onClick={() => onSave({ service, key_name: keyName, key_value: keyValue })}
          disabled={saving || !service || !keyName || !keyValue}
        >
          <Save className="w-4 h-4 ml-1" /> {saving ? "جاري الحفظ..." : initial ? "تحديث" : "إضافة"}
        </Button>
      </div>
    </div>
  );
}

// ── Quick Setup Panel ──
interface QuickSetupPanelProps {
  endpoints: ServiceEndpoint[];
  keys: ApiKey[];
  onRefresh: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}

const SEARCH_ENGINE_TEMPLATES = [
  {
    service: "amadeus",
    label: "Amadeus - رحلات الطيران والفنادق",
    icon: Plane,
    base_url: "https://test.api.amadeus.com",
    notes: "محرك بحث Amadeus API للطيران والفنادق والتنقلات والأنشطة",
    requiredKeys: [
      { key_name: "client_id", placeholder: "أدخل Client ID..." },
      { key_name: "client_secret", placeholder: "أدخل Client Secret..." },
    ],
  },
  {
    service: "moyasar",
    label: "Moyasar - بوابة الدفع",
    icon: CreditCard,
    base_url: "https://api.moyasar.com/v1",
    notes: "بوابة دفع Moyasar للمدفوعات الإلكترونية",
    requiredKeys: [
      { key_name: "secret_key", placeholder: "sk_test_..." },
      { key_name: "publishable_key", placeholder: "pk_test_..." },
    ],
  },
  {
    service: "skyscanner",
    label: "Skyscanner - بحث الطيران",
    icon: Plane,
    base_url: "https://partners.api.skyscanner.net",
    notes: "محرك بحث Skyscanner كبديل للطيران",
    requiredKeys: [
      { key_name: "api_key", placeholder: "أدخل مفتاح API..." },
    ],
  },
  {
    service: "booking_hotels",
    label: "Booking.com - الفنادق",
    icon: Hotel,
    base_url: "https://distribution-xml.booking.com/2.0",
    notes: "بحث الفنادق من Booking.com",
    requiredKeys: [
      { key_name: "api_key", placeholder: "أدخل مفتاح API..." },
      { key_name: "affiliate_id", placeholder: "رقم الشريك..." },
    ],
  },
  {
    service: "rentalcars",
    label: "إيجار السيارات",
    icon: Car,
    base_url: "https://api.rentalcars.com/v1",
    notes: "محرك بحث إيجار السيارات",
    requiredKeys: [
      { key_name: "api_key", placeholder: "أدخل مفتاح API..." },
    ],
  },
  {
    service: "viator_tours",
    label: "Viator - الرحلات السياحية",
    icon: Map,
    base_url: "https://api.viator.com/partner",
    notes: "محرك بحث الرحلات السياحية والأنشطة",
    requiredKeys: [
      { key_name: "api_key", placeholder: "أدخل مفتاح API..." },
    ],
  },
];

function QuickSetupPanel({ endpoints, keys, onRefresh, toast }: QuickSetupPanelProps) {
  const [setupValues, setSetupValues] = useState<Record<string, Record<string, string>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { ok: boolean; message: string }>>({});

  const isServiceConfigured = (service: string) => {
    const hasEndpoint = endpoints.some((e) => e.service === service && e.status === "enabled");
    const template = SEARCH_ENGINE_TEMPLATES.find((t) => t.service === service);
    const hasAllKeys = template?.requiredKeys.every((rk) =>
      keys.some((k) => k.service === service && k.key_name === rk.key_name && k.is_active)
    );
    return hasEndpoint && hasAllKeys;
  };

  const handleQuickSetup = async (template: typeof SEARCH_ENGINE_TEMPLATES[0]) => {
    const values = setupValues[template.service] || {};
    const missingKeys = template.requiredKeys.filter((rk) => !values[rk.key_name]?.trim());

    if (missingKeys.length > 0) {
      toast({ title: "مطلوب", description: `أدخل قيمة: ${missingKeys.map((k) => k.key_name).join(", ")}`, variant: "destructive" });
      return;
    }

    setSaving(template.service);
    try {
      // Upsert endpoint
      const existingEP = endpoints.find((e) => e.service === template.service);
      if (!existingEP) {
        await supabase.from("service_endpoints").insert({
          service: template.service,
          base_url: template.base_url,
          status: "enabled",
          notes: template.notes,
        } as any);
      } else if (existingEP.status !== "enabled") {
        await supabase.from("service_endpoints").update({ status: "enabled" }).eq("id", existingEP.id);
      }

      // Upsert keys
      for (const rk of template.requiredKeys) {
        const val = values[rk.key_name].trim();
        const existingKey = keys.find((k) => k.service === template.service && k.key_name === rk.key_name);
        if (existingKey) {
          await supabase.from("api_keys").update({ key_value: val, is_active: true }).eq("id", existingKey.id);
        } else {
          await supabase.from("api_keys").insert({
            service: template.service,
            key_name: rk.key_name,
            key_value: val,
            is_active: true,
          } as any);
        }
      }

      toast({ title: "تم الإعداد بنجاح", description: `تم تفعيل ${template.label}` });
      onRefresh();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
    setSaving(null);
  };

  const handleTestConnection = async (service: string) => {
    setTesting(service);
    try {
      if (service === "amadeus") {
        const result = await testAmadeusConnection();
        setTestResults((prev) => ({ ...prev, [service]: { ok: result.ok, message: result.message } }));
      } else if (service === "moyasar") {
        const configured = await isMoyasarConfigured();
        setTestResults((prev) => ({
          ...prev,
          [service]: configured
            ? { ok: true, message: "المفاتيح مُهيّأة بنجاح" }
            : { ok: false, message: "المفاتيح غير مُهيّأة" },
        }));
      } else {
        // Generic test: just verify endpoint + keys exist
        const configured = isServiceConfigured(service);
        setTestResults((prev) => ({
          ...prev,
          [service]: configured
            ? { ok: true, message: "الرابط والمفاتيح مُهيّأة" }
            : { ok: false, message: "يرجى إكمال الإعداد" },
        }));
      }
    } catch (err: any) {
      setTestResults((prev) => ({ ...prev, [service]: { ok: false, message: err.message } }));
    }
    setTesting(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <Rocket className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-bold">الإعداد السريع للتكاملات</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          أضف مفاتيح APIs وروابط محركات البحث بسرعة. ادخل المفاتيح واضغط "تفعيل" لإعداد الخدمة بالكامل.
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-5">
        {SEARCH_ENGINE_TEMPLATES.map((template) => {
          const configured = isServiceConfigured(template.service);
          const testResult = testResults[template.service];
          const TemplateIcon = template.icon;

          return (
            <div
              key={template.service}
              className={`p-5 rounded-2xl border transition-all ${
                configured
                  ? "bg-green-500/5 border-green-500/20"
                  : "bg-card border-border/50 hover:border-primary/30"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  configured ? "bg-green-500/10" : "bg-primary/10"
                }`}>
                  <TemplateIcon className={`w-6 h-6 ${configured ? "text-green-500" : "text-primary"}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm">{template.label}</h3>
                    {configured && (
                      <Badge variant="default" className="text-[10px] bg-green-500/10 text-green-500 border-green-500/20">
                        <CheckCircle className="w-3 h-3 ml-1" /> مُفعّل
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{template.notes}</p>
                  <p className="text-xs text-muted-foreground mb-3 font-mono" dir="ltr">{template.base_url}</p>

                  {/* Key inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {template.requiredKeys.map((rk) => {
                      const existingKey = keys.find(
                        (k) => k.service === template.service && k.key_name === rk.key_name && k.is_active
                      );
                      return (
                        <div key={rk.key_name} className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Key className="w-3 h-3" /> {rk.key_name}
                            {existingKey && <CheckCircle className="w-3 h-3 text-green-500" />}
                          </Label>
                          <Input
                            type="password"
                            className="bg-muted/30 text-xs font-mono h-8"
                            dir="ltr"
                            placeholder={existingKey ? "••••••••" : rk.placeholder}
                            value={setupValues[template.service]?.[rk.key_name] || ""}
                            onChange={(e) =>
                              setSetupValues((prev) => ({
                                ...prev,
                                [template.service]: {
                                  ...(prev[template.service] || {}),
                                  [rk.key_name]: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Test result */}
                  {testResult && (
                    <div className={`text-xs px-3 py-2 rounded-lg mb-3 flex items-center gap-2 ${
                      testResult.ok ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
                    }`}>
                      {testResult.ok ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {testResult.message}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="gold"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleQuickSetup(template)}
                      disabled={saving === template.service}
                    >
                      {saving === template.service ? (
                        <><Loader2 className="w-3 h-3 ml-1 animate-spin" /> جاري التفعيل...</>
                      ) : configured ? (
                        <><RefreshCw className="w-3 h-3 ml-1" /> تحديث المفاتيح</>
                      ) : (
                        <><Zap className="w-3 h-3 ml-1" /> تفعيل</>
                      )}
                    </Button>
                    {configured && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleTestConnection(template.service)}
                        disabled={testing === template.service}
                      >
                        {testing === template.service ? (
                          <><Loader2 className="w-3 h-3 ml-1 animate-spin" /> فحص...</>
                        ) : (
                          <><Shield className="w-3 h-3 ml-1" /> فحص الاتصال</>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Component ──
export default function AdminIntegrations() {
  const [endpoints, setEndpoints] = useState<ServiceEndpoint[]>([]);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loadingEP, setLoadingEP] = useState(true);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchEP, setSearchEP] = useState("");
  const [searchKeys, setSearchKeys] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dialogs
  const [showAddEP, setShowAddEP] = useState(false);
  const [editEP, setEditEP] = useState<ServiceEndpoint | null>(null);
  const [showAddKey, setShowAddKey] = useState(false);
  const [editKey, setEditKey] = useState<ApiKey | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "ep" | "key"; id: string; name: string } | null>(null);

  const { toast } = useToast();

  // ── Fetch ──
  const fetchEndpoints = useCallback(async () => {
    setLoadingEP(true);
    const { data, error } = await supabase.from("service_endpoints").select("*").order("service");
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else setEndpoints(data || []);
    setLoadingEP(false);
  }, [toast]);

  const fetchKeys = useCallback(async () => {
    setLoadingKeys(true);
    const { data, error } = await supabase.from("api_keys").select("*").order("service");
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else setKeys(data || []);
    setLoadingKeys(false);
  }, [toast]);

  useEffect(() => { fetchEndpoints(); fetchKeys(); }, [fetchEndpoints, fetchKeys]);

  // ── Endpoint CRUD ──
  const saveEndpoint = async (data: Partial<ServiceEndpoint>, id?: string) => {
    setSaving(true);
    if (id) {
      const { error } = await supabase.from("service_endpoints").update(data).eq("id", id);
      if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
      else { toast({ title: "تم التحديث بنجاح" }); setEditEP(null); }
    } else {
      const { error } = await supabase.from("service_endpoints").insert({ ...data, status: "enabled" } as any);
      if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
      else { toast({ title: "تمت الإضافة بنجاح" }); setShowAddEP(false); }
    }
    setSaving(false);
    fetchEndpoints();
  };

  const toggleEndpointStatus = async (ep: ServiceEndpoint) => {
    const newStatus = ep.status === "enabled" ? "disabled" : "enabled";
    const { error } = await supabase.from("service_endpoints").update({ status: newStatus }).eq("id", ep.id);
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else fetchEndpoints();
  };

  // ── API Key CRUD ──
  const saveApiKey = async (data: Partial<ApiKey>, id?: string) => {
    setSaving(true);
    if (id) {
      const { error } = await supabase.from("api_keys").update(data).eq("id", id);
      if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
      else { toast({ title: "تم التحديث بنجاح" }); setEditKey(null); }
    } else {
      const { error } = await supabase.from("api_keys").insert({ ...data, is_active: true } as any);
      if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
      else { toast({ title: "تمت الإضافة بنجاح" }); setShowAddKey(false); }
    }
    setSaving(false);
    fetchKeys();
  };

  const toggleKeyActive = async (k: ApiKey) => {
    const { error } = await supabase.from("api_keys").update({ is_active: !k.is_active }).eq("id", k.id);
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else fetchKeys();
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const table = deleteTarget.type === "ep" ? "service_endpoints" : "api_keys";
    const { error } = await supabase.from(table).delete().eq("id", deleteTarget.id);
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    else { toast({ title: "تم الحذف بنجاح" }); deleteTarget.type === "ep" ? fetchEndpoints() : fetchKeys(); }
    setDeleteTarget(null);
  };

  // ── Helpers ──
  const maskKey = (key: string) => key.length > 8 ? key.slice(0, 4) + "••••••••" + key.slice(-4) : "••••••••";

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredEP = endpoints.filter(
    (ep) => ep.service.toLowerCase().includes(searchEP.toLowerCase()) || ep.base_url.toLowerCase().includes(searchEP.toLowerCase())
  );

  const filteredKeys = keys.filter(
    (k) => k.service.toLowerCase().includes(searchKeys.toLowerCase()) || k.key_name.toLowerCase().includes(searchKeys.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Shield className="w-7 h-7 text-primary" />
            إدارة الاتصالات والمفاتيح
          </h1>
          <p className="text-muted-foreground text-sm mt-1">إدارة روابط الخدمات الخارجية ومفاتيح APIs بشكل مركزي</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-card border border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{endpoints.length}</p>
              <p className="text-xs text-muted-foreground">رابط خدمة</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{endpoints.filter((e) => e.status === "enabled").length}</p>
              <p className="text-xs text-muted-foreground">مفعّل</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{keys.length}</p>
              <p className="text-xs text-muted-foreground">مفتاح API</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{keys.filter((k) => k.is_active).length}</p>
              <p className="text-xs text-muted-foreground">مفتاح نشط</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="quick-setup" className="space-y-4" dir="rtl">
        <TabsList className="bg-muted/30 p-1">
          <TabsTrigger value="quick-setup" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-2">
            <Zap className="w-4 h-4" /> الإعداد السريع
          </TabsTrigger>
          <TabsTrigger value="endpoints" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-2">
            <Link2 className="w-4 h-4" /> روابط الخدمات ({endpoints.length})
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-2">
            <Key className="w-4 h-4" /> مفاتيح APIs ({keys.length})
          </TabsTrigger>
        </TabsList>

        {/* ─── Quick Setup Tab ─── */}
        <TabsContent value="quick-setup" className="space-y-6">
          <QuickSetupPanel
            endpoints={endpoints}
            keys={keys}
            onRefresh={() => { fetchEndpoints(); fetchKeys(); }}
            toast={toast}
          />
        </TabsContent>

        {/* ─── Endpoints Tab ─── */}
        <TabsContent value="endpoints" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchEP}
                onChange={(e) => setSearchEP(e.target.value)}
                placeholder="بحث في الروابط..."
                className="bg-muted/30 pr-10"
              />
            </div>
            <Button variant="outline" size="icon" onClick={fetchEndpoints} title="تحديث">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="gold" size="sm" onClick={() => { setShowAddEP(true); setEditEP(null); }}>
              <Plus className="w-4 h-4 ml-1" /> إضافة رابط
            </Button>
          </div>

          {/* Add / Edit Form */}
          {(showAddEP || editEP) && (
            <div className="p-5 rounded-xl bg-card border border-primary/20 shadow-lg">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                {editEP ? <Pencil className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
                {editEP ? "تعديل رابط الخدمة" : "إضافة رابط خدمة جديد"}
              </h3>
              <EndpointForm
                initial={editEP || undefined}
                onSave={(data) => saveEndpoint(data, editEP?.id)}
                onCancel={() => { setShowAddEP(false); setEditEP(null); }}
                saving={saving}
              />
            </div>
          )}

          {/* Endpoints Table */}
          {loadingEP ? (
            <div className="p-12 text-center text-muted-foreground">جاري التحميل...</div>
          ) : filteredEP.length === 0 ? (
            <div className="p-12 rounded-xl bg-card border border-border/50 text-center">
              <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{searchEP ? "لا توجد نتائج" : "لا توجد روابط خدمات"}</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-right">الخدمة</TableHead>
                    <TableHead className="text-right">الرابط</TableHead>
                    <TableHead className="text-right">ملاحظات</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                    <TableHead className="text-center w-[180px]">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEP.map((ep) => (
                    <TableRow key={ep.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Globe className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-semibold text-sm">{ep.service}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono" dir="ltr">{ep.base_url}</code>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">{ep.notes || "—"}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={ep.status === "enabled" ? "default" : "destructive"} className="text-[10px]">
                          {ep.status === "enabled" ? "مفعّل" : "معطّل"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button size="sm" variant="ghost" onClick={() => toggleEndpointStatus(ep)} title={ep.status === "enabled" ? "تعطيل" : "تفعيل"}>
                            {ep.status === "enabled" ? <XCircle className="w-4 h-4 text-destructive" /> : <CheckCircle className="w-4 h-4 text-success" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => { setEditEP(ep); setShowAddEP(false); }} title="تعديل">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteTarget({ type: "ep", id: ep.id, name: ep.service })} title="حذف">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ─── API Keys Tab ─── */}
        <TabsContent value="api-keys" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchKeys}
                onChange={(e) => setSearchKeys(e.target.value)}
                placeholder="بحث في المفاتيح..."
                className="bg-muted/30 pr-10"
              />
            </div>
            <Button variant="outline" size="icon" onClick={fetchKeys} title="تحديث">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="gold" size="sm" onClick={() => { setShowAddKey(true); setEditKey(null); }}>
              <Plus className="w-4 h-4 ml-1" /> إضافة مفتاح
            </Button>
          </div>

          {/* Add / Edit Form */}
          {(showAddKey || editKey) && (
            <div className="p-5 rounded-xl bg-card border border-primary/20 shadow-lg">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                {editKey ? <Pencil className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
                {editKey ? "تعديل مفتاح API" : "إضافة مفتاح API جديد"}
              </h3>
              <ApiKeyForm
                initial={editKey || undefined}
                onSave={(data) => saveApiKey(data, editKey?.id)}
                onCancel={() => { setShowAddKey(false); setEditKey(null); }}
                saving={saving}
              />
            </div>
          )}

          {/* Keys Table */}
          {loadingKeys ? (
            <div className="p-12 text-center text-muted-foreground">جاري التحميل...</div>
          ) : filteredKeys.length === 0 ? (
            <div className="p-12 rounded-xl bg-card border border-border/50 text-center">
              <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{searchKeys ? "لا توجد نتائج" : "لا توجد مفاتيح APIs"}</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-right">الخدمة</TableHead>
                    <TableHead className="text-right">اسم المفتاح</TableHead>
                    <TableHead className="text-right">القيمة</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                    <TableHead className="text-center w-[220px]">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKeys.map((k) => (
                    <TableRow key={k.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                            <Key className="w-4 h-4 text-secondary" />
                          </div>
                          <span className="font-semibold text-sm">{k.service}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{k.key_name}</span>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono" dir="ltr">
                          {visibleKeys.has(k.id) ? k.key_value : maskKey(k.key_value)}
                        </code>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={k.is_active ? "default" : "destructive"} className="text-[10px]">
                          {k.is_active ? "نشط" : "معطّل"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setVisibleKeys((prev) => {
                                const next = new Set(prev);
                                next.has(k.id) ? next.delete(k.id) : next.add(k.id);
                                return next;
                              });
                            }}
                            title={visibleKeys.has(k.id) ? "إخفاء" : "إظهار"}
                          >
                            {visibleKeys.has(k.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(k.key_value, k.id)}
                            title="نسخ"
                          >
                            {copiedId === k.id ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => toggleKeyActive(k)} title={k.is_active ? "تعطيل" : "تفعيل"}>
                            {k.is_active ? <XCircle className="w-4 h-4 text-destructive" /> : <CheckCircle className="w-4 h-4 text-success" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => { setEditKey(k); setShowAddKey(false); }} title="تعديل">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteTarget({ type: "key", id: k.id, name: `${k.service} - ${k.key_name}` })} title="حذف">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف <strong>{deleteTarget?.name}</strong>؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 ml-1" /> حذف نهائي
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
