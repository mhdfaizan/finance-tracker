"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import ExpenseForm from "@/components/ExpenseForm";

export default function EditExpensePage({ params }) {
  const { id } = use(params);
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/expenses/${id}`);
        if (!res.ok) throw new Error("Expense not found");
        setExpense(await res.json());
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
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Edit Expense</h1>
      <ExpenseForm initialData={expense} />
    </div>
  );
}
