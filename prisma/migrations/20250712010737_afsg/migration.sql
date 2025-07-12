/*
  Warnings:

  - You are about to drop the column `oauth_account_user` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "oauth_account_user";
