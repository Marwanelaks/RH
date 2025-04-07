-- CreateTable
CREATE TABLE "TestItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestItem_pkey" PRIMARY KEY ("id")
);
