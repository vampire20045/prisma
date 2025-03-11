import {Hono} from 'hono';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
export const BlogRouter=new Hono<{
Bindings: {
		DATABASE_URL: string
	}
}>
BlogRouter.post('/',async(c:any)=>{
   const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());
const b=await c.req.json();
await prisma.post.create({
  data:{
    title:b.title,
    content:b.content,
    published:b.published,
    authorId:"12"
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
