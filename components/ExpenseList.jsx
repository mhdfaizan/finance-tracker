"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import CategoryBadge from "./CategoryBadge";

export default function ExpenseList({ expenses, onDelete }) {
  const router = useRouter();

  async function handleDelete(id) {
    if (!confirm("Delete this expense?")) return;
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      if (onDelete) onDelete(id);
      router.refresh();
    } catch (err) {
      alert(err.message);
    }
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        <p className="text-lg">No expenses yet</p>
        <Link
          href="/expenses/new"
          className="inline-block mt-3 text-sm text-zinc-900 underline"
        >
          Add your first expense
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200">
            <th className="text-left py-3 px-2 font-medium text-zinc-500">Date</th>
            <th className="text-left py-3 px-2 font-medium text-zinc-500">Category</th>
            <th className="text-left py-3 px-2 font-medium text-zinc-500">Note</th>
            <th className="text-right py-3 px-2 font-medium text-zinc-500">Amount</th>
            <th className="py-3 px-2 w-20"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id} className="border-b border-zinc-100 hover:bg-zinc-50">
              <td className="py-3 px-2 text-zinc-600">{exp.date}</td>
              <td className="py-3 px-2">
                <CategoryBadge category={exp.category} />
              </td>
              <td className="py-3 px-2 text-zinc-600 max-w-[200px] truncate">
                {exp.note || "-"}
              </td>
              <td className="py-3 px-2 text-right font-medium text-red-600">
                Rs {parseInt(exp.amount || 0).toLocaleString()}
              </td>
              <td className="py-3 px-2">
                <div className="flex gap-2 justify-end">
                  <Link
                    href={`/expenses/${exp.id}`}
                    className="text-xs text-zinc-500 hover:text-zinc-900 underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="text-xs text-red-500 hover:text-red-700 underline"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
