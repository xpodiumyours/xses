"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function GoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signIn() {
    setLoading(true);
    setError("");

    const supabase = createBrowserSupabaseClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/`,
      },
    });

    if (authError) {
      setError("Google girişi başlatılamadı. Tekrar deneyin.");
      setLoading(false);
    }
  }

  return (
    <div className="auth-actions">
      <button
        className="primary-button"
        type="button"
        onClick={signIn}
        disabled={loading}
      >
        {loading ? "Google açılıyor…" : "Google ile devam et"}
      </button>
      {error ? <p className="inline-error" role="alert">{error}</p> : null}
    </div>
  );
}
