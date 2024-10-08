"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.push("/budget");
      } else {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [router, supabase.auth]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Button
      type="submit"
      variant="outline"
      size="icon"
      className="flex items-center gap-2"
      onClick={handleGoogleLogin}
    >
      <FcGoogle className="h-5 w-5" />
    </Button>
  );
}
