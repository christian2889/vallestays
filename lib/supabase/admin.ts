import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

let cached: SupabaseClient<Database> | null = null;

/**
 * Service-role Supabase client. Bypasses RLS — use only in server-only code
 * (webhook handlers, server actions that need admin operations). Never expose
 * to a client component or HTTP request from the browser.
 */
export function getSupabaseAdminClient(): SupabaseClient<Database> {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Required for admin DB operations."
    );
  }
  if (cached) return cached;
  cached = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}

/**
 * Find an auth user by email or create one. Returns the user id (= profiles.id).
 * The profiles row is created by the existing `handle_new_user` trigger.
 */
export async function findOrCreateGuestUser(args: {
  email: string;
  fullName?: string;
  phone?: string;
}): Promise<{ id: string } | { error: string }> {
  const admin = getSupabaseAdminClient();
  // 1) Try to find an existing auth user by email
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", args.email)
    .maybeSingle<{ id: string }>();

  if (existingProfile?.id) return { id: existingProfile.id };

  // 2) Create the auth user. The trigger creates the profile.
  const { data, error } = await admin.auth.admin.createUser({
    email: args.email,
    email_confirm: true,
    user_metadata: {
      full_name: args.fullName ?? "",
      phone: args.phone ?? "",
      created_via: "vallestays_checkout",
    },
  });

  if (error || !data.user) {
    // The user might already exist in auth.users without a profile row — fall back
    // to the listUsers API to find them by email.
    const { data: list, error: listErr } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (!listErr && list?.users) {
      const found = list.users.find((u) => u.email?.toLowerCase() === args.email.toLowerCase());
      if (found) return { id: found.id };
    }
    return { error: error?.message ?? "could_not_create_user" };
  }

  // Make sure the profile row exists (the trigger should have done it; ensure name/phone).
  await admin
    .from("profiles")
    .upsert(
      {
        id: data.user.id,
        email: args.email,
        full_name: args.fullName ?? null,
        phone: args.phone ?? null,
      } as never,
      { onConflict: "id" }
    );

  return { id: data.user.id };
}
