import express, { type Request, type Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express();
app.use(express.json());

app.get(`/`, async (req: Request, res: Response) => {
  res.json("hello world 2");
});

// GET /pokemon
app.get('/pokemon', async (req: Request, res: Response) => {
  const pokemon = await prisma.pokemon.findMany()
  res.status(200).json(pokemon);
})

// POST /:userId/capture/:pokemonId
app.post('/:userId/capture/:pokemonId', async (req: Request, res: Response) => {
  const { userId, pokemonId } = req.params;
  const { name, note } = req.body;

  const captures = await prisma.capture.findUnique({
    where: {
      userId: +userId
    }
  })

  // cannnot capture same pokemon twice
  const previouslyCaptured = captures.some(capture => {
    capture.id === pokemonId
  });
  if(previouslyCaptured) {
    res.status(400);
  }

  const capture = await prisma.capture.create({
    data: { 
      user: {connect: {id: +userId}}, 
      pokemon: {connect:{id: +pokemonId}}, 
      name, 
      note,
    }
  })
  res.status(201).json(capture);
})

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
