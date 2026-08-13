"use client";

import { useMemo, useState } from "react";

const demoMedia = [
  {
    id: "media-101",
    kind: "image",
    caption: "El yapımı seramik kahve kupası\nSınırlı üretim",
    mediaUrl: "https://example.com/kupa.jpg",
    permalink: "https://instagram.com/p/demo-101",
  },
  {
    id: "media-102",
    kind: "video",
    caption: "Keten yaz gömleği\nDoğal kumaş",
    mediaUrl: "https://example.com/gomlek.mp4",
    permalink: "https://instagram.com/reel/demo-102",
  },
  {
    id: "media-103",
    kind: "carousel",
    caption: "Minimal deri çanta\nÜç farklı renk",
    mediaUrl: "https://example.com/canta.jpg",
    permalink: "https://instagram.com/p/demo-103",
  },
] as const;

interface DraftResult {
  jobId: string;
  targets: {
    vixrex: Array<{
      externalProductId: string;
      name: string;
      isVisible: false;
    }>;
  };
}

export function ImportDemo() {
  const [selected, setSelected] = useState<string[]>([
    demoMedia[0].id,
    demoMedia[1].id,
  ]);
  const [result, setResult] = useState<DraftResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedMedia = useMemo(
    () => demoMedia.filter((item) => selected.includes(item.id)),
    [selected],
  );

  function toggle(id: string) {
    setResult(null);
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  async function createDrafts() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/drafts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: {
            provider: "instagram",
            accountId: "verified-demo-account",
            username: "ornek.magaza",
            verifiedAt: new Date().toISOString(),
            method: "profile_code",
          },
          media: selectedMedia,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.code || "Taslaklar oluşturulamadı.");
      }
      setResult(data);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Beklenmeyen hata oluştu.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="workspace" aria-labelledby="demo-title">
      <aside className="workspace-aside">
        <p className="eyebrow">ÇALIŞAN İLK DİLİM</p>
        <h2>Medya → Ürün Taslağı</h2>
        <p>
          Bu ekran gerçek API sözleşmesini kullanır. Sonuç hiçbir platformda
          otomatik yayınlanmaz.
        </p>
        <div className="step-list">
          {[
            "Hesabı doğrula",
            "Medyayı seç",
            "Taslakları hazırla",
            "Vixrex’te onayla",
          ].map((label, index) => (
            <div className={`step ${index < 3 ? "active" : ""}`} key={label}>
              <span className="step-number">{index + 1}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </aside>

      <div className="workspace-main">
        <div className="panel-head">
          <div>
            <p className="eyebrow">@ORNEK.MAGAZA</p>
            <h2 id="demo-title">Ürün olacak içerikleri seç</h2>
            <p>Birden fazla fotoğraf veya videoyu aynı anda hazırlayabilirsin.</p>
          </div>
          <span className="verified-badge">✓ Hesap doğrulandı</span>
        </div>

        <div className="media-grid">
          {demoMedia.map((item) => {
            const isSelected = selected.includes(item.id);
            const mediaLabel =
              item.kind === "video"
                ? "Video"
                : item.kind === "carousel"
                  ? "Çoklu görsel"
                  : "Fotoğraf";

            return (
              <button
                className={`media-card ${isSelected ? "selected" : ""}`}
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                aria-pressed={isSelected}
              >
                <span className="select-mark">{isSelected ? "✓" : ""}</span>
                <span>
                  <strong>{item.caption.split("\n")[0]}</strong>
                  <small>{mediaLabel}</small>
                </span>
              </button>
            );
          })}
        </div>

        <div className="action-row">
          <span className="selection-note">
            {selected.length} içerik seçildi · yayınlama kapalı
          </span>
          <button
            className="primary-button"
            type="button"
            onClick={createDrafts}
            disabled={!selected.length || loading}
          >
            {loading ? "Hazırlanıyor…" : "Seçilenleri taslağa çevir"}
          </button>
        </div>

        {error ? <div className="error-box" role="alert">{error}</div> : null}

        {result ? (
          <div className="result-panel" aria-live="polite">
            <h3>{result.targets.vixrex.length} Vixrex taslağı hazır</h3>
            <div className="draft-list">
              {result.targets.vixrex.map((draft) => (
                <div className="draft-row" key={draft.externalProductId}>
                  <div>
                    <strong>{draft.name}</strong>
                    <p>{draft.externalProductId}</p>
                  </div>
                  <span className="draft-status">Görünmez taslak</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
