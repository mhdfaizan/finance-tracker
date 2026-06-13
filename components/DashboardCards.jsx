import CategoryBadge from "./CategoryBadge";

function Card({ label, amount, color }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5">
      <p className="text-sm text-zinc-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>
        Rs {parseInt(amount || 0).toLocaleString()}
      </p>
    </div>
  );
}

export default function DashboardCards({ data }) {
  if (!data) {
    return (
      <div className="text-center py-12 text-zinc-400">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          label="This Month Income"
          amount={data.totalIncome}
          color="text-green-600"
        />
        <Card
          label="This Month Expenses"
          amount={data.totalExpenses}
          color="text-red-600"
        />
        <Card
          label="Balance"
          amount={data.balance}
          color={data.balance >= 0 ? "text-zinc-900" : "text-red-600"}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h3 className="text-sm font-semibold text-zinc-700 mb-3">
            Category Breakdown
          </h3>
          {Object.keys(data.categoryBreakdown || {}).length === 0 ? (
            <p className="text-sm text-zinc-400">No expenses this month</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(data.categoryBreakdown).map(([cat, amt]) => (
                <div
                  key={cat}
                  className="flex items-center justify-between"
                >
                  <CategoryBadge category={cat} />
                  <span className="text-sm font-medium">
                    Rs {parseInt(amt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h3 className="text-sm font-semibold text-zinc-700 mb-3">
            Recent Transactions
          </h3>
          {data.recentTransactions?.length === 0 ? (
            <p className="text-sm text-zinc-400">No transactions yet</p>
          ) : (
            <div className="space-y-2">
              {data.recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-zinc-400 text-xs shrink-0">
                      {tx.date}
                    </span>
                    <span className="truncate">
                      {tx.type === "income" ? tx.source : tx.category}
                    </span>
                  </div>
                  <span
                    className={`font-medium shrink-0 ml-2 ${
                      tx.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}Rs{" "}
                    {parseInt(tx.amount || 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 text-xs text-zinc-400">
        <span>{data.expenseCount} expenses this month</span>
        <span>·</span>
        <span>{data.incomeCount} income entries this month</span>
      </div>
    </div>
  );
}
