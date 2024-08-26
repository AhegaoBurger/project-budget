import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import BudgetSetupWizard from "@/components/BudgetSetupWizard";
import { redirect } from "next/navigation";

export default async function BudgetPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Your Budget Planner, {user.email}
      </h1>
      <BudgetSetupWizard user={user} />
    </main>
  );
}
