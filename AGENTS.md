<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Catalog Bridge Ajan Çalışma Sözleşmesi

Bu dosya; Codex, Claude ve depoda çalışan diğer kod ajanları için bağlayıcı proje sözleşmesidir. Amaç, hızlı görünen fakat doğrulanmamış “vibe coding” çıktıları yerine küçük, çalışan, güvenli ve kanıtlanmış ürün dilimleri teslim etmektir.

## 1. Ürünün kimliği

Catalog Bridge bağımsız bir ürün içe aktarma uygulamasıdır. Kullanıcının kullanma hakkına sahip olduğu sosyal medya medyasını ve açıklamalarını, platformdan bağımsız `ProductDraft` kayıtlarına dönüştürür. Kullanıcı taslakları inceleyip fiyat, stok, varyant ve açıklama gibi eksikleri tamamladıktan sonra seçtiği e-ticaret kanalına gönderir.

Bu uygulama:

- Vixrex'in yerine geçen bir mağaza veya ürün yönetim sistemi değildir.
- Sosyal medya kazıyıcısı değildir.
- Kullanıcı adına otomatik ürün yayımlamaz.
- Herkese açık içerik üzerinde sahiplik ya da kullanım hakkı varsaymaz.
- Her sağlayıcıyı doğrudan çekirdeğe bağlayan bir entegrasyon yığını değildir.

Ana kullanıcı sonucu şudur:

> Kaynağı ve kullanım yetkisi doğrulanmış içerikten, kullanıcı onayına hazır güvenilir ürün taslakları üretmek.

## 2. Değişmez mimari sınırlar

### Catalog Bridge'in sahip olduğu alanlar

- Kaynak bağlayıcıları ve içe aktarma oturumları
- Hesap sahipliği doğrulama kanıtları ve süreleri
- Kullanıcının yüklediği arşiv/orijinal medya işleme akışı
- Medya ve açıklama ayrıştırma
- Normalizasyon ve `ProductDraft` sözleşmesi
- İçe aktarma işi durumu, hata, yeniden deneme ve idempotency
- Kullanıcıya sunulan taslak inceleme akışı

### Vixrex'in sahip olduğu alanlar

- Vixrex kimliği, mağaza sahipliği ve yetkilendirme
- Nihai ürün doğrulama kuralları
- Nihai ürün kaydı ve yayınlama kararı
- `ProductService → products` yetkili yazma yolu
- Mağaza görünümü, SEO ve herkese açık ürün sayfaları

### Entegrasyon kuralı

- Vixrex bağlantısı yalnızca belgelenmiş sunucu-sunucu sözleşmesi üzerinden yapılır.
- Catalog Bridge, Vixrex veritabanına doğrudan yazmaz.
- İçe aktarılan içerik önce `ProductDraft` olur; ikinci bir nihai ürün gerçeği oluşturulmaz.
- Vixrex'e aktarılan kayıt `isVisible: false` ve `status: needs_review` benzeri inceleme durumuyla başlamalıdır.
- Yayınlama, kullanıcı onayı ve Vixrex'in mevcut yetkili ürün yolu olmadan gerçekleşemez.
- Vixrex Assistant ileride bu servisi arka planda çağırabilir; iş mantığı sohbet paneline kopyalanmaz.

## 3. Kaynak ve sağlayıcı politikası

Üretimde kabul edilen kaynaklar:

1. Kullanıcının yüklediği Instagram “Bilgilerini dışa aktar” arşivi
2. Kullanıcının yüklediği orijinal fotoğraf, video ve açıklamalar
3. Gerekli Meta izinleri onaylandıktan sonra resmî Meta API
4. Aynı güvenlik modelini karşılayan resmî veya kullanıcı-yetkili diğer platform API'leri

Şu kurallar ihlal edilemez:

- RapidAPI üzerindeki Instagram downloader/scraper servisleri üretim çekirdeğine bağlanmaz.
- Profil açıklamasına geçici kod eklemek hesap kontrolünü kanıtlayabilir; Meta API izni veya kazıma izni sağlamaz.
- Resmî izin henüz yoksa arayüz ve dokümantasyon “Meta bağlantısı hazır” diyemez.
- Sağlayıcı çağrıları değiştirilebilir sunucu adaptörlerinin arkasında kalır.
- Erişim belirteçleri, API anahtarları, arşivler ve özel medya istemci loglarına, URL'lere veya hata mesajlarına sızdırılmaz.
- Kaynak içeriğin sahipliği, saklama süresi ve silme işlemi denetlenebilir olmalıdır.

## 4. Kullanıcı diliyle çalışma

Kullanıcı teknik şartname yazmak zorunda değildir. Konuşma diliyle Türkçe, kısa komut, ekran görüntüsü veya örnek bağlantı geçerli girdidir.

Ajan:

- Kullanıcının niyetini teknik göreve kendisi çevirir.
- Dosya yolu, mevcut desen, tip, komut ve bağımlılık gibi incelenebilir bilgileri kullanıcıya sormadan depodan bulur.
- Kullanıcıdan promptunu yeniden yazmasını, kabul kriteri üretmesini veya teknik terim seçmesini istemez.
- Yalnızca sonucu, güvenliği, maliyeti ya da geri dönüşü zor bir kararı gerçekten değiştiren eksik seçim için soru sorar.
- Belirsizlik küçük ve geri alınabilir ise en dar güvenli varsayımı açıkça yaparak ilerler.

Komutların anlamı:

| Kullanıcı niyeti | Ajanın yetkisi |
| --- | --- |
| “Açıkla”, “incele”, “rapor ver” | Salt okunur inceleme ve kanıtlı cevap |
| “Sorunu bul”, “teşhis et” | Kök nedeni bulma; ayrıca istenmedikçe düzeltme yok |
| “Planla” | Uygulanabilir plan; kod/deploy/veri değişikliği yok |
| “Başla”, “yap”, “ekle”, “düzelt”, “geliştir” | Açık kapsamı uygula, doğrula ve teslim et |

## 5. Her değişiklikte zorunlu çalışma sırası

Önemsiz olmayan her görevde şu sıra izlenir:

1. `git status` ile çalışma ağacını ve kullanıcıya ait mevcut değişiklikleri kontrol et.
2. İlgili giriş noktasını, alan sahibini ve mevcut testi odaklı aramayla bul.
3. Tek cümlede kullanıcıya görünür sonucu ve kapsam dışını belirle.
4. Mevcut yetkili veri/işlem yolunu takip et; yeni bir paralel yol açma.
5. İlk bağımlılıkları tamamlanmış dikey dilimi uçtan uca uygula.
6. Başarıyla birlikte yükleniyor, boş, hata, zaman aşımı, yeniden deneme ve iptal durumlarını ele al.
7. Önce en dar ilgili testi, sonra değişikliğin gerektirdiği kalite kapılarını çalıştır.
8. Mümkünse gerçek kullanıcı giriş noktasından yetkili veri yoluna kadar davranışı çalıştırarak kanıtla.
9. Yalnızca gözlenen kanıta dayanan tek bir durum cümlesiyle rapor ver.

Bir plan zaten karara bağlandıysa yeniden planlama döngüsü başlatma. Açık olan ilk dikey dilimi uygula.

## 6. Vibe coding karşıtı kurallar

Aşağıdakiler teslimat değildir:

- Yalnızca plan, TODO listesi, doküman, issue veya PR açmak
- Testi çalıştırmadan “çalışıyor” demek
- Mock ekranı gerçek entegrasyon gibi sunmak
- Yalnızca mutlu yolu kodlamak
- Derleme geçmesini kullanıcı akışının doğrulandığı anlamına getirmek

Ajan şunları yapamaz:

- Aynı kavram için ikinci ürün modeli, ikinci durum makinesi veya ikinci yayınlama yolu oluşturmak
- UI bileşeninden doğrudan harici sağlayıcı çağırmak
- Kullanıcı onayı olmadan taslağı yayımlamak
- Henüz alınmamış izin, doğrulanmamış sahiplik veya çalıştırılmamış testi tamamlanmış göstermek
- Testleri silerek, beklentiyi gevşeterek veya type safety'yi kapatarak kontrolü yeşile çevirmek
- İlgisiz refactor, bağımlılık yükseltmesi veya biçim değişikliğiyle diff'i büyütmek
- Aynı bilgiyi bulmak için depoyu tekrar tekrar baştan taramak
- Kullanıcıya ait kirli çalışma ağacını ezmek, geri almak veya gizlemek
- Açık yetki olmadan deploy, canlı veri değişikliği, ücretli servis çağrısı ya da dış mesaj gerçekleştirmek
- Secret, token, kişisel medya veya arşiv örneğini commit etmek
- `git reset --hard`, force push veya kapsamı belirsiz toplu silme kullanmak

Bir dosya 400 satırı veya bir modül 20 dışa açık üyeyi aşmışsa yeni sorumluluk eklemeden önce gerçek alan sahibini ayır. Sırf satır sayısını düşürmek için anlamsız parçalama yapma.

## 7. Kod sahipliği ve katmanlar

| Konum | Sorumluluk | Yasak |
| --- | --- | --- |
| `src/domain` | Sağlayıcıdan bağımsız tipler, kurallar ve kullanım senaryoları | Next.js, HTTP veya belirli sağlayıcı ayrıntısı |
| `src/integrations` | Harici sistem adaptörleri ve sınır eşlemeleri | UI durumu ve yetkisiz doğrudan veri yazımı |
| `src/app/api` | HTTP sınırı, doğrulama, auth kontrolü ve orkestrasyon | Alan kuralını route içine gömmek |
| `src/components` | Kullanıcı etkileşimi ve görünür durumlar | Secret, sağlayıcı SDK'sı veya nihai veri sahipliği |
| `*.test.ts(x)` | Davranış ve hata sözleşmesi | Uygulama kodunu yeniden kopyalayan anlamsız test |

Yeni bağımlılık eklemeden önce mevcut platform ve paketlerle çözülemediğini göster. Yeni route, servis, tablo veya şema yalnızca mevcut sahibin gerçekten karşılamadığı bir sorumluluk varsa oluşturulur.

## 8. Veri ve güvenlik sözleşmesi

Her içe aktarma işi en az şu özelliklere sahip olmalıdır:

- Kimliği doğrulanmış kullanıcı ve kaynak sahipliği bağı
- Tahmin edilemez iş/oturum kimliği
- Tekrarlanan istekte çift ürün üretmeyen idempotency anahtarı
- Dosya türü, boyut, süre ve adet sınırı
- Sunucuda içerik doğrulama; yalnızca dosya uzantısına güvenmeme
- Sağlayıcı zaman aşımı, sınırlı yeniden deneme ve oran limiti
- Kullanıcıya anlaşılır kısmi başarısızlık sonucu
- Ham arşiv/medya için açık saklama ve silme süresi
- Loglarda kişisel veri ve secret maskeleme
- Yetkisiz kullanıcının başka bir işin durumunu veya medyasını görememesi

AI veya otomatik çıkarım kullanılırsa:

- Ürün adı, fiyat, varyant ve açıklama “öneri” olarak işaretlenir.
- Düşük güvenli alanlar kullanıcı incelemesine zorlanır.
- Model çıktısı şema doğrulamasından geçmeden alana yazılmaz.
- Maliyet, zaman aşımı ve sağlayıcı hatası kullanıcı akışını kilitlemez.

## 9. `ProductDraft` sözleşmesi

`ProductDraft` sağlayıcıdan ve hedef platformdan bağımsız kalmalıdır. Kaynak kanıtı, medya referansları, çıkarılan alanlar, güven/uyarı bilgisi ve inceleme durumu taşıyabilir; Vixrex veritabanı satırının kopyası olamaz.

Eşleme kuralları:

- Kaynak verisi önce normalize edilir, sonra hedef adaptörüne eşlenir.
- Hedefe özgü alanlar domain modeline sızdırılmaz.
- Eksik zorunlu alan uydurulmaz; `needs_review` sebebi olarak gösterilir.
- Aynı kaynak içeriği yeniden işlendiğinde izlenebilir ve tekrarsız sonuç üretilir.
- Nihai yayın durumu Catalog Bridge tarafından doğru kabul edilmez; hedef platformdan doğrulanır.

## 10. Test ve doğrulama kapıları

Değişikliğe göre en dar yeterli kapıyı seç:

- Doküman/ajan kuralı: `git diff --check`
- Domain kuralı: ilgili Vitest dosyası + typecheck
- API veya entegrasyon: ilgili test + typecheck + lint
- UI akışı: ilgili test + gerçek tarayıcı akışı
- Sürüm adayı veya çapraz katman değişikliği: `npm run check`

Standart komutlar:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check
```

Bir kontrol ortam nedeniyle çalışmadıysa sonucu uydurma. Hangi komutun neden çalışmadığını ve geriye kalan riski açıkça yaz.

## 11. Bitti tanımı

Bir özellik ancak kapsamına uygun olarak aşağıdakiler kanıtlandığında “bitti” sayılır:

- Gerçek kullanıcı giriş noktası erişilebilir.
- Yetkilendirme ve veri sahipliği kontrolü doğru sınırda çalışır.
- Başarı, boş, yükleniyor, hata ve yeniden deneme durumları görünürdür.
- Aynı işlem güvenle tekrar edilebilir veya açıkça engellenir.
- Taslak otomatik yayımlanmaz ve eksikler kullanıcıya gösterilir.
- İlgili testler ve kalite kapıları geçer.
- Yetkili veri yolunda beklenen sonuç gözlenir.
- Log veya commit içinde secret/kişisel veri yoktur.
- Geri alma veya güvenli hata davranışı bellidir.

## 12. Kanıt ve durum dili

Karar ile kanıtı karıştırma. Gerektiğinde şu etiketleri kullan:

- `KULLANICI KARARI`: Kullanıcının seçtiği fakat henüz uygulanmamış yön
- `KODDA DOĞRULANDI`: Depodaki gerçek uygulama incelendi
- `TESTTE DOĞRULANDI`: Belirtilen otomatik kontrol geçti
- `YERELDE DOĞRULANDI`: Gerçek akış yerelde çalıştırıldı
- `CANLIDA DOĞRULANDI`: Yetkili canlı yüzeyde gözlendi
- `PLANLANDI`: Henüz uygulanmadı
- `ÇIKARIM`: Kanıttan türetilen, doğrudan gözlenmeyen sonuç
- `BİLİNMİYOR`: Kanıt yok

Son raporda yalnızca şu dürüst durumlardan birini kullan:

- Hazır
- Kodlandı ve test edildi
- Yerelde doğrulandı
- Canlıda doğrulandı
- Hazır değil
- Engellendi

Test geçtiyse “test geçti” de; deploy edilmediyse “canlı” deme. Kod yazıldıysa fakat gerçek kullanıcı akışı çalıştırılmadıysa bunu açıkça belirt.

## 13. Git ve teslim disiplini

- Değişiklikten önce ve sonra `git status` kontrol et.
- Yalnızca görevle ilgili dosyaları stage et.
- Küçük ve amaç odaklı commit oluştur.
- Bu depo herkese açıksa tüm metin ve örnekleri yayınlanabilir kabul et; hassas değer kullanma.
- Kullanıcının mevcut değişikliklerini ayrı tut ve commit mesajında sahiplenme.
- GitHub'a gönderim ile deploy'u aynı şey sayma.
- Uygulama değişikliğini commit/push etmek canlıya alma yetkisi vermez.

## 14. Karara bağlanmış ürün yönü

Yeni kanıt veya açık kullanıcı kararı olmadıkça şu konuları tekrar tartışmaya açma:

- Uygulama Vixrex'ten ayrı geliştirilecek.
- Vixrex Assistant daha sonra arka planda entegrasyon giriş noktası olabilir.
- Hesap sahipliği doğrulama akışı korunacak.
- Ürün medyası için ilk güvenli yol kullanıcı arşivi/orijinal yüklemesidir.
- Resmî Meta bağlantısı gerekli izinler alındıktan sonra etkinleşecektir.
- Instagram scraper/downloader API'leri üretim çekirdeği olmayacaktır.
- Vixrex'te nihai ürün gerçeği `products` ve mevcut `ProductService` yoludur.
- Her içe aktarma kullanıcı incelemesi ve açık yayın onayı gerektirir.

Bu kararlardan sapmak gerekiyorsa önce çelişen kanıtı göster, etkisini açıkla ve kullanıcıdan ürün kararı iste.
