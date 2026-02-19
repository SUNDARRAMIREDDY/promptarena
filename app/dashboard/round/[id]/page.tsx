"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { Navbar } from "@/components/navbar";
import { SubmissionForm } from "@/components/submission-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

function RoundPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  const roundNumber = parseInt(id, 10);
  const isValidRound = [1, 2, 3].includes(roundNumber);
  const isVerified = searchParams.get("verified") === "true";

  useEffect(() => {
    if (!isValidRound) {
      router.push("/dashboard");
      return;
    }
    if (!isVerified) {
      router.push("/dashboard");
      return;
    }
    setVerified(true);
  }, [isValidRound, isVerified, router]);

  if (!isValidRound || !verified) {
    return (
      <>
        <Navbar />
        <main className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
          <ShieldAlert className="mb-4 h-16 w-16 text-destructive" />
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            Access Denied
          </h1>
          <p className="mb-6 text-muted-foreground">
            You need to enter the round access code from the dashboard to submit
            your prompt challenge entry.
          </p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            Round {roundNumber} - Prompt Challenge
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upload your AI-generated recreation and the prompt you used. Make
            sure it matches the target image shown at the lab.
          </p>
        </div>

        <SubmissionForm roundNumber={roundNumber} />
      </main>
    </>
  );
}

export default function RoundPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <ProtectedRoute>
      <RoundPageContent params={params} />
    </ProtectedRoute>
  );
}
