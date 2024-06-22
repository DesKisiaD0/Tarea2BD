import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const correos = new Elysia()


    .post("/marcarFAV", async ({ body }) => {
        if (body.correo === undefined || body.correo_favorito === undefined) {
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
            return {
                status: 200,
                message: "Correo marcado como favorito"
            };
        } catch (error) {
            if (error.code === 'P2002') {
                return {
                    status: 400,
                    message: "El correo ya es favorito"
                };
            }
            return {
                status: 500,
                message: "Error al marcar como favorito"
            };
        }
    })


    .delete("/desmarcarFAV", async ({body}) => {
        if(body.correo === undefined || body.correo_favorito === undefined){
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
            return {
                "status": 200,
                "message": "Correo desmarcado como favorito"
            };
        } catch (error) {
            return {
                "status": 500,
                "message": "Error al desmarcar como favorito"
            };
        }
    })

    .get("/informacion", async ({ query }) => {
        const { correo } = query;
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
    })

    .get("/favoritos", async ({ query }) => {
        if (!query.correo) {
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
    })