import { z } from "zod";

export const accountSchema = z.object({
  username: z.string().min(1, "Username is required"),
  website: z.string().url("Please enter a valid URL").optional(),
  avatarUrl: z.string().optional(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;