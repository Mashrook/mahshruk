import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Save } from "lucide-react";
import PermissionGate from "@/components/auth/PermissionGate";

interface BrandingForm {
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_heading: string;
  font_body: string;
  support_email: string;
  support_phone: string;
  footer_text: string;
  custom_css: string;
}

export default function AdminTenantBranding() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [form, setForm] = useState<BrandingForm>({
    logo_url: "", favicon_url: "", primary_color: "#D4A017",
    secondary_color: "#24AEFF", accent_color: "#C04AFF",
    font_heading: "Noto Kufi Arabic", font_body: "Cairo",
    support_email: "", support_phone: "", footer_text: "", custom_css: "",
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("tenants").select("id, name, slug").order("name").then(({ data }) => {
      setTenants(data || []);
    });
  }, []);

  useEffect(() => {
    if (!selectedTenantId) return;
    supabase.from("tenant_branding").select("*").eq("tenant_id", selectedTenantId).maybeSingle().then(({ data }) => {
      if (data) {
        setForm({
          logo_url: data.logo_url || "",
          favicon_url: data.favicon_url || "",
          primary_color: data.primary_color || "#D4A017",
          secondary_color: data.secondary_color || "#24AEFF",
          accent_color: data.accent_color || "#C04AFF",
          font_heading: data.font_heading || "Noto Kufi Arabic",
          font_body: data.font_body || "Cairo",
          support_email: data.support_email || "",
          support_phone: data.support_phone || "",
          footer_text: data.footer_text || "",
          custom_css: data.custom_css || "",
        });
      }
    });
  }, [selectedTenantId]);

  const save = async () => {
    if (!selectedTenantId) return;
    setSaving(true);
    const { error } = await supabase.from("tenant_branding").upsert({
      tenant_id: selectedTenantId,
      ...form,
    }, { onConflict: "tenant_id" });

    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم حفظ العلامة التجارية بنجاح" });
    }
    setSaving(false);
  };

  return (
    <PermissionGate permission="tenant.branding">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3 mb-2">
          <Palette className="w-7 h-7 text-primary" /> محرر العلامة التجارية
        </h1>
        <p className="text-muted-foreground text-sm mb-8">تخصيص الشعار والألوان والخطوط لكل مستأجر</p>

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

        {selectedTenantId && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <h3 className="font-bold mb-4">الشعار والأيقونة</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">رابط الشعار</label>
                  <Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} dir="ltr" placeholder="https://..." />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">رابط الأيقونة</label>
                  <Input value={form.favicon_url} onChange={(e) => setForm({ ...form, favicon_url: e.target.value })} dir="ltr" placeholder="https://..." />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <h3 className="font-bold mb-4">الألوان</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">اللون الرئيسي</label>
                  <div className="flex gap-2">
                    <input type="color" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-0" />
                    <Input value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">اللون الثانوي</label>
                  <div className="flex gap-2">
                    <input type="color" value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-0" />
                    <Input value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">لون التمييز</label>
                  <div className="flex gap-2">
                    <input type="color" value={form.accent_color} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-0" />
                    <Input value={form.accent_color} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} dir="ltr" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <h3 className="font-bold mb-4">الخطوط</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">خط العناوين</label>
                  <Input value={form.font_heading} onChange={(e) => setForm({ ...form, font_heading: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">خط النصوص</label>
                  <Input value={form.font_body} onChange={(e) => setForm({ ...form, font_body: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <h3 className="font-bold mb-4">الدعم والتواصل</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">بريد الدعم</label>
                  <Input value={form.support_email} onChange={(e) => setForm({ ...form, support_email: e.target.value })} dir="ltr" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">هاتف الدعم</label>
                  <Input value={form.support_phone} onChange={(e) => setForm({ ...form, support_phone: e.target.value })} dir="ltr" />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm text-muted-foreground mb-1 block">نص التذييل</label>
                <Input value={form.footer_text} onChange={(e) => setForm({ ...form, footer_text: e.target.value })} />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <h3 className="font-bold mb-4">CSS مخصص</h3>
              <Textarea
                value={form.custom_css}
                onChange={(e) => setForm({ ...form, custom_css: e.target.value })}
                dir="ltr"
                rows={5}
                placeholder=":root { --custom-var: value; }"
                className="font-mono text-xs"
              />
            </div>

            <Button onClick={save} disabled={saving} className="min-w-[160px]">
              <Save className="w-4 h-4 ml-2" />
              {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </div>
        )}
      </div>
    </PermissionGate>
  );
}
