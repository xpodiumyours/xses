import {
  createImportJobInputSchema,
  idempotencyKeySchema,
  type ImportJobRepository,
} from "../domain/import-job";

interface StartImportJobCommand {
  userId: string;
  idempotencyKey: string;
  input: unknown;
}

export async function startImportJob(
  command: StartImportJobCommand,
  repository: ImportJobRepository,
) {
  const input = createImportJobInputSchema.parse(command.input);
  const idempotencyKey = idempotencyKeySchema.parse(command.idempotencyKey);

  return repository.create({
    userId: command.userId,
    idempotencyKey,
    sourceUsername: input.sourceUsername,
  });
}
