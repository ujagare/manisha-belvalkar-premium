import { apiError, apiSuccess, requestId } from "@/lib/api";
import { consumeRateLimit } from "@/lib/rate-limit";
import { checkShiprocketServiceability } from "@/lib/shiprocket";
import { calculateParcelSpec, isValidIndianPincode } from "@/lib/shiprocket-utils";

export const runtime = "nodejs";

/**
 * GET /api/shipping/serviceability?pincode=400001&slug=shakti-oracle-deck&quantity=1
 * Public PIN code delivery estimator & Shiprocket courier serviceability check.
 */
export async function GET(request: Request) {
  const traceId = requestId(request);
  try {
    if (!(await consumeRateLimit(request, "shipping-serviceability", 30, 60))) {
      return apiError("RATE_LIMITED", "Too many PIN code checks. Please wait a moment.", 429);
    }

    const url = new URL(request.url);
    const pincode = (url.searchParams.get("pincode") ?? "").trim();
    if (!isValidIndianPincode(pincode)) {
      return apiError("BAD_REQUEST", "Please enter a valid 6-digit Indian PIN code.", 422);
    }

    const slug = (url.searchParams.get("slug") ?? "").trim();
    const quantity = Math.max(1, Math.min(20, Number.parseInt(url.searchParams.get("quantity") ?? "1", 10) || 1));
    const explicitWeight = Number.parseFloat(url.searchParams.get("weight") ?? "");
    const cod = url.searchParams.get("cod") === "1" || url.searchParams.get("cod") === "true";

    const parcel = Number.isFinite(explicitWeight) && explicitWeight > 0 && explicitWeight <= 30
      ? { weightKg: explicitWeight }
      : calculateParcelSpec(slug ? [{ slug, quantity }] : []);

    const result = await checkShiprocketServiceability({
      deliveryPostcode: pincode,
      weightKg: parcel.weightKg,
      cod,
    });

    return apiSuccess(result);
  } catch (error) {
    console.error("[shipping:serviceability]", { traceId, error });
    return apiError(
      "BAD_GATEWAY",
      "Could not check courier availability right now. Please try again shortly.",
      502,
      { traceId },
    );
  }
}
