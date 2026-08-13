import { describe, expect, it } from "vitest";
import { createProductDrafts } from "./create-product-drafts";

const source = {
  provider: "instagram" as const,
  accountId: "account-1",
  username: "ornek.magaza",
  verifiedAt: "2026-08-14T00:00:00.000Z",
  method: "profile_code" as const,
};

describe("createProductDrafts", () => {
  it("creates unpublished review drafts with stable external ids", () => {
    const [draft] = createProductDrafts(source, [
      {
        id: "media-1",
        kind: "image",
        caption: "Seramik kupa\n#elyapimi",
        mediaUrl: "https://example.com/kupa.jpg",
      },
    ]);

    expect(draft.externalId).toBe("instagram:account-1:media-1");
    expect(draft.name).toBe("Seramik kupa");
    expect(draft.status).toBe("needs_review");
    expect(draft.rights.ownershipVerified).toBe(true);
    expect(draft.priceAmount).toBeNull();
  });
});
