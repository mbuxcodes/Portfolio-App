import { z } from "zod";

const skillCategoryEnum = z.enum([
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Tools",
]);
const proficiencyEnum = z.enum([
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
]);

export const createSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters"),
  category: skillCategoryEnum,
  proficiency: proficiencyEnum,
  narrative: z.string().min(20, "Narrative should be at least 20 characters"),
  icon: z.string().optional(),
  order: z.number().optional(),
});

export const updateSkillSchema = createSkillSchema.partial();
