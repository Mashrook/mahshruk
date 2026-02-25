import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Upload, Trash2, Video, Image, Eye } from "lucide-react";

export default function AdminPromoMedia() {
  const [promoUrl, setPromoUrl] = useState("");
  const [promoType, setPromoType] = useState<"video" | "image">("video");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data: urlSetting } = await supabase
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", "promo_media_url")
      .maybeSingle();
    const { data: typeSetting } = await supabase
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", "promo_media_type")
      .maybeSingle();

    if (urlSetting?.setting_value) setPromoUrl(urlSetting.setting_value);
    if (typeSetting?.setting_value) setPromoType(typeSetting.setting_value as "video" | "image");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) {
      toast({ title: "خطأ", description: "يرجى اختيار ملف فيديو أو صورة", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `promo-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("promo-media")
      .upload(fileName, file, { upsert: true });

    if (error) {
      toast({ title: "خطأ في الرفع", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("promo-media").getPublicUrl(fileName);
    setPromoUrl(publicUrl.publicUrl);
    setPromoType(isVideo ? "video" : "image");
    setUploading(false);
    toast({ title: "تم رفع الملف بنجاح" });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upsert promo_media_url
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", "promo_media_url")
        .maybeSingle();

      if (existing) {
        await supabase
          .from("site_settings")
          .update({ setting_value: promoUrl })
          .eq("setting_key", "promo_media_url");
      } else {
        await supabase.from("site_settings").insert({
          setting_key: "promo_media_url",
          setting_value: promoUrl,
          setting_type: "url",
        });
      }

      // Upsert promo_media_type
      const { data: existingType } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", "promo_media_type")
        .maybeSingle();

      if (existingType) {
        await supabase
          .from("site_settings")
          .update({ setting_value: promoType })
          .eq("setting_key", "promo_media_type");
      } else {
        await supabase.from("site_settings").insert({
          setting_key: "promo_media_type",
          setting_value: promoType,
          setting_type: "text",
        });
      }

      toast({ title: "تم حفظ الإعدادات" });
    } catch {
      toast({ title: "خطأ", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setPromoUrl("");
    await supabase.from("site_settings").update({ setting_value: "" }).eq("setting_key", "promo_media_url");
    toast({ title: "تم حذف المحتوى الدعائي" });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">المحتوى الدعائي</h1>
          <p className="text-muted-foreground">رفع فيديو أو صورة دعائية تظهر في الصفحة الرئيسية</p>
        </div>
        <Video className="w-8 h-8 text-primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>رفع محتوى دعائي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload */}
          <div className="space-y-2">
            <Label>اختر ملف فيديو أو صورة من جهازك</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 ml-2" />
                {uploading ? "جاري الرفع..." : "رفع ملف"}
              </Button>
              {promoUrl && (
                <Button variant="destructive" size="sm" onClick={handleRemove}>
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف
                </Button>
              )}
            </div>
          </div>

          {/* Or paste URL */}
          <div className="space-y-2">
            <Label>أو أدخل رابط مباشر</Label>
            <Input
              value={promoUrl}
              onChange={(e) => setPromoUrl(e.target.value)}
              placeholder="https://example.com/promo-video.mp4"
              dir="ltr"
            />
          </div>

          {/* Type selector */}
          <div className="flex gap-3">
            <Button
              variant={promoType === "video" ? "default" : "outline"}
              size="sm"
              onClick={() => setPromoType("video")}
            >
              <Video className="w-4 h-4 ml-2" />
              فيديو
            </Button>
            <Button
              variant={promoType === "image" ? "default" : "outline"}
              size="sm"
              onClick={() => setPromoType("image")}
            >
              <Image className="w-4 h-4 ml-2" />
              صورة
            </Button>
          </div>

          {/* Preview */}
          {promoUrl && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Eye className="w-4 h-4" />معاينة</Label>
              <div className="rounded-xl overflow-hidden border border-border bg-muted max-w-2xl">
                {promoType === "video" ? (
                  <video
                    src={promoUrl}
                    controls
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <img
                    src={promoUrl}
                    alt="محتوى دعائي"
                    className="w-full aspect-video object-cover"
                  />
                )}
              </div>
            </div>
          )}

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
