import { apiError, apiSuccess, readJsonObject } from "@/lib/api";
import { brand } from "@/lib/data";
import { consumeRateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/resend/client";
import { requestConfirmationEmail } from "@/lib/resend/templates";
import { isSameOriginRequest } from "@/lib/security";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedTypes = new Set(["contact enquiry", "product order", "course enrollment", "cart order"]);
const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
  if (!(await consumeRateLimit(request, "manual-confirmations", 8, 900))) {
    return apiError("RATE_LIMITED", "Too many confirmation requests.", 429);
  }

  try {
    const body = await readJsonObject(request, 12_288);
    const name = text(body.name, 120);
    const email = text(body.email, 254).toLowerCase();
    const reference = text(body.reference, 80);
    const requestType = text(body.requestType, 40);
    const summary = text(body.summary, 2000);
    if (!name || !emailPattern.test(email) || !reference || !allowedTypes.has(requestType) || !summary) {
      return apiError("BAD_REQUEST", "Valid confirmation details are required.", 422);
    }

    const customer = requestConfirmationEmail({ name, reference, requestType, summary });
    const admin = requestConfirmationEmail({ name, reference, requestType, summary: `${summary}\nCustomer email: ${email}` });
    const [customerResult, adminResult] = await Promise.all([
      sendEmail({ to: email, subject: customer.subject, html: customer.html }),
      sendEmail({ to: brand.email, subject: `New ${requestType} - ${reference}`, html: admin.html }),
    ]);
    if (!customerResult.ok) return apiError("INTERNAL_ERROR", "Confirmation email could not be sent.", 503);
    return apiSuccess({ emailed: true, adminNotified: adminResult.ok });
  } catch (error) {
    console.error("[manual-confirmations]", error);
    return apiError("INTERNAL_ERROR", "Confirmation email could not be sent.", 500);
  }
}
