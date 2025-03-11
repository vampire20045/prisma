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
BlogRouter.get("/:id",(c:any)=>{
  const id=c.req.param('id');
  console.log(id);
  return c.text('blog id');

})
BlogRouter.put("/:id",(c:any)=>{
  const id =c.req.param('id');
  console.log(id);
  return c.text('to update the blog');
})
BlogRouter.delete("/:id",(c:any)=>{
  const id=c.req.param('id');
  return c.text("to delete the blog");
})
