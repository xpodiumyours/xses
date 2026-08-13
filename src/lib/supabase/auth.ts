interface SupabaseUserIdentity {
  is_anonymous?: boolean;
  app_metadata: Record<string, unknown>;
}

export function isGoogleAuthenticatedUser(user: SupabaseUserIdentity) {
  if (user.is_anonymous) {
    return false;
  }

  const provider = user.app_metadata.provider;
  const providers = user.app_metadata.providers;

  return (
    provider === "google" ||
    (Array.isArray(providers) && providers.includes("google"))
  );
}
