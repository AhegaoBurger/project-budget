import { createClient } from "@/utils/supabase/server";
import BudgetSetupWizard from "@/components/BudgetSetupWizard";
import LandingPage from "@/components/LandingPage";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Your Budget Planner
      </h1>
      {user ? <BudgetSetupWizard user={user} /> : <LandingPage />}
    </main>
  );
}
