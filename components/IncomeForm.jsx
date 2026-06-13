"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function IncomeForm({ initialData }) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    amount: initialData?.amount || "",
    source: initialData?.source || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    note: initialData?.note || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const url = isEdit ? `/api/income/${initialData.id}` : "/api/income";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.details ? data.details.join(", ") : data.error || "Failed to save"
        );
      }
      router.push("/income");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Amount (Rs)
        </label>
        <input
          type="number"
          name="amount"
          step="1"
          min="1"
          required
          value={form.amount}
          onChange={handleChange}
          placeholder="e.g. 50000"
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Source
        </label>
        <input
          type="text"
          name="source"
          required
          value={form.source}
          onChange={handleChange}
          placeholder="Salary, Freelance, etc."
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          required
          value={form.date}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Note (optional)
        </label>
        <input
          type="text"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Monthly salary, bonus, etc."
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : isEdit ? "Update Income" : "Add Income"}
        </button>
        <Link
          href="/income"
          className="px-5 py-2.5 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
