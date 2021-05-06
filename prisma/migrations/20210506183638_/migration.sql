-- CreateEnum
CREATE TYPE "_CargoCategory" AS ENUM ('steward', 'emergency', 'extra');

-- CreateTable
CREATE TABLE "General" (
    "role" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "names" TEXT[],
    "iconDatas" INTEGER[],
    "urls" TEXT[],

    PRIMARY KEY ("role")
);

-- CreateTable
CREATE TABLE "User" (
    "aircraftId" INTEGER NOT NULL,
    "userId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("aircraftId","name")
);

-- CreateTable
CREATE TABLE "Aircraft" (
    "aircraftId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fs0" DOUBLE PRECISION NOT NULL,
    "fs1" DOUBLE PRECISION NOT NULL,
    "mom0" DOUBLE PRECISION NOT NULL,
    "mom1" DOUBLE PRECISION NOT NULL,
    "weight0" DOUBLE PRECISION NOT NULL,
    "weight1" DOUBLE PRECISION NOT NULL,
    "cargoWeight1" DOUBLE PRECISION NOT NULL,
    "lemac" DOUBLE PRECISION NOT NULL,
    "mac" DOUBLE PRECISION NOT NULL,
    "momMultiplyer" DOUBLE PRECISION NOT NULL,

    PRIMARY KEY ("aircraftId")
);

-- CreateTable
CREATE TABLE "Glossary" (
    "aircraftId" INTEGER NOT NULL,
    "glossaryId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    PRIMARY KEY ("name","aircraftId")
);

-- CreateTable
CREATE TABLE "Tank" (
    "name" TEXT NOT NULL,
    "aircraftId" INTEGER NOT NULL,
    "tankId" SERIAL NOT NULL,
    "weightsCSV" TEXT NOT NULL,
    "simpleMomsCSV" TEXT NOT NULL,

    PRIMARY KEY ("aircraftId","name")
);

-- CreateTable
CREATE TABLE "Config" (
    "aircraftId" INTEGER NOT NULL,
    "configId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("name","aircraftId")
);

-- CreateTable
CREATE TABLE "Cargo" (
    "aircraftId" INTEGER NOT NULL,
    "cargoId" SERIAL NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL DEFAULT E'unknown',
    "name" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "fs" DOUBLE PRECISION DEFAULT -1,
    "category" "_CargoCategory" DEFAULT E'extra',

    PRIMARY KEY ("name","aircraftId")
);

-- CreateTable
CREATE TABLE "ConfigCargo" (
    "configId" INTEGER NOT NULL,
    "aircraftId" INTEGER NOT NULL,
    "cargoId" INTEGER NOT NULL,
    "configCargoId" SERIAL NOT NULL,
    "fs" DOUBLE PRECISION NOT NULL,
    "qty" INTEGER NOT NULL,

    PRIMARY KEY ("configId","aircraftId","cargoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.userId_unique" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Aircraft.name_unique" ON "Aircraft"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Glossary.glossaryId_unique" ON "Glossary"("glossaryId");

-- CreateIndex
CREATE UNIQUE INDEX "Tank.tankId_unique" ON "Tank"("tankId");

-- CreateIndex
CREATE UNIQUE INDEX "Config.configId_unique" ON "Config"("configId");

-- CreateIndex
CREATE UNIQUE INDEX "Cargo.cargoId_unique" ON "Cargo"("cargoId");

-- CreateIndex
CREATE UNIQUE INDEX "ConfigCargo.configCargoId_unique" ON "ConfigCargo"("configCargoId");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("aircraftId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Glossary" ADD FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("aircraftId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tank" ADD FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("aircraftId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("aircraftId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cargo" ADD FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("aircraftId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigCargo" ADD FOREIGN KEY ("configId") REFERENCES "Config"("configId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigCargo" ADD FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("aircraftId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigCargo" ADD FOREIGN KEY ("cargoId") REFERENCES "Cargo"("cargoId") ON DELETE CASCADE ON UPDATE CASCADE;
