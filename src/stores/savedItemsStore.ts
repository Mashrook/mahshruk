import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

export interface SavedItem {
  id?: string;
  item_type: string;
  item_id: string;
  item_data: Record<string, any>;
  created_at?: string;
}

const LOCAL_KEY = "mashroky_saved_items";

function getLocalItems(): SavedItem[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function setLocalItems(items: SavedItem[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

interface SavedItemsState {
  items: SavedItem[];
  loading: boolean;
  fetchItems: (userId?: string) => Promise<void>;
  addItem: (item: SavedItem, userId?: string) => Promise<void>;
  removeItem: (itemType: string, itemId: string, userId?: string) => Promise<void>;
  isSaved: (itemType: string, itemId: string) => boolean;
}

export const useSavedItemsStore = create<SavedItemsState>((set, get) => ({
  items: getLocalItems(),
  loading: false,

  fetchItems: async (userId) => {
    if (!userId) {
      set({ items: getLocalItems() });
      return;
    }
    set({ loading: true });
    const { data } = await supabase
      .from("saved_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    const items = (data || []).map((d) => ({
      id: d.id,
      item_type: d.item_type,
      item_id: d.item_id,
      item_data: d.item_data as Record<string, any>,
      created_at: d.created_at,
    }));
    set({ items, loading: false });
    setLocalItems(items);
  },

  addItem: async (item, userId) => {
    const current = get().items;
    if (current.some((i) => i.item_type === item.item_type && i.item_id === item.item_id)) return;
    const newItems = [item, ...current];
    set({ items: newItems });
    setLocalItems(newItems);
    if (userId) {
      await supabase.from("saved_items").insert({
        user_id: userId,
        item_type: item.item_type,
        item_id: item.item_id,
        item_data: item.item_data,
      });
    }
  },

  removeItem: async (itemType, itemId, userId) => {
    const newItems = get().items.filter((i) => !(i.item_type === itemType && i.item_id === itemId));
    set({ items: newItems });
    setLocalItems(newItems);
    if (userId) {
      await supabase
        .from("saved_items")
        .delete()
        .eq("user_id", userId)
        .eq("item_type", itemType)
        .eq("item_id", itemId);
    }
  },

  isSaved: (itemType, itemId) =>
    get().items.some((i) => i.item_type === itemType && i.item_id === itemId),
}));
