import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge'; // Use Edge version for Cloudflare Workers
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/jwt';

export const BlogRouter = new Hono<{ Bindings: { DATABASE_URL: string } }>();

const sec = "Aryan";


BlogRouter.use('/*', async (c, next) => {
  const token = c.req.header('Authorization');
  if (!token) {
    return c.json({ message: "Missing token" }, 401);
  }

  try {
    const result = await verify(token, sec);
    if (!result) {
      return c.json({ message: "Invalid token" }, 401);
    }
    // @ts-ignore
    c.set('userId', result.id);
    await next();
  } catch (err) {
    return c.json({ message: "Invalid token format" }, 401);
  }
});

// 📝 Create a Blog
BlogRouter.post('/', async (c) => { 
    
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());

    //@ts-ignore
  const authorId = c.get('userId');
  const b = await c.req.json();

  await prisma.post.create({
    data: {
      title: b.title,
      content: b.content,
      published: b.published,
      //@ts-ignore
      authorId: authorId,
    }
  });

  return c.json({ message: "Blog created successfully" });
});

// 📃 Fetch All Published Blogs
BlogRouter.get("/", async (c) => {
     const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());
  const result = await prisma.post.findMany({
    where: { published: true }
  });
  return c.json(result);
});

// 🔍 Get a Blog by ID
BlogRouter.get("/:id", async (c) => {
     const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());
  const id = c.req.param('id');

  const result = await prisma.post.findUnique({
    where: { id: id }
  });

  if (!result) {
    return c.json({ message: "Blog not found" }, 404);
  }

  return c.json(result);
});

// ✏️ Update a Blog
BlogRouter.put("/:id", async (c) => {
     const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());
  const id = c.req.param('id');
  const b = await c.req.json();

  try {
    await prisma.post.update({
      where: { id: id },
      data: {
        title: b.title,
        content: b.content
      }
    });
    return c.json({ message: "Blog updated successfully" });
  } catch (e) {
    return c.json({ message: "Blog not found" }, 404);
  }
});

// ❌ Delete a Blog
BlogRouter.delete("/:id", async (c) => {
     const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());
  const id = c.req.param('id');

  try {
    await prisma.post.delete({
      where: { id: id }
    });
    return c.json({ message: "Blog deleted successfully" });
  } catch (e) {
    return c.json({ message: "Blog not found" }, 404);
  }
});
