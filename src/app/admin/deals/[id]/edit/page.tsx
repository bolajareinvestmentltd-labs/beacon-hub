"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditDealPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [deal, setDeal] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/deals", { credentials: "same-origin" })
      .then((response) => response.json())
      .then((data) => setDeal((data.deals || []).find((item: any) => String(item.id) === String(params.id))))
      .catch(() => setMessage("Unable to load escrow asset."));
  }, [params.id]);

  if (!deal) return <main className="mx-auto max-w-2xl p-8">{message || "Loading escrow asset..."}</main>;

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/admin/deals", { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ id: deal.id, ...values, price: Number(values.price) }) });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || "Unable to update asset.");
    router.push("/admin");
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#1C1C1E] md:p-8">
        <h1 className="mb-6 text-3xl font-black font-playfair">Edit Escrow Asset</h1>
        <form onSubmit={save} className="flex flex-col gap-5">
          <input name="title" defaultValue={deal.title} required className="rounded-md border p-3" placeholder="Asset title" />
          <input name="vendorName" defaultValue={deal.vendorName} required className="rounded-md border p-3" placeholder="Vendor name" />
          <input name="category" defaultValue={deal.category} required className="rounded-md border p-3" placeholder="Category" />
          <input name="price" type="number" defaultValue={deal.price} required className="rounded-md border p-3" placeholder="Price" />
          <textarea name="description" defaultValue={deal.description} required rows={7} className="rounded-md border p-3" placeholder="Asset details" />
          {message && <p className="text-sm text-red-600">{message}</p>}
          <button className="rounded-md bg-[#E2725B] px-4 py-3 font-bold text-white">Save Escrow Asset</button>
        </form>
      </div>
    </main>
  );
}
