import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

export interface AppNotification {
  id: string;
  title: string;
  body: string | null;
  type: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

interface NotificationsState {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    const notifications = (data || []) as AppNotification[];
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.is_read).length,
      loading: false,
    });
  },

  markAsRead: async (id) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    const notifications = get().notifications.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    );
    set({ notifications, unreadCount: notifications.filter((n) => !n.is_read).length });
  },

  markAllAsRead: async (userId) => {
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId).eq("is_read", false);
    const notifications = get().notifications.map((n) => ({ ...n, is_read: true }));
    set({ notifications, unreadCount: 0 });
  },

  deleteNotification: async (id) => {
    await supabase.from("notifications").delete().eq("id", id);
    const notifications = get().notifications.filter((n) => n.id !== id);
    set({ notifications, unreadCount: notifications.filter((n) => !n.is_read).length });
  },
}));
