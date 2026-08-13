"use client";

import { useState, type FormEvent } from "react";
import type { ImportJob } from "@/domain/import-job";

const statusLabels: Record<ImportJob["status"], string> = {
  awaiting_upload: "Medya bekliyor",
  queued: "Sırada",
  processing: "İşleniyor",
  ready_for_review: "İncelemeye hazır",
  failed: "Başarısız",
  cancelled: "İptal edildi",
};

export function ImportJobPanel({ initialJobs }: { initialJobs: ImportJob[] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function createJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/import-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({ sourceUsername: username }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.code ?? "IMPORT_JOB_CREATE_FAILED");
      }

      setJobs((current) => [
        data.job,
        ...current.filter((job) => job.id !== data.job.id),
      ]);
      setUsername("");
    } catch {
      setError("Aktarım işi oluşturulamadı. Bilgiyi kontrol edip tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="job-panel" aria-labelledby="job-panel-title">
      <div className="job-panel-copy">
        <p className="eyebrow">KALICI AKTARIM ALANI</p>
        <h2 id="job-panel-title">Yeni aktarım başlat</h2>
        <p>
          Bu adım işi hesabınıza kaydeder. Medya yükleme açılana kadar hiçbir
          Instagram içeriği çekilmez veya yayınlanmaz.
        </p>
      </div>

      <form className="job-form" onSubmit={createJob}>
        <label htmlFor="source-username">Instagram kullanıcı adı</label>
        <div className="job-form-row">
          <input
            id="source-username"
            name="sourceUsername"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="ornek.magaza"
            autoComplete="off"
            maxLength={64}
            required
          />
          <button className="primary-button" disabled={loading} type="submit">
            {loading ? "Kaydediliyor…" : "Aktarım oluştur"}
          </button>
        </div>
        {error ? <p className="inline-error" role="alert">{error}</p> : null}
      </form>

      <div className="job-list" aria-live="polite">
        <h3>Aktarım işlerim</h3>
        {jobs.length ? (
          jobs.map((job) => (
            <article className="job-row" key={job.id}>
              <div>
                <strong>@{job.sourceUsername}</strong>
                <p>{new Date(job.createdAt).toLocaleString("tr-TR")}</p>
              </div>
              <span className="draft-status">{statusLabels[job.status]}</span>
            </article>
          ))
        ) : (
          <p className="empty-state">Henüz bir aktarım işi oluşturmadınız.</p>
        )}
      </div>
    </section>
  );
}
