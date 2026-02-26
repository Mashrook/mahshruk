import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { logAudit } from "@/lib/auditLog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield, Save, Users, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import PermissionGate from "@/components/auth/PermissionGate";

interface Permission {
  id: string;
  key: string;
  name_ar: string;
  category: string;
  description_ar: string | null;
  is_system: boolean;
}

interface RolePermMap {
  [role: string]: Set<string>; // set of permission IDs
}

interface AdminUser {
  user_id: string;
  role: string;
  profile_name: string | null;
  email: string | null;
}

const ROLES = ["admin", "editor", "support"] as const;
const ROLE_LABELS: Record<string, string> = {
  super_admin: "مدير النظام",
  admin: "مدير",
  editor: "محرر",
  support: "دعم فني",
};

const CATEGORY_LABELS: Record<string, string> = {
  dashboard: "لوحة التحكم",
  bookings: "الحجوزات",
  users: "المستخدمين",
  content: "المحتوى",
  services: "الخدمات",
  offers: "العروض",
  settings: "الإعدادات",
  rbac: "الأدوار والصلاحيات",
  security: "الأمان",
  reports: "التقارير",
};

export default function AdminRBAC() {
  const { toast } = useToast();
  const { roles: myRoles } = useAuthStore();
  const isSuperAdmin = myRoles.includes("super_admin");

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePerms, setRolePerms] = useState<RolePermMap>({});
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"roles" | "admins">("roles");

  // New admin assignment
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<string>("editor");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Fetch permissions
      const { data: perms } = await supabase
        .from("permissions")
        .select("*")
        .order("category")
        .order("key");
      setPermissions((perms || []) as Permission[]);

      // Fetch role_permissions
      const { data: rp } = await supabase.from("role_permissions").select("*");
      const map: RolePermMap = {};
      ROLES.forEach((r) => (map[r] = new Set()));
      (rp || []).forEach((r: any) => {
        if (map[r.role]) map[r.role].add(r.permission_id);
      });
      setRolePerms(map);

      // Fetch admin users (users with roles)
      const { data: urs } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (urs && urs.length > 0) {
        const userIds = [...new Set(urs.map((u: any) => u.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", userIds);

        const profileMap: Record<string, string | null> = {};
        (profiles || []).forEach((p: any) => {
          profileMap[p.user_id] = p.full_name;
        });

        const admins: AdminUser[] = urs.map((u: any) => ({
          user_id: u.user_id,
          role: u.role,
          profile_name: profileMap[u.user_id] || null,
          email: null,
        }));
        setAdminUsers(admins);
      }
    } catch {
      toast({ title: "خطأ", description: "تعذر تحميل البيانات", variant: "destructive" });
    }
    setLoading(false);
  };

  const togglePermission = (role: string, permId: string) => {
    if (!isSuperAdmin) return;
    setRolePerms((prev) => {
      const newMap = { ...prev };
      const set = new Set(newMap[role]);
      if (set.has(permId)) set.delete(permId);
      else set.add(permId);
      newMap[role] = set;
      return newMap;
    });
  };

  const savePermissions = async () => {
    if (!isSuperAdmin) return;
    setSaving(true);
    try {
      // Delete all existing role_permissions for managed roles
      for (const role of ROLES) {
        await supabase.from("role_permissions").delete().eq("role", role);
      }
      // Insert new
      const inserts: { role: "admin" | "super_admin" | "editor" | "support"; permission_id: string }[] = [];
      for (const role of ROLES) {
        rolePerms[role]?.forEach((permId) => {
          inserts.push({ role, permission_id: permId });
        });
      }
      if (inserts.length > 0) {
        const { error } = await supabase.from("role_permissions").insert(inserts);
        if (error) throw error;
      }
      await logAudit({ action: "permission_update", entity_type: "role_permission", after: { roles: ROLES.map(r => ({ role: r, count: rolePerms[r]?.size || 0 })) } });
      toast({ title: "تم الحفظ", description: "تم تحديث الصلاحيات بنجاح" });
    } catch {
      toast({ title: "خطأ", description: "تعذر حفظ الصلاحيات", variant: "destructive" });
    }
    setSaving(false);
  };

  const assignRole = async () => {
    if (!isSuperAdmin || !newAdminEmail.trim()) return;
    setSaving(true);
    try {
      // Find user by email from profiles (we search full_name or we need auth — use profiles)
      // Since we can't query auth.users, we look up profiles or ask for user_id
      // For now, we'll use an edge function approach or direct user_id input
      // Let's search profiles by checking if the email matches a known pattern
      toast({
        title: "ملاحظة",
        description: "أدخل معرف المستخدم (UUID) مباشرة. يمكنك العثور عليه من قسم المستخدمين.",
      });
    } catch {
      toast({ title: "خطأ", description: "تعذرت العملية", variant: "destructive" });
    }
    setSaving(false);
  };

  const assignRoleById = async (userId: string, role: string) => {
    if (!isSuperAdmin) return;
    try {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: role as "admin" | "super_admin" | "editor" | "support" });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "موجود", description: "هذا الدور مُعيّن مسبقاً لهذا المستخدم" });
        } else throw error;
      } else {
        await logAudit({ action: "role_assign", entity_type: "user_role", entity_id: userId, after: { role } });
        toast({ title: "تم", description: "تم تعيين الدور بنجاح" });
        fetchAll();
      }
    } catch {
      toast({ title: "خطأ", description: "تعذر تعيين الدور", variant: "destructive" });
    }
  };

  const removeAdminRole = async (userId: string, role: string) => {
    if (!isSuperAdmin) return;
    if (role === "super_admin") {
      toast({ title: "غير مسموح", description: "لا يمكن إزالة دور مدير النظام", variant: "destructive" });
      return;
    }
    try {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as "admin" | "super_admin" | "editor" | "support");
      await logAudit({ action: "role_remove", entity_type: "user_role", entity_id: userId, before: { role } });
      toast({ title: "تم", description: "تم إزالة الدور" });
      fetchAll();
    } catch {
      toast({ title: "خطأ", description: "تعذرت الإزالة", variant: "destructive" });
    }
  };

  // Group permissions by category
  const grouped = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    (acc[p.category] = acc[p.category] || []).push(p);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">الصلاحيات والأدوار</h1>
        {!isSuperAdmin && (
          <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">عرض فقط</span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "roles" ? "gold" : "outline"}
          size="sm"
          onClick={() => setActiveTab("roles")}
        >
          <Shield className="w-4 h-4 ml-2" />
          الأدوار والصلاحيات
        </Button>
        <Button
          variant={activeTab === "admins" ? "gold" : "outline"}
          size="sm"
          onClick={() => setActiveTab("admins")}
        >
          <Users className="w-4 h-4 ml-2" />
          المشرفين
        </Button>
      </div>

      {activeTab === "roles" && (
        <div>
          {/* Permissions matrix */}
          <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-right p-4 font-bold text-foreground">الصلاحية</th>
                    {ROLES.map((r) => (
                      <th key={r} className="p-4 text-center font-bold text-foreground w-28">
                        <div className="flex flex-col items-center gap-1">
                          {r === "admin" ? (
                            <ShieldCheck className="w-4 h-4 text-primary" />
                          ) : r === "editor" ? (
                            <Shield className="w-4 h-4 text-secondary" />
                          ) : (
                            <ShieldAlert className="w-4 h-4 text-muted-foreground" />
                          )}
                          {ROLE_LABELS[r]}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(grouped).map(([cat, perms]) => (
                    <PermissionCategoryGroup
                      key={cat}
                      category={cat}
                      label={CATEGORY_LABELS[cat] || cat}
                      permissions={perms}
                      rolePerms={rolePerms}
                      roles={ROLES}
                      onToggle={togglePermission}
                      disabled={!isSuperAdmin}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isSuperAdmin && (
            <div className="mt-6 flex justify-end">
              <Button variant="gold" onClick={savePermissions} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
                حفظ الصلاحيات
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === "admins" && (
        <div>
          {/* Admin users list */}
          <div className="rounded-2xl bg-card border border-border/50 p-6 mb-6">
            <h3 className="font-bold mb-4">المشرفين الحاليين</h3>
            {adminUsers.length === 0 ? (
              <p className="text-muted-foreground text-sm">لا يوجد مشرفين</p>
            ) : (
              <div className="space-y-3">
                {adminUsers.map((a, i) => (
                  <div key={`${a.user_id}-${a.role}-${i}`} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/30">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{a.profile_name || a.user_id.slice(0, 8) + "..."}</p>
                      <p className="text-xs text-muted-foreground font-mono">{a.user_id}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {ROLE_LABELS[a.role] || a.role}
                    </span>
                    {isSuperAdmin && a.role !== "super_admin" && (
                      <Button variant="ghost" size="sm" className="text-destructive text-xs" onClick={() => removeAdminRole(a.user_id, a.role)}>
                        إزالة
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add admin */}
          <PermissionGate permission="admin_users.manage">
            <div className="rounded-2xl bg-card border border-border/50 p-6">
              <h3 className="font-bold mb-4">تعيين مشرف جديد</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="معرف المستخدم (UUID)"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl bg-muted border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  title="اختيار الدور"
                  className="px-4 py-2 rounded-xl bg-muted border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
                <Button
                  variant="gold"
                  onClick={() => {
                    if (newAdminEmail.trim()) {
                      assignRoleById(newAdminEmail.trim(), newAdminRole);
                      setNewAdminEmail("");
                    }
                  }}
                >
                  تعيين
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                أدخل معرف المستخدم (UUID) من قسم المستخدمين، ثم اختر الدور المناسب.
              </p>
            </div>
          </PermissionGate>
        </div>
      )}
    </div>
  );
}

// Sub-component: Permission category group rows
function PermissionCategoryGroup({
  category,
  label,
  permissions,
  rolePerms,
  roles,
  onToggle,
  disabled,
}: {
  category: string;
  label: string;
  permissions: Permission[];
  rolePerms: RolePermMap;
  roles: readonly string[];
  onToggle: (role: string, permId: string) => void;
  disabled: boolean;
}) {
  return (
    <>
      <tr>
        <td colSpan={roles.length + 1} className="px-4 pt-4 pb-2">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">{label}</span>
        </td>
      </tr>
      {permissions.map((p) => (
        <tr key={p.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
          <td className="p-4">
            <div>
              <span className="font-medium text-foreground">{p.name_ar}</span>
              {p.description_ar && (
                <p className="text-xs text-muted-foreground mt-0.5">{p.description_ar}</p>
              )}
            </div>
          </td>
          {roles.map((role) => (
            <td key={role} className="p-4 text-center">
              <Switch
                checked={rolePerms[role]?.has(p.id) || false}
                onCheckedChange={() => onToggle(role, p.id)}
                disabled={disabled}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
