# SiWita Lamsel — Sistem Informasi Wisata dan Retribusi Digital
**Pemerintah Kabupaten Lampung Selatan**  
*(Dinas Pariwisata & Badan Pengelola Pajak dan Retribusi Daerah - BAPENDA)*

---

## 1. Tentang SiWita Lamsel

**SiWita Lamsel** adalah platform *e-retribusi* dan tiket digital terpadu berbasis web responsif (*mobile-first*) untuk destinasi wisata resmi yang dikelola oleh Pemerintah Kabupaten Lampung Selatan. Sistem ini dirancang untuk:

1. **Meningkatkan Pendapatan Asli Daerah (PAD):** Menghilangkan kebocoran retribusi dengan pembayaran nontunai (*cashless*) yang langsung tercatat dan terekonsiliasi ke Kas Daerah.
2. **Kemudahan Wisatawan:** Membeli tiket resmi kapan saja tanpa antre loket, menerima e-tiket dengan QR Code instan di ponsel.
3. **Kecepatan Validasi Gate:** Pemindai berbasis kamera (*Gate Scanner*) yang memverifikasi tiket dalam waktu di bawah 5 detik dengan pencegahan penggunaan ganda (*anti double-entry*).

---

## 2. Fitur Utama

### 🌟 Modul Wisatawan:
- **Katalog Wisata:** Pencarian nama/lokasi, filter kategori (*Pantai*, *Alam*, *Budaya*, *Keluarga*), status operasional (BUKA/TUTUP), dan jam buka.
- **Detail Destinasi:** Galeri, fasilitas umum, deskripsi daya tarik, dan tabel tarif resmi Perda No. 1/2024.
- **Formulir Tiket:** Pemilihan tanggal kunjungan, *stepper* jumlah tiket per kategori (*Dewasa*, *Anak-anak*, *Pelajar*), dan kalkulasi otomatis retribusi + biaya layanan sistem (Rp 2.000).
- **Simulasi Pembayaran (Mock Gateway):** Pilihan metode QRIS dinamis, E-Wallet (DANA, GoPay, OVO), dan Virtual Account Bank Lampung dengan tombol simulasi "Bayar Berhasil" atau "Bayar Gagal".
- **E-Tiket Digital QR:** Tiket elektronik individual dengan nomor tiket unik, QR Code beresolusi tinggi, informasi kunjungan, dan fitur cetak/unduh.
- **Tiket Saya:** Riwayat dan pengelolaan seluruh tiket yang telah dipesan.

### 🛡️ Modul Petugas Lapangan ("SiWita Gate Scanner"):
- **Akses Cepat:** URL langsung di `/gate`.
- **Selektor Pos Gerbang:** Memilih objek wisata tempat petugas berjaga.
- **Pemindai Kamera & Input Manual:** Pemindaian kamera langsung via `html5-qrcode` atau input manual kode tiket.
- **Validasi Server Atomik:** Mencegah tiket yang sama dipakai dua kali atau pemindaian bersamaan (*race condition*).
- **5 Status Respon Audio-Visual:**
  1. `VALID` (Hijau) — Akses diberikan, nada sukses.
  2. `SUDAH DIGUNAKAN` (Kuning/Oranye) — Tiket pernah discan sebelumnya (disertai waktu scan).
  3. `KEDALUWARSA` (Merah) — Tanggal kunjungan telah lewat.
  4. `SALAH LOKASI` (Ungu) — Tiket dibeli untuk objek wisata berbeda.
  5. `TIDAK DIKENAL` (Abu-abu gelap) — Kode QR palsu / tidak terdaftar.
- **Riwayat Sesi:** Daftar scan petugas per sesi kerja.

### 📊 Modul Admin (BAPENDA / Dinas Pariwisata):
- **Ringkasan KPI:** Pengunjung Masuk Hari Ini, Total Tiket Terjual, Penerimaan Bruto PAD (Rp), Settlement Kasda.
- **Grafik Tren & Analitik:** Grafik tren kunjungan 7 hari dan kontribusi retribusi per objek wisata.
- **Tabel Transaksi Terpadu:** Pemantauan status transaksi, metode pembayaran, dan rincian pemesan.
- **Kelola Objek Wisata & Tarif:** Toggle status Buka/Tutup seketika dan penyesuaian tarif tiket dengan pencatatan versi tarif baru.
- **Log Gate Scanner:** Catatan pemindaian pintu masuk secara *real-time*.
- **Ekspor Laporan (CSV):** Unduhan berkas CSV berstandar aman dari *formula injection*.
- **Jejak Audit (Audit Trail):** Rekam jejak *append-only* atas seluruh tindakan administratif dan finansial.

---

## 3. Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions & Route Handlers, TypeScript)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) dengan palet GovTech resmi:
  - Utama: `#1F4E79` (Deep Blue)
  - Header Dark: `#163A5C`
  - Aksen: `#2980B9`
  - Sukses: `#2E7D32`
  - Peringatan: `#F9A825`
  - Bahaya: `#C62828`
- **Database & ORM:** SQLite (`prisma/dev.db`) + [Prisma ORM](https://www.prisma.io/) (100% lokal, tanpa akun eksternal)
- **QR Code:** `qrcode` (penerbitan e-tiket) dan `html5-qrcode` (kamera scanner)
- **Icons:** `lucide-react`
- **Audio:** Web Audio API sintetis (tanpa file mp3 eksternal)

---

## 4. Akun Demo untuk Pengujian

Aplikasi telah dilengkapi data awal (*seeder*) dengan 3 akun contoh dan fitur **Quick Role Switcher** di bilah navigasi atas (1-Klik untuk berganti peran):

| Peran | Nama Akun | Email | Kata Sandi | Keterangan |
|---|---|---|---|---|
| **Wisatawan** | Budi Santoso | `wisatawan@siwita.id` | `password123` | Membeli tiket, bayar, simpan tiket QR |
| **Petugas Gate** | Ahmad Yani | `petugas@siwita.id` | `password123` | Menjaga Gate Pantai Pasir Putih |
| **Admin BAPENDA** | Siti Rahma, S.E. | `admin@siwita.id` | `password123` | Pantau PAD, kelola tarif & objek |

---

## 5. Destinasi Binaan Lampung Selatan (Seed Data)

1. **Pantai Pasir Putih Lampung** (Katibung) — Tiket Dewasa: Rp 15.000 / Anak: Rp 10.000 / Pelajar: Rp 12.000
2. **Menara Siger Bakauheni** (Bakauheni) — Tiket Dewasa: Rp 10.000 / Anak: Rp 5.000 / Pelajar: Rp 7.000
3. **Pantai Kedu Warna Kalianda** (Kalianda) — Tiket Dewasa: Rp 12.000 / Anak: Rp 8.000 / Pelajar: Rp 10.000
4. **Air Terjun Way Lalaan** (Penengahan) — Tiket Dewasa: Rp 10.000 / Anak: Rp 5.000 / Pelajar: Rp 7.000
5. **Pemandian Air Panas Way Belerang** (Kalianda) — Tiket Dewasa: Rp 15.000 / Anak: Rp 10.000 / Pelajar: Rp 12.000

---

## 6. Cara Instalasi & Menjalankan Lokal

### Prasyarat
- Node.js versi 18+ atau 20+ (Node LTS)
- npm versi 9+

### Langkah Menjalankan:
```bash
# 1. Clone atau masuk ke direktori proyek
cd c:\Users\ASUS\Downloads\siwita-lamsel

# 2. Pasang dependensi
npm install

# 3. Sinkronisasi database SQLite
npx prisma db push

# 4. Muat data awal (5 Destinasi, 3 Akun, Dummy Transaksi)
node prisma/seed.js

# 5. Jalankan server pengembangan
npm run dev
```

Buka peramban (*browser*) Anda di:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 7. Panduan Pengujian Step-by-Step

### Skenario 1: Alur Pemesanan Wisatawan
1. Buka `http://localhost:3000` (Katalog Wisata).
2. Gunakan fitur pencarian (misal ketik `Pasir Putih` atau pilih chip `Pantai`).
3. Klik **Lihat Detail** untuk melihat info dan tarif resmi Perda.
4. Klik **Beli Tiket Sekarang** untuk membuka formulir pemesanan.
5. Tentukan tanggal kunjungan dan atur jumlah tiket (*Dewasa* / *Anak*).
6. Klik **Lanjut ke Pembayaran**.
7. Pada layar pembayaran, Anda dapat melihat QRIS dinamis dan hitung mundur 15 menit.
8. Klik tombol hijau **Simulasi Bayar Berhasil (Lunas)**.
9. Anda langsung diarahkan ke layar **E-Tiket Digital**. QR Code individual diterbitkan lengkap dengan nomor tiket unik.
10. Klik tombol **Buka Scanner Gate dengan Kode Ini** untuk menguji tiket tersebut.

### Skenario 2: Alur Pemindai Petugas Gate (`/gate`)
1. Buka `http://localhost:3000/gate`.
2. Pastikan pos gerbang terpilih adalah **Pantai Pasir Putih Lampung**.
3. Pada panel **Input Manual Kode Tiket**, klik tombol pintas:
   - **1. Tiket Valid:** Menampilkan status `VALID` (Hijau), bunyi nada sukses, tiket berubah menjadi terpakai.
   - **2. Sudah Dipakai:** Coba masukkan kembali kode tiket di atas atau klik preset tombol kuning `Sudah Dipakai`. Muncul status `SUDAH DIGUNAKAN` (Kuning) dengan keterangan jam scan sebelumnya.
   - **3. Kedaluwarsa:** Klik tombol merah `Kedaluwarsa`. Muncul status `KEDALUWARSA` (Merah).
   - **4. Salah Lokasi:** Klik tombol ungu `Salah Lokasi` (tiket Menara Siger). Muncul status `SALAH LOKASI` (Ungu).
   - **5. Tidak Dikenal:** Klik tombol abu-abu `Tidak Dikenal`. Muncul status `TIDAK DIKENAL`.
4. Anda juga dapat menguji kamera fisik dengan mengklik **Aktifkan Kamera** dan mengarahkan ke layar ponsel/cetakan QR.

### Skenario 3: Alur Admin BAPENDA (`/admin`)
1. Buka `http://localhost:3000/admin`.
2. Di bagian atas, periksa angka **Pengunjung Masuk**, **Total Tiket Terjual**, dan **Penerimaan Bruto (PAD)**.
3. Perhatikan grafik tren kunjungan 7 hari dan distribusi retribusi per objek wisata.
4. Buka tab **Objek Wisata & Tarif**:
   - Coba klik tombol toggle **BUKA/TUTUP** pada salah satu destinasi.
   - Klik ikon pensil untuk mengubah tarif (misal tiket Dewasa disesuaikan), lalu klik simpan.
5. Buka tab **Transaksi Retribusi**: Anda dapat menyaring status `DIBAYAR` atau mencari berdasarkan Order ID.
6. Buka tab **Log Gate Masuk**: Melihat seluruh aktivitas pemindaian yang baru saja Anda lakukan di gate.
7. Buka tab **Jejak Audit**: Melihat catatan perubahan tarif dan sistem.
8. Klik tombol hijau **Ekspor Laporan (CSV)** di kanan atas untuk mengunduh rekapitulasi data.

---

## 8. Struktur Direktori Proyek

```
siwita-lamsel/
├── docs/                                # Dokumen PRD v1.1 & Spesifikasi Desain Google Stitch
├── prisma/
│   ├── schema.prisma                    # Definisi model database SQLite
│   ├── seed.js                          # Script data awal 5 destinasi, 3 akun, & transaksi
│   └── dev.db                           # File database SQLite lokal
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── export/route.ts      # Ekspor data CSV aman formula injection
│   │   │   │   ├── site/tariff/route.ts # Penyesuaian tarif berversi
│   │   │   │   ├── site/toggle/route.ts # Toggle status Buka/Tutup
│   │   │   │   └── stats/route.ts       # Agregasi data KPI & analitik
│   │   │   ├── gate/validate/route.ts   # Validasi scan atomik anti double-use
│   │   │   ├── orders/route.ts          # Pembuatan pesanan retribusi
│   │   │   ├── payment/mock/route.ts    # Simulasi pembayaran gateway
│   │   │   └── health/route.ts          # Status koneksi database
│   │   ├── admin/page.tsx               # Halaman Dashboard Admin BAPENDA
│   │   ├── booking/[slug]/page.tsx      # Formulir retribusi & jumlah tiket
│   │   ├── destinasi/[slug]/page.tsx    # Halaman detail objek wisata & tarif
│   │   ├── gate/page.tsx                # Halaman SiWita Gate Scanner
│   │   ├── my-tickets/page.tsx          # Halaman daftar e-tiket wisatawan
│   │   ├── payment/[orderId]/page.tsx   # Layar pembayaran (QRIS/VA) & simulasi
│   │   ├── ticket/[orderId]/page.tsx    # Layar e-tiket digital QR Code
│   │   ├── layout.tsx                   # Layout global, header govtech & footer
│   │   ├── page.tsx                     # Beranda katalog destinasi
│   │   └── globals.css                  # Konfigurasi Tailwind & warna GovTech
│   ├── components/
│   │   ├── AdminDashboardView.tsx       # Tampilan analitik, tabel, & manajemen tarif
│   │   ├── BookingForm.tsx              # Komponen formulir pemesanan interaktif
│   │   ├── DestinationCatalog.tsx       # Katalog dengan filter kategori & search
│   │   ├── Footer.tsx                   # Footer resmi Pemkab Lampung Selatan
│   │   ├── GateScannerView.tsx          # Pemindai kamera html5-qrcode & audio-visual
│   │   ├── MyTicketsView.tsx            # Daftar tiket wisatawan
│   │   ├── Navbar.tsx                   # Top bar info pemerintah & 1-click role switcher
│   │   ├── PaymentView.tsx              # Layar countdown timer & sandbox payment
│   │   └── TicketDetailView.tsx         # Tampilan tiket QR kupon retribusi
│   └── lib/
│       ├── audio-cue.ts                 # Web Audio API sintetis (nada valid/error)
│       ├── auth-context.tsx             # Manajemen sesi & role switcher 3 akun
│       ├── prisma.ts                    # Prisma Client singleton
│       ├── qr.ts                        # Pembuatan QR data URL via library qrcode
│       └── types.ts                     # Definisi TypeScript
├── package.json
├── tailwind.config.ts                   # Konfigurasi palet warna resmi Pemkab
└── tsconfig.json
```

---
*Dibuat untuk Pemerintah Kabupaten Lampung Selatan — Mendukung Digitalisasi Retribusi Daerah Menuju Tata Kelola Transparan dan PAD Mandiri.*
