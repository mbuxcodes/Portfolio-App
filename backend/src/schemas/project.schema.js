import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const projectCategoryEnum = z.enum([
  "Personal",
  "Freelance",
  "Open Source",
  "Academic",
]);
const projectStatusEnum = z.enum(["draft", "published"]);

export const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  category: projectCategoryEnum,
  techStack: z
    .array(z.string().regex(objectIdRegex, "Invalid skill ID"))
    .min(1, "At least one technology must be selected"),
  coverImage: z.string().min(1, "Cover image is required"),
  gallery: z.array(z.string()).optional().default([]),
  problem: z
    .string()
    .min(20, "Problem description should be at least 20 characters"),
  solution: z
    .string()
    .min(20, "Solution description should be at least 20 characters"),
  results: z
    .string()
    .min(20, "Results description should be at least 20 characters"),
  role: z.string().optional(),
  liveLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  featured: z.boolean().optional().default(false),
  status: projectStatusEnum.optional().default("draft"),
  order: z.number().optional(),
});

// Update allows partial fields — an admin editing a project rarely
// resubmits every field, only the ones they changed.
export const updateProjectSchema = createProjectSchema.partial();
