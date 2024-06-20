import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registrar = new Elysia()
    .post("/registrar", async ({body}) => {
        const { correo, clave, nombre, apellido } = body;

        const ExisteUsuario = await prisma.usuarios.findUnique({
            where: {
                direccion_correo: correo
            }
        });
        if(ExisteUsuario !== null){
            return {
                "status": 400,
                "message": "Usuario ya existe"
            };
        }

        try {
            await prisma.usuarios.create({
                data: {
                    direccion_correo: correo,
                    clave: clave,
                    nombre: nombre,
                    apellido: apellido
                }
            });
        } catch (error) {
            return {
                "status": 400,
                "message": "Error al registrar usuario"
            };
        }
        return {
            "status": 200,
            "message": "Usuario registrado con exito"
        };
    });