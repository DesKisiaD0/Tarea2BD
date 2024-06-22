import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const bloquear = new Elysia()
    .post("/bloquear", async ({body}) => {
        if(body.correo === undefined || body.correo_bloqueado === undefined){
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
    } catch (error) {
        
        return {
            "status": 400,
            "message": "Error al bloquear usuario"
        };
    }
    return {
        "status": 200,
        "message": "Usuario bloqueado con exito"
    };
});