import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Package } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  max_bookings_per_month: number | null;
  max_members: number | null;
  is_active: boolean;
  sort_order: number;
}

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [open, setOpen] = useState(false);

  const loadPlans = async () => {
    setLoading(true);
    const { data } = await supabase.from('plans').select('*').order('sort_order');
    setPlans((data || []) as Plan[]);
    setLoading(false);
  };

  useEffect(() => { loadPlans(); }, []);

  const handleSave = async () => {
    if (!editPlan) return;
    const { id, ...rest } = editPlan;
    if (id) {
      await supabase.from('plans').update(rest).eq('id', id);
    } else {
      await supabase.from('plans').insert(rest);
    }
    toast({ title: "تم الحفظ" });
    setOpen(false);
    setEditPlan(null);
    loadPlans();
  };

  const newPlan = () => {
    setEditPlan({
      id: '',
      name: '', name_ar: '', slug: '', description: '',
      price_monthly: 0, price_yearly: 0, currency: 'SAR',
      max_bookings_per_month: null, max_members: 5,
      is_active: true, sort_order: plans.length,
    });
    setOpen(true);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">إدارة الخطط</h1>
          <p className="text-muted-foreground">إنشاء وتعديل خطط الاشتراك</p>
        </div>
        <Button onClick={newPlan}><Plus className="w-4 h-4 ml-2" />خطة جديدة</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الخطة</TableHead>
                <TableHead>السعر الشهري</TableHead>
                <TableHead>السعر السنوي</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{plan.name_ar}</p>
                      <p className="text-xs text-muted-foreground">{plan.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>{plan.price_monthly} {plan.currency}</TableCell>
                  <TableCell>{plan.price_yearly} {plan.currency}</TableCell>
                  <TableCell>
                    <Badge className={plan.is_active ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}>
                      {plan.is_active ? "نشط" : "معطل"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => { setEditPlan(plan); setOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>{editPlan?.id ? "تعديل الخطة" : "خطة جديدة"}</DialogTitle>
          </DialogHeader>
          {editPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>الاسم (EN)</Label><Input value={editPlan.name} onChange={(e) => setEditPlan({ ...editPlan, name: e.target.value })} /></div>
                <div><Label>الاسم (AR)</Label><Input value={editPlan.name_ar} onChange={(e) => setEditPlan({ ...editPlan, name_ar: e.target.value })} /></div>
              </div>
              <div><Label>Slug</Label><Input value={editPlan.slug} onChange={(e) => setEditPlan({ ...editPlan, slug: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>السعر الشهري</Label><Input type="number" value={editPlan.price_monthly} onChange={(e) => setEditPlan({ ...editPlan, price_monthly: +e.target.value })} /></div>
                <div><Label>السعر السنوي</Label><Input type="number" value={editPlan.price_yearly} onChange={(e) => setEditPlan({ ...editPlan, price_yearly: +e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>حد الحجوزات/شهر</Label><Input type="number" value={editPlan.max_bookings_per_month ?? ''} onChange={(e) => setEditPlan({ ...editPlan, max_bookings_per_month: e.target.value ? +e.target.value : null })} /></div>
                <div><Label>حد الأعضاء</Label><Input type="number" value={editPlan.max_members ?? ''} onChange={(e) => setEditPlan({ ...editPlan, max_members: e.target.value ? +e.target.value : null })} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editPlan.is_active} onCheckedChange={(v) => setEditPlan({ ...editPlan, is_active: v })} />
                <Label>نشط</Label>
              </div>
              <Button className="w-full" onClick={handleSave}>حفظ</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
