import { z } from "zod";

export const createAssignmentSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  dueDate: z.string().datetime().optional(),
});
