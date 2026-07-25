import { z } from "zod";

export const createSocialLinkSchema = z.object({
  platform: z.string().trim().min(1, "Platform name is required"),
  url: z.string().url("Must be a valid URL starting with http:// or https://"),
  icon: z.string().optional(),
  order: z.number().optional(),
});

export const updateSocialLinkSchema = createSocialLinkSchema.partial();
