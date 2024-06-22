import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const correos = new Elysia()


    .post("/marcarFAV", async ({body}) => {
        const {correo, clave, id_correo_favorito} = body;

        const ExisteUsuario = await prisma.usuarios.findUnique({
            where: {
                direccion_correo: correo
            }
        });
        if(ExisteUsuario === null){
            return {
                "status": 400,
                "message": "Usuario no existe"
            };
        }

        const ExisteCorreo = await prisma.correos.findUnique({
            where: {
                id_correo: id_correo_favorito
            }
        });
        if(ExisteCorreo === null){
            return {
                "status": 400,
                "message": "Correo no existe"
            };
        }

        if(ExisteCorreo.direccion_correo !== correo){
            return {
                "status": 400,
                "message": "Correo no pertenece al usuario"
            };
        }

        if(ExisteCorreo.es_favotito){
            return {
                "status": 400,
                "message": "Correo ya es favorito"
            };
        }

        try {
            await prisma.correos.update({
                where: {
                    id_correo: id_correo_favorito
                },
                data: {
                    es_favotito: true
                }
            });
        } catch (error) {
            return {
                "status": 400,
                "message": "Error al marcar como favorito"
            };
        }
        return {
            "status": 200,
            "message": "Correo marcado como favorito"
        };
    })


    .post("/desmarcarFAV", async ({body}) => {
        const {correo, clave, id_correo_favorito} = body;

        const ExisteUsuario = await prisma.usuarios.findUnique({
            where: {
                direccion_correo: correo
            }
        });
        if(ExisteUsuario === null){
            return {
                "status": 400,
                "message": "Usuario no existe"
            };
        }

        const ExisteCorreo = await prisma.correos.findUnique({
            where: {
                id_correo: id_correo_favorito
            }
        });
        if(ExisteCorreo === null){
            return {
                "status": 400,
                "message": "Correo no existe"
            };
        }

        if(ExisteCorreo.direccion_correo !== correo){
            return {
                "status": 400,
                "message": "Correo no pertenece al usuario"
            };
        }

        if(!ExisteCorreo.es_favotito){
            return {
                "status": 400,
                "message": "Correo no es favorito"
            };
        }

        try {
            await prisma.correos.update({
                where: {
                    id_correo: id_correo_favorito
                },
                data: {
                    es_favotito: false
                }
            });
        } catch (error) {
            return {
                "status": 400,
                "message": "Error al desmarcar como favorito"
            };
        }
        return {
            "status": 200,
            "message": "Correo desmarcado como favorito"
        };
    })

    .get("/informacion", async ({ query }) => {
        const { correo } = query;
        console.log("hola")
        // Validación de entrada
        if (!correo) {
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
                return {
                    "status": 400,
                    "message": "Usuario no existe"
                };
            }

            // Retornar la información del usuario
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

 