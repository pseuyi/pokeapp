import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const run = async () => {
  const myRequest = new Request(
    "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
  );

  fetch(myRequest)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((json: any) => {
      json.results.forEach(
        async ({ name, url }: { name: string; url: string }) => {
          await prisma.pokemon.create({
            data: { name, url }
          });
        }
      );
    });
};

run();
