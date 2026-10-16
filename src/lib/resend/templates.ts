/**
 * Branded HTML email templates sent via Resend. Keep these inline (no external
 * CSS/assets) so they render consistently across email clients.
 */

function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head>
  <body style="margin:0;padding:0;background:#faf7f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf7f2;padding:32px 0;">
      <tr><td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eee3d3;">
          <tr>
            <td style="background:linear-gradient(135deg,#8a1c1c,#6b0b0b);padding:28px 32px;text-align:center;">
              <p style="margin:0;color:#f2d9a6;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Manisha Belvalkar · Spiritual Mentor</p>
              <p style="margin:10px 0 0;color:#ffffff;font-size:22px;font-weight:700;">${title}</p>
            </td>
          </tr>
          <tr><td style="padding:32px;">
            ${body}
          </td></tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #eee3d3;text-align:center;font-size:11px;color:#9b8a75;line-height:1.6;">
              Manisha Belvalkar · Mumbai &amp; Pune · <a href="mailto:manishabelvalkar@gmail.com" style="color:#9b8a75;">manishabelvalkar@gmail.com</a><br>
              &copy; ${new Date().getFullYear()} Manisha Belvalkar. All rights reserved.
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function infoRow(label: string, value: string): string {
  const escaped = value.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
  const multi = escaped.includes("\n");
  return `<tr>
    <td style="padding:8px 16px;background:#faf7f2;border-radius:10px;font-size:12px;color:#9b8a75;vertical-align:top;${multi ? "white-space:pre-line;" : "white-space:nowrap;"}">${label}</td>
    <td style="padding:8px 16px;font-size:14px;color:#2b2118;${multi ? "white-space:pre-line;" : ""}">${escaped}</td>
  </tr>`;
}

function detailsTable(rows: { label: string; value: string }[]): string {
  return `<table role="presentation" width="100%" cellspacing="6" style="margin-top:16px;">${rows.map((r) => infoRow(r.label, r.value)).join("")}</table>`;
}

/** Admin notification for a new contact/enquiry form submission. */
export function enquiryAdminEmail(input: {
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  reference: string;
  sourcePath?: string | null;
}): { subject: string; html: string } {
  const rows = [
    { label: "Name", value: input.name },
    { label: "Email", value: input.email ?? "—" },
    { label: "Phone", value: input.phone ?? "—" },
    { label: "Reference", value: input.reference },
  ];
  if (input.sourcePath) rows.push({ label: "From page", value: input.sourcePath });
  rows.push({ label: "Message", value: input.message });
  return {
    subject: `New enquiry from ${input.name} (${input.reference})`,
    html: layout("New Enquiry", `
      <p style="margin:0 0 8px;font-size:16px;color:#2b2118;">Namaste 🙏 A new enquiry has arrived on the website:</p>
      ${detailsTable(rows)}
      <p style="margin:24px 0 0;font-size:13px;color:#9b8a75;">This message was sent from the contact form on manishabelvalkar.com. You can reply to the visitor directly using the contact details above.</p>
    `),
  };
}

/** Order/booking confirmation sent to the customer after a successful payment. */export function orderConfirmationEmail(input: {
  name: string;
  email: string;
  orderRef: string;
  items: string;
  totalLabel: string;
  itemType: string;
}): { subject: string; html: string } {
  return {
    subject: `Order confirmed — ${input.orderRef}`,
    html: layout("Order Confirmed", `
      <p style="margin:0 0 8px;font-size:16px;color:#2b2118;">Dear ${input.name.replace(/[&<>]/g, " ").trim() || "there"},</p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#2b2118;">Thank you! Your <strong>${input.itemType}</strong> has been confirmed. Here are your details:</p>
      ${detailsTable([
        { label: "Order Ref", value: input.orderRef },
        { label: "What you booked", value: input.items },
        { label: "Total", value: input.totalLabel },
      ])}
      <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:#2b2118;">We will follow up with you personally at <strong>${input.email}</strong> regarding the next steps, scheduling and anything we need from you.</p>
      <p style="margin:12px 0 0;font-size:14px;line-height:1.7;color:#2b2118;">With love &amp; light,<br>Manisha</p>
    `),
  };
}

/** Admin notification for a new session/session-waitlist booking request. */
export function bookingAdminEmail(input: {
  offering: string;
  name: string;
  email: string;
  reference: string;
  format: string;
  requestedStart: string | null;
  notes: string | null;
  timezone: string;
}): { subject: string; html: string } {
  return {
    subject: `New booking request — ${input.offering} (${input.reference})`,
    html: layout("New Session Booking Request", `
      <p style="margin:0 0 8px;font-size:16px;color:#2b2118;">Namaste 🙏 A visitor has requested a session:</p>
      ${detailsTable([
        { label: "Offering", value: input.offering },
        { label: "Booking Ref", value: input.reference },
        { label: "Name", value: input.name },
        { label: "Email", value: input.email },
        { label: "Format", value: input.format },
        { label: "Requested start", value: input.requestedStart ? new Date(input.requestedStart).toLocaleString("en-IN", { timeZone: input.timezone || "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) : "Flexible" },
        { label: "Notes", value: input.notes ?? "—" },
      ])}
      <p style="margin:24px 0 0;font-size:13px;color:#9b8a75;">This request was created on manishabelvalkar.com. Follow up with the visitor personally to confirm availability and details.</p>
    `),
  };
}

/** Customer acknowledgement for requests that still need personal confirmation. */
export function requestConfirmationEmail(input: {
  name: string;
  reference: string;
  requestType: string;
  summary: string;
  details?: { label: string; value: string }[];
}): { subject: string; html: string } {
  const safeName = input.name.replace(/[&<>]/g, " ").trim() || "there";
  const safeType = input.requestType.replace(/[&<>]/g, " ");
  const isContactEnquiry = input.requestType === "contact enquiry";
  const acknowledgement = isContactEnquiry
    ? `Thank you for contacting Manisha Belvalkar. We have received your <strong>${safeType}</strong>.`
    : `Thank you. We have received your <strong>${safeType}</strong>. This is an acknowledgement, not a payment or final appointment confirmation.`;
  const nextSteps = isContactEnquiry
    ? "Our team will review your message and reply using the email address or phone number you provided."
    : "Please send the prepared WhatsApp message if you have not already done so. Our team will personally confirm availability, amount, schedule, delivery, or next steps as applicable.";
  return {
    subject: `Request received - ${input.reference}`,
    html: layout("Request Received", `
      <p style="margin:0 0 8px;font-size:16px;color:#2b2118;">Dear ${safeName},</p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#2b2118;">${acknowledgement}</p>
      ${detailsTable(input.details?.length
        ? [{ label: "Reference", value: input.reference }, ...input.details]
        : [{ label: "Reference", value: input.reference }, { label: "Request", value: input.summary }])}
      <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:#2b2118;">${nextSteps}</p>
      <p style="margin:12px 0 0;font-size:14px;line-height:1.7;color:#2b2118;">With love &amp; light,<br>Manisha Belvalkar</p>
    `),
  };
}
