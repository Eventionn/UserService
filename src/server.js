import express from "express"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv";

const app = express()
dotenv.config();
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();
//Teste
app.use(express.json());

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