"use client";

import { useActionState } from "react";
import { Loader2, MapPin } from "lucide-react";
import type { UserAddress } from "@/lib/supabase/models";
import { saveAddressAction } from "@/app/account/addresses/actions";
import { cn } from "@/lib/utils";

interface AddressFormProps {
  address?: UserAddress;
  defaultPhone?: string;
  onCancel?: () => void;
}

const FIELDS: { name: string; label: string; col?: string; placeholder?: string }[] = [
  { name: "label", label: "Label", placeholder: "Home / Office" },
  { name: "recipient_name", label: "Full name", placeholder: "Recipient name" },
  { name: "phone", label: "Phone", placeholder: "+91 98765 43210" },
  { name: "line1", label: "Address line 1", col: "sm:col-span-2", placeholder: "House no., street, area" },
  { name: "line2", label: "Address line 2 (optional)", col: "sm:col-span-2", placeholder: "Landmark / floor" },
  { name: "city", label: "City" },
  { name: "state", label: "State" },
  { name: "postal_code", label: "PIN code" },
];

export default function AddressForm({ address, onCancel }: AddressFormProps) {
  const [state, formAction, pending] = useActionState(saveAddressAction, null);
  const errors = (state as { errors?: Record<string, string> })?.errors;

  return (
    <form action={formAction} className="rounded-[24px] border border-parchment bg-white p-6">
      <input type="hidden" name="id" value={address?.id ?? ""} />
      {address ? <p className="font-display text-lg font-bold text-charcoal">Edit address</p> : <p className="font-display text-lg font-bold text-charcoal">Add a new address</p>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.name} className={field.col ?? ""}>
            <label htmlFor={`addr-${field.name}`} className="mb-1.5 block text-sm font-medium text-charcoal">
              {field.label}
            </label>
            <input
              id={`addr-${field.name}`}
              name={field.name}
              defaultValue={address?.[field.name as keyof UserAddress] as string | number | undefined}
              placeholder={field.placeholder}
              required={!["line2", "label", "id"].includes(field.name)}
              className={cn(
                "w-full rounded-xl border border-parchment bg-ivory/50 px-4 py-2.5 text-charcoal outline-none transition focus:border-gold",
                errors?.[field.name] && "border-primary",
              )}
            />
            {errors?.[field.name] ? <p className="mt-1 text-xs text-primary">{errors[field.name]}</p> : null}
          </div>
        ))}
      </div>

      {errors?.form ? <p role="alert" className="mt-4 rounded-xl bg-primary-soft p-3 text-sm text-primary">{errors.form}</p> : null}

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        {onCancel ? (
          <button type="button" onClick={onCancel} className="rounded-full border border-parchment px-5 py-2.5 text-sm font-semibold text-warmgray hover:text-charcoal">
            Cancel
          </button>
        ) : null}
        <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {address ? "Save changes" : "Add address"}
        </button>
      </div>
    </form>
  );
}
