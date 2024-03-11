import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import postgres from 'postgres'
import { drizzle } from "drizzle-orm/postgres-js"
import { eq } from "drizzle-orm"
import { users } from "../drizzle/schema"
import { execute } from "drizzle-kit/orm-extenstions/d1-driver/wrangler-client";
import { fetchSpaceImage } from './utils/fetchSpaceImage'
import { SpaceImage } from './components/SpaceImage'

const client = postgres(
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
)
const db = drizzle(client, { logger: true })

const app = new Hono()

/**
 * === Rooting ===
 */
// root
app.get('/', (c) => {
  return c.html(
    <div>Hello, Hono!!</div>
  )
})

// 404
app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})

// 500
app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})

// /picture
app.get('/picture', async (c) => {
  const spaceImageUrl = await fetchSpaceImage()
  return c.html(
    <div>
      <SpaceImage url={spaceImageUrl} />
    </div>
  )
})

// / create
app.get('/create', (c) => {
  return c.html(
    <div>
      <form action="user" method="post" required>
        username: <input type="text" name="user" required /><br />
        age: <input type="number" name="age" /><br />
        <button type="submit">CREATE USER</button>
      </form>
    </div>
  )
})

// Create
app.post("/user", async (c) => {
  const body = await c.req.parseBody()
  console.log(body)

  await db.insert(users)
      .values({
        name: body.user,
        age: body.age
      })

  return c.json({message: "ok", ok: true})
})

// Read
app.get('/users/:id?', async (c) => {
  let result = [];
  if (!c.req.param("id")) {
    result = await db.select(
      {
        id: users.id,
        name: users.name,
        age: users.age
      }
    )
    .from(users)
  }
  else {
    result = await db.select(
      {
        id: users.id,
        name: users.name,
        age: users.age
      }
    )
    .from(users)
    .where(eq(users.id, c.req.param("id")))
  }

    return c.json(result)
})

// Update
app.put("/user/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.parseBody()
  console.log(body)

  await db.update(users)
      .set({
        name: body.name,
        age: body.age
      })
      .where(eq(users.id, id))

  return c.json({message: "ok", ok: true})
})

// Delete
app.delete("/user/:id", async (c) => {
  const id = c.req.param("id");

  await db.delete(users)
      .where(eq(users.id, id))

  return c.json({message: "ok", ok: true})
})

/**
 * === Server ===
 */
const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
