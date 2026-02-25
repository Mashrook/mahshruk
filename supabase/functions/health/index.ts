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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check DB connectivity
    const dbStart = Date.now();
    const { error: dbError } = await supabase.from("service_endpoints").select("id").limit(1);
    const dbLatency = Date.now() - dbStart;

    // Check table counts
    const [
      { count: bookingsCount },
      { count: usersCount },
      { count: alertsCount },
      { count: incidentsCount },
    ] = await Promise.all([
      supabase.from("bookings").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("admin_alerts").select("id", { count: "exact", head: true }).eq("is_resolved", false),
      supabase.from("incidents").select("id", { count: "exact", head: true }).eq("status", "open"),
    ]);

    const health = {
      status: dbError ? "degraded" : "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      uptime: "N/A",
      services: {
        database: {
          status: dbError ? "down" : "up",
          latency_ms: dbLatency,
        },
      },
      stats: {
        total_bookings: bookingsCount || 0,
        total_users: usersCount || 0,
        open_alerts: alertsCount || 0,
        open_incidents: incidentsCount || 0,
      },
    };

    return new Response(JSON.stringify(health), {
      status: dbError ? 503 : 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
