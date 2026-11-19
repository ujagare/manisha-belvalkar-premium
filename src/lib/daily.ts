import "server-only";
import { randomBytes } from "node:crypto";
import { serverEnv } from "@/lib/env";

const DAILY_API = "https://api.daily.co/v1";

function dailyHeaders() {
  const apiKey = serverEnv.dailyApiKey();
  if (!apiKey) throw new Error("Daily.co is not configured");
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

export interface DailyRoomResult {
  roomName: string;
  roomUrl: string;
}

/**
 * Creates a private, time-bounded, waiting-room-protected 1:1 Daily.co room.
 * - privacy: "private" (requires signed meeting token — URL alone cannot join)
 * - enable_knocking: true (waiting room; host admits client)
 * - max_participants: 2 (private 1:1 healing space)
 * - nbf / exp: opens 15 min before start, auto-expires 90 min after end
 */
export async function createPrivateDailyRoom(input: {
  bookingId: string;
  offeringSlug: string;
  startsAtIso: string | null;
  durationMinutes?: number;
}): Promise<DailyRoomResult> {
  const sanitizedSlug = input.offeringSlug.replace(/[^a-z0-9-]/gi, "").slice(0, 20) || "session";
  const shortId = input.bookingId.replace(/[^a-z0-9]/gi, "").slice(0, 8);
  const entropy = randomBytes(6).toString("hex");
  const roomName = `mb-${sanitizedSlug}-${shortId}-${entropy}`.toLowerCase();

  const durationSec = (input.durationMinutes ?? 60) * 60;
  const startMs = input.startsAtIso ? Date.parse(input.startsAtIso) : Number.NaN;
  const nowSec = Math.floor(Date.now() / 1000);
  const startSec = Number.isFinite(startMs) ? Math.floor(startMs / 1000) : nowSec;

  // Allow host/client to enter 15 min early; auto-eject 90 min after scheduled end.
  const nbf = Math.max(nowSec, startSec - 15 * 60);
  const exp = Math.max(nowSec + 4 * 60 * 60, startSec + durationSec + 90 * 60);

  const response = await fetch(`${DAILY_API}/rooms`, {
    method: "POST",
    headers: dailyHeaders(),
    body: JSON.stringify({
      name: roomName,
      privacy: "private",
      properties: {
        nbf,
        exp,
        max_participants: 2,
        enable_knocking: true,
        enable_chat: true,
        enable_screenshare: true,
        enable_prejoin_ui: true,
        start_video_off: false,
        start_audio_off: false,
        eject_at_room_exp: true,
      },
    }),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Daily.co room creation failed (${response.status}): ${errorText.slice(0, 200)}`);
  }

  const data = (await response.json()) as { name?: string; url?: string };
  if (!data.name || !data.url) {
    throw new Error("Daily.co room response missing name or url");
  }

  return { roomName: data.name, roomUrl: data.url };
}

/**
 * Mints a short-lived signed Daily.co meeting token bound to one room and user.
 * Only staff/practitioner receives `is_owner: true`.
 */
export async function createDailyMeetingToken(input: {
  roomName: string;
  userName: string;
  userId: string;
  isOwner: boolean;
  expiresInSeconds?: number;
}): Promise<string> {
  const nowSec = Math.floor(Date.now() / 1000);
  const exp = nowSec + (input.expiresInSeconds ?? 2 * 60 * 60);

  const response = await fetch(`${DAILY_API}/meeting-tokens`, {
    method: "POST",
    headers: dailyHeaders(),
    body: JSON.stringify({
      properties: {
        room_name: input.roomName,
        user_name: input.userName.slice(0, 80) || (input.isOwner ? "Dr. Manisha Belvalkar" : "Client"),
        user_id: input.userId.slice(0, 64),
        is_owner: input.isOwner,
        exp,
        enable_screenshare: true,
        start_video_off: false,
        start_audio_off: false,
      },
    }),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Daily.co token creation failed (${response.status}): ${errorText.slice(0, 200)}`);
  }

  const data = (await response.json()) as { token?: string };
  if (!data.token) throw new Error("Daily.co token response missing token");
  return data.token;
}

/** Best-effort deletion when a booking is cancelled or rescheduled. */
export async function deleteDailyRoom(roomName: string): Promise<void> {
  if (!serverEnv.dailyApiKey() || !roomName) return;
  try {
    await fetch(`${DAILY_API}/rooms/${encodeURIComponent(roomName)}`, {
      method: "DELETE",
      headers: dailyHeaders(),
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
  } catch (error) {
    console.warn("[daily:delete-room]", roomName, error);
  }
}
