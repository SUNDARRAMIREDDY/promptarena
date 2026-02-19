"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth-provider";
import { ProtectedRoute } from "@/components/protected-route";
import { Navbar } from "@/components/navbar";
import { RoundCard } from "@/components/round-card";
import { RoundCodeDialog } from "@/components/round-code-dialog";
import { apiGetMySubmissions, type SubmissionData } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

function DashboardContent() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);

  const fetchSubmissions = useCallback(async () => {
    const res = await apiGetMySubmissions();
    if (res.data) {
      setSubmissions(res.data.submissions);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  function getSubmissionForRound(roundNumber: number): SubmissionData | null {
    return submissions.find((s) => s.roundNumber === roundNumber) || null;
  }

  function handleRoundClick(roundNumber: number) {
    const existing = getSubmissionForRound(roundNumber);
    if (existing) return; // Already submitted
    setSelectedRound(roundNumber);
    setDialogOpen(true);
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* Welcome header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            View the target image at the lab, craft your AI prompt to recreate
            it, then select a round below to submit your entry.
          </p>
        </div>

        {/* Round cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {([1, 2, 3] as const).map((round) => (
              <RoundCard
                key={round}
                roundNumber={round}
                submission={getSubmissionForRound(round)}
                onClick={() => handleRoundClick(round)}
              />
            ))}
          </div>
        )}

        {/* Submission stats */}
        {!isLoading && submissions.length > 0 && (
          <div className="mt-10 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-2 text-lg font-semibold text-card-foreground">
              Your Progress
            </h2>
            <p className="text-muted-foreground">
              You have completed{" "}
              <span className="font-semibold text-primary">
                {submissions.length}
              </span>{" "}
              out of <span className="font-semibold text-foreground">3</span>{" "}
              rounds.
            </p>
            <div className="mt-4 flex gap-2">
              {[1, 2, 3].map((r) => (
                <div
                  key={r}
                  className={`h-2 flex-1 rounded-full ${
                    getSubmissionForRound(r)
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <RoundCodeDialog
        roundNumber={selectedRound}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
