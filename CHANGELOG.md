# Changelog — Kas Basecamp

> Share ke teman-teman basecamp. Bahasa santai, no jargon berlebihan.

### v1.1 — 6 Okt 2026

#### ✨ Baru
- **Bayar Kas via QR (Guest)** — Buat yang belum login / bukan admin, sekarang ada tombol **Bayar via QR** di desktop dan **FAB QR** di HP. Tap → lihat QR QRIS asli → **Unduh QR** atau langsung **Konfirmasi via WhatsApp** (`wa.me/62895614790050` dengan pesan otomatis *"Halo Admin, saya sudah transfer kas mingguan."*).
- **QRIS Asli No Edit** — `public/qr-kas.png` pakai file asli GoPay Merchant (1129×1600, 638KB) tanpa resize/compress. Scan tetap valid.

#### 🎨 Tampilan
- **Dark OLED Full** — Semua halaman (`/` dan `/anggota`) sekarang ikut token `design-system/kas-basecamp/MASTER.md`: background `#020617`, card `#0E1223`, aksen `#22C55E`, border `#334155`. Kontras lulus WCAG AA (15.9:1).
- **Fix Judul Anggota** — `Master Data Anggota Kas` yang sempat hilang / pucat di dark mode balik lagi dengan ikon accent. Angka KPI `0 Orang` sekarang `text-card-foreground` biar kebaca.
- **Badge Lembut** — Status Aktif → `bg-accent/15` (hijau soft), Nonaktif → `bg-muted` (abu soft). Nggak norak.

#### 🧹 Rapi-rapi
- FAB admin tetap **2 tombol** (Input Kas + Pengeluaran) khusus `sm:hidden`. Guest cuma 1 FAB QR — nggak numpuk.
- Copy dibenerin (antislop-human): *"Pindai QR untuk transfer. Simpan QR jika perlu, lalu konfirmasi ke admin via WhatsApp. Preferensi tunai? Bayar langsung ke admin."* — pendek, jelas, tanpa em dash.

#### 🔒 Tetap Aman
- Nggak ada logic / props / handler yang diubah. Cuma ganti warna & FAB. `getIsAdmin()`, `router.push`, `recordCashPayment` dll tetap sama.

---

#### Cara Coba
1. Buka `/` sebagai guest → lihat tombol **Bayar via QR** (desktop) / FAB hijau QR (HP).
2. Tap → modal → **Unduh QR** atau **Konfirmasi via WhatsApp**.
3. Login admin → FAB balik jadi Input Kas + Pengeluaran seperti biasa.

Ada saran? Ping aja di WA admin. 🙏
