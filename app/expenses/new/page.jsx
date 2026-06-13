import ExpenseForm from "@/components/ExpenseForm";

export const metadata = {
  title: "Add Expense - Finance Tracker",
};

export default function NewExpensePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Add Expense</h1>
      <ExpenseForm />
    </div>
  );
}
