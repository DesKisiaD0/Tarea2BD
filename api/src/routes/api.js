import elysia from "elysia";
import { correos } from "./correos";
import { registrar } from "./registrar";
import { bloquear } from "./bloquear";


export const api = new elysia({
    prefix: "api"
}) 

    .use(correos)
    .use(registrar)
    .use(bloquear)
    ;