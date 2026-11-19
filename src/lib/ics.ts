/**
 * Pure RFC 5545 .ics calendar invite generator (no external dependencies).
 * Attached to session confirmation emails so clients add the session in 1 click.
 */
function formatIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function buildSessionIcs(input: {
  bookingId: string;
  title: string;
  startsAtIso: string;
  durationMinutes?: number;
  joinUrl: string;
  organizerEmail: string;
  attendeeEmail?: string | null;
}): string {
  const start = new Date(input.startsAtIso);
  const end = new Date(start.getTime() + (input.durationMinutes ?? 60) * 60 * 1000);
  const now = new Date();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Manisha Belvalkar//Online Healing Sessions//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:booking-${input.bookingId}@manishabelvalkar.com`,
    `DTSTAMP:${formatIcsUtc(now)}`,
    `DTSTART:${formatIcsUtc(start)}`,
    `DTEND:${formatIcsUtc(end)}`,
    `SUMMARY:${escapeIcsText(`${input.title} — Dr. Manisha Belvalkar`)}`,
    `DESCRIPTION:${escapeIcsText(`Private online session with Dr. Manisha Belvalkar.\n\nJoin securely from your account (opens 15 minutes before start):\n${input.joinUrl}\n\nPreparation: Find a quiet, uninterrupted space, keep water nearby, and use headphones if possible.`)}`,
    `LOCATION:${escapeIcsText(input.joinUrl)}`,
    `URL:${input.joinUrl}`,
    `ORGANIZER;CN=Dr. Manisha Belvalkar:mailto:${input.organizerEmail}`,
    ...(input.attendeeEmail ? [`ATTENDEE;RSVP=TRUE:mailto:${input.attendeeEmail}`] : []),
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Your online session with Dr. Manisha Belvalkar begins in 1 hour.",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `${lines.join("\r\n")}\r\n`;
}
