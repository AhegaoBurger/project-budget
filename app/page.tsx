import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import BudgetSetupWizard from "@/components/BudgetSetupWizard";
import LandingPage from "@/components/LandingPage";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Your Budget Planner
      </h1>
      {session ? <BudgetSetupWizard /> : <LandingPage />}
    </main>
  );
}
