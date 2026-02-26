// Amadeus Service — re-exports from secure edge-function client
// All API calls are proxied through the Supabase Edge Function (no secrets in browser).

export {
  searchActivities,
  getActivityDetails,
  isAmadeusConfigured,
  testAmadeusConnection,
} from '@/lib/amadeusClient';

// Re-export types for backward compatibility
export type { FlightSearchParams } from '@/lib/amadeusClient';
