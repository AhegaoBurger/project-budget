import BudgetSetupWizard from "@/components/BudgetSetupWizard";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Your Budget Planner
      </h1>
      <BudgetSetupWizard />
    </main>
  );
}
