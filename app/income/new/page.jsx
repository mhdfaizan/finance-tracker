import IncomeForm from "@/components/IncomeForm";

export const metadata = {
  title: "Add Income - Finance Tracker",
};

export default function NewIncomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Add Income</h1>
      <IncomeForm />
    </div>
  );
}
