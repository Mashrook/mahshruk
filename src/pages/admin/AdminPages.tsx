import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText, Plus, Pencil, Lock, Unlock, Trash2, Eye, EyeOff,
  Upload, Video, Image, GripVertical, Search, Loader2, ExternalLink,
} from "lucide-react";

interface ManagedPage {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  status: "active" | "locked" | "draft" | "hidden";
  is_system: boolean;
  sort_order: number;
  media_type: "video" | "image" | null;
  media_url: string | null;
  icon: string;
  route: string | null;
  created_at: string;
  updated_at: string;
}

const statusLabels: Record<string, { label: string; color: string; icon: typeof Eye }> = {
  active: { label: "نشطة", color: "bg-green-500/10 text-green-500 border-green-500/30", icon: Eye },
  locked: { label: "مقفلة", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30", icon: Lock },
  draft: { label: "مسودة", color: "bg-blue-500/10 text-blue-400 border-blue-500/30", icon: FileText },
  hidden: { label: "مخفية", color: "bg-red-500/10 text-red-400 border-red-500/30", icon: EyeOff },
};

const emptyPage: Omit<ManagedPage, "id" | "created_at" | "updated_at"> = {
  title: "",
  slug: "",
  description: "",
  content: "",
  status: "draft",
  is_system: false,
  sort_order: 0,
  media_type: null,
  media_url: null,
  icon: "FileText",
  route: null,
};

export default function AdminPages() {
  const [pages, setPages] = useState<ManagedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<ManagedPage | null>(null);
  const [form, setForm] = useState(emptyPage);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<ManagedPage | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("managed_pages" as any)
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      toast({ title: "خطأ", description: "تعذر تحميل الصفحات", variant: "destructive" });
    } else {
      setPages((data as any) || []);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditingPage(null);
    setForm({ ...emptyPage, sort_order: pages.length + 1 });
    setDialogOpen(true);
  };

  const openEdit = (page: ManagedPage) => {
    setEditingPage(page);
    setForm({
      title: page.title,
      slug: page.slug,
      description: page.description || "",
      content: page.content || "",
      status: page.status,
      is_system: page.is_system,
      sort_order: page.sort_order,
      media_type: page.media_type,
      media_url: page.media_url,
      icon: page.icon,
      route: page.route,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) {
      toast({ title: "خطأ", description: "العنوان والرابط مطلوبان", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editingPage) {
        const { error } = await supabase
          .from("managed_pages" as any)
          .update({
            title: form.title,
            slug: form.slug,
            description: form.description,
            content: form.content,
            status: form.status,
            sort_order: form.sort_order,
            media_type: form.media_type,
            media_url: form.media_url,
            icon: form.icon,
            route: form.route,
            updated_at: new Date().toISOString(),
          } as any)
          .eq("id", editingPage.id);
        if (error) throw error;
        toast({ title: "تم تحديث الصفحة بنجاح" });
      } else {
        const { error } = await supabase
          .from("managed_pages" as any)
          .insert({
            title: form.title,
            slug: form.slug,
            description: form.description,
            content: form.content,
            status: form.status,
            sort_order: form.sort_order,
            media_type: form.media_type,
            media_url: form.media_url,
            icon: form.icon,
            route: form.route || `/${form.slug}`,
          } as any);
        if (error) throw error;
        toast({ title: "تم إنشاء الصفحة بنجاح" });
      }
      setDialogOpen(false);
      fetchPages();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const toggleStatus = async (page: ManagedPage, newStatus: string) => {
    const { error } = await supabase
      .from("managed_pages" as any)
      .update({ status: newStatus, updated_at: new Date().toISOString() } as any)
      .eq("id", page.id);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `تم تغيير الحالة إلى ${statusLabels[newStatus]?.label}` });
      fetchPages();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase
      .from("managed_pages" as any)
      .delete()
      .eq("id", deleteTarget.id);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم حذف الصفحة" });
      fetchPages();
    }
    setDeleteTarget(null);
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
    const fileName = `page-${form.slug || "media"}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("page-media")
      .upload(fileName, file, { upsert: true });

    if (error) {
      toast({ title: "خطأ في الرفع", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("page-media").getPublicUrl(fileName);
    setForm(prev => ({
      ...prev,
      media_url: publicUrl.publicUrl,
      media_type: isVideo ? "video" : "image",
    }));
    setUploading(false);
    toast({ title: "تم رفع الملف بنجاح" });
  };

  const removeMedia = () => {
    setForm(prev => ({ ...prev, media_url: null, media_type: null }));
  };

  const filteredPages = pages.filter(p => {
    const matchSearch = !search || p.title.includes(search) || p.slug.includes(search);
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة الصفحات</h1>
          <p className="text-muted-foreground text-sm">إضافة، تعديل، إقفال الصفحات مع إمكانية رفع محتوى دعائي</p>
        </div>
        <Button variant="gold" onClick={openCreate}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة صفحة
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث بالعنوان أو الرابط..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9 bg-muted/30"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "locked", "draft", "hidden"].map(s => (
            <Button
              key={s}
              variant={filterStatus === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(s)}
              className="text-xs"
            >
              {s === "all" ? "الكل" : statusLabels[s]?.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Pages List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">لا توجد صفحات</div>
      ) : (
        <div className="space-y-3">
          {filteredPages.map((page) => {
            const st = statusLabels[page.status] || statusLabels.active;
            const StIcon = st.icon;
            return (
              <div
                key={page.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-all group"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">{page.title}</h3>
                    {page.is_system && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">نظام</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span dir="ltr">{page.route || `/${page.slug}`}</span>
                    {page.media_type && (
                      <span className="flex items-center gap-1">
                        {page.media_type === "video" ? <Video className="w-3 h-3" /> : <Image className="w-3 h-3" />}
                        {page.media_type === "video" ? "فيديو" : "صورة"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1 ${st.color}`}>
                  <StIcon className="w-3 h-3" />
                  {st.label}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon-sm" title="تعديل" onClick={() => openEdit(page)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>

                  {page.status === "active" ? (
                    <Button variant="ghost" size="icon-sm" title="قفل" onClick={() => toggleStatus(page, "locked")}>
                      <Lock className="w-3.5 h-3.5 text-yellow-500" />
                    </Button>
                  ) : page.status === "locked" ? (
                    <Button variant="ghost" size="icon-sm" title="فتح" onClick={() => toggleStatus(page, "active")}>
                      <Unlock className="w-3.5 h-3.5 text-green-500" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon-sm" title="تفعيل" onClick={() => toggleStatus(page, "active")}>
                      <Eye className="w-3.5 h-3.5 text-green-500" />
                    </Button>
                  )}

                  {page.status !== "hidden" && (
                    <Button variant="ghost" size="icon-sm" title="إخفاء" onClick={() => toggleStatus(page, "hidden")}>
                      <EyeOff className="w-3.5 h-3.5 text-red-400" />
                    </Button>
                  )}

                  {!page.is_system && (
                    <Button variant="ghost" size="icon-sm" title="حذف" onClick={() => setDeleteTarget(page)}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  )}

                  {page.route && (
                    <a href={page.route} target="_blank" rel="noopener noreferrer" title={`معاينة ${page.title}`}>
                      <Button variant="ghost" size="icon-sm" title="معاينة">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPage ? "تعديل الصفحة" : "إضافة صفحة جديدة"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            {/* Title & Slug */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>عنوان الصفحة *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    setForm(prev => ({
                      ...prev,
                      title: e.target.value,
                      slug: editingPage ? prev.slug : e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^\u0621-\u064Aa-z0-9-]/g, ""),
                    }));
                  }}
                  placeholder="اسم الصفحة"
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label>الرابط (slug) *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="page-slug"
                  className="bg-muted/30"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>الوصف</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="وصف مختصر للصفحة"
                className="bg-muted/30"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>حالة الصفحة</Label>
              <div className="flex gap-2">
                {(["active", "locked", "draft", "hidden"] as const).map(s => (
                  <Button
                    key={s}
                    type="button"
                    variant={form.status === s ? "default" : "outline"}
                    size="sm"
                    onClick={() => setForm(prev => ({ ...prev, status: s }))}
                    className="text-xs"
                  >
                    {statusLabels[s].label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Media Upload Section */}
            <div className="space-y-3 p-4 rounded-xl bg-muted/20 border border-border/30">
              <Label className="text-sm font-semibold">المحتوى الدعائي (اختياري)</Label>
              <p className="text-xs text-muted-foreground">يمكنك رفع فيديو أو صورة من جهازك، أو لصق رابط مباشر</p>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,image/*"
                className="hidden"
                onChange={handleFileUpload}
                title="رفع ملف وسائط"
              />

              <div className="flex gap-3 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 ml-2" />
                  {uploading ? "جاري الرفع..." : "رفع ملف"}
                </Button>
                <Button
                  type="button"
                  variant={form.media_type === "video" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setForm(prev => ({ ...prev, media_type: "video" }))}
                >
                  <Video className="w-4 h-4 ml-1" /> فيديو
                </Button>
                <Button
                  type="button"
                  variant={form.media_type === "image" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setForm(prev => ({ ...prev, media_type: "image" }))}
                >
                  <Image className="w-4 h-4 ml-1" /> صورة
                </Button>
                {form.media_url && (
                  <Button type="button" variant="destructive" size="sm" onClick={removeMedia}>
                    <Trash2 className="w-4 h-4 ml-1" /> حذف الميديا
                  </Button>
                )}
              </div>

              {/* URL input */}
              <Input
                value={form.media_url || ""}
                onChange={(e) => setForm(prev => ({ ...prev, media_url: e.target.value || null }))}
                placeholder="أو أدخل رابط مباشر للفيديو أو الصورة"
                className="bg-muted/30"
                dir="ltr"
              />

              {/* Preview */}
              {form.media_url && (
                <div className="rounded-lg overflow-hidden border border-border max-w-md">
                  {form.media_type === "video" ? (
                    <video src={form.media_url} controls className="w-full aspect-video object-cover" />
                  ) : (
                    <img src={form.media_url} alt="معاينة" className="w-full aspect-video object-cover" />
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label>محتوى الصفحة</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="محتوى الصفحة (HTML أو نص)"
                className="bg-muted/30 min-h-[120px]"
                dir="rtl"
              />
            </div>

            {/* Route */}
            <div className="space-y-2">
              <Label>المسار (Route)</Label>
              <Input
                value={form.route || ""}
                onChange={(e) => setForm(prev => ({ ...prev, route: e.target.value || null }))}
                placeholder={`/${form.slug}`}
                className="bg-muted/30"
                dir="ltr"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button variant="gold" onClick={handleSave} disabled={saving}>
              {saving ? "جاري الحفظ..." : editingPage ? "تحديث" : "إنشاء الصفحة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            هل أنت متأكد من حذف صفحة <strong>{deleteTarget?.title}</strong>؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
