"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { AdminSubmissionData } from "@/lib/api-client";
import { Trophy, Medal, Award, FileImage, ImageIcon } from "lucide-react";

interface AdminSubmissionsTableProps {
  submissions: Record<number, AdminSubmissionData[]>;
  isLoading: boolean;
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-4 w-4 text-chart-4" />;
  if (rank === 2) return <Medal className="h-4 w-4 text-muted-foreground" />;
  if (rank === 3) return <Award className="h-4 w-4 text-chart-3" />;
  return null;
}

function getRankLabel(rank: number): string {
  const suffixes: Record<number, string> = { 1: "st", 2: "nd", 3: "rd" };
  const suffix = suffixes[rank] || "th";
  return `${rank}${suffix}`;
}

export function AdminSubmissionsTable({
  submissions,
  isLoading,
}: AdminSubmissionsTableProps) {
  const [previewImage, setPreviewImage] = useState<{
    src: string;
    name: string;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading submissions...
      </div>
    );
  }

  const allEmpty = Object.values(submissions).every(
    (arr) => arr.length === 0
  );
  if (allEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <FileImage className="mb-3 h-12 w-12 opacity-40" />
        <p>No submissions yet.</p>
      </div>
    );
  }

  return (
    <>
      <Tabs defaultValue="1">
        <TabsList>
          <TabsTrigger value="1">
            Round 1 ({submissions[1]?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="2">
            Round 2 ({submissions[2]?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="3">
            Round 3 ({submissions[3]?.length || 0})
          </TabsTrigger>
        </TabsList>

        {([1, 2, 3] as const).map((round) => (
          <TabsContent key={round} value={String(round)}>
            {(!submissions[round] || submissions[round].length === 0) ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <FileImage className="mb-3 h-10 w-10 opacity-40" />
                <p>No submissions for Round {round} yet.</p>
              </div>
            ) : (
              <div className="rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Image Name</TableHead>
                      <TableHead>Prompt</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>Submitted At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions[round].map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {getRankIcon(sub.rank)}
                            <span className="font-semibold text-foreground">
                              {getRankLabel(sub.rank)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {sub.userName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {sub.userEmail}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{sub.teamName}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate text-foreground">
                          {sub.imageName}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="truncate text-muted-foreground">
                            {sub.prompt}
                          </p>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() =>
                              setPreviewImage({
                                src: sub.imagePath,
                                name: sub.imageName,
                              })
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/50 transition-colors hover:bg-muted"
                            aria-label={`Preview image: ${sub.imageName}`}
                          >
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(sub.submittedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Image Preview Dialog */}
      <Dialog
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">{previewImage?.name}</DialogTitle>
            <DialogDescription className="sr-only">
              Preview of the submitted image for {previewImage?.name}
            </DialogDescription>
          </DialogHeader>
          {previewImage && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={previewImage.src}
              alt={previewImage.name}
              className="w-full rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
