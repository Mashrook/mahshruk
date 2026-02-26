// Moyasar Edge Function — keeps secret key on the server

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MOYASAR_BASE = "https://api.moyasar.com/v1";

async function getMoyasarSecretKey(): Promise<string> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supabaseUrl, serviceKey);

  const { data, error } = await sb
    .from("api_keys")
    .select("key_value")
    .eq("service", "moyasar")
    .eq("key_name", "secret_key")
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data?.key_value) {
    throw new Error("moyasar_not_configured");
  }
  return data.key_value;
}

function authHeader(secretKey: string) {
  return {
    Authorization: `Basic ${btoa(secretKey + ":")}`,
    "Content-Type": "application/json",
  };
}

// ─── Actions ───

async function createInvoice(body: Record<string, unknown>, secretKey: string) {
  const res = await fetch(`${MOYASAR_BASE}/invoices`, {
    method: "POST",
    headers: authHeader(secretKey),
    body: JSON.stringify({
      amount: body.amount,
      currency: body.currency || "SAR",
      description: body.description,
      success_url: body.success_url,
      back_url: body.back_url,
      callback_url: body.callback_url,
      metadata: body.metadata,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Moyasar createInvoice failed [${res.status}]: ${err}`);
  }
  return res.json();
}

async function fetchPayment(paymentId: string, secretKey: string) {
  const res = await fetch(`${MOYASAR_BASE}/payments/${paymentId}`, {
    headers: authHeader(secretKey),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Moyasar fetchPayment failed [${res.status}]: ${err}`);
  }
  return res.json();
}

async function refundPayment(
  paymentId: string,
  amount: number | undefined,
  secretKey: string
) {
  const payload: Record<string, unknown> = {};
  if (amount) payload.amount = amount;

  const res = await fetch(`${MOYASAR_BASE}/payments/${paymentId}/refund`, {
    method: "POST",
    headers: authHeader(secretKey),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Moyasar refund failed [${res.status}]: ${err}`);
  }
  return res.json();
}

// ─── Handler ───

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, paymentId, ...rest } = body;

    const secretKey = await getMoyasarSecretKey();

    let result: unknown;

    switch (action) {
      case "create_invoice":
        result = await createInvoice(rest, secretKey);
        break;
      case "fetch_payment":
        if (!paymentId) throw new Error("paymentId required");
        result = await fetchPayment(paymentId, secretKey);
        break;
      case "refund_payment":
        if (!paymentId) throw new Error("paymentId required");
        result = await refundPayment(paymentId, rest.amount, secretKey);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[moyasar-proxy]", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
