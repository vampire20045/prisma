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
const sec="Aryan"
app.route("/api",UserRouter);
app.route("/api/blog",BlogRouter);
app.use('/api/blog/*',async(c,next:any)=>{
  const token=c.req.header('Authorization');
  if(!token){
    return c.json({message:"incorrect token"});
  }
  const result=await verify(token,sec);
  if(!result){
    return c.json({message:"Invalid token"});
  }
  //@ts-ignore
  c.set('userId',result.id);
  await next();
})
export default app;