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

    // Verify auth
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

    const { plan_slug, tenant_id, billing_cycle = 'monthly' } = await req.json()

    if (!plan_slug || !tenant_id) {
      return new Response(JSON.stringify({ error: 'Missing plan_slug or tenant_id' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify user is tenant owner/admin
    const { data: membership } = await supabase
      .from('tenant_members')
      .select('role')
      .eq('tenant_id', tenant_id)
      .eq('user_id', user.id)
      .in('role', ['owner', 'admin'])
      .maybeSingle()

    if (!membership) {
      return new Response(JSON.stringify({ error: 'Not authorized for this tenant' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get plan
    const { data: plan } = await supabase
      .from('plans')
      .select('*')
      .eq('slug', plan_slug)
      .eq('is_active', true)
      .single()

    if (!plan) {
      return new Response(JSON.stringify({ error: 'Plan not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const price = billing_cycle === 'yearly' ? plan.price_yearly : plan.price_monthly
    const periodEnd = billing_cycle === 'yearly'
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    // Upsert subscription
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('tenant_id', tenant_id)
      .maybeSingle()

    let subscription
    if (existingSub) {
      const { data } = await supabase
        .from('subscriptions')
        .update({
          plan_id: plan.id,
          status: price === 0 ? 'active' : 'active', // Placeholder: would be 'pending' with real payment
          billing_cycle,
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd,
          canceled_at: null,
        })
        .eq('id', existingSub.id)
        .select()
        .single()
      subscription = data
    } else {
      const { data } = await supabase
        .from('subscriptions')
        .insert({
          tenant_id,
          plan_id: plan.id,
          status: price === 0 ? 'active' : 'active',
          billing_cycle,
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd,
        })
        .select()
        .single()
      subscription = data
    }

    // Create invoice
    if (price > 0 && subscription) {
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
      await supabase.from('invoices').insert({
        tenant_id,
        subscription_id: subscription.id,
        invoice_number: invoiceNumber,
        amount: price,
        currency: plan.currency,
        status: 'pending', // Placeholder: real payment would update this
        billing_period_start: new Date().toISOString(),
        billing_period_end: periodEnd,
      })
    }

    // Sync feature flags from plan features
    if (subscription && plan.features && Array.isArray(plan.features)) {
      for (const featureKey of plan.features as string[]) {
        const { data: existing } = await supabase
          .from('feature_flags')
          .select('id')
          .eq('tenant_id', tenant_id)
          .eq('flag_key', featureKey)
          .maybeSingle()

        if (existing) {
          await supabase.from('feature_flags').update({ is_enabled: true }).eq('id', existing.id)
        } else {
          await supabase.from('feature_flags').insert({
            tenant_id,
            flag_key: featureKey,
            is_enabled: true,
          })
        }
      }

      // Disable flags not in the new plan
      const { data: allFlags } = await supabase
        .from('feature_flags')
        .select('id, flag_key')
        .eq('tenant_id', tenant_id)

      if (allFlags) {
        const planFeatures = new Set(plan.features as string[])
        for (const flag of allFlags) {
          if (!planFeatures.has(flag.flag_key)) {
            await supabase.from('feature_flags').update({ is_enabled: false }).eq('id', flag.id)
          }
        }
      }
    }

    // Placeholder: In production, redirect to Moyasar/Stripe checkout
    return new Response(JSON.stringify({
      success: true,
      subscription,
      message: 'Subscription updated. Payment integration placeholder.',
      // checkout_url: 'https://payment-provider.com/checkout/...'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
