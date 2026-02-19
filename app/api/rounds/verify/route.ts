import { NextResponse, type NextRequest } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth";
import { roundVerifySchema } from "@/lib/validations";

const ROUND_CODES: Record<number, string | undefined> = {
  1: process.env.ROUND1_CODE,
  2: process.env.ROUND2_CODE,
  3: process.env.ROUND3_CODE,
};

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);

    const body = await request.json();

    // Validate input
    const parsed = roundVerifySchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    const { roundNumber, accessCode } = parsed.data;

    // Get the expected code for this round
    const expectedCode = ROUND_CODES[roundNumber];
    if (!expectedCode) {
      return NextResponse.json(
        { error: "Round code not configured on the server" },
        { status: 500 }
      );
    }

    // Compare codes (case-sensitive)
    if (accessCode !== expectedCode) {
      return NextResponse.json(
        { error: "Invalid access code. Please try again." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: "Access code verified successfully",
      roundNumber,
      verified: true,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    console.error("Round verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
