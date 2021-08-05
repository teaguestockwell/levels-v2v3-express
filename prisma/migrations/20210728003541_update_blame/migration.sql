-- The DB was reset when these mifration were applied, so the folling colums will never be null

/*
  Warnings:

  - Added the required column `updated` to the `Aircraft` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `Config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `ConfigCargo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `Glossary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `Tank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Aircraft" ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT E'developer';

-- AlterTable
ALTER TABLE "Cargo" ALTER COLUMN "updatedBy" SET DEFAULT E'developer';

-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT E'developer';

-- AlterTable
ALTER TABLE "ConfigCargo" ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT E'developer';

-- AlterTable
ALTER TABLE "Glossary" ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT E'developer';

-- AlterTable
ALTER TABLE "Tank" ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT E'developer';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT E'developer';
