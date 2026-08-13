# Catalog Bridge

Catalog Bridge, doğrulanmış sosyal medya hesabına ait fotoğraf ve videoları
platformdan bağımsız ürün taslaklarına dönüştüren bağımsız servistir.

## Değişmez sınırlar

- Hesap sahipliği doğrulanmadan medya işlenmez.
- Kazıma sağlayıcısı çekirdek mimarinin parçası değildir.
- İçe aktarılan içerik otomatik yayınlanmaz.
- Vixrex bağlantısı veritabanına doğrudan yazmaz; Vixrex `ProductService`
  hattına görünmez taslak gönderir.
- Vixrex'in `products` tablosu son ürün kaydının tek otoritesidir.

## İlk çalışan dilim

`POST /api/v1/drafts` doğrulanmış kaynak ve seçilmiş medya alır, ortak
`ProductDraft` sözleşmesini üretir ve Vixrex'e gönderilecek görünmez taslak
karşılığını döndürür.

## Kalıcı hesap ve aktarım temeli

- Google oturumu Supabase Auth ve güvenli SSR cookie akışıyla çalışır.
- `POST /api/v1/import-jobs` yalnız giriş yapan kullanıcı için kalıcı iş açar.
- `GET /api/v1/import-jobs` yalnız oturum sahibinin işlerini döndürür.
- `supabase/migrations` içindeki RLS politikaları kullanıcılar arası erişimi
  engeller.
- İlk kalıcı durum `awaiting_upload` olur; hesap sahipliği doğrulanmadan medya
  çekilmez ve ürün yayınlanmaz.

Yerel ortam için `.env.example` değerlerini bağımsız Catalog Bridge Supabase
projesinden doldurun. Mevcut Vixrex Supabase projesi bu servis için kullanılmaz.

```bash
npm install
npm run dev
```

Kalite kapısı:

```bash
npm run check
```

## Sıradaki dikey dilim

Kesintiye dayanıklı arşiv/orijinal medya yükleme ve `ImportJob` durum geçişleri.
