import { z } from "zod";

/**
 * Only one schema exists for this entity, matching PUT /api/admin/about —
 * there is deliberately no createAboutContentSchema, since no create route
 * exists at all for this singleton resource (Architecture Doc 2/3).
 */
export const updateAboutContentSchema = z.object({
  headline: z
    .string()
    .trim()
    .min(1, "Headline is required")
    .max(150, "Headline must be at most 150 characters"),
  bio: z.string().min(20, "Bio should be at least 20 characters"),
  profileImage: z.string().optional(),
  highlights: z.array(z.string()).optional().default([]),
});
