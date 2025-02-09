-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "oldPrice" REAL,
    "newPrice" REAL,
    "difference" REAL,
    "percentageChange" REAL,
    "group" TEXT,
    "oldQuantity" INTEGER,
    "newQuantity" INTEGER,
    "month" INTEGER,
    "book" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
