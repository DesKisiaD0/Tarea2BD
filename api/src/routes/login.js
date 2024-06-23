import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const login = new Elysia()

    .get("/login", async({query}) => {
        if (!query.correo || !query.clave) {
            return {
                status: 400,
                body: {
                    message: "Correo o contraseña no proporcionados"
                }
            }
        }
        const {correo, clave} = query;

        try {
            const usuario = await prisma.usuarios.findUnique({
                where: {
                    direccion_correo: correo,
                    clave: clave,
                },
            });

            if(usuario) {
                return {
                    "estado": 200,
                    "mensaje": "Usuario autenticado",
                    "credenciales_correctas": true
                };
            } else {
                return {
                    "estado": 400,
                    "mensaje": "Usuario no autenticado",
                    "credenciales_correctas": false
                };
            }
        } catch (error) {
            return {
                "estado": 500,
                "mensaje": "Error al autenticar usuario",
            };
        }
    });
