import posts from "./posts";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await Promise.all(
      posts.map(
        async ({ id, title, tags, content: text }) =>
          await prisma.post.upsert({
            where: { id },
            update: { title, text },
            create: {
              id,
              title,
              text,
              tags: {
                connectOrCreate: tags.map((tagName) => ({
                  where: { name: tagName },
                  create: { name: tagName, description: tagName },
                })),
              },
            },
          }),
      ),
    );
  }

  main().catch(console.error);