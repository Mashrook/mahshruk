import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
}

export default function ShareButton({ title, text, url, className }: ShareButtonProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title,
      text: text || title,
      url: url || window.location.href,
    };

    // Try Web Share API (works on iOS Safari & Android)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled — ignore
        return;
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareData.url);
      toast({ title: "تم النسخ", description: "تم نسخ الرابط إلى الحافظة" });
    } catch {
      toast({ title: "خطأ", description: "تعذر نسخ الرابط", variant: "destructive" });
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleShare} className={className} title="مشاركة">
      <Share2 className="w-5 h-5" />
    </Button>
  );
}
