import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Save, Globe, Users, Plus, Trash2 } from "lucide-react";
import PermissionGate from "@/components/auth/PermissionGate";

export default function AdminTenantSettings() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [tenant, setTenant] = useState<any>(null);
  const [domains, setDomains] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("tenants").select("id, name, slug").order("name").then(({ data }) => setTenants(data || []));
  }, []);

  const loadTenantData = async (tenantId: string) => {
    const [tRes, dRes, mRes] = await Promise.all([
      supabase.from("tenants").select("*").eq("id", tenantId).single(),
      supabase.from("tenant_domains").select("*").eq("tenant_id", tenantId),
      supabase.from("tenant_members").select("*").eq("tenant_id", tenantId),
    ]);
    setTenant(tRes.data);
    setDomains(dRes.data || []);
    setMembers(mRes.data || []);
  };

  useEffect(() => {
    if (selectedTenantId) loadTenantData(selectedTenantId);
  }, [selectedTenantId]);

  const updateTenant = async () => {
    if (!tenant) return;
    setSaving(true);
    await supabase.from("tenants").update({
      name: tenant.name,
      contact_email: tenant.contact_email,
      contact_phone: tenant.contact_phone,
      plan: tenant.plan,
    }).eq("id", tenant.id);
    toast({ title: "تم حفظ إعدادات المستأجر" });
    setSaving(false);
  };

  const addDomain = async () => {
    if (!selectedTenantId || !newDomain) return;
    const { error } = await supabase.from("tenant_domains").insert({
      tenant_id: selectedTenantId,
      domain: newDomain.toLowerCase(),
    });
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      setNewDomain("");
      loadTenantData(selectedTenantId);
    }
  };

  const removeDomain = async (id: string) => {
    await supabase.from("tenant_domains").delete().eq("id", id);
    loadTenantData(selectedTenantId);
  };

  const removeMember = async (id: string) => {
    await supabase.from("tenant_members").delete().eq("id", id);
    loadTenantData(selectedTenantId);
  };

  return (
    <PermissionGate permission="tenant.settings">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3 mb-2">
          <Settings className="w-7 h-7 text-primary" /> إعدادات المستأجر
        </h1>
        <p className="text-muted-foreground text-sm mb-8">إدارة النطاقات والأعضاء والإعدادات العامة</p>

        <div className="mb-6">
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
        </div>

        {tenant && (
          <div className="space-y-6">
            {/* General Settings */}
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <h3 className="font-bold mb-4">الإعدادات العامة</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">اسم المستأجر</label>
                  <Input value={tenant.name} onChange={(e) => setTenant({ ...tenant, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">البريد الإلكتروني</label>
                  <Input value={tenant.contact_email || ""} onChange={(e) => setTenant({ ...tenant, contact_email: e.target.value })} dir="ltr" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">الهاتف</label>
                  <Input value={tenant.contact_phone || ""} onChange={(e) => setTenant({ ...tenant, contact_phone: e.target.value })} dir="ltr" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">الخطة</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={tenant.plan}
                    onChange={(e) => setTenant({ ...tenant, plan: e.target.value })}
                  >
                    <option value="free">مجاني</option>
                    <option value="starter">مبتدئ</option>
                    <option value="pro">احترافي</option>
                    <option value="enterprise">مؤسسات</option>
                  </select>
                </div>
              </div>
              <Button className="mt-4" onClick={updateTenant} disabled={saving}>
                <Save className="w-4 h-4 ml-2" /> {saving ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </div>

            {/* Domains */}
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> النطاقات</h3>
              {domains.length > 0 && (
                <div className="space-y-2 mb-4">
                  {domains.map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                      <div>
                        <span className="font-medium text-sm" dir="ltr">{d.domain}</span>
                        {d.is_primary && <span className="text-xs text-primary mr-2">(رئيسي)</span>}
                        {!d.is_verified && <span className="text-xs text-warning mr-2">(غير موثق)</span>}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeDomain(d.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <Input placeholder="example.com" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} dir="ltr" />
                <Button onClick={addDomain}><Plus className="w-4 h-4 ml-1" /> إضافة</Button>
              </div>
            </div>

            {/* Members */}
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> الأعضاء</h3>
              {members.length === 0 ? (
                <p className="text-sm text-muted-foreground">لا يوجد أعضاء</p>
              ) : (
                <div className="space-y-2">
                  {members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                      <div>
                        <span className="text-sm font-medium">{m.user_id.substring(0, 8)}...</span>
                        <span className="text-xs text-primary mr-2">{m.role}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeMember(m.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PermissionGate>
  );
}
