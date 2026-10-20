# PRODUCT REQUIREMENTS DOCUMENT  
# SiWita Lamsel — Sistem Informasi Wisata dan Retribusi Digital

**Versi:** 1.1  
**Tanggal:** 20 Oktober 2026  
**Status:** Draft untuk validasi stakeholder — **bukan persetujuan implementasi**

> Dokumen ini memperbaiki konsistensi scope, keamanan QR, pencatatan pendapatan, definisi metrik, dan kriteria selesai. Jawaban substantif atas lima pertanyaan klarifikasi belum tersedia. Semua pilihan desain berikut merupakan **USULAN** untuk ditinjau, bukan keputusan pengguna atau kebijakan resmi pemerintah daerah.

**Penanda:**

- **USULAN** = rekomendasi produk yang perlu persetujuan.
- **OQ** = open question / keputusan terbuka.
- Tidak ada tarif, daftar lokasi pilot, target bisnis, atau kebijakan refund yang dianggap sudah disahkan.

## Kontrol Dokumen dan Keputusan

| Item | Status |
|---|---|
| Pemilik produk / pemberi persetujuan | OPD pengampu pariwisata dan pengelola penerimaan daerah; pejabat dan kewenangan belum dikonfirmasi (OQ-01). |
| Platform usulan | Web responsif untuk wisatawan, dashboard internal, dan pemindai berbasis web pada perangkat petugas; native app tidak termasuk MVP. |
| Scope usulan | Pembelian tiket wisata pemerintah daerah, pembayaran digital, QR online, laporan kunjungan dan penerimaan. |
| Kondisi jaringan usulan | Validasi gate wajib online. Offline penuh ditunda agar tidak menjanjikan pencegahan penggunaan ganda lintas perangkat tanpa koneksi. |
| Metode pembayaran | Minimal satu kanal digital melalui penyedia resmi; pilihan kanal dan penyedia belum diputuskan (OQ-04). |
| Batas jadwal, anggaran, lokasi, beban | Belum ditentukan; tidak ada estimasi rilis yang dianggap komitmen (OQ-02, OQ-03, OQ-11). |

## 1. Problem Statement

**Hipotesis masalah:** informasi destinasi, penjualan tiket, validasi masuk, dan pencatatan penerimaan yang terpisah dapat menimbulkan antrean, kesalahan rekap, serta kesulitan penelusuran transaksi. Kondisi aktual, besaran kerugian, dan baseline belum diverifikasi melalui observasi atau wawancara.

| Pihak terdampak | Kerugian / kebutuhan | Bukti yang perlu dikumpulkan |
|---|---|---|
| Wisatawan | Sulit memastikan informasi, harga, dan status tiket; waktu terbuang saat antre. | Wawancara calon pengunjung, uji alur beli, pengukuran waktu antre. |
| Petugas gate/loket | Validasi dan pencatatan berulang; risiko tiket dipakai ulang. | Observasi operasional, perangkat, jaringan, SOP gate. |
| Pengelola penerimaan | Sulit membedakan transaksi dibayar, tiket digunakan, dan dana yang sudah disetor. | Contoh laporan, mutasi settlement, SOP setoran dan rekonsiliasi. |
| Pengelola destinasi | Sulit mengukur efektivitas promosi dan tren kunjungan. | Data kunjungan dan kanal promosi yang tersedia. |

**Masalah yang diselesaikan:** menyediakan alur terhubung dari informasi destinasi sampai transaksi, validasi kunjungan, dan rekonsiliasi penerimaan yang dapat ditelusuri. Peningkatan PAD merupakan dampak yang diharapkan, bukan hasil yang dijamin oleh aplikasi.

## 2. Target User dan Dua Persona

Prioritas usulan: wisatawan pembeli tiket dan petugas gate sebagai pengguna operasional utama; admin konten, operator keuangan, dan pimpinan sebagai pengguna pendukung. Prioritas akhir perlu dikonfirmasi (OQ-01).

### Persona A — Wisatawan Keluarga

| Aspek | Keterangan |
|---|---|
| Tujuan | Melihat destinasi, biaya, jam buka, lalu membeli dan membuka tiket dari ponsel. |
| Hambatan | Koneksi seluler terbatas; tidak ingin proses registrasi panjang. |
| Ukuran keberhasilan | Dapat menyelesaikan pembelian dan menemukan kembali tiket tanpa bantuan. |

### Persona B — Petugas Gate

| Aspek | Keterangan |
|---|---|
| Tujuan | Memastikan tiket sah dan mencatat pengunjung dengan cepat. |
| Hambatan | Cahaya kamera, jaringan lokasi, pemindaian tiket bersamaan. |
| Ukuran keberhasilan | Hasil validasi jelas dan satu tiket tidak diterima dua kali. |

Kedua persona adalah alat perancangan, bukan hasil riset pengguna. Login wisatawan wajib atau pembelian tanpa akun masih terbuka (OQ-05).

## 3. Goals dan Non-Goals

### Goals MVP

- Menyediakan informasi destinasi yang dikelola pemerintah daerah dan tarif yang telah diverifikasi.
- Menghubungkan pemesanan, pembayaran terverifikasi, penerbitan tiket, dan validasi masuk.
- Memisahkan tiket terjual, pengunjung benar-benar masuk, penerimaan bruto, biaya layanan, refund, dan settlement.
- Memberikan laporan dan jejak audit yang dapat ditelusuri sampai transaksi sumber.

### Non-Goals MVP

- Marketplace hotel, transportasi, paket tour, atau kuliner.
- Tiket objek swasta sebagai sumber retribusi daerah.
- Native app.
- Validasi offline penuh.
- Program loyalty, ulasan, promosi berbayar, dan prediksi AI.
- Posting otomatis ke sistem keuangan daerah.
- Penjualan tunai/loket, kecuali dikonfirmasi wajib melalui OQ-06.

**Batas penting:** objek wisata yang dipromosikan tidak otomatis berhak dipungut retribusi melalui sistem. Status pengelolaan, dasar tarif, penerima dana, dan kewenangan pemungutan wajib diverifikasi sebelum aktivasi penjualan.

## 4. User Stories

| ID | User story |
|---|---|
| US-01 | Sebagai wisatawan, saya ingin mencari destinasi supaya saya dapat memilih tempat wisata yang sesuai. |
| US-02 | Sebagai wisatawan, saya ingin melihat informasi resmi, tarif, dan jam buka supaya saya dapat merencanakan kunjungan. |
| US-03 | Sebagai wisatawan, saya ingin memilih tanggal, jenis, dan jumlah tiket supaya pesanan sesuai kebutuhan kunjungan. |
| US-04 | Sebagai wisatawan, saya ingin membayar melalui kanal digital supaya transaksi dapat diselesaikan tanpa loket. |
| US-05 | Sebagai wisatawan, saya ingin membuka kembali tiket setelah pembayaran terkonfirmasi supaya saya dapat menunjukkannya di gate. |
| US-06 | Sebagai petugas, saya ingin memindai tiket dan melihat alasan penolakan supaya hanya tiket yang sah diterima. |
| US-07 | Sebagai admin, saya ingin mengelola konten dan versi tarif supaya informasi dan harga dapat dipertanggungjawabkan. |
| US-08 | Sebagai operator keuangan, saya ingin membandingkan pembayaran dan settlement supaya selisih dapat ditindaklanjuti. |
| US-09 | Sebagai pimpinan, saya ingin melihat pengunjung masuk dan penerimaan per destinasi supaya keputusan berbasis data. |
| US-10 | Sebagai auditor berwenang, saya ingin menelusuri tindakan dan perubahan transaksi supaya penyimpangan dapat diperiksa. |

## 5. Daftar Fitur: MVP, v2, dan Nanti

| Fase | Fitur | Batasan |
|---|---|---|
| MVP | Katalog, pencarian, detail destinasi | Konten kurasi admin; hanya lokasi terverifikasi dapat menjual tiket. |
| MVP | Pemesanan dan pembayaran digital | Satu kanal aktif terlebih dahulu; kanal/gateway menunggu keputusan. |
| MVP | QR per tiket dan validasi online | Satu pemesanan dapat berisi banyak tiket individual, bukan satu QR grup. |
| MVP | Akses petugas, admin, dan keuangan | Hak akses per peran dan penugasan lokasi. |
| MVP | Laporan kunjungan, penerimaan, rekonsiliasi | CSV; pencocokan settlement dapat memakai impor file resmi/manual tercatat. |
| MVP | Audit dan pemulihan transaksi | Termasuk penanganan pengecualian pembayaran; bukan refund otomatis. |
| v2 | Loket/tunai, tiket grup, kanal bayar tambahan | Jika tidak menjadi kebutuhan wajib hasil klarifikasi. |
| v2 | Promo/event, ulasan, PDF, integrasi peta interaktif | Informasi alamat/tautan rute tetap tersedia di MVP. |
| v2 | Offline, reschedule, dan refund mandiri | Memerlukan SOP serta mitigasi risiko khusus. |
| Nanti | Integrasi keuangan daerah, loyalty, analitik prediktif | Hanya setelah stabilitas transaksi dan kualitas data terbukti. |

**Keputusan go/no-go:** bila koneksi gate tidak memadai dan offline wajib, baseline ini tidak layak dirilis sebelum desain offline dan kontrol penggunaan ganda disepakati.

## 6. Functional Requirements MVP

### F-01 — Identitas dan Hak Akses

| ID | Requirement / acceptance criteria |
|---|---|
| FR-01 | Akun internal dibuat/diundang admin; petugas hanya boleh memvalidasi lokasi yang ditugaskan. |
| FR-02 | Peran dipisah: admin konten/tarif, petugas gate, keuangan, pembaca laporan, administrator akun. Otorisasi harus diperiksa di server. |
| FR-03 | Sesi dapat dicabut saat akun dinonaktifkan. Password bila digunakan harus disimpan sebagai hash; MFA internal diusulkan wajib. |
| AC-01 | Permintaan API lintas lokasi atau tanpa izin ditolak; penonaktifan akun mengakhiri akses. Metode akses wisatawan diputuskan sebelum implementasi (OQ-05). |

### F-02 — Katalog dan Tarif

| ID | Requirement / acceptance criteria |
|---|---|
| FR-04 | Destinasi memiliki nama, deskripsi, alamat, koordinat opsional, foto, fasilitas, jam operasional, status, serta informasi pengelola. |
| FR-05 | Pencarian nama/lokasi dan filter kategori tersedia; hasil kosong ditampilkan dengan saran menghapus filter. |
| FR-06 | Lokasi ditutup/nonaktif tidak boleh menerima pemesanan baru. Tiket lama masuk penanganan pengecualian sesuai kebijakan. |
| FR-07 | Tarif diberi versi, waktu efektif, referensi dasar tarif, dan petugas pengubah; perubahan tidak mengubah nilai pesanan yang telah dibuat. |
| AC-02 | Pemesanan menggunakan tarif server yang berlaku; pengubahan harga di browser tidak memengaruhi total; riwayat versi tarif dapat ditelusuri. |

### F-03 — Pemesanan

| ID | Requirement / acceptance criteria |
|---|---|
| FR-08 | Pengguna memilih lokasi, tanggal, jenis, dan jumlah tiket. Nilai jumlah harus bilangan bulat positif dan tanggal harus dapat dijual. |
| FR-09 | Sistem menyimpan snapshot harga, rincian retribusi, dan biaya layanan terpisah; nominal uang memakai bilangan bulat rupiah, bukan floating point. |
| FR-10 | Pembuatan pesanan harus idempotent terhadap pengiriman ulang yang sama. Pesanan memiliki nomor unik dan batas pembayaran terkonfigurasi. |
| FR-11 | Status pesanan dipisah dari status pembayaran dan tiket; pesanan belum dibayar tidak menambah pengunjung atau penerimaan. |
| AC-03 | Pengiriman ulang permintaan tidak menghasilkan pesanan ganda; rincian dan total sesuai perhitungan server. Durasi pembayaran dan kuota menunggu OQ-07/OQ-08. |

### F-04 — Pembayaran dan Penerbitan Tiket

| ID | Requirement / acceptance criteria |
|---|---|
| FR-12 | Integrasi penyedia pembayaran harus menggunakan referensi unik; redirect sukses atau screenshot bukan bukti pembayaran. |
| FR-13 | Webhook diverifikasi tanda tangan, referensi, nominal, mata uang, dan status. Event duplikat/out-of-order tidak boleh menggandakan pencatatan. |
| FR-14 | Konfirmasi provider yang sah memicu pencatatan pembayaran dan antrean penerbitan tiket; kegagalan penerbitan harus dapat dicoba ulang tanpa tagihan ulang. |
| FR-15 | Polling status dilakukan bila webhook tertunda. Status gagal/kedaluwarsa lokal tidak boleh menghapus bukti uang yang terlanjur diterima. |
| FR-16 | Pembayaran terlambat, ganda, nominal salah, atau refund dicatat sebagai pengecualian dan ditindaklanjuti sesuai SOP yang disetujui. |
| AC-04 | Webhook identik dikirim berulang tetap menghasilkan satu pembayaran terkonfirmasi dan jumlah tiket sesuai pesanan; pembayaran tidak sah tidak menerbitkan tiket. |

### F-05 — Tiket QR dan Akses Tiket

| ID | Requirement / acceptance criteria |
|---|---|
| FR-17 | **USULAN:** satu QR untuk satu tiket orang; pembelian beberapa tiket menghasilkan beberapa QR. QR memakai token acak yang tidak dapat ditebak tanpa data pribadi terbuka. |
| FR-18 | Tiket menyimpan lokasi dan rentang waktu berlaku. QR tiket masuk dibedakan jelas dari QR pembayaran. |
| FR-19 | Tiket dapat dibuka ulang melalui akun atau tautan akses terlindungi sesuai keputusan identitas. Notifikasi bukan satu-satunya cara memperoleh tiket. |
| AC-05 | Setelah pembayaran terkonfirmasi, pengguna memperoleh seluruh tiket; kegagalan notifikasi tidak menghilangkan akses tiket. Token tidak dicatat mentah pada log publik. |

### F-06 — Validasi Gate dan Pencatatan Kunjungan

| ID | Requirement / acceptance criteria |
|---|---|
| FR-20 | Server memeriksa token, lokasi petugas, pembayaran, status tiket, dan waktu berlaku berdasarkan jam server zona Asia/Jakarta. |
| FR-21 | Perubahan tiket aktif menjadi digunakan dan pembuatan kunjungan harus atomik. Constraint unik mencegah dua kunjungan untuk tiket yang sama. |
| FR-22 | Hasil validasi: `VALID`, `SUDAH_DIGUNAKAN`, `BELUM_BERLAKU`, `KEDALUWARSA`, `SALAH_LOKASI`, `DIBATALKAN`, `TIDAK_DIKENAL`, atau `TIDAK_DAPAT_DIVERIFIKASI`. |
| FR-23 | Saat jaringan terputus, jangan menampilkan `VALID`; tampilkan gagal verifikasi dan SOP bantuan. MVP tidak mengizinkan override masuk tanpa verifikasi. |
| AC-06 | Dua perangkat memindai tiket bersamaan: tepat satu diterima. Pengulangan request setelah respons terputus harus dapat menampilkan hasil transaksi awal tanpa kunjungan baru. |

### F-07 — Laporan dan Rekonsiliasi

| ID | Requirement / acceptance criteria |
|---|---|
| FR-24 | Pisahkan tanggal transaksi, tanggal kunjungan, dan tanggal settlement. Filter lokasi/periode/kanal tersedia sesuai hak akses. |
| FR-25 | Tampilkan tiket dibayar, tiket digunakan, pengunjung masuk, penerimaan bruto, refund berhasil, biaya provider, settlement aktual, dan selisih. Nilai belum tersedia ditandai *belum tersedia*, bukan nol. |
| FR-26 | Gunakan referensi provider/batch untuk mencocokkan penerimaan dengan settlement. Selisih diberi status terbuka, ditelusuri, atau diselesaikan dengan alasan dan pelaksana. |
| FR-27 | Ekspor CSV sesuai filter dan otorisasi; hindari kebocoran data pribadi dan formula injection pada spreadsheet. |
| AC-07 | Dataset uji dengan transaksi sukses, belum bayar, refund, dan settlement tertunda menghasilkan total sesuai sumber; tiket belum digunakan tidak dihitung sebagai pengunjung masuk. |

### F-08 — Audit dan Pemulihan

| ID | Requirement / acceptance criteria |
|---|---|
| FR-28 | Catat aktor, aksi, entitas, waktu, lokasi, correlation ID, serta perubahan sebelum/sesudah untuk tarif, akun, dan tindakan finansial. |
| FR-29 | Aplikasi tidak menyediakan edit/hapus transaksi final dan audit log. Koreksi menggunakan catatan penyesuaian beralasan dan persetujuan pihak berwenang. |
| FR-30 | Sediakan daftar transaksi bermasalah, retry terkontrol, dan jejak tindakan pemulihan. Refund tidak dijalankan sampai SOP dan otorisasi disahkan. |
| AC-08 | Operator tidak dapat mengubah saldo historis tanpa jejak; retry pemulihan tidak menggandakan tiket, pembayaran, atau kunjungan. |

### 6.1 Aturan Status

- **Pesanan:** `MENUNGGU_PEMBAYARAN` → `DIBAYAR` atau `KEDALUWARSA`/`DIBATALKAN`. Pembayaran terlambat setelah kedaluwarsa masuk pengecualian, bukan otomatis diabaikan.
- **Pembayaran:** `PENDING` → `SUCCEEDED`/`FAILED`/`EXPIRED`; refund dicatat terpisah agar riwayat pembayaran asli tetap utuh.
- **Tiket:** `PENDING_ISSUE` → `ACTIVE` → `USED`, `EXPIRED`, atau `CANCELLED`; pembatalan setelah digunakan tidak boleh menjadi jalan penghapusan kunjungan.
- **Settlement:** `UNMATCHED` → `MATCHED` atau `DISPUTED`. Status `DIBAYAR` tidak sama dengan dana telah disetor ke rekening penerima.

### 6.2 Persyaratan Nonfungsional Usulan

| Area | Usulan kriteria | Validasi |
|---|---|---|
| Kinerja | Respons validasi server p95 ≤ 2 detik; pengalaman pindai ke hasil p95 ≤ 5 detik pada jaringan uji yang disepakati. | Load test; jumlah petugas/transaksi serentak masih OQ-11. |
| Keandalan | Target uptime 99,5% bulanan; retry antrean dan alarm transaksi macet. | Definisi downtime dan cakupan provider disepakati sebelum rilis. |
| Keamanan | TLS, secret di penyimpanan aman, rate limiting, pemeriksaan otorisasi, dan akses internal kuat. | Uji akses lintas peran, pemalsuan callback, QR replay; tidak ada temuan kritis/tinggi terbuka. |
| Privasi | Minimalkan identitas; jangan wajibkan NIK/demografi tanpa kebutuhan sah; kebijakan retensi dan pemberitahuan privasi. | Persetujuan pengelola data dan peninjauan kebijakan (OQ-12). |
| Pemulihan | **USULAN** RPO ≤ 24 jam dan RTO ≤ 4 jam; backup terenkripsi dan uji restore. | Rekonsiliasi ulang ke provider setelah restore; target perlu validasi operasional. |
| Aksesibilitas | Antarmuka responsif, bahasa Indonesia, label jelas; hasil scan tidak hanya dibedakan warna. | Uji pada perangkat petugas dan ponsel target. |

### 6.3 Definisi Selesai / Definition of Done

- Scope, lokasi pilot, tarif, penyedia pembayaran, penerima dana, kebijakan penutupan/refund, dan perangkat gate disetujui pemilik berwenang.
- Seluruh acceptance criteria MVP lulus UAT, termasuk scan bersamaan, webhook duplikat, pembayaran terlambat, dan pemulihan penerbitan tiket.
- Uji pembayaran end-to-end dan rekonsiliasi sampai settlement berhasil; sandbox saja tidak cukup untuk go-live.
- Tidak ada defect blocker/critical dan tidak ada temuan keamanan kritis/tinggi yang belum ditangani.
- Dashboard monitoring, backup/restore, panduan petugas, prosedur insiden, dan dukungan operasional siap.
- Jumlah lokasi/transaksi pilot, durasi observasi, dan penandatangan UAT ditentukan sebelum rilis (OQ-13).

## 7. Sketsa Data Model

| Entitas | Field kunci / aturan |
|---|---|
| `User` | `id`, `name`, `contact`, `auth_subject`/`password_hash`, `status`; hanya data minimum. |
| `RoleAssignment` | `user_id`, `role`, `site_id` nullable; mendukung pembatasan lokasi dan pemisahan tugas. |
| `TourismSite` | `id`, `name`, `description`, `address`, `coordinates`, `category`, `opening_hours`, `status`, `manager`, `sales_verified`. |
| `TicketType` | `id`, `site_id`, `name`, `visitor_category`, `status`. |
| `TariffVersion` | `id`, `ticket_type_id`, `amount_idr`, `valid_from`, `valid_until`, `legal_reference`, `approved_by`; riwayat tidak ditimpa. |
| `Order` | `id`, `number` UNIQUE, `user_id` nullable, `access_reference_hash`, `site_id`, `visit_date`, `status`, `subtotal_idr`, `fee_idr`, `total_idr`, `expires_at`, `created_at`, `idempotency_key` UNIQUE. |
| `OrderItem` | `id`, `order_id`, `ticket_type_id`, `tariff_version_id`, `quantity`, `unit_price_snapshot`, `subtotal_idr`. |
| `PaymentAttempt` | `id`, `order_id`, `provider`, `provider_reference` UNIQUE, `expected_amount`, `confirmed_amount`, `status`, `paid_at`. |
| `PaymentEvent` | `id`, `payment_id`, `provider_event_id` UNIQUE, `received_at`, `verified`, `payload_reference`; payload disanitasi dan akses dibatasi. |
| `Ticket` | `id`, `order_item_id`, `token_hash` UNIQUE, `site_id`, `valid_from`, `valid_until`, `status`, `issued_at`, `used_at`; jumlah baris sesuai quantity. |
| `ValidationAttempt` | `id`, `ticket_id` nullable, `actor_id`, `site_id`, `device_id`, `request_id` UNIQUE, `result`, `created_at`. |
| `Visit` | `id`, `ticket_id` UNIQUE, `site_id`, `validated_by`, `entered_at`; satu tiket maksimal satu kunjungan. |
| `SettlementRecord` | `id`, `provider_reference`/`batch`, `paid_amount`, `refund_amount`, `fee_amount`, `net_amount`, `settled_at`, `destination_reference`, `match_status`. |
| `RefundCase` | `id`, `payment_id`, `amount`, `reason`, `status`, `requested_by`, `approved_by`, `provider_ref`, `completed_at`; operasi menunggu SOP. |
| `AuditLog` | `id`, `actor_id`, `action`, `entity_type`, `entity_id`, `before_after_sanitized`, `created_at`, `correlation_id`; append-only lewat aplikasi. |

**Relasi utama:** `TourismSite 1:N TicketType`; `TicketType 1:N TariffVersion`; `Order 1:N OrderItem`; `Order 1:N PaymentAttempt`; `OrderItem 1:N Ticket`; `Ticket 0:1 Visit`; `PaymentAttempt 1:N PaymentEvent`.

Pemetaan settlement dapat dilakukan per transaksi atau per batch sesuai format provider. Laporan diturunkan dari data sumber, bukan tabel snapshot yang menjadi satu-satunya kebenaran.

## 8. Edge Case dan Failure State

| Kasus | Respons wajib |
|---|---|
| Webhook hilang/terlambat | Polling dan antrean retry; tampilkan *menunggu konfirmasi*, bukan gagal pasti. |
| Webhook palsu / nominal salah | Tolak update sukses; simpan bukti tersanitasi dan buka pengecualian. |
| Webhook berulang / urutan terbalik | Deduplicate; jangan menurunkan sukses menjadi pending atau menerbitkan tiket ganda. |
| Uang masuk setelah pesanan kedaluwarsa | Catat uang masuk; tahan penerbitan dan arahkan ke penanganan sesuai kebijakan. Tidak otomatis menghapus dana. |
| Pembayaran ganda | Catat kedua penerimaan; hanya terbitkan jumlah tiket sesuai pesanan; kelebihan masuk kasus penyelesaian/refund. |
| Bayar sukses, tiket gagal terbit | Tampilkan *sedang diproses*; retry idempotent dan alarm operator; pengguna tidak diminta membayar ulang. |
| Dua gate memindai bersamaan | Transaksi atomik: hanya satu penerimaan dan satu kunjungan. |
| Respons scan terputus setelah sukses | Ulangi dengan request ID yang sama untuk memperoleh hasil awal, bukan membuat kunjungan baru. |
| QR salah lokasi / belum berlaku / kedaluwarsa | Tolak dengan alasan spesifik; jangan menambah kunjungan. |
| HP wisatawan mati / tiket hilang | Pencarian bantuan oleh petugas berwenang berdasarkan referensi dan verifikasi sesuai SOP; tidak membuka data ke publik. |
| Jaringan gate mati | Tidak mengklaim tiket valid; SOP eskalasi. Offline/override bukan fitur MVP. |
| Objek ditutup mendadak | Blokir penjualan baru; tampilkan pemberitahuan dan daftar tiket terdampak; reschedule/refund sesuai keputusan berwenang. |
| Kuota berubah / habis saat checkout | Jika kuota diberlakukan, reservasi dan pelepasan harus atomik serta punya TTL; kalau belum siap, jangan klaim kapasitas terjamin. |
| Tarif berubah setelah pesanan dibuat | Harga snapshot pesanan tetap; setelah kedaluwarsa, pembelian baru memakai tarif baru. |
| Settlement belum diterima | Laporkan *belum settlement*, bukan nol penerimaan; selisih umur transaksi dipantau. |
| Refund setelah tiket dipakai | Jangan otomatis menghapus kunjungan; butuh peninjauan dan adjustment terotorisasi. |
| Notifikasi gagal | Tiket tetap bisa diakses; retry notifikasi tanpa menggandakan tiket. |

## 9. Success Metrics

Seluruh angka target di bawah adalah **USULAN** untuk persetujuan, bukan baseline nyata. Ukur baseline pada pilot; jangan menyatakan peningkatan pendapatan disebabkan aplikasi tanpa pembanding musim, tarif, dan jumlah destinasi.

| Metrik | Definisi / sumber | Target usulan |
|---|---|---|
| Pembelian selesai | Pesanan dibayar unik ÷ pesanan eligible yang telah melewati jendela pembayaran; cohort `created_at`. | Tetapkan setelah baseline pilot, bukan angka arbitrer. |
| Keandalan penerbitan | Pesanan dibayar dengan seluruh tiket terbit ≤ 60 detik setelah konfirmasi provider ÷ pesanan dibayar. | ≥ 99% pada pilot. |
| Kecepatan validasi | p95 durasi scan–hasil sukses; pisahkan waktu server dan jaringan/perangkat. | ≤ 5 detik pada jaringan uji yang disepakati. |
| Penggunaan ganda diterima | Jumlah tiket menghasilkan > 1 kunjungan valid dari constraint dan audit. | 0; blocker bila terjadi. |
| Integritas rekonsiliasi | Seluruh penerimaan provider memiliki pasangan atau kasus selisih tercatat. | 100% terlacak; selisih tanpa penjelasan 0 sebelum tutup periode. |
| Keterlambatan penyelesaian selisih | Jumlah kasus selisih lewat SLA berdasarkan tanggal settlement kontraktual provider. | SLA setelah kontrak provider tersedia. |
| Adopsi tiket digital | Tiket digital dibayar ÷ seluruh tiket terjual di lokasi pilot; memerlukan data loket pembanding. | Tetapkan setelah scope tunai dan baseline diputuskan. |
| Kunjungan valid | Jumlah `Visit` unik berdasarkan `entered_at`, bukan jumlah tiket terjual. | Pantau harian; tidak menjanjikan pertumbuhan tanpa baseline. |
| Ketersediaan | Menit layanan siap ÷ menit layanan terjadwal, diukur monitoring eksternal. | 99,5% bulanan, usulan. |
| Kepuasan wisatawan | Rata-rata skor survei pascakunjungan; laporkan jumlah dan response rate. | Target setelah pilot; sampel minimum ditetapkan stakeholder. |

**Definisi finansial:** penerimaan bruto adalah nominal pembayaran yang terkonfirmasi untuk komponen retribusi; biaya layanan dilaporkan terpisah. Refund dan biaya provider tidak boleh disamarkan sebagai penurunan kunjungan. PAD yang diakui dan setoran ke rekening daerah mengikuti kebijakan akuntansi/rekonsiliasi yang disahkan pengelola keuangan, bukan sekadar status pembayaran aplikasi.

## 10. Open Questions

| ID | Pertanyaan keputusan | Pemilik keputusan usulan | Dampak |
|---|---|---|---|
| OQ-01 | Siapa user prioritas, owner produk, pengelola penerimaan, dan penandatangan persetujuan? | Sponsor/OPD terkait | Menentukan tanggung jawab dan hak akses. |
| OQ-02 | Lokasi pilot mana yang resmi dikelola pemda dan berwenang memungut retribusi? | Pengampu wisata & keuangan | Blocker aktivasi penjualan. |
| OQ-03 | Apa tarif, kategori pengunjung, dasar hukum, dan jadwal berlaku yang sah? | Pengelola pendapatan | Blocker konfigurasi harga. |
| OQ-04 | Siapa provider, kanal pembayaran, rekening penerima, biaya, dan SLA settlement? | Keuangan/pengadaan | Blocker pembayaran live. |
| OQ-05 | Apakah login wajib, OTP/password, atau checkout tanpa akun? Bagaimana pemulihan tiket? | Product owner & pengelola data | Menentukan identitas dan biaya notifikasi. |
| OQ-06 | Apakah loket/tunai wajib MVP? Jika ya, siapa pemegang kas, penerima setoran, dan approver koreksi? | Operasional & bendahara | Mengubah scope dan kontrol kas. |
| OQ-07 | Berapa TTL pembayaran dan masa berlaku tiket; boleh masuk ulang atau tidak? | Operasional & provider | Menentukan state dan validasi. |
| OQ-08 | Apakah kuota keras wajib? Berapa kapasitas dan bagaimana reservasi dialokasikan? | Pengelola destinasi | Jika wajib, naik ke MVP dengan kontrol concurrency. |
| OQ-09 | Apakah jaringan/perangkat gate memadai? Apakah offline mutlak wajib? | TI & operasional lokasi | Offline wajib memerlukan desain ulang baseline. |
| OQ-10 | Apa kebijakan refund, pembayaran terlambat, pembayaran ganda, reschedule, dan penutupan? | Keuangan & operasional | Blocker go-live penanganan pengecualian. |
| OQ-11 | Berapa anggaran, jadwal, tim, hosting, beban puncak, dan integrasi wajib? | Sponsor & TI | Menentukan estimasi dan uji beban. |
| OQ-12 | Apa ketentuan privasi, retensi, backup, lokasi data, dan respons insiden? | Pengelola data & TI | Blocker persetujuan operasional. |
| OQ-13 | Berapa lokasi, transaksi, periode pilot, kriteria UAT, dan siapa yang menyatakan selesai? | Product owner & sponsor | Blocker persetujuan rilis final. |

**Prioritas penutupan:** OQ-01 sampai OQ-04 untuk otoritas dan transaksi; OQ-06/OQ-09 untuk kelayakan scope; OQ-10/OQ-12/OQ-13 sebelum go-live. Menjawab sebagian pertanyaan tidak otomatis menjadikan PRD final; seluruh keputusan yang memengaruhi rilis harus disetujui.

## Catatan Referensi dan Batas Klaim

Dokumen ini berisi usulan kebutuhan produk, bukan audit kondisi aktual ataupun pendapat hukum. Detail hukum daerah, tarif, dan status kepemilikan objek wisata belum diverifikasi. Tidak ada destinasi swasta yang otomatis dinyatakan sebagai sumber retribusi pemerintah.

Jika QRIS dipilih, QRIS adalah standar QR Code pembayaran yang ditetapkan Bank Indonesia. QRIS pembayaran tidak sama dengan QR tiket masuk SiWita. Referensi resmi: Bank Indonesia, *Quick Response Code Indonesian Standard (QRIS)*, <https://www.bi.go.id/id/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/qris/default.aspx>. Kanal ini tetap menunggu keputusan OQ-04.
