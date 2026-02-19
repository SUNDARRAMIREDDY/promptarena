import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ISubmission extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  roundNumber: 1 | 2 | 3;
  imageName: string;
  teamName: string;
  prompt: string;
  imagePath: string;
  submittedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
    index: true,
  },
  roundNumber: {
    type: Number,
    required: [true, "Round number is required"],
    enum: {
      values: [1, 2, 3],
      message: "Round number must be 1, 2, or 3",
    },
  },
  imageName: {
    type: String,
    required: [true, "Image name is required"],
    trim: true,
    maxlength: [200, "Image name must be at most 200 characters"],
  },
  teamName: {
    type: String,
    required: [true, "Team name is required"],
    trim: true,
    maxlength: [100, "Team name must be at most 100 characters"],
  },
  prompt: {
    type: String,
    required: [true, "Prompt is required"],
    maxlength: [5000, "Prompt must be at most 5000 characters"],
  },
  imagePath: {
    type: String,
    required: [true, "Image path is required"],
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index to prevent duplicate submissions per round per user
SubmissionSchema.index({ userId: 1, roundNumber: 1 }, { unique: true });

const Submission: Model<ISubmission> =
  mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema);

export default Submission;
