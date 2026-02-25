import { useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationsStore } from "@/stores/notificationsStore";

export default function Notifications() {
  const { user } = useAuthStore();
  const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationsStore();

  useEffect(() => {
    if (user) fetchNotifications(user.id);
  }, [user]);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">الإشعارات</h1>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={() => user && markAllAsRead(user.id)}>
              <CheckCheck className="w-4 h-4 ml-2" />
              تعليم الكل كمقروء
            </Button>
          )}
        </div>
        {loading ? (
          <p className="text-muted-foreground">جاري التحميل...</p>
        ) : notifications.length === 0 ? (
          <div className="p-12 rounded-2xl bg-card border border-border/50 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد إشعارات</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition-colors ${n.is_read ? "bg-card border-border/50" : "bg-primary/5 border-primary/20"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mt-1 ${n.is_read ? "bg-muted" : "bg-primary/10"}`}>
                  <Bell className={`w-5 h-5 ${n.is_read ? "text-muted-foreground" : "text-primary"}`} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{n.title}</p>
                  {n.body && <p className="text-muted-foreground text-xs mt-1">{n.body}</p>}
                  <p className="text-xs text-muted-foreground mt-2">{new Date(n.created_at).toLocaleDateString("ar-SA")}</p>
                </div>
                <div className="flex gap-1">
                  {!n.is_read && (
                    <Button variant="ghost" size="icon" onClick={() => markAsRead(n.id)} title="تعليم كمقروء">
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => deleteNotification(n.id)} title="حذف">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
