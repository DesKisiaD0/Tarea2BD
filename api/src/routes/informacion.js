import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const informacion = new Elysia()


    .get("/informacion", async ({ query }) => {
        console.log("Se ha solicitado información de un usuario")
        const { correo } = query;
        // Validación de entrada
        if (!correo) {
            console.log("Faltan parametros requeridos")
            return {
                "status": 400,
                "message": "Faltan parámetros requeridos"
            };
        }

        try {
            // Buscar el usuario en la base de datos
            const ExisteUsuario = await prisma.usuarios.findUnique({
                where: {
                    direccion_correo: correo
                }
            });

            // Verificar si el usuario existe
            if (ExisteUsuario === null) {
                console.log("El usuario solicitado no fue encontrado")
                return {
                    "status": 400,
                    "message": "Usuario no existe"
                };
            }

            // Retornar la información del usuario
            console.log("La solicitud fue realizada con exito")
            return {
                "status": 200,
                "message": "Usuario encontrado",
                "data": {
                    "nombre": ExisteUsuario.nombre,
                    "correo": ExisteUsuario.direccion_correo,
                    "descripcion": ExisteUsuario.descripcion
                }
            };
        } catch (error) {
            // Manejo de errores
            console.error('Error al buscar el usuario:', error);
            return {
                "status": 500,
                "message": "Error interno del servidor"
            };
        }
    });