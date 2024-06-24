import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const informacion = new Elysia()

    .get("/informacion", async ({ query }) => { // Desde el correo del usuario, 
                                                // aquí se obtiene información del mismo.
        console.log("Se ha solicitado información de un usuario")
    
        if (!query.correo_informacion) {                  // Si el correo_informacion NO es parte de la consulta, 
            console.log("Faltan parametros requeridos")   // se avisa por consola que falta anotarlo;
            return {                                      //  luego, se retorna un objeto con
                "status": 400,                            // un estado de error 400
                "message": "Faltan parámetros requeridos" // y un mensaje de error.
            };
        }
        const { correo_informacion } = query;
        // Como aquí funciona, toma el correo_informacion desde la consulta.

        try {                                                        // Se intenta:
            const ExisteUsuario = await prisma.usuarios.findUnique({ // buscar en la BD a un usuario
                where: {                                             // donde
                    direccion_correo: correo_informacion             // su correo coincida con el buscado
                }
            });

            if (ExisteUsuario === null) {                              // De no encontrar al correo,
                console.log("El usuario solicitado no fue encontrado") // se avisa por consola que no existe;
                return {                                               // luego, se retorna un objeto con
                    "status": 400, // 400 es de Bad Request            // un estado de error 400
                    "message": "Usuario no existe"                     // y un mensaje de error.
                };
            }

            // Después se muestra por consola que:
            console.log("La solicitud fue realizada con exito") 

            return {                                          // Se retorna un objeto con
                "status": 200,                                // un estado de éxito
                "message": "Usuario encontrado",              // un mensaje de éxito
                "data": {                                     // y los datos del usuario:
                    "Nombre": ExisteUsuario.nombre,           // su nombre,
                    "Correo": ExisteUsuario.direccion_correo, // su correo electrónico
                    "Descripcion": ExisteUsuario.descripcion  // y su descripción.
                }
                
            };
        } catch (error) {                                        // De haber un error,
            console.error('Error al buscar el usuario:', error); // se debe mostrar en consola
            return {                                             // y se retorna un objeto con 
                "status": 500,                                   // un estado de error --culpa del usuario--
                "message": "Error interno del servidor"          // y un mensaje de error.
            };
        }
    });