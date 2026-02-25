import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Offline() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-3">غير متصل بالإنترنت</h1>
        <p className="text-muted-foreground mb-8">
          يبدو أنك غير متصل بالإنترنت. تحقق من اتصالك وحاول مرة أخرى.
        </p>
        <Button variant="gold" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 ml-2" />
          إعادة المحاولة
        </Button>
      </div>
    </div>
  );
}
