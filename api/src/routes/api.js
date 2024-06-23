import elysia from "elysia";
import { desmarcarFAV } from "./desmarcarFAV";
import { marcarFAV } from "./marcarFAV";
import { favoritos } from "./favoritos";
import {informacion} from "./informacion";
import { registrar } from "./registrar";
import { bloquear } from "./bloquear";
import { login } from "./login";


export const api = new elysia({
    prefix: "api"
}) 
    .use(desmarcarFAV)
    .use(marcarFAV)
    .use(favoritos)
    .use(informacion)
    .use(registrar)
    .use(bloquear)
    .use(login)
    ;