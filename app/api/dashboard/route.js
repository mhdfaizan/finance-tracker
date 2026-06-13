import { NextResponse } from "next/server";
import { readAll } from "@/lib/googleSheets";
import { getCurrentMonthRange, isDateInRange } from "@/lib/utils";
import { CURRENCY_SYMBOL, SHEETS } from "@/lib/constants";

export async function GET() {
  try {
    const [expenses, income] = await Promise.all([
      readAll(SHEETS.EXPENSES),
      readAll(SHEETS.INCOME),
    ]);
    const { start, end } = getCurrentMonthRange();
    const monthExpenses = expenses.filter((e) => isDateInRange(e.date, start, end));
    const monthIncome = income.filter((i) => isDateInRange(i.date, start, end));
    const totalExpenses = monthExpenses.reduce(
      (sum, e) => sum + parseFloat(e.amount || 0),
      0
    );
    const totalIncome = monthIncome.reduce(
      (sum, i) => sum + parseFloat(i.amount || 0),
      0
    );
    const categoryBreakdown = {};
    monthExpenses.forEach((e) => {
      categoryBreakdown[e.category] =
        (categoryBreakdown[e.category] || 0) + parseFloat(e.amount || 0);
    });
    const sorted = [...expenses, ...income].sort(
      (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
    );
    const recent = sorted.slice(0, 5).map((r) => ({
      ...r,
      type: r.category !== undefined ? "expense" : "income",
    }));
    return NextResponse.json({
      totalExpenses: Math.round(totalExpenses),
      totalIncome: Math.round(totalIncome),
      balance: Math.round(totalIncome - totalExpenses),
      expenseCount: monthExpenses.length,
      incomeCount: monthIncome.length,
      currency: CURRENCY_SYMBOL,
      categoryBreakdown,
      recentTransactions: recent,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data", details: err.message },
      { status: 500 }
    );
  }
}
