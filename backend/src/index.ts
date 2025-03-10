import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
	}
}>();
const sec="Aryan";
app.post('/api/singup',async(c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());
const b = await c.req.json();
const result=await prisma.user.findUnique({
  where:{
    email:b.email
  }
})
if(result){
  return c.json({message:"User already exists"});
}
const user=await prisma.user.create({
  data:{
    name: b.name,
    email: b.email,
    password: b.password

  }})
const token=sign({id:user.id},sec);

return c.json({message:"signup successfully",token:token});
})

app.post('/api/login',async(c)=>{
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());
const b=await c.req.json();
const result=await prisma.user.findFirst({
  where:{
    AND:[
      {email:b.email},
      {password:b.password}]
 
  }})
  if(!result){
    return c.json({message:"Invalid email or password"});}
    const token=sign({id:result.id},sec);
    return c.json({message:"Login Successfully",token:token});

})
app.post('/api/blog',async(c)=>{
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
app.get("/api/blog",async(c)=>{
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
app.get("/api/blog/:id",(c)=>{
  const id=c.req.param('id');
  console.log(id);
  return c.text('blog id');

})
app.put("/api/blog/:id",(c)=>{
  const id =c.req.param('id');
  console.log(id);
  return c.text('to update the blog');
})
app.delete("api/blog/:id",(c)=>{
  const id=c.req.param('id');
  return c.text("to delete the blog");
})

export default app
