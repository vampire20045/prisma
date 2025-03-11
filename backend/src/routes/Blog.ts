import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/jwt';

export const BlogRouter = new Hono<{ Bindings: { DATABASE_URL: string } }>();

// Load Secret from Environment
const JWT_SECRET = 'Aryan';

// Initialize Prisma Client once
const prisma = new PrismaClient().$extends(withAccelerate());

// Authentication Middleware
BlogRouter.use('/*', async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  try {
    const result = await verify(token, JWT_SECRET);
    if (!result) {
      return c.json({ message: 'Invalid token' }, 401);
    }
    //@ts-ignore
    c.set('userId', result.id);
    await next();
  } catch (error) {
    return c.json({ message: 'Invalid token' }, 401);
  }
});

// Create Blog
BlogRouter.post('/', async (c) => {
    //@ts-ignore
  const authorId = c.get('userId');
  const body = await c.req.json();

  try {
    await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        published: body.published,
        //@ts-ignore
        authorId:authorId
      },
    });
    return c.json({ message: 'Blog created successfully' });
  } catch (error) {
    return c.json({ message: 'Error creating blog', error }, 500);
  }
});

// Get All Published Blogs
BlogRouter.get('/', async (c) => {
  try {
    const result = await prisma.post.findMany({ where: { published: true } });
    return c.json(result);
  } catch (error) {
    return c.json({ message: 'Error fetching blogs', error }, 500);
  }
});

// Get Blog by ID
BlogRouter.get('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const result = await prisma.post.findUnique({ where: { id } });
    if (!result) return c.json({ message: 'Blog not found' }, 404);
    return c.json(result);
  } catch (error) {
    return c.json({ message: 'Error fetching blog', error }, 500);
  }
});

// Update Blog
BlogRouter.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();

  try {
    await prisma.post.update({
      where: { id },
      data: { title: body.title, content: body.content },
    });
    return c.json({ message: 'Blog updated successfully' });
  } catch (error) {
    return c.json({ message: 'Blog not found or update failed', error }, 404);
  }
});

// Delete Blog
BlogRouter.delete('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    await prisma.post.delete({ where: { id } });
    return c.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    return c.json({ message: 'Blog not found or delete failed', error }, 404);
  }
});

export default BlogRouter;
