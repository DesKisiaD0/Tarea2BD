import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registrar = new Elysia()


    .get("/iniciar", async () => {
        console.log("Se abrio el cliente de registro de usuario");
        return {
            "status": 200,
            "message": "Se abrio el cliente"
        }
    })



    .post("/registrar", async ({body}) => {
        console.log("Se ha recibido una solicitud de registro de usuario")
        const { correo, clave, nombre, apellido } = body;

        const ExisteUsuario = await prisma.usuarios.findUnique({
            where: {
                direccion_correo: correo
            }
        });
        if(ExisteUsuario){
            console.error("Se intento registrar un usuario ya existente");
            console.log(ExisteUsuario);
            return {
                "status": 500,
                "message": "Usuario ya existe"
            };
        }

        try {
            const NuevoRegistro = await prisma.usuarios.create({
                data: {
                    direccion_correo: correo,
                    clave: clave,
                    nombre: nombre,
                    descripcion: descripcion
                }
            });
            console.log("Se ha registrado un nuevo usuario: ", NuevoRegistro);
            return {
                "status": 200,
                "message": "Usuario registrado con exito",
                "nombre": nombre,
                "correo": correo,
                "clave": clave,
                "descripcion": descripcion
            };
        } catch (error) {
            console.error("Error al registrar usuario: ");
            return {
                "status": 500,
                "message": "Error al registrar usuario"
            };
        }
    });