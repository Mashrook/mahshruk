import { supabase } from '@/integrations/supabase/client';

// Utility for making authenticated requests via Supabase
// Edge functions should be called using supabase.functions.invoke()
// This file is kept for backward compatibility but most calls
// should go through the supabase client directly.

export async function callEdgeFunction(functionName: string, body?: any) {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
  });
  if (error) throw error;
  return data;
}

export default { callEdgeFunction };
