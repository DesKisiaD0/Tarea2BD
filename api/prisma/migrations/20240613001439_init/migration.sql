/*
  Warnings:

  - You are about to drop the `Correos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Correos" DROP CONSTRAINT "Correos_destinatario_id_fkey";

-- DropForeignKey
ALTER TABLE "Correos" DROP CONSTRAINT "Correos_remitente_id_fkey";

-- DropTable
DROP TABLE "Correos";

-- DropTable
DROP TABLE "Usuario";

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "direccion_correo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "direcciones_bloqueadas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "bloqueado_id" INTEGER NOT NULL,

    CONSTRAINT "direcciones_bloqueadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "direcciones_favoritas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "favorito_id" INTEGER NOT NULL,

    CONSTRAINT "direcciones_favoritas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "correos" (
    "id" SERIAL NOT NULL,
    "remitente_id" INTEGER NOT NULL,
    "destinatario_id" INTEGER NOT NULL,
    "asunto" TEXT NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "fecha_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "es_favorito" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "correos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_direccion_correo_key" ON "usuarios"("direccion_correo");

-- CreateIndex
CREATE UNIQUE INDEX "direcciones_bloqueadas_usuario_id_bloqueado_id_key" ON "direcciones_bloqueadas"("usuario_id", "bloqueado_id");

-- CreateIndex
CREATE UNIQUE INDEX "direcciones_favoritas_usuario_id_favorito_id_key" ON "direcciones_favoritas"("usuario_id", "favorito_id");

-- AddForeignKey
ALTER TABLE "direcciones_bloqueadas" ADD CONSTRAINT "direcciones_bloqueadas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones_bloqueadas" ADD CONSTRAINT "direcciones_bloqueadas_bloqueado_id_fkey" FOREIGN KEY ("bloqueado_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones_favoritas" ADD CONSTRAINT "direcciones_favoritas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones_favoritas" ADD CONSTRAINT "direcciones_favoritas_favorito_id_fkey" FOREIGN KEY ("favorito_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correos" ADD CONSTRAINT "correos_remitente_id_fkey" FOREIGN KEY ("remitente_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correos" ADD CONSTRAINT "correos_destinatario_id_fkey" FOREIGN KEY ("destinatario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
