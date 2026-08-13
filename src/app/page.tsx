import { ImportDemo } from "@/components/import-demo";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Catalog Bridge ana sayfa">
          <span className="brand-mark">CB</span>
          <span>Catalog Bridge</span>
        </a>
        <span className="status-pill">
          <span aria-hidden="true" /> Çekirdek hazır
        </span>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">ÜRÜN AKTARIM MOTORU</p>
          <h1>Sosyal medya içeriğini güvenli ürün taslağına dönüştür.</h1>
          <p className="hero-text">
            Hesap sahipliği doğrulanır, kullanıcı kendi medyasını seçer ve sonuç
            Vixrex dahil bağlı platformlara yayınlanmamış ürün taslağı olarak
            gönderilir.
          </p>
          <div className="hero-tags" aria-label="Temel ürün ilkeleri">
            <span>Tek ürün sözleşmesi</span>
            <span>Sağlayıcıdan bağımsız</span>
            <span>Kullanıcı onaylı yayın</span>
          </div>
        </div>
        <aside className="boundary-card">
          <p className="eyebrow">ENTEGRASYON SINIRI</p>
          <ol>
            <li><b>Kaynak:</b> Doğrulanmış hesaba ait medya</li>
            <li><b>Motor:</b> Normalize edilmiş ürün taslağı</li>
            <li><b>Vixrex:</b> ProductService üzerinden görünmez kayıt</li>
            <li><b>Yayın:</b> Yalnız kullanıcı onayından sonra</li>
          </ol>
        </aside>
      </section>

      <ImportDemo />
    </main>
  );
}
