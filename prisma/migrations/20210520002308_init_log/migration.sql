-- CreateTable
CREATE TABLE "Log" (
    "logId" SERIAL NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER NOT NULL,
    "ep" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "resTime" INTEGER NOT NULL,
    "body" JSONB,
    "query" TEXT,

    PRIMARY KEY ("logId")
);
