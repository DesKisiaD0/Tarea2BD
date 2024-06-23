import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const desmarcarFAV = new Elysia()

    .delete("/desmarcarFAV", async ({ query }) => {
        console.log("Se ha solicitado desmarcar como favorito a un usuario");
        if (!query.correo || !query.correo_favorito) {
            console.log("Faltan datos para poder desmarcar un favorito con éxito");
            return {
                status: 400,
                message: "Faltan datos"
            };
        }
        const { correo, correo_favorito } = query;

        const ExisteUsuario = await prisma.usuarios.findUnique({
            where: {
                direccion_correo: correo
            }
        });

        if (ExisteUsuario === null) {
            console.log("Se intentó desmarcar cómo favorito con un usuario que no existe");
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
            console.log("Se intentó desmarcar cómo favorito a un usuario que no existe");
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

        if (yaFavorito === null) {
            console.log("El correo ingresado no es favorito, no es necesario desmarcarlo");
            return {
                status: 400,
                message: "El correo no es favorito"
            };
        }

        try {
            await prisma.direcciones_favoritas.delete({
                where: {
                    usuario_id_favorito_id: {
                        usuario_id: ExisteUsuario.id,
                        favorito_id: ExisteFavorito.id
                    }
                }
            });
            console.log("Usuario desmarcado cómo favorito con éxito");
            return {
                status: 200,
                message: "Correo desmarcado como favorito"
            };
        } catch (error) {
            console.log("Error al desmarcar como favorito");
            return {
                status: 500,
                message: "Error al desmarcar como favorito"
            };
        }
    });
