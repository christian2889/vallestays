import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";

const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
            );
          } catch {
            // Server Component context — set ignored. Middleware/Route Handler should refresh.
          }
        },
      },
    }
  );
}

/**
 * Tenant discriminator for the shared DB. Always normalized to one of the
 * allowed values regardless of how it was set in env (someone occasionally
 * pastes a URL there). Defaults to 'vallestays'.
 */
const ALLOWED_SITES = ["vallestays", "nidosnvillas"] as const;
type AllowedSite = (typeof ALLOWED_SITES)[number];

function normalizeSite(raw: string | undefined): AllowedSite {
  if (!raw) return "vallestays";
  const lower = raw.toLowerCase();
  for (const s of ALLOWED_SITES) {
    if (lower === s || lower.includes(s)) return s;
  }
  return "vallestays";
}

export const SITE: AllowedSite = normalizeSite(process.env.NEXT_PUBLIC_SITE);
