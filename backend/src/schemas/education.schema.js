import { z } from "zod";

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

export const createEducationSchema = z
  .object({
    institution: z.string().trim().min(1, "Institution is required"),
    degree: z.string().trim().min(1, "Degree is required"),
    field: z.string().optional(),
    startDate: z.coerce.date({
      errorMap: () => ({ message: "A valid start date is required" }),
    }),
    endDate: z.coerce.date().optional().nullable(),
    description: z.string().optional(),
    order: z.number().optional(),
  })
  .superRefine(dateOrderRefinement);

export const updateEducationSchema = z
  .object({
    institution: z.string().trim().min(1).optional(),
    degree: z.string().trim().min(1).optional(),
    field: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional().nullable(),
    description: z.string().optional(),
    order: z.number().optional(),
  })
  .superRefine(dateOrderRefinement);
