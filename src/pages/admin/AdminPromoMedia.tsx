import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Video, Image, Eye, Plus, FileText, Loader2 } from "lucide-react";

interface MediaItem {
  id: string;
  label: string;
  settingKeyUrl: string;
  settingKeyType: string;
  url: string;
  type: "video" | "image";
}

const defaultSlots: Omit<MediaItem, "id" | "url" | "type">[] = [
  { label: "الصفحة الرئيسية", settingKeyUrl: "promo_media_url", settingKeyType: "promo_media_type" },
  { label: "صفحة العروض", settingKeyUrl: "promo_offers_url", settingKeyType: "promo_offers_type" },
  { label: "صفحة الوجهات", settingKeyUrl: "promo_destinations_url", settingKeyType: "promo_destinations_type" },
];

export default function AdminPromoMedia() {
  const [slots, setSlots] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadAllSlots();
  }, []);

  const loadAllSlots = async () => {
    setLoading(true);
    const keys = defaultSlots.flatMap(s => [s.settingKeyUrl, s.settingKeyType]);
    const { data } = await supabase
      .from("site_settings")
      .select("setting_key, setting_value")
      .in("setting_key", keys);

    const map: Record<string, string> = {};
    (data || []).forEach(d => { map[d.setting_key] = d.setting_value || ""; });

    const loaded = defaultSlots.map((s, i) => ({
      id: String(i),
      label: s.label,
      settingKeyUrl: s.settingKeyUrl,
      settingKeyType: s.settingKeyType,
      url: map[s.settingKeyUrl] || "",
      type: (map[s.settingKeyType] as "video" | "image") || "video",
    }));
    setSlots(loaded);
    setLoading(false);
  };

  const updateSlot = (id: string, patch: Partial<MediaItem>) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  const handleFileUpload = async (slotId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) {
      toast({ title: "خطأ", description: "يرجى اختيار ملف فيديو أو صورة", variant: "destructive" });
      return;
    }

    setUploading(slotId);
    const ext = file.name.split(".").pop();
    const fileName = `promo-${slotId}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("promo-media")
      .upload(fileName, file, { upsert: true });

    if (error) {
      toast({ title: "خطأ في الرفع", description: error.message, variant: "destructive" });
      setUploading(null);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("promo-media").getPublicUrl(fileName);
    updateSlot(slotId, {
      url: publicUrl.publicUrl,
      type: isVideo ? "video" : "image",
    });
    setUploading(null);
    toast({ title: "تم رفع الملف بنجاح" });
  };

  const upsertSetting = async (key: string, value: string, type: string = "text") => {
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("setting_key", key)
      .maybeSingle();

    if (existing) {
      await supabase.from("site_settings").update({ setting_value: value }).eq("setting_key", key);
    } else {
      await supabase.from("site_settings").insert({ setting_key: key, setting_value: value, setting_type: type });
    }
  };

  const handleSaveSlot = async (slot: MediaItem) => {
    setSaving(slot.id);
    try {
      await upsertSetting(slot.settingKeyUrl, slot.url, "url");
      await upsertSetting(slot.settingKeyType, slot.type, "text");
      toast({ title: `تم حفظ محتوى "${slot.label}"` });
    } catch {
      toast({ title: "خطأ", variant: "destructive" });
    }
    setSaving(null);
  };

  const handleRemoveSlot = async (slot: MediaItem) => {
    updateSlot(slot.id, { url: "" });
    await supabase.from("site_settings").update({ setting_value: "" }).eq("setting_key", slot.settingKeyUrl);
    toast({ title: `تم حذف محتوى "${slot.label}"` });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">المحتوى الدعائي</h1>
          <p className="text-muted-foreground text-sm">رفع فيديو أو صورة دعائية لكل صفحة — من الجهاز أو برابط مباشر</p>
        </div>
        <Video className="w-8 h-8 text-primary" />
      </div>

      {slots.map((slot) => (
        <Card key={slot.id}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4 text-primary" />
              {slot.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload */}
            <input
              ref={(el) => { fileInputRefs.current[slot.id] = el; }}
              type="file"
              accept="video/*,image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(slot.id, e)}
              title={`رفع ملف لـ ${slot.label}`}
            />
            <div className="flex flex-wrap gap-3 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRefs.current[slot.id]?.click()}
                disabled={uploading === slot.id}
              >
                <Upload className="w-4 h-4 ml-2" />
                {uploading === slot.id ? "جاري الرفع..." : "رفع من الجهاز"}
              </Button>
              <Button
                variant={slot.type === "video" ? "default" : "outline"}
                size="sm"
                onClick={() => updateSlot(slot.id, { type: "video" })}
              >
                <Video className="w-4 h-4 ml-1" /> فيديو
              </Button>
              <Button
                variant={slot.type === "image" ? "default" : "outline"}
                size="sm"
                onClick={() => updateSlot(slot.id, { type: "image" })}
              >
                <Image className="w-4 h-4 ml-1" /> صورة
              </Button>
              {slot.url && (
                <Button variant="destructive" size="sm" onClick={() => handleRemoveSlot(slot)}>
                  <Trash2 className="w-4 h-4 ml-1" /> حذف
                </Button>
              )}
            </div>

            {/* URL */}
            <Input
              value={slot.url}
              onChange={(e) => updateSlot(slot.id, { url: e.target.value })}
              placeholder="أو أدخل رابط مباشر للفيديو أو الصورة"
              className="bg-muted/30"
              dir="ltr"
            />

            {/* Preview */}
            {slot.url && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs"><Eye className="w-3.5 h-3.5" />معاينة</Label>
                <div className="rounded-xl overflow-hidden border border-border bg-muted max-w-lg">
                  {slot.type === "video" ? (
                    <video src={slot.url} controls className="w-full aspect-video object-cover" />
                  ) : (
                    <img src={slot.url} alt={slot.label} className="w-full aspect-video object-cover" />
                  )}
                </div>
              </div>
            )}

            <Button variant="gold" size="sm" onClick={() => handleSaveSlot(slot)} disabled={saving === slot.id}>
              {saving === slot.id ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
