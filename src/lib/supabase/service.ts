import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Service role: bypassa RLS. Usar apenas em rotinas server-side que precisam
// de acesso amplo (webhooks, cron, agregações cross-user). NUNCA em código
// que recebe input direto do user sem validar ownership manualmente.
export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
