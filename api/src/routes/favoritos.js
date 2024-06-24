import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); 

export const favoritos = new Elysia()

    .get("/favoritos", async ({ query }) => { // Desde el correo del usuario, 
                                              // aquí se obtienen los favoritos.

        console.log("Se solicitó mostrar favoritos de un usuario");
        if (!query.correo) {                             // Si el correo NO es parte de la consulta, 
            console.log("Faltan parámetros requeridos"); // se avisa por consola que falta anotarlo;
            return {                                     // luego, se retorna un objeto con
                status: 400, // 400 es de Bad Request    // un estado de error 400
                message: "Faltan parámetros requeridos"  // y un mensaje de error.
            };
        }
        const { correo } = query; // Como aquí funciona, toma el correo desde la consulta.

        try {                                                        // Se intenta:
            const ExisteUsuario = await prisma.usuarios.findUnique({ // buscar en la BD a un usuario
                where: {                                             // donde
                    direccion_correo: correo                         // su correo coincida con el buscado
                }
            });

            if (!ExisteUsuario) {                                       // De no encontrar al correo,
                console.log("El usuario solicitado no fue encontrado"); // se avisa por consola que no existe;
                return {                                                // luego, se retorna un objeto con
                    status: 400, // 400 es de Bad Request               // un estado de error 400
                    message: "Usuario no existe"                        // y un mensaje de error.
                };
            }

            // Ahora, es posible buscar entre TODOS los favoritos del usuario hallado: 
            const Favoritos = await prisma.direcciones_favoritas.findMany({ // Se busca en la BD
                where: {                                                    // donde 
                    usuario_id: ExisteUsuario.id                            // el ID de usuario "exista"
                },

                select: {              // Para cada registro encontrado,
                    favorito_id: true  // se selecciona sólo el ID del favorito.
                }
            });
        
            // Este es un arreglo que guarde los correos favoritos de nuestro usuario:
            const CorreosFavoritos = [];

            for (const favorito of Favoritos) {                            // De entre cada favorito encontrado,
                const usuarioFavorito = await prisma.usuarios.findUnique({ // se busca en la BD
                    where: {                                               // por su 
                        id: favorito.favorito_id                           // ID de favorito.
                    },          
                    
                                               // Luego, únicamente se
                    select: {                  // selecciona
                        direccion_correo: true // la dirección del correo del usuario hallado.
                    }
                });                                                          // Si efectivamente
                if (usuarioFavorito) {                                       // el usuario favorito existe,
                    CorreosFavoritos.push(usuarioFavorito.direccion_correo); // se agrega al array "CorreosFavoritos" 
                                                                             // su correo electrónico.
                }
            }
     
            // Después se muestra por consola que:
            console.log("La solicitud fue realizada con éxito"); 

            return {                                      // Se retorna un objeto con
                status: 200,                              // un estado de éxito
                message: "Correos favoritos encontrados", // un mensaje de éxito
                data: CorreosFavoritos                    // y el arreglo con los favoritos del usuario.
            };
        } catch (error) {                                                   // De haber un error,
            console.error('Error al buscar los correos favoritos:', error); // se debe mostrar en consola

            return {                                  // y se retorna un objeto con 
                status: 500,                          // un estado de error --culpa del usuario--
                message: "Error interno del servidor" // y un mensaje de error.
            };
        }
    });
