import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Moyasar: {
      init: (config: any) => void;
    };
  }
}

interface MoyasarPaymentProps {
  amount: number; // in SAR (will be converted to halalas)
  description: string;
  callbackUrl: string;
  methods?: ("creditcard" | "applepay" | "samsungpay" | "stcpay")[];
  onInitiated?: (paymentId: string) => void;
  metadata?: Record<string, string>;
}

export default function MoyasarPayment({
  amount,
  description,
  callbackUrl,
  methods = ["creditcard", "applepay"],
  onInitiated,
  metadata,
}: MoyasarPaymentProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Moyasar publishable key from api_keys table
  useEffect(() => {
    const fetchKey = async () => {
      const { data, error: err } = await supabase
        .from("api_keys")
        .select("key_value")
        .eq("service", "moyasar")
        .eq("key_name", "publishable_key")
        .eq("is_active", true)
        .single();

      if (err || !data) {
        setError("لم يتم العثور على مفتاح Moyasar. يرجى إضافته من لوحة التحكم.");
        setLoading(false);
        return;
      }
      setPublishableKey(data.key_value);
      setLoading(false);
    };
    fetchKey();
  }, []);

  useEffect(() => {
    if (!publishableKey || !formRef.current || !window.Moyasar) return;

    // Clear previous form
    formRef.current.innerHTML = "";

    window.Moyasar.init({
      element: formRef.current,
      amount: amount * 100, // Convert SAR to halalas
      currency: "SAR",
      description,
      publishable_api_key: publishableKey,
      callback_url: callbackUrl,
      supported_networks: ["visa", "mastercard", "mada"],
      methods,
      metadata: metadata || {},
      on_initiating: (payment: any) => {
        onInitiated?.(payment?.id);
      },
      language: "ar",
    });
  }, [publishableKey, amount, description, callbackUrl, methods, metadata, onInitiated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/30 text-center">
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="moyasar-payment-wrapper">
      <div ref={formRef} className="mysr-form" />
    </div>
  );
}
