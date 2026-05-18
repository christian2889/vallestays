/**
 * Shared nightly-price logic. Safe to import in client and server code.
 *
 * Properties have a weekday rate (`price_per_night`, Sun–Thu) and an
 * optional weekend rate (`weekend_price`, Fri & Sat). A night is priced
 * by the weekday on which the guest sleeps.
 */

export type StayBreakdown = {
  nights: number;
  subtotal: number;
  weekdayNights: number;
  weekendNights: number;
};

/** Parse a "YYYY-MM-DD" string as a LOCAL date (no UTC shift). */
export function parseLocalDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/** Friday (5) and Saturday (6) nights are weekend-priced. */
function isWeekendNight(d: Date): boolean {
  const day = d.getDay();
  return day === 5 || day === 6;
}

export function computeStaySubtotal(opts: {
  checkIn: Date;
  checkOut: Date;
  weekdayPrice: number;
  weekendPrice: number;
}): StayBreakdown {
  const { weekdayPrice, weekendPrice } = opts;
  const c = new Date(
    opts.checkIn.getFullYear(),
    opts.checkIn.getMonth(),
    opts.checkIn.getDate()
  );
  const end = new Date(
    opts.checkOut.getFullYear(),
    opts.checkOut.getMonth(),
    opts.checkOut.getDate()
  );
  let subtotal = 0;
  let weekdayNights = 0;
  let weekendNights = 0;
  let nights = 0;
  let guard = 0;
  while (c < end && guard < 366) {
    if (isWeekendNight(c)) {
      subtotal += weekendPrice;
      weekendNights++;
    } else {
      subtotal += weekdayPrice;
      weekdayNights++;
    }
    nights++;
    c.setDate(c.getDate() + 1);
    guard++;
  }
  return { nights, subtotal, weekdayNights, weekendNights };
}

/**
 * Breakdown from ISO date strings. Falls back to all-weekday pricing
 * over `fallbackNights` when the dates are missing/invalid.
 */
export function staySubtotalFromIso(opts: {
  checkInIso: string | null | undefined;
  checkOutIso: string | null | undefined;
  weekdayPrice: number;
  weekendPrice: number;
  fallbackNights?: number;
}): StayBreakdown {
  const ci = parseLocalDate(opts.checkInIso);
  const co = parseLocalDate(opts.checkOutIso);
  if (ci && co && co > ci) {
    return computeStaySubtotal({
      checkIn: ci,
      checkOut: co,
      weekdayPrice: opts.weekdayPrice,
      weekendPrice: opts.weekendPrice,
    });
  }
  const n = Math.max(0, opts.fallbackNights ?? 0);
  return {
    nights: n,
    subtotal: n * opts.weekdayPrice,
    weekdayNights: n,
    weekendNights: 0,
  };
}
