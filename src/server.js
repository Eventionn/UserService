import express from "express"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv";
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Routes from "./routes/routes.js";
import swaggerUi from "swagger-ui-express"; 
import https from 'https';
import cors from 'cors';

const app = express()
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ler certificados SSL/TLS
const key = fs.readFileSync(path.resolve('/usr/src/app/key.pem'));
const cert = fs.readFileSync(path.resolve('/usr/src/app/cert.pem'));

app.use(cors({
  origin: 'https://localhost:5173',
  credentials: true
}));
app.options('*', cors());

app.use('/uploads', express.static('/usr/src/app/public/uploads'));

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
  res.json('hello ther')
})

app.get('/users', async (req, res) => {
  try { 
    const users = await prisma.user.findMany()
    res.json(users)
  } catch(err) {
    console.log(err)
  }
})

//const server = app.listen(PORT, () => {
//  console.log(`listening on port ${PORT}`)
//})

export { app /*, server*/ };

// Criar servidor HTTPS
https.createServer({ 
  key, 
  cert, 
  passphrase: 'benfica' // passphrase
}, app).listen(PORT, () => {
  console.log(`HTTPS server listening on port ${PORT}`);
});