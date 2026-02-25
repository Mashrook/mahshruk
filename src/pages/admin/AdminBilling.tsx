import { useEffect, useState } from "react";
import { useBillingStore, Plan } from "@/stores/billingStore";
import { useTenantStore } from "@/stores/tenantStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Receipt, ArrowUpCircle, XCircle, Check, Crown } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function AdminBilling() {
  const { tenant } = useTenantStore();
  const {
    plans, subscription, invoices, isActive, isTrial, isExpired,
    loading, loadPlans, loadSubscription, loadInvoices, checkout, cancelSubscription
  } = useBillingStore();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
    if (tenant?.id) {
      loadSubscription(tenant.id);
      loadInvoices(tenant.id);
    }
  }, [tenant?.id]);

  const currentPlanId = subscription?.plan_id;

  const handleCheckout = async (plan: Plan) => {
    if (!tenant?.id) return;
    setCheckingOut(plan.slug);
    try {
      await checkout(tenant.id, plan.slug, billingCycle);
      toast({ title: "تم تحديث الاشتراك", description: `تم الاشتراك في خطة ${plan.name_ar}` });
    } catch {
      toast({ title: "خطأ", description: "فشل في تحديث الاشتراك", variant: "destructive" });
    } finally {
      setCheckingOut(null);
    }
  };

  const handleCancel = async () => {
    if (!tenant?.id) return;
    try {
      await cancelSubscription(tenant.id);
      toast({ title: "تم إلغاء الاشتراك" });
    } catch {
      toast({ title: "خطأ", variant: "destructive" });
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-green-500/10 text-green-600",
      trial: "bg-blue-500/10 text-blue-600",
      canceled: "bg-red-500/10 text-red-600",
      expired: "bg-muted text-muted-foreground",
      past_due: "bg-yellow-500/10 text-yellow-600",
    };
    const labels: Record<string, string> = {
      active: "نشط", trial: "تجريبي", canceled: "ملغي", expired: "منتهي", past_due: "متأخر",
    };
    return <Badge className={map[status] || ""}>{labels[status] || status}</Badge>;
  };

  const invoiceStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      paid: "bg-green-500/10 text-green-600",
      pending: "bg-yellow-500/10 text-yellow-600",
      failed: "bg-red-500/10 text-red-600",
      draft: "bg-muted text-muted-foreground",
      refunded: "bg-purple-500/10 text-purple-600",
      void: "bg-muted text-muted-foreground",
    };
    const labels: Record<string, string> = {
      paid: "مدفوع", pending: "معلق", failed: "فشل", draft: "مسودة", refunded: "مسترد", void: "ملغي",
    };
    return <Badge className={map[status] || ""}>{labels[status] || status}</Badge>;
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الفواتير والاشتراك</h1>
          <p className="text-muted-foreground">إدارة خطة الاشتراك والفواتير</p>
        </div>
        <CreditCard className="w-8 h-8 text-primary" />
      </div>

      {/* Current Subscription */}
      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              الاشتراك الحالي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">الخطة</p>
                <p className="font-semibold">{(subscription as any).plans?.name_ar || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الحالة</p>
                {statusBadge(subscription.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تنتهي في</p>
                <p className="font-semibold">
                  {format(new Date(subscription.current_period_end), "dd MMMM yyyy", { locale: ar })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">دورة الفوترة</p>
                <p className="font-semibold">{subscription.billing_cycle === "yearly" ? "سنوي" : "شهري"}</p>
              </div>
            </div>
            {subscription.status !== "canceled" && (
              <Button variant="destructive" size="sm" className="mt-4" onClick={handleCancel}>
                <XCircle className="w-4 h-4 ml-2" />
                إلغاء الاشتراك
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Paywall Warning */}
      {isExpired && (
        <Card className="border-destructive">
          <CardContent className="py-6">
            <div className="flex items-center gap-3 text-destructive">
              <XCircle className="w-6 h-6" />
              <div>
                <p className="font-bold">انتهى اشتراكك</p>
                <p className="text-sm">يرجى ترقية خطتك لاستئناف إنشاء الحجوزات.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">الخطط</TabsTrigger>
          <TabsTrigger value="invoices">الفواتير</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          {/* Billing Cycle Toggle */}
          <div className="flex items-center gap-3 justify-center">
            <Button
              variant={billingCycle === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setBillingCycle("monthly")}
            >
              شهري
            </Button>
            <Button
              variant={billingCycle === "yearly" ? "default" : "outline"}
              size="sm"
              onClick={() => setBillingCycle("yearly")}
            >
              سنوي (خصم 17%)
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => {
              const isCurrent = plan.id === currentPlanId;
              const price = billingCycle === "yearly" ? plan.price_yearly : plan.price_monthly;
              return (
                <Card key={plan.id} className={isCurrent ? "border-primary ring-2 ring-primary/20" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name_ar}
                      {isCurrent && <Badge className="bg-primary/10 text-primary">الحالية</Badge>}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-foreground">
                      {price === 0 ? "مجاني" : `${price} ${plan.currency}`}
                      {price > 0 && (
                        <span className="text-sm font-normal text-muted-foreground">
                          /{billingCycle === "yearly" ? "سنة" : "شهر"}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        {plan.max_bookings_per_month ? `${plan.max_bookings_per_month} حجز/شهر` : "حجوزات غير محدودة"}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        {plan.max_members ? `${plan.max_members} أعضاء` : "أعضاء غير محدودين"}
                      </li>
                      {(plan.features as string[]).map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          {f.replace('.enabled', '').replace('_', ' ')}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={isCurrent ? "outline" : "default"}
                      disabled={isCurrent || checkingOut === plan.slug}
                      onClick={() => handleCheckout(plan)}
                    >
                      {checkingOut === plan.slug ? "جاري المعالجة..." :
                        isCurrent ? "الخطة الحالية" : <><ArrowUpCircle className="w-4 h-4 ml-2" />ترقية</>}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                الفواتير
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">لا توجد فواتير بعد</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الفاتورة</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-xs">{inv.invoice_number}</TableCell>
                        <TableCell>{inv.amount} {inv.currency}</TableCell>
                        <TableCell>{invoiceStatusBadge(inv.status)}</TableCell>
                        <TableCell>{format(new Date(inv.created_at), "dd/MM/yyyy")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
