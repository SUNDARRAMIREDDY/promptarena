import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters"),
  adminCode: z.string().optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required"),
});

export const roundVerifySchema = z.object({
  roundNumber: z
    .number()
    .int()
    .min(1, "Round number must be between 1 and 3")
    .max(3, "Round number must be between 1 and 3"),
  accessCode: z
    .string()
    .min(1, "Access code is required")
    .trim(),
});

export const submissionFieldsSchema = z.object({
  roundNumber: z.coerce
    .number()
    .int()
    .min(1, "Round number must be between 1 and 3")
    .max(3, "Round number must be between 1 and 3"),
  imageName: z
    .string()
    .min(1, "Image name is required")
    .max(200, "Image name must be at most 200 characters")
    .trim(),
  teamName: z
    .string()
    .min(1, "Team name is required")
    .max(100, "Team name must be at most 100 characters")
    .trim(),
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .max(5000, "Prompt must be at most 5000 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RoundVerifyInput = z.infer<typeof roundVerifySchema>;
export type SubmissionFieldsInput = z.infer<typeof submissionFieldsSchema>;
