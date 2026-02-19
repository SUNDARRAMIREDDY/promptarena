"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiVerifyRound } from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";

interface RoundCodeDialogProps {
  roundNumber: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoundCodeDialog({
  roundNumber,
  open,
  onOpenChange,
}: RoundCodeDialogProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!roundNumber) return;

    setIsVerifying(true);

    const res = await apiVerifyRound({
      roundNumber,
      accessCode: code,
    });

    if (res.error) {
      toast.error(res.error);
      setIsVerifying(false);
      return;
    }

    if (res.data?.verified) {
      toast.success(`Round ${roundNumber} unlocked!`);
      onOpenChange(false);
      setCode("");
      router.push(`/dashboard/round/${roundNumber}?verified=true`);
    }

    setIsVerifying(false);
  }

  function handleClose(value: boolean) {
    if (!isVerifying) {
      setCode("");
      onOpenChange(value);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-card-foreground">
            Unlock Round {roundNumber}
          </DialogTitle>
          <DialogDescription>
            Enter the access code provided at the lab to unlock this round and
            submit your AI-generated image and prompt.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleVerify}>
          <div className="flex flex-col gap-2 py-4">
            <Label htmlFor="access-code">Access Code</Label>
            <Input
              id="access-code"
              type="text"
              placeholder="Enter round access code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoComplete="off"
              disabled={isVerifying}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isVerifying || !code.trim()}>
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Unlock"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
