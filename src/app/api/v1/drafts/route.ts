import { ZodError } from "zod";
import { createProductDrafts } from "@/domain/create-product-drafts";
import { createDraftsRequestSchema } from "@/domain/product-draft";
import { toVixrexProductDraft } from "@/integrations/vixrex-product-mapper";

export async function POST(request: Request) {
  try {
    const input = createDraftsRequestSchema.parse(await request.json());
    const drafts = createProductDrafts(input.source, input.media);

    return Response.json(
      {
        jobId: crypto.randomUUID(),
        status: "ready_for_review",
        drafts,
        targets: {
          vixrex: drafts.map(toVixrexProductDraft),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        { code: "INVALID_DRAFT_REQUEST", issues: error.issues },
        { status: 400 },
      );
    }

    return Response.json({ code: "DRAFT_CREATION_FAILED" }, { status: 500 });
  }
}
