import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const bloquear = new Elysia()
    .post("/bloquear", async ({body}) => { 
    // Este endpoint permite a un usuario bloquear a otro.

        // Se avisa por consola que:
        console.log("Se ha solicitado bloquear a un usuario") 

        if(body.correo === undefined || body.correo_bloqueado === undefined){ 
            // Si faltan datos, o están incorrectos, se avisa por consola que:
            console.log("Faltan datos para poder realizar el bloqueo con exito") 
            return {                      // Luego, se retorna un objeto con
                "status": 400,            // un mensaje de Bad Request
                "message": "Faltan datos" // y un mensaje de error.
            };
        }                                 

        // Si lo anterior resulta bien, se extraen los datos desde la solicitud.
        const { correo, correo_bloqueado } = body;
    

    const ExisteUsuario = await prisma.usuarios.findUnique({ // Esta función busca en la BD si existe el usuario a bloquear
        where: {                                             // donde
            direccion_correo: correo                         // se toma su direción de correo.
        }
    });

    if(ExisteUsuario === null){ // Si el usuario no existe, se avisa por consola que:
        console.log("Se intentó bloquear con un usuario que no existe")

        return {                           // Luego, se retorna un objeto con
            "status": 400,                 // un mensaje de error (BadRequest)
            "message": "Usuario no existe" // y su correspondiente mensaje.
        };
    }

    // Aquí se busca en la base de datos si el usuario ha sido bloqueado
    const ExisteBloqueado = await prisma.usuarios.findUnique({ 
        where: {                               // donde 
            direccion_correo: correo_bloqueado // se toma nuevamente su correo electrónico.
        }
    });

    if(ExisteBloqueado === null){ // Si el usuario a bloquear no existe,
                                  // se avisa por consola que:
        console.log("Se intento bloquear a un usuario que no existe") 

        return {                                      // y se retorna un objeto con
            "status": 400,                            // un estado de error (BadRequest)
            "message": "Usuario a bloquear no existe" // y un mensaje que anuncia que el usuario a bloquear no existe.
        };
    }

    // Aquí se verifica si el usuario ya tiene una relación de bloqueado con otro:
    const yaBloqueado = await prisma.direcciones_bloqueadas.findUnique({
        where: {                                  // donde 
            usuario_id_bloqueado_id: {            // se toman los siguientes datos del usuario bloqueado:
                usuario_id: ExisteUsuario.id,     // su ID
                bloqueado_id: ExisteBloqueado.id  // y si ya hay bloqueo.
            }
        }
    });
    
    // Si el usuario estaba ya bloquedado, se anuncia por consola que:
    if (yaBloqueado !== null) {                                    
        console.log("Esté usuario ya ha sido bloqueado con exito")
        return {                                         // Luego, se retorna un objeto de error
            "status": 400,                               // con el status 400 (error de usuario)
            "message": "El usuario ya ha sido bloqueado" // y un mensaje.
        };
    }
                                                     // Ahora que todo resultó bien,
    try {                                            // se intenta
        await prisma.direcciones_bloqueadas.create({ // crear una nueva entrada en la tabla de bloqueados
            data: {                                  // con los siguientes datos:
                usuario_id: ExisteUsuario.id,        // la ID del usuario
                bloqueado_id: ExisteBloqueado.id     // y la ID del usuario bloqueado
            }
        });

        // Se anuncia el éxito de la consulta:
        console.log("Usuario bloqueado con exito")

        return {                                     // Finalmente, se retorna un objeto 
            "status": 200,                           // con estado de éxito
            "message": "Usuario bloqueado con exito" // y un mensaje.
        };
    } catch (error) {                              // Si algo sale mal por parte el usuario,
        console.log("Error al bloquear usuario")   // se dicta por consola el error al bloquear al usuario  
        return {                                   // y se retorna un objeto con
            "status": 400,                         // el estado del error al bloquear al usuario
            "message": "Error al bloquear usuario" // y un mensaje.
        };
    }
});