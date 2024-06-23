import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const bloquear = new Elysia()
    .post("/bloquear", async ({body}) => {
        console.log("Se ha solicitado bloquear a un usuario")
        if(body.correo === undefined || body.correo_bloqueado === undefined){
            console.log("Faltan datos para poder realizar el bloqueo con exito")
            return {
                "status": 400,
                "message": "Faltan datos"
            };
        }                                 
        const { correo, correo_bloqueado } = body;
    

    const ExisteUsuario = await prisma.usuarios.findUnique({
        where: {
            direccion_correo: correo
        }
    });

    if(ExisteUsuario === null){
        console.log("Se intento bloquear con un usuario que no existe")
        return {
            "status": 400,
            "message": "Usuario no existe"
        };
    }

    const ExisteBloqueado = await prisma.usuarios.findUnique({
        where: {
            direccion_correo: correo_bloqueado
        }
    });

    if(ExisteBloqueado === null){
        console.log("Se intento bloquear a un usuario que no existe")
        return {
            "status": 400,
            "message": "Usuario a bloquear no existe"
        };
    }
    const yaBloqueado = await prisma.direcciones_bloqueadas.findUnique({
        where: {
            usuario_id_bloqueado_id: {
                usuario_id: ExisteUsuario.id,
                bloqueado_id: ExisteBloqueado.id
            }
        }
    });
    
    if (yaBloqueado !== null) {
        console.log("Esté usuario ya ha sido bloqueado con exito")
        return {
            "status": 400,
            "message": "El usuario ya ha sido bloqueado"
        };
    }
    
    try {
        await prisma.direcciones_bloqueadas.create({
            data: {
                usuario_id: ExisteUsuario.id,
                bloqueado_id: ExisteBloqueado.id
            }
        });
        console.log("Usuario bloqueado con exito")
        return {
            "status": 200,
            "message": "Usuario bloqueado con exito"
        };
    } catch (error) {
        console.log("Error al bloquear usuario")
        return {
            "status": 400,
            "message": "Error al bloquear usuario"
        };
    }
});