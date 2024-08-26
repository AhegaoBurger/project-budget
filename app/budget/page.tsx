import { createClient } from "@/utils/supabase/server";
import BudgetSetupWizard from "@/components/BudgetSetupWizard";
import BudgetGraphs from "@/components/BudgetGraphs";
import { redirect } from "next/navigation";

export default async function BudgetPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Check if the user has completed the setup
  const { data: incomeData } = await supabase
    .from("income")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const setupCompleted = !!incomeData;

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Your Budget Planner, {user.email}
      </h1>
      {setupCompleted ? (
        <BudgetGraphs user={user} />
      ) : (
        <BudgetSetupWizard user={user} />
      )}
    </main>
  );
}
