import { createClient } from '@supabase/supabase-js';

// Use this ONLY in secure server environments (API routes, Server Actions)
// to bypass RLS when necessary (e.g. creating reservations from anonymous users).
export function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
