"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveMyAddress, deleteMyAddress } from "@/lib/supabase/session";

/** Validate and normalise one submitted address field set. */
function parseAddress(form: FormData) {
  const value = (name: string) => (form.get(name)?.toString() ?? "").trim();
  const recipient_name = value("recipient_name");
  const phone = value("phone");
  const line1 = value("line1");
  const line2 = value("line2");
  const city = value("city");
  const state = value("state");
  const postal_code = value("postal_code");

  const errors: Record<string, string> = {};
  if (recipient_name.length < 2) errors.recipient_name = "Full name is required.";
  if (!/^[0-9+()\-\s]{7,15}$/.test(phone)) errors.phone = "Enter a valid phone number.";
  if (line1.length < 4) errors.line1 = "Address line 1 is required.";
  if (city.length < 2) errors.city = "City is required.";
  if (state.length < 2) errors.state = "State is required.";
  if (!/^[0-9]{3,6}([-\s]?[0-9]{1,3})?$/.test(postal_code)) errors.postal_code = "Enter a valid PIN/postal code.";
  if (Object.keys(errors).length) return { errors, data: null as null };

  return {
    errors: null as null,
    data: {
      id: value("id") || undefined,
      label: value("label") || "Home",
      recipient_name,
      phone,
      line1,
      line2: line2 || null,
      city,
      state,
      postal_code,
      country_code: "IN",
    },
  };
}

export async function saveAddressAction(prev: unknown, form: FormData) {
  const parsed = parseAddress(form);
  if (parsed.errors) return { errors: parsed.errors };

  const saved = await saveMyAddress(parsed.data!);
  if (!saved) {
    return { errors: { form: "Could not save the address. Please try again." } };
  }

  revalidatePath("/account/addresses");
  redirect("/account/addresses");
}

export async function deleteAddressAction(form: FormData) {
  const id = form.get("id")?.toString() ?? "";
  if (id) await deleteMyAddress(id);
  revalidatePath("/account/addresses");
  redirect("/account/addresses");
}
