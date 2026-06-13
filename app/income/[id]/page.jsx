"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import IncomeForm from "@/components/IncomeForm";

export default function EditIncomePage({ params }) {
  const { id } = use(params);
  const [income, setIncome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/income/${id}`);
        if (!res.ok) throw new Error("Income not found");
        setIncome(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12 text-zinc-400">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Edit Income</h1>
      <IncomeForm initialData={income} />
    </div>
  );
}
