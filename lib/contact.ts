import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80, "Name must be 80 characters or fewer."),
  email: z.email("Enter a valid email address.").max(160),
  subject: z.string().trim().min(3, "Enter a subject.").max(120, "Subject must be 120 characters or fewer."),
  message: z.string().trim().min(20, "Message must be at least 20 characters.").max(4000, "Message must be 4,000 characters or fewer."),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
