# KasMinggu - Aplikasi Pencatat Kas Mingguan Sederhana

> Aplikasi pencatatan dan rekapan kas mingguan cepat (Rp 5.000 per minggu) dengan visualisasi grafik pemasukan interaktif serta ekspor instan ke format CSV standar RFC 4180.

---

## 🚀 Fitur Utama

1. **Quick Input Kas (< 5 Detik):**
   - Modal input di desktop dan floating action button (FAB) di mobile.
   - Pilihan multi-minggu dengan kalkulasi nominal otomatis (1 minggu = Rp 5.000, 2 minggu = Rp 10.000, dst.).
   - Tanggal bayar dan minggu kalender otomatis terisi (default).
2. **Visualisasi Grafik Mingguan (`graphify`):**
   - Grafik batang Recharts interaktif skala mingguan (W1 s/d W5).
   - Tooltip menampilkan total kas terkumpul, jumlah transaksi penyetor, dan persentase target.
   - Klik batang grafik untuk memfilter tabel transaksi per minggu.
3. **Rekapan Data & Filter Fleksibel:**
   - Filter segmented "Semua Minggu", "Minggu 1" s/d "Minggu 5".
   - Dropdown filter per bulan dan tahun.
   - Pencarian instan berdasarkan nama penyetor atau catatan.
4. **Ekspor File CSV Standar (RFC 4180):**
   - Tombol unduh CSV instan berstandar UTF-8 BOM yang langsung dapat dibuka dan diedit di Microsoft Excel, LibreOffice, maupun Google Sheets.
   - Format kolom baku: `No`, `Nama`, `Tanggal Bayar` (DD/MM/YYYY), `Minggu ke-`, `Jumlah Bayar`.
5. **Master Data Anggota (`/anggota`):**
   - Pengelolaan daftar nama anggota kas, kontak, catatan, dan status aktif/nonaktif.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui Design System + Lucide Icons
- **Database & ORM:** MySQL 8.0 + Prisma ORM 6.4
- **Charts:** Recharts (SVG Responsive Container)
- **Containerization:** Docker multi-stage build + `docker-compose.yml`

---

## 💻 Panduan Menjalankan Aplikasi

### Opsi A: Menjalankan Secara Lokal (Laragon / Local MySQL)

1. **Pastikan MySQL aktif:**
   Buat database bernama `catatan_kas` di MySQL lokal Anda.
2. **Setup Konfigurasi Environment:**
   Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Pastikan variabel `DATABASE_URL` sesuai, contoh:
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/catatan_kas"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```
3. **Sinkronisasi Skema Database & Jalankan Seeder:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
4. **Jalankan Server Pengembangan (Dev):**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser.

---

### Opsi B: Menjalankan Menggunakan Docker Compose

1. **Pastikan Docker Desktop aktif di sistem Anda.**
2. **Build dan jalankan seluruh container:**
   ```bash
   docker compose up --build -d
   ```
3. Container Next.js (`app`) dan MySQL 8.0 (`db`) akan berjalan otomatis secara terisolasi.
4. Akses aplikasi melalui [http://localhost:3000](http://localhost:3000).

---

## 🧪 Pengujian Otomatis

Untuk menjalankan automated test suite (validasi Zod, kalkulasi nominal Rp 5.000 kelipatan, agregasi grafik 0% selisih, dan format CSV):
```bash
npx tsx scripts/test-runner.ts
```
Hasil test suite: **13 PASSED, 0 FAILED**.
