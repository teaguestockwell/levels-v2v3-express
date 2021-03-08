/*
  Warnings:

  - You are about to alter the column `category` on the `Cargo` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum("_CargoCategory")`.

*/
-- CreateEnum
CREATE TYPE "_CargoCategory" AS ENUM ('stewardEquip', 'emergencyEquip', 'extraEquip');

-- AlterTable
ALTER TABLE "Cargo" DROP COLUMN "category";
ALTER TABLE "Cargo" ADD COLUMN "category" "_CargoCategory" DEFAULT E'extraEquip',
ALTER COLUMN "lastModified" DROP DEFAULT;
