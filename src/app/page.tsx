import { ImportDemo } from "@/components/import-demo";
import Link from "next/link";
import { GoogleSignIn } from "@/components/google-sign-in";
import { ImportJobPanel } from "@/components/import-job-panel";
import { signOut } from "@/app/auth/actions";
import { SupabaseImportJobRepository } from "@/integrations/supabase/import-job-repository";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isGoogleAuthenticatedUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function loadAccountState() {
  if (!isSupabaseConfigured()) {
    return { state: "not_configured" as const, jobs: [] };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isGoogleAuthenticatedUser(user)) {
    return { state: "signed_out" as const, jobs: [] };
  }

  const repository = new SupabaseImportJobRepository(supabase);
  try {
    const jobs = await repository.listForUser(user.id);

    return {
      state: "signed_in" as const,
      user: { email: user.email ?? "Google hesabı" },
      jobs,
    };
  } catch {
    return {
      state: "data_error" as const,
      user: { email: user.email ?? "Google hesabı" },
      jobs: [],
    };
  }
}

export default async function Home() {
  const account = await loadAccountState();

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Catalog Bridge ana sayfa">
          <span className="brand-mark">CB</span>
          <span>Catalog Bridge</span>
        </a>
        <span className={`status-pill ${account.state === "not_configured" ? "pending" : ""}`}>
          <span aria-hidden="true" />
          {account.state === "not_configured"
            ? "Supabase bağlantısı bekleniyor"
            : account.state === "signed_in"
              ? "Güvenli oturum açık"
              : account.state === "data_error"
                ? "Veri bağlantısı kontrol edilmeli"
                : "Girişe hazır"}
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

      {account.state === "not_configured" ? (
        <section className="account-card connection-card">
          <div>
            <p className="eyebrow">ALTYAPI DURUMU</p>
            <h2>Bağımsız Supabase projesi bağlanacak</h2>
            <p>
              Auth, kalıcı aktarım kayıtları ve RLS kodlandı. Vixrex veritabanı
              bu uygulama için kullanılmadı.
            </p>
          </div>
          <span className="connection-state">Yapılandırma bekliyor</span>
        </section>
      ) : account.state === "signed_out" ? (
        <section className="account-card">
          <div>
            <p className="eyebrow">GÜVENLİ HESAP</p>
            <h2>Aktarımlarını kaydetmek için giriş yap</h2>
            <p>
              Her aktarım yalnız giriş yapan kullanıcıya bağlanır. Başka bir
              kullanıcı işlerini göremez.
            </p>
          </div>
          <GoogleSignIn />
        </section>
      ) : account.state === "data_error" ? (
        <section className="account-card connection-card">
          <div>
            <p className="eyebrow">VERİ BAĞLANTISI</p>
            <h2>Aktarım kayıtları şu anda okunamıyor</h2>
            <p>
              Oturum açık ancak veritabanı tablosu veya RLS bağlantısı hazır
              değil. Sayfayı yenileyerek tekrar deneyebilirsiniz.
            </p>
          </div>
          <Link className="secondary-link" href="/">Tekrar dene</Link>
        </section>
      ) : (
        <>
          <div className="session-bar">
            <span>{account.user.email}</span>
            <form action={signOut}>
              <button className="text-button" type="submit">Çıkış yap</button>
            </form>
          </div>
          <ImportJobPanel initialJobs={account.jobs} />
        </>
      )}

      <ImportDemo />
    </main>
  );
}
