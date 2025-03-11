import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

export const UserRouter= new Hono<{
	Bindings: {
		DATABASE_URL: string
	}
}>();
const sec="Aryan";

UserRouter.post('/singup',async(c)=>{
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
const token=await sign({id:user.id},sec);

return c.json({message:"signup successfully",token:token});
})

UserRouter.post('/login',async(c)=>{
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
}).$extends(withAccelerate());
const b=await c.req.json();
const result=await prisma.user.findUnique({
  where:{
    email:b.email,
    password:b.password
 
  }})
  if(!result){
    return c.json({message:"Invalid email or password"});}
    const token=await sign({id:result.id},sec);
    return c.json({message:"Login Successfully",token:token});

})