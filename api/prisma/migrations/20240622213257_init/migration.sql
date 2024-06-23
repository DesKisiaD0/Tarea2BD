/*
  Warnings:

  - You are about to drop the `correos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "correos" DROP CONSTRAINT "correos_destinatario_id_fkey";

-- DropForeignKey
ALTER TABLE "correos" DROP CONSTRAINT "correos_remitente_id_fkey";

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "es_favorito" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "correos";
