import { createClient } from "@/utils/supabase/server";
import LandingPage from "@/components/LandingPage";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/budget");
  }

  return <LandingPage />;
}
