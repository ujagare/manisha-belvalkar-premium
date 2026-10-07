"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import type { UserAddress } from "@/lib/supabase/models";
import AddressForm from "@/components/account/AddressForm";
import { deleteAddressAction } from "@/app/account/addresses/actions";

export default function AddressBook({ addresses }: { addresses: UserAddress[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="mt-6">
      {addresses.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="rounded-[24px] border border-parchment bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-deep">
                  {a.is_default ? "✦ Default" : a.label || "Home"}
                </span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setEditingId(editingId === a.id ? null : a.id)} className="flex h-9 w-9 items-center justify-center rounded-full text-warmgray transition hover:bg-ivory hover:text-primary" aria-label={`Edit ${a.label}`}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <form action={deleteAddressAction}>
                    <input type="hidden" name="id" value={a.id} />
                    <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-full text-warmgray transition hover:bg-primary-soft hover:text-primary" aria-label={`Delete ${a.label}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
              <p className="mt-4 font-semibold text-charcoal">{a.recipient_name}</p>
              <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-warmgray">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold-dark" />
                <span>
                  {a.line1}
                  {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} — {a.postal_code}, {a.country_code}
                </span>
              </p>
              <p className="mt-1 pl-6 text-sm text-warmgray">Phone: {a.phone}</p>

              {editingId === a.id ? (
                <div className="mt-5">
                  <AddressForm address={a} onCancel={() => setEditingId(null)} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-parchment bg-white p-10 text-center">
          <MapPin className="mx-auto h-9 w-9 text-gold-dark" />
          <p className="mt-3 text-warmgray">No saved addresses yet.</p>
        </div>
      )}

      <div className="mt-8">
        {showAdd ? (
          <AddressForm onCancel={() => setShowAdd(false)} />
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link className="text-sm text-warmgray hover:text-primary" href="/account">← Back to account</Link>
            <button type="button" onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:brightness-110">
              <Plus className="h-4 w-4" /> Add new address
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-warmgray/70">Addresses are used to deliver physical orders and are shown on your confirmation.</p>
    </div>
  );
}
