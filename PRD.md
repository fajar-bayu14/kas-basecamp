# Product Requirements Document (PRD)

> **Tipe Dokumen:** Web Application / Mini Dashboard  
> **Versi Template:** 2.0  
> **Status Dokumen:** Approved / Ready for Development  
> **Tanggal Pembuatan:** 05-09-2026  
> **Target Rilis:** v1.0

---

# SECTION 1: Product Overview & Problem Statement

### 1.1 Identitas & Kategori Produk

- **Nama Produk / Website:** KasMinggu (Aplikasi Pencatat Kas Mingguan Sederhana)
- **Tipe Proyek:** `[x]` Web Application & Dashboard
- **Tagline / Elevator Pitch:** Aplikasi pencatatan dan rekapan kas mingguan cepat dengan visualisasi grafik pemasukan serta ekspor instan ke format CSV standar.

### 1.2 Problem Statement (Masalah yang Diselesaikan)

- **Konteks Masalah:** Bendahara atau pengelola kas (organisasi, kelas, komunitas, atau tim) kesulitan merekap iuran kas mingguan bernilai tetap (Rp 5.000) jika masih menggunakan pembukuan manual di kertas atau chat WhatsApp. Masalah yang sering timbul adalah lupa mencatat minggu pembayaran, sulit mengecek siapa yang menunggak, serta kerepotan memindahkan data ke spreadsheet saat akhir bulan.
- **Data Pendukung / Validasi:**
  - Rekap kas manual rentan human error (salah hitung nominal dan status minggu terlewat).
  - Pengurus kas membutuhkan rata-rata 15–30 menit per akhir pekan hanya untuk menyalin log pembayaran ke lembar laporan.

### 1.3 Solusi yang Ditawarkan

- Antarmuka pencatatan cepat per anggota: cukup pilih nama dan minggu target, nominal default langsung terisi Rp 5.000 (dapat kelipatan jika bayar beberapa minggu).
- Filter rekapan fleksibel berdasarkan rentang 1 minggu maupun 1 bulan kalender.
- Ekspor file CSV standar (RFC 4180) dengan format kolom baku.
- Visualisasi grafik tren pemasukan mingguan untuk memantau performa ketercapaian target kas.

---

# SECTION 2: Goals & Success Metrics (KPI)

| ID       | Kategori / Tujuan        | Metrik Terukur (Target KPI)                                         | Berlaku Untuk |
| :------- | :----------------------- | :------------------------------------------------------------------ | :------------ |
| **G-01** | **Product Usability**    | Waktu pencatatan per transaksi < 5 detik via mobile/desktop.        | Web App       |
| **G-02** | **Reporting Efficiency** | Ekspor rekapan CSV selesai dalam 1 kali klik (< 1 detik).           | Web App       |
| **G-03** | **Data Accuracy**        | 0% selisih antara total nominal di grafik dengan data mentah tabel. | Web App       |
| **G-04** | **Technical Speed**      | Dashboard interaktif termuat penuh < 1.5 detik.                     | Web App       |

---

# SECTION 3: Target Users & Audience Personas

### Persona 1: Bendahara / Pengelola Kas (Primary User)

- **Demografi / Role:** Usia 18–35 tahun, Bendahara Kelas, Paguyuban, Tim RT/Komunitas, atau Organisasi Mahasiswa.
- **Kebutuhan Utama:** Input cepat uang kas Rp 5.000 per minggu, melihat total uang terkumpul bulan ini, memantau siapa yang belum bayar minggu tertentu, dan mengunduh rekapan data ke CSV.
- **Pain Point:** Ribet jika harus mengetik nama dan format berulang di spreadsheet ponsel; butuh tombol cepat dan grafik yang langsung kelihatan.

### Persona 2: Anggota / Stakeholder (Viewer / Secondary User)

- **Demografi / Role:** Anggota komunitas / kas.
- **Kebutuhan Utama:** Transparansi status pembayaran kas dan grafik tren kas yang jelas.

---

# SECTION 4: Architecture, Sitemap & Page Flow

### 4.1 Sitemap / Navigasi Hierarki

```text
[Dashboard KasMinggu]
├── / (Dashboard Utama)
│   ├── Ringkasan Kartu (Total Kas Masuk Minggu Ini, Bulan Ini, Total Anggota Lunas)
│   ├── Widget Grafik Pemasukan Mingguan (Bar/Line Chart)
│   ├── Quick Action: [Tombol Input Kas Cepat]
│   └── Tabel Rekapan Transaksi Kas (Filter: Mingguan / Bulanan)
│       └── Tombol Action: [Unduh Rekap CSV]
├── /anggota (Master Data Nama Anggota Kas)
└── /riwayat (Log Transaksi Keseluruhan)
```

### 4.2 User Flow Pencatatan Kas

1. **Buka Aplikasi** → Muncul Ringkasan Kas & Grafik Pemasukan.
2. **Klik "Input Kas"** → Pilih Nama Anggota → Pilih Minggu Ke- & Bulan (Nominal auto: Rp 5.000) → Klik Simpan.
3. **Pembaruan Data Otomatis** → Data masuk ke tabel rekapan, grafik mingguan ter-update secara real-time.
4. **Ekspor** → Pilih filter periode (misal: "Bulan September 2026") → Klik "Unduh Rekap CSV".

---

# SECTION 5: User Stories

| ID        | Prioritas | Tipe Website | User Story                                                                                                                                                                                            |
| :-------- | :-------- | :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **US-01** | P1        | Web App      | Sebagai _bendahara_, saya ingin mencatat setoran kas Rp 5.000 per anggota per minggu agar pencatatan tersimpan rapi tanpa perlu input manual berulang.                                                |
| **US-02** | P1        | Web App      | Sebagai _bendahara_, saya ingin melihat grafik pemasukan mingguan agar saya tahu apakah target iuran per minggu tercapai.                                                                             |
| **US-03** | P1        | Web App      | Sebagai _bendahara_, saya ingin memfilter rekapan per 1 minggu atau 1 bulan agar mempermudah evaluasi berkala.                                                                                        |
| **US-04** | P1        | Web App      | Sebagai _bendahara_, saya ingin mengunduh file CSV dengan format kolom baku (`no`, `nama`, `tanggal bayar`, `minggu ke-`, `jumlah bayar`) agar laporan resmi siap dibuka di Excel / spreadsheet.     |
| **US-05** | P2        | Web App      | Sebagai _bendahara_, saya ingin mengelola master nama anggota agar saat input kas cukup memilih lewat dropdown.                                                                                       |

---

# SECTION 6: Functional Requirements

### 6.1 Modul Manajemen Data Kas (CRUD Core)

| ID            | Kebutuhan Fungsional     | Deskripsi & Validasi                                                                                                                                                                               | Pri |
| :------------ | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-- |
| **FR-KAS-01** | Form Input Kas           | Form input terdiri dari: Nama (dropdown master/input), Tanggal Bayar (default: tanggal hari ini), Pilihan Minggu ke- (1–5), Jumlah Bayar (default Rp 5.000, kelipatan 5.000 jika bayar >1 minggu). | P1  |
| **FR-KAS-02** | Rekapan & Filter Periode | Tabel menampilkan riwayat bayar dengan opsi filter toggle: "Minggu Ini", "Bulan Ini", atau custom dropdown Bulan/Tahun.                                                                            | P1  |
| **FR-KAS-03** | Master Data Anggota      | Halaman sederhana untuk menambah, mengedit, dan menonaktifkan nama-nama anggota kas.                                                                                                               | P2  |

### 6.2 Modul Visualisasi Grafik & Ekspor

| ID            | Kebutuhan Fungsional        | Deskripsi & Validasi                                                                                                                                                                                                                                                                                     | Pri |
| :------------ | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-- |
| **FR-RPT-01** | Grafik Pemasukan Mingguan   | Komponen Bar/Column Chart interaktif: Sumbu X = Minggu (W1, W2, W3, W4, dst.), Sumbu Y = Nominal Terkumpul (Rp). Tooltip menampilkan jumlah transaksi dan total uang.                                                                                                                                    | P1  |
| **FR-RPT-02** | Unduh CSV (RFC 4180)        | Fitur ekspor data tabel terpilih langsung menjadi file `.csv` terstruktur berstandar RFC 4180 dengan UTF-8 BOM agar langsung kompatibel di Microsoft Excel dan Google Sheets.                                                                                                                           | P1  |
| **FR-RPT-03** | Standarisasi Format Ekspor  | Format output CSV wajib mengikuti skema kolom berurutan: <br>1. `No` (Auto increment integer) <br>2. `Nama` (String) <br>3. `Tanggal Bayar` (Format `YYYY-MM-DD` atau `DD/MM/YYYY`) <br>4. `Minggu ke-` (Contoh: "Minggu 1", "Minggu 2") <br>5. `Jumlah Bayar` (Integer currency, misal: 5000)     | P1  |

---

# SECTION 7: Non-Functional Requirements

| ID         | Aspek Teknis                    | Spesifikasi / Target Standar                                                                                                        | Pri | Berlaku Untuk |
| :--------- | :------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------- | :-- | :------------ |
| **NFR-01** | **Mobile First Responsiveness** | Tampilan tabel dan form harus nyaman digunakan di layar smartphone (360px–420px) karena bendahara sering mencatat via HP di tempat. | P1  | Web App       |
| **NFR-02** | **Kecepatan Render Grafik**     | Grafik chart ter-render < 300ms setelah data tabel diperbarui.                                                                      | P1  | Web App       |
| **NFR-03** | **Kompatibilitas File Ekspor**  | File CSV yang diunduh langsung dapat dibuka dengan rapi di Microsoft Excel, Google Sheets, dan LibreOffice tanpa error encoding.   | P1  | Backend / API |

---

# SECTION 8: Scope of Release (In Scope vs Out of Scope)

### 8.1 In Scope (v1.0)

- Form input kas dengan nilai baku Rp 5.000 per minggu.
- Tabel rekapan data kas dengan filter per minggu dan per bulan.
- Visualisasi grafik batang pemasukan skala mingguan.
- Ekspor ke format CSV berstandar dengan kolom: `no`, `nama`, `tanggal bayar`, `minggu ke-`, `jumlah bayar`.
- Manajemen daftar nama anggota sederhana.

### 8.2 Out of Scope (v2.0 / Mendatang)

- Pencatatan pos pengeluaran kas (sementara v1.0 murni fokus pada pemasukan kas mingguan).
- Integrasi payment gateway otomatis / QRIS (pembayaran tetap cash/transfer manual yang diinput bendahara).
- Otomasi pesan reminder WhatsApp tagihan kas ke anggota yang belum bayar.
- Multi-organisasi / Multi-tenant (v1.0 dirancang untuk 1 buku kas internal).

---

# SECTION 9: Lampiran & Struktur Data

### Skema Struktur Kolom CSV

| No  |     Nama      | Tanggal Bayar | Minggu ke- | Jumlah Bayar |
| :-: | :-----------: | :-----------: | :--------: | :----------: |
|  1  | Budi Santoso  |  05/09/2026   |  Minggu 1  |    5.000     |
|  2  |  Siti Aminah  |  05/09/2026   |  Minggu 1  |    5.000     |
|  3  | Rizky Pratama |  05/09/2026   |  Minggu 1  |    10.000    |
