"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiCreateSubmission } from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2, Upload, Image as ImageIcon, X } from "lucide-react";

interface SubmissionFormProps {
  roundNumber: number;
}

export function SubmissionForm({ roundNumber }: SubmissionFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageName, setImageName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP, SVG)");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file must be less than 10MB");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function clearFile() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an image to upload");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("roundNumber", String(roundNumber));
    formData.append("imageName", imageName);
    formData.append("teamName", teamName);
    formData.append("prompt", prompt);
    formData.append("image", imageFile);

    const res = await apiCreateSubmission(formData);

    if (res.error) {
      toast.error(res.error);
      setIsSubmitting(false);
      return;
    }

    toast.success(`Round ${roundNumber} submission successful!`);
    router.push("/dashboard");
  }

  return (
    <Card className="mx-auto max-w-2xl border-border">
      <CardHeader>
        <CardTitle className="text-xl text-card-foreground">
          Round {roundNumber} - Prompt Challenge Submission
        </CardTitle>
        <CardDescription>
          Upload the AI-generated image you created from your prompt. Make sure
          it matches the target image shown at the lab as closely as possible.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-5">
          {/* Image Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="imageName">Image Name</Label>
            <Input
              id="imageName"
              type="text"
              placeholder="Name for your AI-generated image"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              required
              maxLength={200}
              disabled={isSubmitting}
            />
          </div>

          {/* Team Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              type="text"
              placeholder="Your team's name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              maxLength={100}
              disabled={isSubmitting}
            />
          </div>

          {/* Upload Image */}
          <div className="flex flex-col gap-2">
            <Label>Upload AI-Generated Image</Label>

            {imagePreview ? (
              <div className="relative overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview of uploaded image"
                  className="h-48 w-full object-contain bg-muted"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-muted-foreground backdrop-blur hover:text-foreground"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="border-t border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                  {imageFile?.name} ({((imageFile?.size ?? 0) / 1024).toFixed(1)} KB)
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border px-6 py-10 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload your AI-generated image</p>
                  <p className="mt-1 text-xs">
                    JPEG, PNG, GIF, WebP, SVG (max 10MB)
                  </p>
                </div>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
              onChange={handleFileChange}
              className="sr-only"
              aria-label="Upload image file"
            />
          </div>

          {/* Prompt */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="prompt">AI Prompt Used</Label>
            <Textarea
              id="prompt"
              placeholder="Paste the exact prompt you used to generate this image..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              maxLength={5000}
              rows={5}
              disabled={isSubmitting}
              className="resize-none"
            />
            <p className="text-right text-xs text-muted-foreground">
              {prompt.length}/5000
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !imageFile}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4" />
                Submit Entry
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
