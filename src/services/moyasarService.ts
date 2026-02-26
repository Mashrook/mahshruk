import { supabase } from '@/integrations/supabase/client';

// ─── Secure: All secret-key operations go through Edge Function ───
// The Moyasar secret key never leaves the server.

async function callMoyasarEdge(action: string, payload: Record<string, unknown> = {}) {
  const { data, error } = await supabase.functions.invoke('moyasar-proxy', {
    body: { action, ...payload },
  });
  if (error) throw new Error(error.message || 'خطأ في خدمة الدفع');
  if (data?.error) throw new Error(data.error);
  return data;
}

// Fetch Moyasar publishable key from DB (safe — publishable keys are public)
export async function getMoyasarPublishableKey(): Promise<string | null> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('key_value')
    .eq('service', 'moyasar')
    .eq('key_name', 'publishable_key')
    .eq('is_active', true)
    .maybeSingle();
  if (error) console.error('getMoyasarPublishableKey error:', error.message);
  return data?.key_value || null;
}

const normalizeAmount = (amount: number | string): number => {
  // Support Arabic numerals ٠-٩ by converting to ASCII
  const arabicToAscii = String(amount).replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
  const numeric = Number(arabicToAscii.replace(/[^\d.]/g, '')) || 0;
  return Math.max(Math.round(numeric * 100), 0); // Convert to halalas
};

export interface MoyasarPaymentResult {
  provider: string;
  paymentId: string;
  currency: string;
  amount: number;
  status: string;
  createdAt: string;
  paidAt: string | null;
}

export function createMockMoyasarPayment({
  amount,
  currency = 'SAR',
}: {
  amount: number;
  currency?: string;
}): MoyasarPaymentResult {
  const paymentId = `pay_${Date.now()}`;
  return {
    provider: 'moyasar',
    paymentId,
    currency,
    amount: Number(amount || 0),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    paidAt: null,
  };
}

export interface CreateInvoiceParams {
  amount: number;
  currency?: string;
  description: string;
  successUrl: string;
  backUrl?: string;
  callbackUrl?: string;
  metadata?: Record<string, string>;
}

export async function createMoyasarInvoice(params: CreateInvoiceParams) {
  return callMoyasarEdge('create_invoice', {
    amount: normalizeAmount(params.amount),
    currency: params.currency || 'SAR',
    description: params.description,
    success_url: params.successUrl,
    back_url: params.backUrl,
    callback_url: params.callbackUrl,
    metadata: params.metadata,
  });
}

export async function fetchMoyasarPayment(paymentId: string) {
  return callMoyasarEdge('fetch_payment', { paymentId });
}

export async function refundMoyasarPayment(paymentId: string, amount?: number) {
  const payload: Record<string, unknown> = { paymentId };
  if (amount) payload.amount = normalizeAmount(amount);
  return callMoyasarEdge('refund_payment', payload);
}

export async function isMoyasarConfigured(): Promise<boolean> {
  const pk = await getMoyasarPublishableKey();
  return !!pk;
}
