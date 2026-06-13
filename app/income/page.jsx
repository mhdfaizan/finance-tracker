"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import IncomeList from "@/components/IncomeList";

export default function IncomePage() {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/income")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setIncome(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleRefresh() {
    setLoading(true);
    setError("");
    fetch("/api/income")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(setIncome)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Income</h1>
        <Link
          href="/income/new"
          className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          + Add Income
        </Link>
      </div>
      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading...</div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200">
          <IncomeList income={income} onDelete={handleRefresh} />
        </div>
      )}
    </div>
  );
}
