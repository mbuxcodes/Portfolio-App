import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

/**
 * The endDate-after-startDate check is a data-quality addition not
 * explicitly required by the original API contract — a job can't logically
 * end before it starts. Added here since we're building this validation
 * layer anyway; cheap to add, prevents nonsensical data from ever being saved.
 */
const dateOrderRefinement = (data, ctx) => {
  if (
    data.endDate &&
    data.startDate &&
    new Date(data.endDate) < new Date(data.startDate)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date cannot be before start date",
      path: ["endDate"],
    });
  }
};

export const createExperienceSchema = z
  .object({
    company: z.string().trim().min(1, "Company is required"),
    role: z.string().trim().min(1, "Role is required"),
    location: z.string().optional(),
    startDate: z.coerce.date({
      errorMap: () => ({ message: "A valid start date is required" }),
    }),
    endDate: z.coerce.date().optional().nullable(),
    description: z
      .string()
      .min(20, "Description should be at least 20 characters"),
    techUsed: z
      .array(z.string().regex(objectIdRegex, "Invalid skill ID"))
      .optional()
      .default([]),
    order: z.number().optional(),
  })
  .superRefine(dateOrderRefinement);

export const updateExperienceSchema = z
  .object({
    company: z.string().trim().min(1).optional(),
    role: z.string().trim().min(1).optional(),
    location: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional().nullable(),
    description: z.string().min(20).optional(),
    techUsed: z
      .array(z.string().regex(objectIdRegex, "Invalid skill ID"))
      .optional(),
    order: z.number().optional(),
  })
  .superRefine(dateOrderRefinement);
