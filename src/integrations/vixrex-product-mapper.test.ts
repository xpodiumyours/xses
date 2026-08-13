import { describe, expect, it } from "vitest";
import { createProductDrafts } from "../domain/create-product-drafts";
import { toVixrexProductDraft } from "./vixrex-product-mapper";

describe("toVixrexProductDraft", () => {
  it("never exposes an imported item before owner approval", () => {
    const [draft] = createProductDrafts(
      {
        provider: "instagram",
        accountId: "account-1",
        username: "ornek.magaza",
        verifiedAt: "2026-08-14T00:00:00.000Z",
        method: "official_oauth",
      },
      [
        {
          id: "media-1",
          kind: "video",
          caption: "Yeni ürün",
          mediaUrl: "https://example.com/urun.mp4",
        },
      ],
    );

    const mapped = toVixrexProductDraft(draft);
    expect(mapped.isVisible).toBe(false);
    expect(mapped.metadata.reviewRequired).toBe(true);
    expect(mapped.externalProductId).toBe("instagram:account-1:media-1");
  });
});
