import { z } from "zod";

const reasonEnum = z.enum(["Job Opportunity", "Freelance", "General", "Other"]);
const statusEnum = z.enum(["new", "read", "replied", "archived"]);

export const submitMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().email("Please provide a valid email address"),
  reason: reasonEnum,
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be at most 2000 characters"),
});

// Deliberately narrow: an admin can only ever change status/notes on an
// existing message, never rewrite the visitor's name/email/message content —
// that would let the admin fabricate what a visitor supposedly said.
export const updateMessageSchema = z.object({
  status: statusEnum.optional(),
  adminNotes: z.string().optional(),
});
