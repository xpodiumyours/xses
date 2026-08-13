import { z } from "zod";

export const importJobStatusSchema = z.enum([
  "awaiting_upload",
  "queued",
  "processing",
  "ready_for_review",
  "failed",
  "cancelled",
]);

export const createImportJobInputSchema = z.object({
  sourceUsername: z
    .string()
    .trim()
    .transform((value) => value.replace(/^@+/, ""))
    .pipe(
      z
        .string()
        .min(1, "Instagram kullanıcı adı gerekli.")
        .max(64)
        .regex(
          /^[A-Za-z0-9._]+$/,
          "Geçerli bir Instagram kullanıcı adı girin.",
        ),
    ),
});

export const idempotencyKeySchema = z.string().uuid();

export const importJobSchema = z.object({
  id: z.string().uuid(),
  sourceProvider: z.literal("instagram"),
  sourceUsername: z.string(),
  status: importJobStatusSchema,
  mediaCount: z.number().int().min(0).max(50),
  draftCount: z.number().int().min(0).max(50),
  errorCode: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CreateImportJobInput = z.infer<
  typeof createImportJobInputSchema
>;
export type ImportJob = z.infer<typeof importJobSchema>;

export interface NewImportJob {
  userId: string;
  idempotencyKey: string;
  sourceUsername: string;
}

export interface ImportJobRepository {
  create(input: NewImportJob): Promise<{
    job: ImportJob;
    created: boolean;
  }>;
  listForUser(userId: string): Promise<ImportJob[]>;
}
