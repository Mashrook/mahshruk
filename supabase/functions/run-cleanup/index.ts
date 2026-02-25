import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const userId = claimsData.claims.sub;

    // Verify admin role using service role client
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: roles } = await serviceClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    const userRoles = (roles || []).map((r: any) => r.role);
    const isAdmin = userRoles.includes("admin") || userRoles.includes("super_admin");
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
    }

    // Fetch retention policies
    const { data: policies } = await serviceClient
      .from("retention_policies")
      .select("*")
      .eq("is_active", true);

    const results: Record<string, number> = {};

    for (const policy of policies || []) {
      const cutoff = new Date(Date.now() - policy.retention_days * 24 * 60 * 60 * 1000).toISOString();

      let deleted = 0;

      if (policy.entity_type === "audit_logs") {
        const { count } = await serviceClient
          .from("audit_logs")
          .delete()
          .lt("created_at", cutoff)
          .select("id", { count: "exact", head: true });
        deleted = count || 0;
      } else if (policy.entity_type === "login_attempts") {
        const { count } = await serviceClient
          .from("login_attempts")
          .delete()
          .lt("created_at", cutoff)
          .select("id", { count: "exact", head: true });
        deleted = count || 0;
      } else if (policy.entity_type === "notifications") {
        const { count } = await serviceClient
          .from("notifications")
          .delete()
          .lt("created_at", cutoff)
          .eq("is_read", true)
          .select("id", { count: "exact", head: true });
        deleted = count || 0;
      } else if (policy.entity_type === "admin_sessions") {
        const { count } = await serviceClient
          .from("admin_sessions")
          .delete()
          .lt("created_at", cutoff)
          .eq("is_active", false)
          .select("id", { count: "exact", head: true });
        deleted = count || 0;
      }

      results[policy.entity_type] = deleted;

      // Update last_cleanup_at
      await serviceClient
        .from("retention_policies")
        .update({ last_cleanup_at: new Date().toISOString() })
        .eq("id", policy.id);
    }

    // Log the cleanup action
    await serviceClient.from("audit_logs").insert({
      actor_admin_id: userId,
      action: "cleanup",
      entity_type: "retention_policy",
      after: results,
      user_agent: req.headers.get("user-agent") || "cron",
    });

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
