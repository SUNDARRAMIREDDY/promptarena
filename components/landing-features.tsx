"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Upload, BarChart3, Eye } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "View Target in Lab",
    description:
      "Each round reveals a target image at the competition venue. Study it carefully before crafting your prompt.",
  },
  {
    icon: Lock,
    title: "Unlock with Code",
    description:
      "Enter the round access code provided by organizers to unlock the submission portal for that round.",
  },
  {
    icon: Upload,
    title: "Submit Your Recreation",
    description:
      "Upload your AI-generated image along with the exact prompt you used. One submission per round.",
  },
  {
    icon: BarChart3,
    title: "Ranked by Speed",
    description:
      "Submissions are ranked by how fast you submit. Be quick and accurate to claim the top spot.",
  },
];

export function LandingFeatures() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
          How the Competition Works
        </h2>
        <p className="text-muted-foreground">
          A multi-round prompt engineering battle
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="border-border bg-card">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg text-card-foreground">{feature.title}</CardTitle>
              <CardDescription className="leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
