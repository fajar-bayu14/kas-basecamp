-- CreateTable
CREATE TABLE `CashExpense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` INTEGER NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `expenseDate` DATETIME(3) NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `notes` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CashExpense_year_month_idx`(`year`, `month`),
    INDEX `CashExpense_expenseDate_idx`(`expenseDate`),
    INDEX `CashExpense_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
