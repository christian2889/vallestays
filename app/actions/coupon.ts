"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { SITE } from "@/lib/supabase/server";

export type CouponResult =
  | { ok: true; discountPct: number; couponId: string }
  | { ok: false; error: string };

export async function validateCoupon(code: string): Promise<CouponResult> {
  if (!code.trim()) return { ok: false, error: "empty" };

  const admin = getSupabaseAdminClient();
  const { data } = await admin
    .from("coupons")
    .select("id, discount_type, discount_value, valid_from, valid_until")
    .eq("code", code.trim().toUpperCase())
    .eq("is_active", true)
    .eq("site", SITE)
    .maybeSingle();

  if (!data) return { ok: false, error: "invalid" };

  const row = data as unknown as {
    id: string;
    discount_type: string;
    discount_value: string | number;
    valid_from: string | null;
    valid_until: string | null;
  };

  const now = new Date();
  if (row.valid_from && new Date(row.valid_from) > now) return { ok: false, error: "not_yet_valid" };
  if (row.valid_until && new Date(row.valid_until) < now) return { ok: false, error: "expired" };
  if (row.discount_type !== "percentage") return { ok: false, error: "unsupported_type" };

  return {
    ok: true,
    discountPct: Number(row.discount_value),
    couponId: String(row.id),
  };
}
