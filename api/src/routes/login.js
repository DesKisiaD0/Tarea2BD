import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const login = new Elysia()

    .get("/login", async({query}) => { // Desde el correo y la clave del usuario,
                                       // aquí se realiza la autenticación.

        if (!query.correo || !query.clave) {                         // Si el correo o la clave NO son parte de la consulta,
            return {                                                 // se retorna un objeto con
                status: 400,                                         // un estado de error 400 (Bad Request)
                body: {                                              // y un
                    message: "Correo o contraseña no proporcionados" // mensaje de error.
                }
            }
        }
        const {correo, clave} = query; 
        // Como aquí funciona, toma el correo y la clave desde la consulta.

        try {                                                  // Se intenta:
            const usuario = await prisma.usuarios.findUnique({ // buscar en la BD a un usuario
                where: {                                       // donde
                    direccion_correo: correo,                  // su correo y
                    clave: clave,                              // su clave coincidan con los buscados.
                },
            });

            if(usuario) {                             // Si el usuario existe,
                return {                              // se retorna un objeto con
                    "estado": 200,                    // un estado de éxito 200 (OK),
                    "mensaje": "Usuario autenticado", // un mensaje de éxito,
                    "credenciales_correctas": true    // y un indicador de credenciales correctas.
                };
            } else {                                     // Si el usuario no existe,
                return {                                 // se retorna un objeto con
                    "estado": 400,                       // un estado de error 400 (Bad Request),
                    "mensaje": "Usuario no autenticado", // un mensaje de error,
                    "credenciales_correctas": false      // y un indicador de credenciales incorrectas.
                };
            }
        } catch (error) {                                 // De haber un error,
            return {                                      // se retorna un objeto con
                "estado": 500,                            // un estado de error 500 (Internal Server Error),
                "mensaje": "Error al autenticar usuario", // y un mensaje de error.
            };
        }
    });
