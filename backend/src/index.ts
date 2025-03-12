import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { BlogRouter } from './routes/Blog'
import {UserRouter} from './routes/User'
const app= new Hono<{
	Bindings: {
		DATABASE_URL: string
	}
}>();

app.route("/api",UserRouter);
app.route("/api/blog",BlogRouter);

export default app;