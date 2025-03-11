import {Hono} from 'hono';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/jwt';
export const BlogRouter=new Hono<{
Bindings: {
		DATABASE_URL: string
	}
}>
const sec="Aryan";
BlogRouter.use('/*',async(c,next:any)=>{
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
BlogRouter.post('/',async(c:any)=>{
   const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());
const authorId=c.get('userId');
const b=await c.req.json();
await prisma.post.create({
  data:{
    title:b.title,
    content:b.content,
    published:b.published,
    authorId:authorId
  }

})

return c.json({message:"Blog created successfully"});
})
BlogRouter.get("/",async(c:any)=>{
   const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());
const result=await prisma.post.findMany({
  where:{
    published:true
  }

})
return c.text(JSON.stringify(result));
})
BlogRouter.get("/:id",async(c:any)=>{
  const id=c.req.param('id');
  const prisma=await new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate());
    const result=await prisma.post.findUnique({
        //@ts-ignore
        where:{
            id:id
        }
    })
    return c.json({result});

})
BlogRouter.put("/:id",async(c:any)=>{
  const id =c.req.param('id');
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate());
    const b=await c.req.json();
    try{
        await prisma.post.update({
            //@ts-ignore

            where:{
                id:id
            },
            data:{
                title:b.title,
                content:b.content

            }
        })
    }
    catch(e){
        return c.json({message:"Blog not found"});
    }
    return c.json({message:"Blog updated successfully"});

})
BlogRouter.delete("/:id",(c:any)=>{
  const id=c.req.param('id');
   const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate());
    const result=prisma.post.delete({
        //@ts-ignore
        where:{
            id:id
        }
    })
    return c.json({message:"Blog deleted successfully"});
})
