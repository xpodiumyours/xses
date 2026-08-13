import type { ProductDraft } from "../domain/product-draft";

export interface VixrexProductDraft {
  name: string;
  description: string;
  priceAmount: number | null;
  imageUrls: string[];
  sourceType: "instagram";
  externalProductId: string;
  isVisible: false;
  metadata: {
    sourceMediaId: string;
    sourcePermalink?: string;
    reviewRequired: true;
    ownershipVerified: true;
  };
}

export function toVixrexProductDraft(
  draft: ProductDraft,
): VixrexProductDraft {
  return {
    name: draft.name,
    description: draft.description,
    priceAmount: draft.priceAmount,
    imageUrls: draft.media.map((item) => item.url),
    sourceType: "instagram",
    externalProductId: draft.externalId,
    isVisible: false,
    metadata: {
      sourceMediaId: draft.sourceMediaId,
      sourcePermalink: draft.sourcePermalink,
      reviewRequired: true,
      ownershipVerified: draft.rights.ownershipVerified,
    },
  };
}
