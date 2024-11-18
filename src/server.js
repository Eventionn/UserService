import express from "express"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv";
import routes from './routes/routes';
import swaggerDocument from '../docs/swagger.json';

const app = express()
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use('/api', routes);
const prisma = new PrismaClient();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api-docs', (req, res) => {
  res.json({
    swagger:
      'the API documentation  is now available on https://realworld-temp-api.herokuapp.com/api',
  });
});

app.get('/', (req, res) => {
  res.json('hello there')
})

app.get('/users', async (req, res) => {
  try { 
    const users = await prisma.user.findMany()
    res.json(users)
  } catch(err) {
    console.log(err)
  }
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

//ISTO É UM TESTE DE ACTION