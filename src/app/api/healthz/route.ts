import { apiSuccess } from "@/lib/api";

export const dynamic = "force-dynamic";

export function GET() {
  return apiSuccess({ status: "ok", service: "manisha-belvalkar-web" });
}
