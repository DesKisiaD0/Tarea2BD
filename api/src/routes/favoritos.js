import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const favoritos = new Elysia()


    .get("/favoritos", async ({ query }) => {
        console.log("Se solicito mostrar favoritos de un usuario")
        if (!query.correo) {
            console.log("Faltan parametros requeridos")
            return {
                "status": 400,
                "message": "Faltan parámetros requeridos"
            };
        }
        const { correo } = query;

        try {
            const ExisteUsuario = await prisma.usuarios.findUnique({
                where: {
                    direccion_correo: correo
                }
            });

            if (ExisteUsuario === null) {
                console.log("El usuario solicitado no fue encontrado")
                return {
                    "status": 400,
                    "message": "Usuario no existe"
                };
            }

            const Favoritos = await prisma.direcciones_favoritas.findMany({
                where: {
                    usuario_id: ExisteUsuario.id
                },
                select: {
                    favorito_id: true
                }
            });

            const CorreosFavoritos = [];

            for (let i = 0; i < Favoritos.length; i++) {
                const Favorito = await prisma.usuarios.findUnique({
                    where: {
                        id: Favoritos[i].favorito_id
                    },
                    select: {
                        direccion_correo: true
                    }
                });
                CorreosFavoritos.push(Favorito.direccion_correo);
            }
            console.log("La solicitud fue realizada con exito")
            return {
                "status": 200,
                "message": "Correos favoritos encontrados",
                "data": CorreosFavoritos
            };
        } catch (error) {
            console.error('Error al buscar los correos favoritos:', error);
            return {
                "status": 500,
                "message": "Error interno del servidor"
            };
        }
    });