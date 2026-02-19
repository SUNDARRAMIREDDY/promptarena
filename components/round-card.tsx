"use client";

import { cn } from "@/lib/utils";
import { Lock, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import type { SubmissionData } from "@/lib/api-client";

interface RoundCardProps {
  roundNumber: 1 | 2 | 3;
  submission: SubmissionData | null;
  onClick: () => void;
}

const roundMeta: Record<
  number,
  { label: string; subtitle: string; ring: string; bg: string; text: string }
> = {
  1: {
    label: "Round 1",
    subtitle: "Beginner Prompt Challenge",
    ring: "ring-primary/30",
    bg: "bg-primary/10",
    text: "text-primary",
  },
  2: {
    label: "Round 2",
    subtitle: "Intermediate Prompt Challenge",
    ring: "ring-accent/30",
    bg: "bg-accent/10",
    text: "text-accent",
  },
  3: {
    label: "Round 3",
    subtitle: "Advanced Prompt Challenge",
    ring: "ring-chart-3/30",
    bg: "bg-chart-3/10",
    text: "text-chart-3",
  },
};

export function RoundCard({ roundNumber, submission, onClick }: RoundCardProps) {
  const isSubmitted = !!submission;
  const meta = roundMeta[roundNumber];

  return (
    <button
      onClick={onClick}
      disabled={isSubmitted}
      className={cn(
        "group relative flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 transition-all",
        isSubmitted
          ? "cursor-default opacity-80"
          : "cursor-pointer hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      {/* Circular indicator */}
      <div
        className={cn(
          "flex h-28 w-28 items-center justify-center rounded-full ring-4 transition-all",
          meta.ring,
          meta.bg,
          !isSubmitted && "group-hover:ring-primary/50 group-hover:scale-105"
        )}
      >
        {isSubmitted ? (
          <CheckCircle2 className="h-12 w-12 text-accent" />
        ) : (
          <Sparkles className={cn("h-10 w-10", meta.text)} />
        )}
      </div>

      {/* Label */}
      <div className="flex flex-col items-center gap-1">
        <h3 className="text-lg font-semibold text-card-foreground">
          {meta.label}
        </h3>
        <p className="text-xs text-muted-foreground">{meta.subtitle}</p>

        {isSubmitted ? (
          <div className="mt-1 flex items-center gap-1.5 text-sm text-accent">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Submitted</span>
          </div>
        ) : (
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            <span>Enter code to unlock</span>
          </div>
        )}
      </div>

      {/* Submitted details */}
      {isSubmitted && submission && (
        <div className="mt-2 w-full rounded-lg bg-muted/50 p-3 text-left text-xs text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Team:</span>{" "}
            {submission.teamName}
          </p>
          <p className="mt-1">
            <span className="font-medium text-foreground">Image:</span>{" "}
            {submission.imageName}
          </p>
          <p className="mt-1">
            <span className="font-medium text-foreground">Submitted:</span>{" "}
            {new Date(submission.submittedAt).toLocaleString()}
          </p>
        </div>
      )}

      {/* Arrow indicator for unlocked rounds */}
      {!isSubmitted && (
        <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  );
}
