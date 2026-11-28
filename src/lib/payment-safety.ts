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

export function isProtectedCheckoutPath(pathname: string, paymentsConfigured: boolean) {
  return paymentsConfigured && pathname.startsWith("/checkout");
}

export function resolveWebhookEventId(
  payload: Record<string, unknown>,
  headerEventId?: string | null,
): string | null {
  const eventType = typeof payload.event === "string" ? payload.event.trim() : "";
  if (!eventType) return null;

  const root = payload.payload as {
    payment?: { entity?: { id?: unknown } };
    refund?: { entity?: { id?: unknown } };
    dispute?: { entity?: { id?: unknown } };
    order?: { entity?: { id?: unknown } };
  } | undefined;

  const cleanId = (value: unknown) =>
    typeof value === "string" && /^[A-Za-z0-9_-]{4,100}$/.test(value.trim()) ? value.trim() : null;

  let entityId: string | null = null;
  if (eventType.startsWith("refund.")) {
    entityId = cleanId(root?.refund?.entity?.id);
  } else if (eventType.startsWith("payment.dispute.")) {
    entityId = cleanId(root?.dispute?.entity?.id);
  } else if (eventType.startsWith("payment.")) {
    entityId = cleanId(root?.payment?.entity?.id);
  } else if (eventType.startsWith("order.")) {
    entityId = cleanId(root?.order?.entity?.id);
  } else {
    entityId =
      cleanId(root?.refund?.entity?.id) ??
      cleanId(root?.dispute?.entity?.id) ??
      cleanId(root?.payment?.entity?.id) ??
      cleanId(root?.order?.entity?.id);
  }

  if (entityId) {
    return `${eventType}:${entityId}`;
  }

  const trimmedHeader = typeof headerEventId === "string" ? headerEventId.trim() : "";
  if (/^[A-Za-z0-9_.:-]{8,128}$/.test(trimmedHeader)) {
    return trimmedHeader;
  }

  return null;
}

export function evaluateWebhookPaymentTransition(input: {
  existing: { status?: string | null; amount_subunits: number; currency: string } | null;
  incomingStatus: string;
  incomingAmount?: number;
  incomingCurrency?: string;
}): "apply" | "skip" | "mismatch" | "missing" {
  if (!input.existing) return "missing";
  if (input.existing.status === "refunded") return "skip";
  if (input.existing.status === "captured" && input.incomingStatus !== "captured") {
    return "skip";
  }
  if (input.incomingStatus === "failed") {
    return "apply";
  }
  if (
    input.incomingAmount !== input.existing.amount_subunits ||
    input.incomingCurrency !== input.existing.currency
  ) {
    return "mismatch";
  }
  return "apply";
}

export async function collectPaginatedRazorpayItems<T extends { id: string }>(
  fetchPage: (params: { count: number; skip: number }) => Promise<T[]>,
  options?: { pageSize?: number; maxPages?: number },
): Promise<T[]> {
  const pageSize = Math.min(100, Math.max(1, options?.pageSize ?? 100));
  const maxPages = Math.max(1, options?.maxPages ?? 10);
  const collected: T[] = [];
  const seenIds = new Set<string>();

  for (let page = 0; page < maxPages; page += 1) {
    const batch = await fetchPage({ count: pageSize, skip: page * pageSize });
    let added = 0;
    for (const item of batch) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        collected.push(item);
        added += 1;
      }
    }
    if (batch.length < pageSize || added === 0) break;
  }

  return collected;
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
