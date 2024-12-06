import express from "express"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
import Routes from "./routes/routes.js";
import swaggerUi from "swagger-ui-express"; 

const app = express()
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use('/api/users', Routes);
const prisma = new PrismaClient();


const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve('docs/swagger.json')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.get('/api-docs', (req, res) => {
//   res.json({
//     swagger:
//       'the API documentation  is now available on https://realworld-temp-api.herokuapp.com/api',
//   });
// });

app.get('/', (req, res) => {
  res.json('hello')
})

app.get('/users', async (req, res) => {
  try { 
    const users = await prisma.user.findMany()
    res.json(users)
  } catch(err) {
    console.log(err)
  }
})

const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

export { app, server };

