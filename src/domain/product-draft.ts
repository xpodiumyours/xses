import { z } from "zod";

export const mediaKindSchema = z.enum(["image", "video", "carousel"]);

export const sourceMediaSchema = z.object({
  id: z.string().trim().min(1).max(120),
  kind: mediaKindSchema,
  caption: z.string().trim().max(2200).default(""),
  mediaUrl: z.string().url(),
  permalink: z.string().url().optional(),
  capturedAt: z.string().datetime().optional(),
});

export const verifiedSourceSchema = z.object({
  provider: z.literal("instagram"),
  accountId: z.string().trim().min(1).max(120),
  username: z.string().trim().min(1).max(64),
  verifiedAt: z.string().datetime(),
  method: z.enum([
    "official_oauth",
    "profile_code",
    "data_export",
    "original_upload",
  ]),
});

export const createDraftsRequestSchema = z.object({
  source: verifiedSourceSchema,
  media: z.array(sourceMediaSchema).min(1).max(50),
});

export const productDraftSchema = z.object({
  externalId: z.string().min(1),
  sourceType: z.literal("instagram"),
  sourceAccountId: z.string().min(1),
  sourceMediaId: z.string().min(1),
  sourcePermalink: z.string().url().optional(),
  name: z.string().min(1).max(160),
  description: z.string().max(5000),
  media: z
    .array(z.object({ url: z.string().url(), kind: mediaKindSchema }))
    .min(1),
  priceAmount: z.number().nonnegative().nullable(),
  currency: z.string().length(3).default("TRY"),
  stockQuantity: z.number().int().nonnegative().nullable(),
  status: z.literal("needs_review"),
  rights: z.object({
    ownershipVerified: z.literal(true),
    verificationMethod: verifiedSourceSchema.shape.method,
    importedAt: z.string().datetime(),
  }),
});

export type SourceMedia = z.infer<typeof sourceMediaSchema>;
export type VerifiedSource = z.infer<typeof verifiedSourceSchema>;
export type ProductDraft = z.infer<typeof productDraftSchema>;
