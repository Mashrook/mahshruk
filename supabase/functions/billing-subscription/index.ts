import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const url = new URL(req.url)
    const tenantId = url.searchParams.get('tenant_id')

    if (!tenantId) {
      return new Response(JSON.stringify({ error: 'Missing tenant_id' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get subscription with plan details
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, plans(*)')
      .eq('tenant_id', tenantId)
      .maybeSingle()

    const isActive = subscription && ['active', 'trial'].includes(subscription.status)
    const isExpired = subscription?.status === 'expired' ||
      (subscription?.trial_ends_at && new Date(subscription.trial_ends_at) < new Date() && subscription.status === 'trial')

    return new Response(JSON.stringify({
      subscription,
      is_active: isActive && !isExpired,
      is_trial: subscription?.status === 'trial',
      is_expired: isExpired,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
