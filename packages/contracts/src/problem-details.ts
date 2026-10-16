import { z } from "zod";

/** RFC 9457 error body shared by every API route (see docs/padroes/11-backend-e-api.md). */
export const problemDetailsSchema = z.object({
  type: z.url(),
  title: z.string().min(1),
  status: z.int().min(400).max(599),
  detail: z.string().optional(),
  errors: z
    .array(z.object({ field: z.string(), message: z.string() }))
    .optional(),
  traceId: z.string().min(1),
});

export type ProblemDetails = z.infer<typeof problemDetailsSchema>;
