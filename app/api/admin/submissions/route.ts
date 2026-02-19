import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAdmin, AuthError } from "@/lib/auth";
import Submission from "@/lib/models/submission";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    await connectToDatabase();

    // Fetch all submissions with populated user data, sorted by submittedAt ascending (fastest first)
    const submissions = await Submission.find()
      .populate("userId", "name email")
      .sort({ roundNumber: 1, submittedAt: 1 })
      .lean();

    // Group by round and add ranking
    const grouped: Record<
      number,
      Array<{
        id: string;
        userName: string;
        userEmail: string;
        roundNumber: number;
        imageName: string;
        teamName: string;
        prompt: string;
        imagePath: string;
        submittedAt: Date;
        rank: number;
      }>
    > = { 1: [], 2: [], 3: [] };

    for (const sub of submissions) {
      const user = sub.userId as unknown as { name: string; email: string } | null;
      const roundNum = sub.roundNumber as number;

      if (!grouped[roundNum]) {
        grouped[roundNum] = [];
      }

      grouped[roundNum].push({
        id: sub._id.toString(),
        userName: user?.name ?? "Unknown",
        userEmail: user?.email ?? "Unknown",
        roundNumber: roundNum,
        imageName: sub.imageName,
        teamName: sub.teamName,
        prompt: sub.prompt,
        imagePath: sub.imagePath,
        submittedAt: sub.submittedAt,
        rank: grouped[roundNum].length + 1,
      });
    }

    return NextResponse.json({
      submissions: grouped,
      total: submissions.length,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    console.error("Admin submissions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
