-- AlterTable
ALTER TABLE "users" ADD COLUMN     "oauth_account_user" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "fullName" DROP NOT NULL;

-- CreateTable
CREATE TABLE "oauth_accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "oauth_accounts_provider_provider_id_key" ON "oauth_accounts"("provider", "provider_id");

-- AddForeignKey
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
