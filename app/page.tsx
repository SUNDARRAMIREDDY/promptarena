"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { LandingHero } from "@/components/landing-hero";
import { LandingFeatures } from "@/components/landing-features";
import { Loader2 } from "lucide-react";

export default function LandingPage() {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push(isAdmin ? "/admin" : "/dashboard");
    }
  }, [user, isLoading, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) return null;

  return (
    <main className="min-h-screen bg-background">
      <LandingHero />
      <LandingFeatures />
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>PromptArena - Prompt Engineering Competition</p>
      </footer>
    </main>
  );
}
