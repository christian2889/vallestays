import "server-only";
import { getSupabaseServerClient, SITE } from "@/lib/supabase/server";
import type {
  DBProperty,
  DBPropertyImage,
  DBBooking,
  DBBookingInsert,
  DBLeadInsert,
} from "@/lib/database.types";
import { toUIProperty, type UIProperty } from "@/lib/uiprops";

export type { UIProperty } from "@/lib/uiprops";

/** All active properties — no site filter, so vallestays sees nidos's catalog too. */
export async function listProperties(): Promise<UIProperty[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listProperties error", error);
    return [];
  }
  return (data ?? []).map(toUIProperty);
}

export async function getProperty(idOrSlug: string): Promise<UIProperty | null> {
  const supabase = await getSupabaseServerClient();
  const isUuid = /^[0-9a-f]{8}-/.test(idOrSlug);
  const query = supabase
    .from("properties")
    .select("*, property_images(*)")
    .limit(1);

  const { data, error } = isUuid
    ? await query.eq("id", idOrSlug).maybeSingle()
    : await query.eq("slug", idOrSlug).maybeSingle();

  if (error) {
    console.error("getProperty error", error);
    return null;
  }
  return data ? toUIProperty(data) : null;
}

/** Insert a booking row tied to this site. */
export async function createBooking(
  input: DBBookingInsert
): Promise<{ id: string } | { error: string }> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .insert([{ ...input, site: SITE }] as never)
    .select("id")
    .single<{ id: string }>();
  if (error) {
    console.error("createBooking error", error);
    return { error: error.message };
  }
  return { id: data.id };
}

export async function getBooking(
  id: string
): Promise<(DBBooking & { property: UIProperty | null }) | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, property:properties(*, property_images(*))")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("getBooking error", error);
    return null;
  }
  if (!data) return null;
  const { property, ...booking } = data as DBBooking & {
    property: (DBProperty & { property_images?: DBPropertyImage[] | null }) | null;
  };
  return { ...booking, property: property ? toUIProperty(property) : null };
}

type LeadWithProperty = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  property_id: string | null;
  check_in: string | null;
  check_out: string | null;
  guests_count: number | null;
  notes: string | null;
  status: string;
  source: string;
  site: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_amount_cents: number | null;
  stripe_currency: string | null;
  property: (DBProperty & { property_images?: DBPropertyImage[] | null }) | null;
};

/** Read a lead by id (used by /confirmed and the webhook). */
export async function getLead(
  id: string
): Promise<(Omit<LeadWithProperty, "property"> & { property: UIProperty | null }) | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*, property:properties(*, property_images(*))")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("getLead error", error);
    return null;
  }
  if (!data) return null;
  const { property, ...lead } = data as unknown as LeadWithProperty;
  return { ...lead, property: property ? toUIProperty(property) : null };
}

/** Update a lead (webhook uses this to mark Stripe payment, status, etc.). */
export async function updateLead(
  id: string,
  patch: Record<string, unknown>
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("leads")
    .update(patch as never)
    .eq("id", id);
  if (error) {
    console.error("updateLead error", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/** Capture a guest inquiry (no auth required). */
export async function createLead(input: DBLeadInsert) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .insert([{ ...input, site: SITE, source: input.source ?? "form" }] as never)
    .select("id")
    .single<{ id: string }>();
  if (error) {
    console.error("createLead error", error);
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const, id: data.id };
}
