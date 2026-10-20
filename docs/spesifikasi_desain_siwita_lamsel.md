# Spesifikasi Desain & Arsitektur Sistem: SiWita Lamsel

**Sistem Informasi & Retribusi Wisata Digital Kabupaten Lampung Selatan**

## 1. Ringkasan Proyek

**SiWita Lamsel** adalah aplikasi web responsif berpendekatan *mobile-first* yang dirancang sebagai platform e-retribusi dan tiket digital terpadu untuk destinasi wisata yang dikelola oleh Pemerintah Kabupaten Lampung Selatan (Dinas Pariwisata & BAPENDA).

### Tujuan Utama:

1. **Masyarakat & Wisatawan:** Kemudahan mencari destinasi, memesan tiket retribusi secara digital, dan melakukan pembayaran online (*cashless*) tanpa perlu mengantre.

2. **Petugas Gate/Lapangan:** Mempercepat validasi tiket elektronik di pintu masuk objek wisata dalam waktu di bawah 5 detik.

3. **Pemerintah Daerah (Admin/BAPENDA):** Menjamin transparansi Pendapatan Asli Daerah (PAD) melalui rekonsiliasi otomatis dan laporan *real-time*.

## 2. Sistem Desain (Design System & Brand Identity)

Aplikasi mengadopsi gaya **GovTech Modern & Terpercaya**, menggabungkan kejelasan informasi, estetika bersih, serta standar aksesibilitas tinggi.

### 2.1 Palet Warna Utama

* **Primary (Deep Blue):** `#1F4E79` (Header, Tombol Utama, Identitas Pemkab Lamsel)

* **Header Deep Dark:** `#163A5C` (Latar belakang top app bar)

* **Accent Blue:** `#2980B9` (Elemen interaktif, ikon, & tautan)

* **Success Green:** `#2E7D32` (Status Valid, Lunas, Buka)

* **Warning Yellow:** `#F9A825` (Status Terpakai, Menunggu Bayar)

* **Danger Red:** `#C62828` (Status Kedaluwarsa, Gagal, Batal)

* **Background:** `#F8FAFC` / Soft Light Gray

### 2.2 Tipografi & Kartu

* **Font Family:** `Inter`, Sans-Serif

* **Bentuk Kartu:** *Rounded Corner* (`border-radius: 12px - 16px`) dengan *Soft Elevation Shadows*.

* **Bahasa UI:** Bahasa Indonesia Baku & Komunikatif.

## 3. Arsitektur Layar & Alur Pengguna (User Flow)

### 3.1 Alur Utama Wisatawan

```
[Beranda / Katalog] ──► [Detail Wisata] ──► [Formulir Tiket] ──► [Pembayaran QRIS] ──► [Tiket Digital QR]

```

### 3.2 Alur Petugas Gate

```
[Buka Gate Scanner] ──► [Pilih Lokasi Gate] ──► [Arahkan Kamera / Scan QR] ──► [Hasil Validasi (<5s)]

```

## 4. Spesifikasi Layar (Screen Specifications)

### Layar 1: Home / Destination Catalog

* **Top App Bar:** Branding "SiWita Lamsel", tombol akses cepat Gate Scanner & Admin.

* **Banner Resmi GovTech:** Informasi e-Retribusi resmi Kabupaten Lampung Selatan.

* **Search & Filter:** Input pencarian interaktif dan *Category Chips* (Semua, Pantai, Alam, Keluarga, Budaya).

* **Kartu Destinasi:**

  * Foto thumbnail lokasi.

  * Tag kategori & badge status operasional (BUKA/TUTUP).

  * Nama destinasi, alamat/lokasi, & jam operasional.

  * Tarif mulai dari (Rupiah).

  * Tombol aksi: "Lihat Detail" & "Beli Tiket".

### Layar 2: Destination Detail

* **Header Navigasi:** Tombol kembali, bagikan (*share*), dan favorit.

* **Hero Image:** Foto lokasi berukuran besar dengan hamparan status operasional.

* **Badges Informasi:** Jam buka, batas tarif terendah, dan identitas pengelola (Pemkab Lamsel).

* **Konten Detail:** Deskripsi lokasi, daftar fasilitas umum (parkir, toilet, mushola, kantin), serta tabel tarif retribusi resmi Perda.

* **Sticky Bottom Bar:** Ringkasan harga & tombol aksi utama "Beli Tiket Sekarang".

### Layar 3: Ticket Purchase (Formulir Retribusi)

* **Ringkasan Destinasi:** Nama lokasi & kecamatan.

* **Date Picker:** Pemilihan tanggal kunjungan.

* **Pilih Jenis Tiket (Stepper Quantity):**

  * Dewasa / Umum

  * Anak-anak (3-10 thn)

  * Pelajar / Mahasiswa

* **Rincian Pembayaran:** Subtotal tiket + Biaya Layanan Sistem (Rp 2.000) = Total Pembayaran.

* **CTA Utama:** "Lanjut Pembayaran".

### Layar 4: Payment Screen

* **Penghitung Waktu (Countdown Timer):** Waktu mundur batas pembayaran (15 menit).

* **Ringkasan Pesanan:** Nomor Order (`SWT-YYYYMMDD-XXXX`), nama destinasi, & total nominal.

* **Metode Pembayaran:** QRIS (Default), E-Wallet (GoPay, DANA, OVO), & Virtual Account Bank Lampung.

* **Simulasi Status:** Tombol pengujian cepat "Simulasi Bayar Berhasil" dan "Simulasi Pembayaran Gagal".

### Layar 5: Digital Ticket with QR Code

* **Header Tiket:** Badge Resmi E-Retribusi PAD Lampung Selatan.

* **Area Utama QR Code:** Kode QR besar terpusat untuk pemindaian gate.

* **Informasi Tiket:**

  * Nomor Tiket & Nomor Order.

  * Tanggal Berlaku.

  * Rincian Pengunjung (Jumlah Dewasa/Anak).

  * Status Tiket: **AKTIF**.

* **Instruksi & Catatan:** "Tunjukkan QR Code kepada petugas" dan "Tiket hanya dapat digunakan 1 kali."

### Layar 6: Staff Gate Scanner (Petugas Lapangan)

* **Selektor Gate:** Pilihan lokasi objek wisata tempat petugas bertugas.

* **Kamera Scanner Simulator:** Area pemindaian dengan animasi *scanline* bergerak.

* **Kartu Hasil Validasi:**
  Didesain dengan teks tebal dan kombinasi warna untuk validasi cepat (< 5 detik):

  1. `VALID` (Hijau) - Akses Diberikan.

  2. `SUDAH DIGUNAKAN` (Kuning/Oranye) - Tiket Pernah Discan.

  3. `KEDALUWARSA` (Merah) - Tanggal Kunjungan Lewat.

  4. `SALAH LOKASI` (Ungu) - Beda Destinasi Wisata.

  5. `TIDAK DIKENAL` (Abu-abu) - Kode QR Tidak Terdaftar.

### Layar 7: Admin Dashboard (BAPENDA / Dinas Pariwisata)

* **Sidebar / Navigasi Admin:** Dashboard, Objek Wisata, Jenis Tiket & Tarif, Pengguna, Laporan Kunjungan, Laporan Pendapatan, Rekonsiliasi, Audit Log.

* **Kartu KPI:** Pengunjung hari ini, Tiket terjual, Penerimaan bruto (PAD), dan Settlement Kasda.

* **Grafik Analitik (Chart.js):**

  1. Tren Kunjungan Wisatawan (7 Hari Terakhir).

  2. Pendapatan Retribusi per Destinasi Wisata (Rp).

* **Tabel Transaksi Terbaru:** Real-time log transaksi mencakup Order ID, Destinasi, Nominal, Metode Pembayaran, Status Bayar, dan Status Gate.

## 5. Fitur Aksesibilitas & Keamanan

1. **Aksesibilitas Tanpa Ketergantungan Warna:** Setiap indikator status wajib menyertakan teks label eksplisit dan ikon penjelas.

2. **Keamanan Single-Use Tiket:** Tiket bertanda unik dan otomatis berubah status menjadi "SUDAH DIGUNAKAN" setelah 1 kali scan di pintu gate.