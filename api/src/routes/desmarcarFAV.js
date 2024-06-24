import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const desmarcarFAV = new Elysia()

    .delete("/desmarcarFAV", async ({ query }) => { // Este endpoint desmarca a un usuario como favorito
        console.log("Se ha solicitado desmarcar como favorito a un usuario"); // Se avisa por consola la solicitud
        if (!query.correo || !query.correo_favorito) {                              // Si hay datos faltantes,
            console.log("Faltan datos para poder desmarcar un favorito con éxito"); // se avisa por consola de ello.
            
            return {                    // Luego, se retorna un objeto con
                status: 400,            // un estado de error (400: Bad Request)
                message: "Faltan datos" // y un mensaje de error.
            };
        }
        const { correo, correo_favorito } = query;
        // Si todo sale bien, aquí se extraen los correos de la consulta

        const ExisteUsuario = await prisma.usuarios.findUnique({ // Se busca en la BD si el usuario existe,
            where: {                                             // donde
                direccion_correo: correo                         // tiene que existir su correo electrónico.
            }
        });

        if (ExisteUsuario === null) {                                                       // Si el usuario no existe,
            console.log("Se intentó desmarcar como favorito con un usuario que no existe"); // se avisa por consola que se hizo el intento.

            return {                         // Luego, se retorna un objeto con
                status: 400,                 // un estado de error (400: Bad Request)
                message: "Usuario no existe" // y un mensaje de error.
            };
        }

        const ExisteFavorito = await prisma.usuarios.findUnique({ // Se busca en la BD si el usuario existe,
            where: {                                              // donde esta vez
                direccion_correo: correo_favorito                 // el usuario debe ser favorito.
            }
        });

        if (ExisteFavorito === null) { // Si no existe un favorito,
                                       // se avisa por consola que:
            console.log("Se intentó desmarcar como favorito a un usuario que no existe"); 
            return {                                 // Luego, se retorna un objeto con
                status: 400,                         // mensaje de error causado por usuario
                message: "Correo favorito no existe" // y un mensaje de error.
            };
        }

        const yaFavorito = await prisma.direcciones_favoritas.findUnique({ // Se busca entre ambos usuarios una relación de favoritos
            where: {                                                       
                usuario_id_favorito_id: {                                  
                    usuario_id: ExisteUsuario.id,
                    favorito_id: ExisteFavorito.id
                }
            }
        });

        if (yaFavorito === null) { // Si no se encuentra esa relación,
                                   // se anuncia por consola que:
            console.log("El correo ingresado no es favorito, no es necesario desmarcarlo"); 

            return {                                // Luego se retorna objeto con 
                status: 400,                        // mensaje de error causado por usuario
                message: "El correo no es favorito" // y un mensaje de error.
            };
        }

                                                        // Una vez todas las medidas preventivas fueron tomadas, 
        try {                                           // se intentará
            await prisma.direcciones_favoritas.delete({ // eliminar la relación de favoritos de la BD
                where: {                                // donde
                    usuario_id_favorito_id: {           // se tienen
                        usuario_id: ExisteUsuario.id,   // estos datos
                        favorito_id: ExisteFavorito.id  // de usuario.
                    }
                }
            });
            // Si funciona, avisar por consola que:
            console.log("Usuario desmarcado cómo favorito con éxito");
            
            return {                                       // Luego, retornar un objeto con
                status: 200,                               // un estado exitoso
                message: "Correo desmarcado como favorito" // y un mensaje
            };
        } catch (error) { // De haber un error inesperado,
                          // anunciar por consola que:
            console.log("Error al desmarcar como favorito");

            return {                                        // Luego, se retorna un objeto con
                status: 500,                                // un estado de error (por culpa del servidor)
                message: "Error al desmarcar como favorito" // y un mensaje de error
            };
        }
    });
