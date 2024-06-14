"bloquear.js"
import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const bloquear = new Elysia()
    .post("/bloquear", async ({body}) => {
        if(body.correo === undefined || body.clave === undefined || body.correo_bloqueado === undefined){
            return {
                "status": 400,
                "message": "Faltan datos"
            };
        }
        const { correo, clave, correo_bloqueado } = body;
    

    const Existe = await prisma.usuarios.findUnique({
        where: {
            direccion_correo: correo
        }
    });

    if(Existe === null){
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

    try {
        await prisma.bloqueados.create({
            data: {
                direccion_correo: correo,
                direccion_correo_bloqueado: correo_bloqueado
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
