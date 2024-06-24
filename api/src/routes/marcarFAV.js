import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const marcarFAV = new Elysia()

    .post("/marcarFAV", async ({ body }) => { // Desde el correo del usuario,
                                              // aquí se marca como favorito a otro usuario.

        console.log("Se ha solicitado marcar como favorito a un usuario");
        if (body.correo === undefined || body.correo_favorito === undefined) {   // Si el correo o el correo_favorito
            console.log("Faltan datos para poder marcar un favorito con éxito"); // NO son parte del cuerpo,
            return {                                                             // se avisa por consola que faltan datos;
                status: 400,                                                     // luego, se retorna un objeto con
                message: "Faltan datos"                                          // un estado de error 400 (Bad Request)
            };                                                                   // y un mensaje de error.
        }

        const { correo, correo_favorito } = body; 
        // Como aquí funciona, toma el correo y el correo_favorito desde el cuerpo.

        const ExisteUsuario = await prisma.usuarios.findUnique({ // Busca en la BD a un usuario
            where: {                                             // donde
                direccion_correo: correo                         // su correo coincida con el buscado.
            }
        });

        if (ExisteUsuario === null) {                                                    // Si no se encuentra el usuario,
            console.log("Se intentó marcar como favorito con un usuario que no existe"); // se avisa por consola que no existe;
            return {                                                                     // luego, se retorna un objeto con
                status: 400,                                                             // un estado de error 400 (Bad Request)
                message: "Usuario no existe"                                             // y un mensaje de error.
            };
        }

        const ExisteFavorito = await prisma.usuarios.findUnique({ // Busca en la BD al usuario favorito
            where: {                                              // donde
                direccion_correo: correo_favorito                 // su correo coincida con el buscado.
            }
        });

        if (ExisteFavorito === null) {                                                 // Si no se encuentra el usuario favorito,
            console.log("Se intentó marcar como favorito a un usuario que no existe"); // se avisa por consola que no existe;
            return {                                                                   // luego, se retorna un objeto con
                status: 400,                                                           // un estado de error 400 (Bad Request)
                message: "Correo favorito no existe"                                   // y un mensaje de error.
            };
        }

        const yaFavorito = await prisma.direcciones_favoritas.findUnique({ // Busca en la BD si ya es favorito
            where: {                                                       // donde
                usuario_id_favorito_id: {                                  // el ID de usuario y el ID de favorito coincidan.
                    usuario_id: ExisteUsuario.id,
                    favorito_id: ExisteFavorito.id
                }
            }
        });

        if (yaFavorito) {                                                           // Si ya es favorito,
            console.log("Este usuario ya ha sido marcado como favorito con éxito"); // se avisa por consola que ya es favorito;
            return {                                                                // luego, se retorna un objeto con
                status: 400,                                                        // un estado de error 400 (Bad Request)
                message: "El correo ya es favorito"                                 // y un mensaje de error.
            };
        }

        try {                                           // Se intenta:
            await prisma.direcciones_favoritas.create({ // crear en la BD un nuevo favorito
                data: {                                 // con
                    usuario_id: ExisteUsuario.id,       // el ID de usuario
                    favorito_id: ExisteFavorito.id      // y el ID de favorito.
                }
            });
            console.log("Usuario marcado como favorito con éxito"); // Si se logra,
            return {                                                // se avisa por consola que se marcó con éxito;
                status: 200,                                        // luego, se retorna un objeto con
                message: "Correo marcado como favorito"             // un estado de éxito 200 (OK)
            };                                                      // y un mensaje de éxito.
            
        } catch (error) {                                                               // De haber un error,
            if (error.code === 'P2002') {                                               // y si el error es por duplicado,
                console.log("Este usuario ya ha sido marcado como favorito con éxito"); // se avisa por consola que ya es favorito;
                return {                                                                // luego, se retorna un objeto con
                    status: 400,                                                        // un estado de error 400 (Bad Request)
                    message: "El correo ya es favorito"                                 // y un mensaje de error.
                };
            }
            console.log("Error al marcar como favorito");                      // Si el error es otro,
            return {                                                           // se avisa por consola;
                status: 500,                                                   // luego, se retorna un objeto con
                message: "Error al marcar como favorito"                       // un estado de error 500 (Internal Server Error)
            };                                                                 // y un mensaje de error.
        }
    });
