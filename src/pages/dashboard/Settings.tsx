import { useState } from "react";
import { Settings as SettingsIcon, Trash2, Globe, Palette, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { clearAllCache } from "@/lib/cache";
import { useToast } from "@/hooks/use-toast";

const APP_VERSION = "1.0.0";

export default function Settings() {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(true);

  const handleClearCache = () => {
    clearAllCache();
    toast({ title: "تم", description: "تم مسح جميع البيانات المخزنة مؤقتاً" });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>

        <div className="space-y-4">
          {/* Language */}
          <div className="p-5 rounded-2xl bg-card border border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-bold">اللغة</p>
                <p className="text-xs text-muted-foreground">العربية (الافتراضية)</p>
              </div>
              <span className="text-sm text-muted-foreground">العربية</span>
            </div>
          </div>

          {/* Theme */}
          <div className="p-5 rounded-2xl bg-card border border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-bold">الوضع الداكن</p>
                <p className="text-xs text-muted-foreground">تفعيل المظهر الداكن</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </div>

          {/* Clear Cache */}
          <div className="p-5 rounded-2xl bg-card border border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-bold">مسح البيانات المؤقتة</p>
                <p className="text-xs text-muted-foreground">مسح كل البيانات المخزنة محلياً</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearCache}>مسح</Button>
            </div>
          </div>

          {/* Version */}
          <div className="p-5 rounded-2xl bg-card border border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Info className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-bold">إصدار التطبيق</p>
                <p className="text-xs text-muted-foreground">مشروكي v{APP_VERSION}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
