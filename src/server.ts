import express from "express"
import { PrismaClient } from "@prisma/client"

const app = express()
const PORT = 3039

const prisma = new PrismaClient({
  // datasources: {
  //   db: {
  //     url: process.env.DATABASE_URL,  
  //   },
  // },
});

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