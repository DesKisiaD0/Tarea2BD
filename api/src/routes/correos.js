import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const correos = new Elysia()


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
    })


    .delete("/desmarcarFAV", async ({body}) => {
        console.log("Se ha solicitado desmarcar como favorito a un usuario")
        if(body.correo === undefined || body.correo_favorito === undefined){
            console.log("Faltan datos para poder desmarcar un favorito con exito")
            return {
                "status": 400,
                "message": "Faltan datos"
            };
        }  
        const {correo, correo_favorito} = body;

        const ExisteUsuario = await prisma.usuarios.findUnique({
            where: {
                direccion_correo: correo
            }
        });

        if(ExisteUsuario === null){
            console.log("Se intento desmarcar cómo favorito con un usuario que no existe")
            return {
                "status": 400,
                "message": "Usuario no existe"
            };
        }

        const ExisteFavorito = await prisma.usuarios.findUnique({
            where: {
                direccion_correo: correo_favorito
            }
        });

        if(ExisteFavorito === null){
            console.log("Se intento desmarcar cómo favorito a un usuario que no existe")
            return {
                "status": 400,
                "message": "Correo favorito no existe"
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

        if(yaFavorito === null){
            console.log("El correo ingresado no es favorito, no es necesario desmarcarlo")
            return {
                "status": 400,
                "message": "El correo no es favorito"
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
            console.log("Usuario desmarcado cómo favorito con exito")
            return {
                "status": 200,
                "message": "Correo desmarcado como favorito"
            };
        } catch (error) {
            console.log("Error al desmarcar como favorito")
            return {
                "status": 500,
                "message": "Error al desmarcar como favorito"
            };
        }
    })

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
    })

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