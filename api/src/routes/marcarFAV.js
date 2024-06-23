import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const marcarFAV = new Elysia()


    .post("/marcarFAV", async ({ body }) => {
        console.log("Se ha solicitado marcar como favorito a un usuario")
        if (body.correo === undefined || body.correo_favorito === undefined) {
            console.log("Faltan datos para poder marcar un favorito con exito")
            return {
                status: 400,
                message: "Faltan datos"
            };
        }

        const { correo, correo_favorito } = body;

        const ExisteUsuario = await prisma.usuarios.findUnique({
            where: {
                direccion_correo: correo
            }
        });

        if (ExisteUsuario === null) {
            console.log("Se intento maracar cómo favorito con un usuario que no existe")
            return {
                status: 400,
                message: "Usuario no existe"
            };
        }

        const ExisteFavorito = await prisma.usuarios.findUnique({
            where: {
                direccion_correo: correo_favorito
            }
        });

        if (ExisteFavorito === null) {
            console.log("Se intento maracar cómo favorito a un usuario que no existe")
            return {
                status: 400,
                message: "Correo favorito no existe"
            };
        }

        const yaFavorito = await prisma.direcciones_favoritas.findUnique({
            where: {
                usuario_id_favorito_id: {
                    usuario_id: ExisteUsuario.id,
                    favorito_id: ExisteFavorito.id
                }
            }
        });

        if (yaFavorito) {
            console.log("Esté usuario ya ha sido maracado cómo favorito con exito")
            return {
                status: 400,
                message: "El correo ya es favorito"
            };
        }

        try {
            await prisma.direcciones_favoritas.create({
                data: {
                    usuario_id: ExisteUsuario.id,
                    favorito_id: ExisteFavorito.id
                }
            });
            console.log("Usuario marcado cómo favorito con exito")
            return {
                status: 200,
                message: "Correo marcado como favorito"
            };
        } catch (error) {
            if (error.code === 'P2002') {
                console.log("Esté usuario ya ha sido maracado cómo favorito con exito")
                return {
                    status: 400,
                    message: "El correo ya es favorito"
                };
            }
            console.log("Error al marcar cómo favorito")
            return {
                status: 500,
                message: "Error al marcar como favorito"
            };
        }
    });