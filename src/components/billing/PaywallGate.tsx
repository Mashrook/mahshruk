import { useBillingStore } from "@/stores/billingStore";
import { useTenantStore } from "@/stores/tenantStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowUpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaywallGateProps {
  children: React.ReactNode;
  /** If true, blocks content when subscription is inactive */
  enforce?: boolean;
}

export default function PaywallGate({ children, enforce = true }: PaywallGateProps) {
  const { tenant } = useTenantStore();
  const { isActive, isExpired, loading } = useBillingStore();
  const navigate = useNavigate();

  // No tenant = platform mode, no paywall
  if (!tenant) return <>{children}</>;

  // Still loading
  if (loading) return <>{children}</>;

  // Subscription is active or trial
  if (isActive && !isExpired) return <>{children}</>;

  // Don't enforce = just show children
  if (!enforce) return <>{children}</>;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6" dir="rtl">
      <Card className="max-w-lg w-full border-destructive">
        <CardContent className="py-10 text-center space-y-4">
          <XCircle className="w-16 h-16 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">انتهى اشتراكك</h2>
          <p className="text-muted-foreground">
            لا يمكنك إنشاء حجوزات جديدة حتى يتم تجديد اشتراكك.
            يرجى ترقية خطتك للاستمرار.
          </p>
          <Button size="lg" onClick={() => navigate("/admin/billing")}>
            <ArrowUpCircle className="w-5 h-5 ml-2" />
            ترقية الخطة
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
