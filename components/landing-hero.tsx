"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, BrainCircuit } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--primary)_0%,transparent_50%)] opacity-5" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-20 pt-24 text-center">
        {/* Badge */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          <BrainCircuit className="h-4 w-4 text-primary" />
          <span>Prompt Engineering Challenge</span>
        </div>

        {/* Hero icon */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <Sparkles className="h-10 w-10 text-primary-foreground" />
        </div>

        {/* Headline */}
        <h1 className="mb-6 max-w-3xl text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Craft the Perfect Prompt.
          <br />
          <span className="text-primary">Recreate the Image.</span>
        </h1>

        {/* Subheadline */}
        <p className="mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          See the target image displayed at the lab, write the best AI prompt
          you can to recreate it, then submit your generated image here.
          The fastest and most accurate submissions win.
        </p>

        {/* How it works */}
        <div className="mb-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
          {[
            { step: "1", label: "View the target image in the lab" },
            { step: "2", label: "Craft your AI prompt to recreate it" },
            { step: "3", label: "Submit your generated image here" },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {item.step}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild className="gap-2 px-8">
            <Link href="/register">
              Join the Competition
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="px-8">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
