-- CreateTable
CREATE TABLE "General" (
    "role" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "names" TEXT[],
    "icondatas" INTEGER[],
    "urls" TEXT[],

    PRIMARY KEY ("role")
);

-- CreateTable
CREATE TABLE "User" (
    "aircraftid" INTEGER NOT NULL,
    "userid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("aircraftid","name")
);

-- CreateTable
CREATE TABLE "Aircraft" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fs0" DECIMAL(65,30) NOT NULL,
    "fs1" DECIMAL(65,30) NOT NULL,
    "mom0" DECIMAL(65,30) NOT NULL,
    "mom1" DECIMAL(65,30) NOT NULL,
    "weight0" DECIMAL(65,30) NOT NULL,
    "weight1" DECIMAL(65,30) NOT NULL,
    "cargoweight1" DECIMAL(65,30) NOT NULL,
    "lemac" DECIMAL(65,30) NOT NULL,
    "mac" DECIMAL(65,30) NOT NULL,
    "mommultiplyer" DECIMAL(65,30) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Glossary" (
    "aircraftid" INTEGER NOT NULL,
    "glossaryid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    PRIMARY KEY ("name","aircraftid")
);

-- CreateTable
CREATE TABLE "Tank" (
    "name" TEXT NOT NULL,
    "aircraftid" INTEGER NOT NULL,
    "tankid" SERIAL NOT NULL,
    "weights" TEXT NOT NULL,
    "simplemoms" TEXT NOT NULL,

    PRIMARY KEY ("aircraftid","name")
);

-- CreateTable
CREATE TABLE "Config" (
    "aircraftid" INTEGER NOT NULL,
    "configid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("name","aircraftid")
);

-- CreateTable
CREATE TABLE "Cargo" (
    "aircraftid" INTEGER NOT NULL,
    "cargoid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "fs" DECIMAL(65,30) DEFAULT -1,
    "category" INTEGER DEFAULT 3,

    PRIMARY KEY ("name","aircraftid")
);

-- CreateTable
CREATE TABLE "ConfigCargo" (
    "configid" INTEGER NOT NULL,
    "aircraftid" INTEGER NOT NULL,
    "cargoid" INTEGER NOT NULL,
    "configcargoid" SERIAL NOT NULL,
    "fs" DECIMAL(65,30) NOT NULL,
    "qty" INTEGER NOT NULL,

    PRIMARY KEY ("configid","aircraftid","cargoid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.userid_unique" ON "User"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "Aircraft.name_unique" ON "Aircraft"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Glossary.glossaryid_unique" ON "Glossary"("glossaryid");

-- CreateIndex
CREATE UNIQUE INDEX "Tank.tankid_unique" ON "Tank"("tankid");

-- CreateIndex
CREATE UNIQUE INDEX "Config.configid_unique" ON "Config"("configid");

-- CreateIndex
CREATE UNIQUE INDEX "Cargo.cargoid_unique" ON "Cargo"("cargoid");

-- CreateIndex
CREATE UNIQUE INDEX "ConfigCargo.configcargoid_unique" ON "ConfigCargo"("configcargoid");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("aircraftid") REFERENCES "Aircraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Glossary" ADD FOREIGN KEY ("aircraftid") REFERENCES "Aircraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tank" ADD FOREIGN KEY ("aircraftid") REFERENCES "Aircraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD FOREIGN KEY ("aircraftid") REFERENCES "Aircraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cargo" ADD FOREIGN KEY ("aircraftid") REFERENCES "Aircraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigCargo" ADD FOREIGN KEY ("configid") REFERENCES "Config"("configid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigCargo" ADD FOREIGN KEY ("aircraftid") REFERENCES "Aircraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigCargo" ADD FOREIGN KEY ("cargoid") REFERENCES "Cargo"("cargoid") ON DELETE CASCADE ON UPDATE CASCADE;
