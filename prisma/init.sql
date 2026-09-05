-- Skema Inisialisasi Database KasMinggu (Catatan Kas Basecamp)
-- File ini dieksekusi otomatis oleh MySQL container saat pertama kali dibuat

CREATE TABLE IF NOT EXISTS `Member` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `notes` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    INDEX `Member_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `CashTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL,
    `weekNumber` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL DEFAULT 5000,
    `notes` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    INDEX `CashTransaction_year_month_weekNumber_idx`(`year`, `month`, `weekNumber`),
    INDEX `CashTransaction_paymentDate_idx`(`paymentDate`),
    INDEX `CashTransaction_memberId_idx`(`memberId`),
    UNIQUE INDEX `CashTransaction_memberId_year_month_weekNumber_key`(`memberId`, `year`, `month`, `weekNumber`),
    PRIMARY KEY (`id`),
    CONSTRAINT `CashTransaction_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Data Awal Master Anggota (12 Anggota)
INSERT INTO `Member` (`id`, `name`, `phone`, `notes`, `isActive`) VALUES
(1, 'Budi Santoso', '081234567890', 'Koordinator Lapangan', true),
(2, 'Siti Aminah', '081234567891', 'Divisi Konsumsi', true),
(3, 'Rizky Pratama', '081234567892', 'Divisi Perlengkapan', true),
(4, 'Dewi Lestari', '081234567893', 'Sekretaris', true),
(5, 'Ahmad Fauzi', '081234567894', 'Divisi Humas', true),
(6, 'Putri Wulandari', '081234567895', 'Anggota Aktif', true),
(7, 'Hendra Wijaya', '081234567896', 'Anggota Aktif', true),
(8, 'Rina Marlina', '081234567897', 'Anggota Aktif', true),
(9, 'Dian Sastro', '081234567898', 'Divisi Acara', true),
(10, 'Fajar Nugraha', '081234567899', 'Ketua Basecamp', true),
(11, 'Bayu Saputra', '081298765432', 'Anggota Aktif', true),
(12, 'Anisa Rahma', '081298765431', 'Bendahara Kas', true)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Data Awal Riwayat Transaksi Kas September 2026 (Minggu 1 s/d 4)
INSERT INTO `CashTransaction` (`memberId`, `paymentDate`, `weekNumber`, `month`, `year`, `amount`, `notes`) VALUES
-- Minggu 1 (W1)
(1, '2026-09-05 00:00:00.000', 1, 9, 2026, 5000, 'Iuran Kas W1'),
(2, '2026-09-05 00:00:00.000', 1, 9, 2026, 5000, 'Iuran Kas W1'),
(3, '2026-09-05 00:00:00.000', 1, 9, 2026, 5000, 'Iuran Kas W1'),
(4, '2026-09-05 00:00:00.000', 1, 9, 2026, 5000, 'Iuran Kas W1'),
(5, '2026-09-05 00:00:00.000', 1, 9, 2026, 5000, 'Iuran Kas W1'),
(6, '2026-09-05 00:00:00.000', 1, 9, 2026, 5000, 'Iuran Kas W1'),
(7, '2026-09-05 00:00:00.000', 1, 9, 2026, 5000, 'Iuran Kas W1'),
(8, '2026-09-05 00:00:00.000', 1, 9, 2026, 5000, 'Iuran Kas W1'),
(9, '2026-09-05 00:00:00.000', 1, 9, 2026, 5000, 'Iuran Kas W1'),
(10, '2026-09-05 00:00:00.000', 1, 9, 2026, 5000, 'Iuran Kas W1'),

-- Minggu 2 (W2)
(1, '2026-09-12 00:00:00.000', 2, 9, 2026, 5000, 'Iuran Kas W2'),
(2, '2026-09-12 00:00:00.000', 2, 9, 2026, 5000, 'Iuran Kas W2'),
(3, '2026-09-12 00:00:00.000', 2, 9, 2026, 5000, 'Iuran Kas W2'),
(4, '2026-09-12 00:00:00.000', 2, 9, 2026, 5000, 'Iuran Kas W2'),
(5, '2026-09-12 00:00:00.000', 2, 9, 2026, 5000, 'Iuran Kas W2'),
(6, '2026-09-12 00:00:00.000', 2, 9, 2026, 5000, 'Iuran Kas W2'),
(7, '2026-09-12 00:00:00.000', 2, 9, 2026, 5000, 'Iuran Kas W2'),
(8, '2026-09-12 00:00:00.000', 2, 9, 2026, 5000, 'Iuran Kas W2'),

-- Minggu 3 (W3)
(1, '2026-09-19 00:00:00.000', 3, 9, 2026, 5000, 'Iuran Kas W3'),
(2, '2026-09-19 00:00:00.000', 3, 9, 2026, 5000, 'Iuran Kas W3'),
(3, '2026-09-19 00:00:00.000', 3, 9, 2026, 5000, 'Iuran Kas W3'),
(4, '2026-09-19 00:00:00.000', 3, 9, 2026, 5000, 'Iuran Kas W3'),
(5, '2026-09-19 00:00:00.000', 3, 9, 2026, 5000, 'Iuran Kas W3'),
(6, '2026-09-19 00:00:00.000', 3, 9, 2026, 5000, 'Iuran Kas W3'),
(7, '2026-09-19 00:00:00.000', 3, 9, 2026, 5000, 'Iuran Kas W3'),

-- Minggu 4 (W4)
(1, '2026-09-26 00:00:00.000', 4, 9, 2026, 5000, 'Iuran Kas W4'),
(2, '2026-09-26 00:00:00.000', 4, 9, 2026, 5000, 'Iuran Kas W4'),
(3, '2026-09-26 00:00:00.000', 4, 9, 2026, 5000, 'Iuran Kas W4'),
(4, '2026-09-26 00:00:00.000', 4, 9, 2026, 5000, 'Iuran Kas W4'),
(5, '2026-09-26 00:00:00.000', 4, 9, 2026, 5000, 'Iuran Kas W4')
ON DUPLICATE KEY UPDATE `amount` = VALUES(`amount`);
