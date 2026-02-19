import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth, AuthError } from "@/lib/auth";
import Submission from "@/lib/models/submission";
import { submissionFieldsSchema } from "@/lib/validations";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB (base64 adds ~33%, so ~6.7MB stored in MongoDB, under the 16MB doc limit)

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // Parse multipart form data
    const formData = await request.formData();

    const roundNumber = formData.get("roundNumber");
    const imageName = formData.get("imageName");
    const teamName = formData.get("teamName");
    const prompt = formData.get("prompt");
    const imageFile = formData.get("image");

    // Validate text fields
    const parsed = submissionFieldsSchema.safeParse({
      roundNumber,
      imageName,
      teamName,
      prompt,
    });

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    // Validate image file
    if (!imageFile || !(imageFile instanceof File)) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid image type. Allowed types: JPEG, PNG, GIF, WebP, SVG",
        },
        { status: 400 }
      );
    }

    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image file size must be less than 10MB" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check for duplicate submission
    const existingSubmission = await Submission.findOne({
      userId: user._id,
      roundNumber: parsed.data.roundNumber,
    });

    if (existingSubmission) {
      return NextResponse.json(
        {
          error: `You have already submitted for Round ${parsed.data.roundNumber}`,
        },
        { status: 409 }
      );
    }

    // Convert image to base64 data URL.
    // Vercel's serverless filesystem is read-only, so we cannot write to disk.
    // Storing as a data URL in MongoDB avoids any filesystem dependency.
    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const imageDataUrl = `data:${imageFile.type};base64,${base64}`;

    // Create submission
    const submission = await Submission.create({
      userId: user._id,
      roundNumber: parsed.data.roundNumber,
      imageName: parsed.data.imageName,
      teamName: parsed.data.teamName,
      prompt: parsed.data.prompt,
      imagePath: imageDataUrl,
    });

    return NextResponse.json(
      {
        message: "Submission created successfully",
        submission: {
          id: submission._id.toString(),
          roundNumber: submission.roundNumber,
          imageName: submission.imageName,
          teamName: submission.teamName,
          prompt: submission.prompt,
          imagePath: submission.imagePath,
          submittedAt: submission.submittedAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    // Handle Mongoose duplicate key error
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: "You have already submitted for this round" },
        { status: 409 }
      );
    }
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    await connectToDatabase();

    const submissions = await Submission.find({ userId: user._id })
      .sort({ roundNumber: 1 })
      .lean();

    return NextResponse.json({
      submissions: submissions.map((s) => ({
        id: s._id.toString(),
        roundNumber: s.roundNumber,
        imageName: s.imageName,
        teamName: s.teamName,
        prompt: s.prompt,
        imagePath: s.imagePath,
        submittedAt: s.submittedAt,
      })),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    console.error("Get submissions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
