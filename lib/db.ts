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

export type DateRange = { start: string; end: string };

/**
 * Real availability for a property — shared across vallestays & nidosnvillas
 * because blocked_dates and bookings are keyed by property_id (no site filter).
 * Returns inclusive ISO date ranges (YYYY-MM-DD) that should be marked off.
 */
export async function getBlockedDateRanges(
  propertyId: string
): Promise<DateRange[]> {
  const supabase = await getSupabaseServerClient();
  const ranges: DateRange[] = [];

  // 1) blocked_dates: ical syncs, manual blocks, booking-derived blocks
  const { data: blocked, error: blockedErr } = await supabase
    .from("blocked_dates" as never)
    .select("start_date, end_date")
    .eq("property_id", propertyId);
  if (blockedErr) {
    console.error("getBlockedDateRanges blocked_dates error", blockedErr);
  } else {
    for (const r of (blocked ?? []) as { start_date: string; end_date: string }[]) {
      if (r.start_date && r.end_date) ranges.push({ start: r.start_date, end: r.end_date });
    }
  }

  // 2) platform bookings that are not cancelled/refunded
  const { data: bookings, error: bookingsErr } = await supabase
    .from("bookings")
    .select("check_in, check_out, status")
    .eq("property_id", propertyId);
  if (bookingsErr) {
    console.error("getBlockedDateRanges bookings error", bookingsErr);
  } else {
    for (const b of (bookings ?? []) as {
      check_in: string;
      check_out: string;
      status: string | null;
    }[]) {
      if (b.status === "cancelled" || b.status === "refunded") continue;
      if (b.check_in && b.check_out) ranges.push({ start: b.check_in, end: b.check_out });
    }
  }

  return ranges;
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

/** Find an already-created booking by its Stripe payment_intent_id. Used for
 *  webhook idempotency. Uses the service-role client so RLS doesn't hide the
 *  row we just inserted from the parallel webhook event. */
export async function findBookingByStripePI(stripePI: string) {
  const { getSupabaseAdminClient } = await import("@/lib/supabase/admin");
  const admin = getSupabaseAdminClient();
  const { data } = await admin
    .from("bookings")
    .select("id")
    .eq("stripe_payment_intent_id", stripePI)
    .maybeSingle();
  return data ? { id: (data as { id: string }).id } : null;
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

/** Read a lead by id (used by /confirmed and the webhook). Service-role —
 *  the leads SELECT policies only allow admins or hosts of the property. */
export async function getLead(
  id: string
): Promise<(Omit<LeadWithProperty, "property"> & { property: UIProperty | null }) | null> {
  const { getSupabaseAdminClient } = await import("@/lib/supabase/admin");
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
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

/** Update a lead (webhook + server actions use this; service-role to bypass
 *  RLS since neither caller has an authenticated user context). */
export async function updateLead(
  id: string,
  patch: Record<string, unknown>
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { getSupabaseAdminClient } = await import("@/lib/supabase/admin");
  const admin = getSupabaseAdminClient();
  const { error } = await admin
    .from("leads")
    .update(patch as never)
    .eq("id", id);
  if (error) {
    console.error("updateLead error", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/** Capture a guest inquiry (no auth required). Uses the service-role client
 *  because the visitor is anonymous and the leads RLS policy + grants don't
 *  let `anon` SELECT after INSERT (we need the returned id). */
export async function createLead(input: DBLeadInsert) {
  const { getSupabaseAdminClient } = await import("@/lib/supabase/admin");
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
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
