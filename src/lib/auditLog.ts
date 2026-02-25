import { supabase } from "@/integrations/supabase/client";

interface AuditLogEntry {
  action: string;
  entity_type: string;
  entity_id?: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
}

export async function logAudit(entry: AuditLogEntry) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("audit_logs").insert({
      actor_admin_id: user.id,
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id || null,
      before: entry.before || {},
      after: entry.after || {},
      ip_address: null, // collected server-side in production
      user_agent: navigator.userAgent,
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}
