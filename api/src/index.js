import { Elysia } from "elysia";
import { api } from "./routes/api"

const APP_PORT = 3001;

const app = new Elysia()
  .use(api)
  .listen(APP_PORT);

console.log(
  `🦊 Elysia is running at :${APP_PORT}`
);