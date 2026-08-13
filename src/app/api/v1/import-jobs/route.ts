import { ZodError } from "zod";
import { startImportJob } from "@/application/start-import-job";
import { SupabaseImportJobRepository } from "@/integrations/supabase/import-job-repository";
import {
  isSupabaseConfigured,
  SupabaseConfigurationError,
} from "@/lib/supabase/config";
import { isGoogleAuthenticatedUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function noStoreJson(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store");
  return Response.json(body, { ...init, headers });
}

async function authenticatedContext() {
  if (!isSupabaseConfigured()) {
    throw new SupabaseConfigurationError();
  }

  const client = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user || !isGoogleAuthenticatedUser(user)) {
    return null;
  }

  return {
    user,
    repository: new SupabaseImportJobRepository(client),
  };
}

export async function GET() {
  try {
    const context = await authenticatedContext();
    if (!context) {
      return noStoreJson({ code: "AUTH_REQUIRED" }, { status: 401 });
    }

    const jobs = await context.repository.listForUser(context.user.id);
    return noStoreJson({ jobs });
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return noStoreJson(
        { code: "SUPABASE_NOT_CONFIGURED" },
        { status: 503 },
      );
    }

    return noStoreJson({ code: "IMPORT_JOBS_LIST_FAILED" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const context = await authenticatedContext();
    if (!context) {
      return noStoreJson({ code: "AUTH_REQUIRED" }, { status: 401 });
    }

    let input: unknown;
    try {
      input = await request.json();
    } catch {
      return noStoreJson(
        { code: "INVALID_IMPORT_JOB_REQUEST" },
        { status: 400 },
      );
    }

    const result = await startImportJob(
      {
        userId: context.user.id,
        idempotencyKey: request.headers.get("Idempotency-Key") ?? "",
        input,
      },
      context.repository,
    );

    return noStoreJson(result, { status: result.created ? 201 : 200 });
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return noStoreJson(
        { code: "SUPABASE_NOT_CONFIGURED" },
        { status: 503 },
      );
    }

    if (error instanceof ZodError) {
      return noStoreJson(
        { code: "INVALID_IMPORT_JOB_REQUEST", issues: error.issues },
        { status: 400 },
      );
    }

    return noStoreJson({ code: "IMPORT_JOB_CREATE_FAILED" }, { status: 500 });
  }
}
