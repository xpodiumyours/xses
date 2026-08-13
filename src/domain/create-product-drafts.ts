import type {
  ProductDraft,
  SourceMedia,
  VerifiedSource,
} from "./product-draft";

function firstMeaningfulLine(caption: string) {
  return caption
    .split(/\r?\n/)
    .map((line) => line.replace(/#[\p{L}\p{N}_]+/gu, "").trim())
    .find((line) => line.length >= 3);
}

function cleanDescription(caption: string) {
  return caption.replace(/\s+/g, " ").trim().slice(0, 5000);
}

export function createProductDrafts(
  source: VerifiedSource,
  media: SourceMedia[],
): ProductDraft[] {
  const importedAt = new Date().toISOString();

  return media.map((item, index) => ({
    externalId: `instagram:${source.accountId}:${item.id}`,
    sourceType: "instagram",
    sourceAccountId: source.accountId,
    sourceMediaId: item.id,
    sourcePermalink: item.permalink,
    name: (
      firstMeaningfulLine(item.caption) || `Instagram ürünü ${index + 1}`
    ).slice(0, 160),
    description: cleanDescription(item.caption),
    media: [{ url: item.mediaUrl, kind: item.kind }],
    priceAmount: null,
    currency: "TRY",
    stockQuantity: null,
    status: "needs_review",
    rights: {
      ownershipVerified: true,
      verificationMethod: source.method,
      importedAt,
    },
  }));
}
