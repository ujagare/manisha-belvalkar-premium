"use client";

import { useSyncExternalStore } from "react";

const IST_ZONES = new Set(["Asia/Kolkata", "Asia/Calcutta"]);

function subscribeNoop() {
  return () => {};
}

function getClientTimezoneSnapshot(): string | null {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch {
    return null;
  }
}

function getServerTimezoneSnapshot(): string | null {
  return null;
}

/**
 * Hydration-safe hook returning the visitor's IANA browser timezone on the client
 * and null during SSR so server/client markup never mismatches.
 */
export function useVisitorTimezone(): string | null {
  return useSyncExternalStore(
    subscribeNoop,
    getClientTimezoneSnapshot,
    getServerTimezoneSnapshot,
  );
}

export function isOutsideIst(timezone: string | null | undefined): timezone is string {
  return Boolean(timezone && !IST_ZONES.has(timezone));
}

/**
 * Formats an ISO timestamp in the visitor's local timezone with short zone name
 * (e.g., "Fri, 27 Nov, 11:30 pm EST" or "11:30 pm GMT").
 */
export function formatVisitorLocalDateTime(
  iso: string | null | undefined,
  visitorTz: string | null | undefined,
  options?: { timeOnly?: boolean; includeYear?: boolean },
): string | null {
  if (!iso || !isOutsideIst(visitorTz)) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  try {
    if (options?.timeOnly) {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: visitorTz,
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }).format(date);
    }

    return new Intl.DateTimeFormat("en-US", {
      timeZone: visitorTz,
      weekday: "short",
      day: "numeric",
      month: "short",
      ...(options?.includeYear ? { year: "numeric" } : {}),
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date);
  } catch {
    return null;
  }
}
