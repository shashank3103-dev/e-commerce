/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `otp` VARCHAR(191) NULL,
    ADD COLUMN `otpExpires` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'user';
