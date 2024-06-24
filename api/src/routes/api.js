                                                // Se importa lo siguiente
import elysia from "elysia";                    // el módulo elysia para configurar la API
import { desmarcarFAV } from "./desmarcarFAV";  // el endpoint desmarcarFAV desde el archivo desmarcarFAV.js
import { marcarFAV } from "./marcarFAV";        // el endpoint marcarFAV desde el archivo marcarFAV.js
import { favoritos } from "./favoritos";        // el endpoint favoritos desde el archivo favoritos.js
import {informacion} from "./informacion";      //  el endpoint informacion desde el archivo informacion.js
import { registrar } from "./registrar";        // el endpoint registrar desde el archivo registrar.js
import { bloquear } from "./bloquear";          // el endpoint bloquear desde el archivo bloquear.js
import { login } from "./login";                // y el endpoint login desde el archivo login.js.

// Exporta una instancia de elysia que configura la API con el prefijo "api"
export const api = new elysia({
    prefix: "api" // Configura el prefijo de la API como "api"
})
    .use(desmarcarFAV) // Usa el endpoint desmarcarFAV configurado anteriormente
    .use(marcarFAV)    // Usa el endpoint marcarFAV configurado anteriormente
    .use(favoritos)    // Usa el endpoint favoritos configurado anteriormente
    .use(informacion)  // Usa el endpoint informacion configurado anteriormente
    .use(registrar)    // Usa el endpoint registrar configurado anteriormente
    .use(bloquear)     // Usa el endpoint bloquear configurado anteriormente
    .use(login);       // Usa el endpoint login configurado anteriormente
