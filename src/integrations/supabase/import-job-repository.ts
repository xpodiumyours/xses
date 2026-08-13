import type { SupabaseClient } from "@supabase/supabase-js";
import {
  importJobSchema,
  type ImportJob,
  type ImportJobRepository,
  type NewImportJob,
} from "@/domain/import-job";
import type { Database } from "@/lib/supabase/database.types";

type ImportJobRow = Database["public"]["Tables"]["import_jobs"]["Row"];

function toImportJob(row: ImportJobRow): ImportJob {
  return importJobSchema.parse({
    id: row.id,
    sourceProvider: row.source_provider,
    sourceUsername: row.source_username,
    status: row.status,
    mediaCount: row.media_count,
    draftCount: row.draft_count,
    errorCode: row.error_code,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export class SupabaseImportJobRepository implements ImportJobRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async create(input: NewImportJob) {
    const { data, error } = await this.client
      .from("import_jobs")
      .insert({
        user_id: input.userId,
        idempotency_key: input.idempotencyKey,
        source_provider: "instagram",
        source_username: input.sourceUsername,
      })
      .select("*")
      .single();

    if (!error && data) {
      return { job: toImportJob(data), created: true };
    }

    if (error?.code !== "23505") {
      throw new Error("IMPORT_JOB_CREATE_FAILED", { cause: error });
    }

    const { data: existing, error: readError } = await this.client
      .from("import_jobs")
      .select("*")
      .eq("user_id", input.userId)
      .eq("idempotency_key", input.idempotencyKey)
      .single();

    if (readError || !existing) {
      throw new Error("IMPORT_JOB_READ_AFTER_CONFLICT_FAILED", {
        cause: readError,
      });
    }

    return { job: toImportJob(existing), created: false };
  }

  async listForUser(userId: string) {
    const { data, error } = await this.client
      .from("import_jobs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      throw new Error("IMPORT_JOBS_LIST_FAILED", { cause: error });
    }

    return (data ?? []).map(toImportJob);
  }
}
