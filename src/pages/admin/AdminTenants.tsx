import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Ban, CheckCircle2, Trash2, Eye } from "lucide-react";
import PermissionGate from "@/components/auth/PermissionGate";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: string;
  plan: string;
  owner_user_id: string;
  contact_email: string | null;
  created_at: string;
}

export default function AdminTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", contact_email: "", plan: "free" });
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const { toast } = useToast();

  const fetchTenants = async () => {
    setLoading(true);
    const { data } = await supabase.from("tenants").select("*").order("created_at", { ascending: false });
    setTenants((data || []) as Tenant[]);
    setLoading(false);
  };

  useEffect(() => { fetchTenants(); }, []);

  const createTenant = async () => {
    if (!form.name || !form.slug) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("tenants").insert({
      name: form.name,
      slug: form.slug.toLowerCase().replace(/[^a-z0-9-]/g, ""),
      contact_email: form.contact_email || null,
      plan: form.plan,
      owner_user_id: user.id,
    });

    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم إنشاء المستأجر بنجاح" });
      setShowCreate(false);
      setForm({ name: "", slug: "", contact_email: "", plan: "free" });
      fetchTenants();
    }
  };

  const toggleStatus = async (tenant: Tenant) => {
    const newStatus = tenant.status === "active" ? "suspended" : "active";
    await supabase.from("tenants").update({ status: newStatus }).eq("id", tenant.id);
    toast({ title: `تم ${newStatus === "active" ? "تفعيل" : "تعليق"} المستأجر` });
    fetchTenants();
  };

  const deleteTenant = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستأجر؟")) return;
    await supabase.from("tenants").delete().eq("id", id);
    toast({ title: "تم حذف المستأجر" });
    fetchTenants();
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-500/15 text-green-400",
      suspended: "bg-destructive/15 text-destructive",
      trial: "bg-warning/15 text-warning",
    };
    const labels: Record<string, string> = { active: "نشط", suspended: "معلق", trial: "تجريبي" };
    return <span className={`text-xs px-2 py-1 rounded-full ${colors[status] || ""}`}>{labels[status] || status}</span>;
  };

  return (
    <PermissionGate permission="tenants.manage">
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Building2 className="w-7 h-7 text-primary" /> إدارة المستأجرين
            </h1>
            <p className="text-muted-foreground text-sm mt-1">إنشاء وإدارة المستأجرين على المنصة</p>
          </div>
          <Button onClick={() => setShowCreate(!showCreate)}>
            <Plus className="w-4 h-4 ml-2" /> إنشاء مستأجر
          </Button>
        </div>

        {showCreate && (
          <div className="p-6 mb-6 rounded-2xl bg-card border border-border/50 space-y-4">
            <h3 className="font-bold">مستأجر جديد</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="اسم المستأجر" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Slug (رابط فرعي)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} dir="ltr" />
              <Input placeholder="البريد الإلكتروني" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} dir="ltr" />
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
              >
                <option value="free">مجاني</option>
                <option value="starter">مبتدئ</option>
                <option value="pro">احترافي</option>
                <option value="enterprise">مؤسسات</option>
              </select>
            </div>
            <Button onClick={createTenant}>إنشاء</Button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : tenants.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">لا يوجد مستأجرين بعد</div>
        ) : (
          <div className="space-y-3">
            {tenants.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">/t/{t.slug} · {t.plan}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {statusBadge(t.status)}
                  <Button variant="ghost" size="icon" onClick={() => setSelectedTenant(t)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => toggleStatus(t)}>
                    {t.status === "active" ? <Ban className="w-4 h-4 text-destructive" /> : <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteTenant(t.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tenant Detail Sheet */}
        {selectedTenant && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setSelectedTenant(null)}>
            <div className="bg-card p-8 rounded-2xl border border-border/50 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">{selectedTenant.name}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Slug:</span><span dir="ltr">{selectedTenant.slug}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">الحالة:</span>{statusBadge(selectedTenant.status)}</div>
                <div className="flex justify-between"><span className="text-muted-foreground">الخطة:</span><span>{selectedTenant.plan}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">البريد:</span><span dir="ltr">{selectedTenant.contact_email || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">تاريخ الإنشاء:</span><span>{new Date(selectedTenant.created_at).toLocaleDateString("ar")}</span></div>
              </div>
              <Button className="w-full mt-6" variant="outline" onClick={() => setSelectedTenant(null)}>إغلاق</Button>
            </div>
          </div>
        )}
      </div>
    </PermissionGate>
  );
}
