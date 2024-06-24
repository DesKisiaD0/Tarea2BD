import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registrar = new Elysia()
    .get("/iniciar", async () => { // Este endpoint inicia el cliente de registro de usuario.

        console.log("Se abrio el cliente de registro de usuario"); // Mensaje en consola indicando que se abrió el cliente
        return {                                                   // retorna
            "status": 200,                                         // estado exitoso (200: OK)
            "message": "Se abrio el cliente"                       // y un mensaje de éxito
        };
    })
    .post("/registrar", async ({ body }) => {                               // Este endpoint registra a un nuevo usuario
        console.log("Se ha recibido una solicitud de registro de usuario"); // Se avisa por consola sobre la solicitud
        const { nombre, correo, clave, descripcion } = body;                // Extrae datos del cuerpo de la solicitud

        if (!correo) {                                         // De no haber correo,
            console.error("El campo 'correo' es obligatorio"); // se avisa por consola el error del usuario;
            return {                                           // luego, se retorna un objeto
                "status": 400,                                 // con un estado de error 400 (Bad Request)
                "message": "El campo 'correo' es obligatorio"  // y un mensaje reprimiendo al usuario
            };
        }

        const ExisteUsuario = await prisma.usuarios.findUnique({ // Ahora, se busca al usuario en la BD
            where: {                                             // donde
                direccion_correo: correo                         // su correo coincida con el buscado.
            }
        });

        if (ExisteUsuario) {                                               // Si el usuario existe,
            console.error("Se intento registrar un usuario ya existente"); // se avisa en consola del error,
            console.log(ExisteUsuario);                                    // muestra los datos del usuario que ya existe
            return {                                                       // y retorna un objeto con
                "status": 500,                                             // un estado de error interno del servidor
                "message": "Usuario ya existe"                             // y un mensaje reprimiendo al servidor
            };
        }

        try {                                                    // Se intenta:
            const NuevoRegistro = await prisma.usuarios.create({ // crear un registro nuevo en la BD (nuestro usuario)
                data: {                                          // cuyos datos han de ser
                    nombre: nombre,                              // el nombre,
                    direccion_correo: correo,                    // la dirección de correo electrónico
                    clave: clave,                                // la clave
                    descripcion: descripcion                     // y la descripción de este nuevo usuario.
                }
            });
            console.log("Se ha registrado un nuevo usuario: ", NuevoRegistro); // Se avisa por consola que el registro fue exitoso;
            return {                                       // Se retorna un objeto con
                "status": 200,                             // el estado existoso (200: OK),
                "message": "Usuario registrado con exito", // el mensaj,
                "nombre": nombre,                          // el nombre,
                "correo": correo,                          // la dirección de correo electrónico
                "clave": clave,                            // la clave
                "descripcion": descripcion                 // y la descripción de este nuevo usuario.
            };
        } catch (error) {                                         // Si llega a haber un error, será culpa del servidor.
            console.error("Error al registrar usuario: ", error); // Se avisa por consola del error;
            return {                                    // luego, se retorna un objeto con
                "status": 500,                          // un estado de error interno del servidor
                "message": "Error al registrar usuario" // Y un mensaje de error.
            };
        }
    });