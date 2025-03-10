import { Hono } from 'hono'
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
	}
}>();

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.post('/api/singup',(c)=>{
  return c.json({message:"signup"})
})

app.post('/api/login',(c)=>{
  return c.json({message:"Login"});
})
app.post('/api/blog',(c)=>{
  return c.json({message:"Blog"});
})
app.get("/api/blog",(c)=>{
return c.json({message:"Blog get"});
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
