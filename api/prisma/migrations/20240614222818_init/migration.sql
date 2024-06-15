/*
  Warnings:

  - You are about to drop the column `cuerpo` on the `correos` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_envio` on the `correos` table. All the data in the column will be lost.
  - You are about to drop the column `leido` on the `correos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "correos" DROP COLUMN "cuerpo",
DROP COLUMN "fecha_envio",
DROP COLUMN "leido";
