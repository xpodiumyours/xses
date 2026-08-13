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

```bash
npm install
npm run dev
```

Kalite kapısı:

```bash
npm run check
```

## Sıradaki dikey dilim

Kalıcı `ImportJob` deposu, süreli Vixrex handoff oturumu ve Vixrex Asistanının
bu işi başlatıp sonucunu okuması.
