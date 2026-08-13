import { describe, expect, it } from "vitest";
import { isGoogleAuthenticatedUser } from "./auth";

describe("isGoogleAuthenticatedUser", () => {
  it("accepts a non-anonymous Google identity", () => {
    expect(
      isGoogleAuthenticatedUser({
        is_anonymous: false,
        app_metadata: { provider: "google", providers: ["google"] },
      }),
    ).toBe(true);
  });

  it("rejects anonymous and non-Google identities", () => {
    expect(
      isGoogleAuthenticatedUser({
        is_anonymous: true,
        app_metadata: { provider: "google" },
      }),
    ).toBe(false);
    expect(
      isGoogleAuthenticatedUser({
        is_anonymous: false,
        app_metadata: { provider: "email" },
      }),
    ).toBe(false);
  });
});
