import { useEffect } from "react";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useSavedItemsStore } from "@/stores/savedItemsStore";
import { useToast } from "@/hooks/use-toast";

export default function SavedItems() {
  const { user } = useAuthStore();
  const { items, fetchItems, removeItem, loading } = useSavedItemsStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchItems(user?.id);
  }, [user]);

  const handleRemove = async (itemType: string, itemId: string) => {
    await removeItem(itemType, itemId, user?.id);
    toast({ title: "تمت الإزالة", description: "تم إزالة العنصر من المحفوظات" });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">المحفوظات</h1>
        {loading ? (
          <p className="text-muted-foreground">جاري التحميل...</p>
        ) : items.length === 0 ? (
          <div className="p-12 rounded-2xl bg-card border border-border/50 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد عناصر محفوظة</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.item_type}-${item.item_id}`} className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{item.item_data?.title || item.item_type}</p>
                  <p className="text-xs text-muted-foreground">{item.item_data?.description || item.item_id}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemove(item.item_type, item.item_id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
