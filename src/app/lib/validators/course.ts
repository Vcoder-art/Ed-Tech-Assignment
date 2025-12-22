import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
});

export const updateCourseSchema = createCourseSchema.partial();
