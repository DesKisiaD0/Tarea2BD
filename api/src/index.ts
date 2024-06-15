import { PrismaClient } from '@prisma/client';
import { Elysia } from 'elysia';

const prisma = new PrismaClient();
const app = new Elysia();

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});