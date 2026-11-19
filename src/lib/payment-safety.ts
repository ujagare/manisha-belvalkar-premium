export const sessionOrderTypes = ["service", "healing", "mentoring"] as const;
export const SLOT_HOLD_MINUTES = 15;
export const BOOKING_MODIFICATION_HOURS = 24;

/** Async distance healing uses the private photo portal rather than a live video slot. */
export function isAsyncHealingItem(itemType: string, itemSlug?: string | null) {
  return itemType === "healing" && itemSlug === "distance-healing";
}

export function sessionCheckoutIssue({
  itemTypes,
  itemSlugs = [],
  userId,
  slotId,
  format,
}: {
  itemTypes: string[];
  itemSlugs?: string[];
  userId: string | null;
  slotId: string | null;
  format: string | null;
}) {
  const hasSessionType = itemTypes.some((type) =>
    sessionOrderTypes.includes(type as (typeof sessionOrderTypes)[number]),
  );
  if (!hasSessionType) return null;
  if (!userId) return "SIGN_IN_REQUIRED" as const;

  const requiresLiveSlot = itemTypes.some((type, index) => {
    if (!sessionOrderTypes.includes(type as (typeof sessionOrderTypes)[number])) return false;
    return !isAsyncHealingItem(type, itemSlugs[index]);
  });
  if (requiresLiveSlot && (!slotId || !format)) return "SLOT_REQUIRED" as const;
  return null;
}

export function isWithinModificationWindow(startsAtIso: string | null | undefined, nowMs = Date.now()) {
  if (!startsAtIso) return true;
  const startsMs = Date.parse(startsAtIso);
  if (!Number.isFinite(startsMs)) return true;
  return startsMs - nowMs >= BOOKING_MODIFICATION_HOURS * 60 * 60 * 1000;
}

export function successfulPaymentStatus(status: string) {
  return status === "captured";
}

export function assertDatabaseSuccess(
  result: { error?: { message?: string } | null },
  operation: string,
) {
  if (result.error) throw new Error(`${operation}: ${result.error.message ?? "database operation failed"}`);
}

export function defaultAvailabilityStarts(latestSlotStart: string, days: number) {
  const latest = new Date(latestSlotStart);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(latest);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  const cursor = new Date(Date.UTC(value("year"), value("month") - 1, value("day") + 1));
  const starts: string[] = [];
  let addedDays = 0;
  while (addedDays < days) {
    if (cursor.getUTCDay() !== 0) {
      starts.push(new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate(), 4, 30)).toISOString());
      starts.push(new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate(), 9, 30)).toISOString());
      addedDays += 1;
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return starts;
}
