import { describe, expect, it } from "vitest";
import type {
  ImportJob,
  ImportJobRepository,
  NewImportJob,
} from "../domain/import-job";
import { startImportJob } from "./start-import-job";

class RecordingRepository implements ImportJobRepository {
  received: NewImportJob | null = null;

  async create(input: NewImportJob) {
    this.received = input;
    const timestamp = "2026-08-14T00:00:00.000Z";
    const job: ImportJob = {
      id: "28a9280f-1b06-4b78-a3a0-789557d2f307",
      sourceProvider: "instagram",
      sourceUsername: input.sourceUsername,
      status: "awaiting_upload",
      mediaCount: 0,
      draftCount: 0,
      errorCode: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return { job, created: true };
  }

  async listForUser() {
    return [];
  }
}

describe("startImportJob", () => {
  it("normalizes the username and binds the job to the authenticated user", async () => {
    const repository = new RecordingRepository();

    await startImportJob(
      {
        userId: "user-1",
        idempotencyKey: "673f8b6f-a1ce-4eac-bd84-1828b818bab8",
        input: { sourceUsername: "  @ornek.magaza " },
      },
      repository,
    );

    expect(repository.received).toEqual({
      userId: "user-1",
      idempotencyKey: "673f8b6f-a1ce-4eac-bd84-1828b818bab8",
      sourceUsername: "ornek.magaza",
    });
  });

  it("rejects a malformed idempotency key before persistence", async () => {
    const repository = new RecordingRepository();

    await expect(
      startImportJob(
        {
          userId: "user-1",
          idempotencyKey: "same-request",
          input: { sourceUsername: "ornek.magaza" },
        },
        repository,
      ),
    ).rejects.toMatchObject({ name: "ZodError" });

    expect(repository.received).toBeNull();
  });

  it("rejects an invalid Instagram username before persistence", async () => {
    const repository = new RecordingRepository();

    await expect(
      startImportJob(
        {
          userId: "user-1",
          idempotencyKey: "673f8b6f-a1ce-4eac-bd84-1828b818bab8",
          input: { sourceUsername: "instagram.com/ornek" },
        },
        repository,
      ),
    ).rejects.toMatchObject({ name: "ZodError" });

    expect(repository.received).toBeNull();
  });
});
