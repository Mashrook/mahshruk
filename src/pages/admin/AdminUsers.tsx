import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Mail, Phone, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
      else setProfiles(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
        <span className="text-sm text-muted-foreground">{profiles.length} مستخدم</span>
      </div>

      {loading ? (
        <p className="text-muted-foreground">جاري التحميل...</p>
      ) : profiles.length === 0 ? (
        <div className="p-12 rounded-2xl bg-card border border-border/50 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">لا يوجد مستخدمين مسجلين</p>
        </div>
      ) : (
        <div className="space-y-3">
          {profiles.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                {p.avatar_url ? (
                  <img src={p.avatar_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <Users className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold">{p.full_name || "بدون اسم"}</p>
                <div className="flex items-center gap-4 mt-1">
                  {p.phone && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" /> {p.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" /> {new Date(p.created_at).toLocaleDateString("ar-SA")}
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{p.user_id?.slice(0, 12)}...</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}