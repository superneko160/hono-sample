import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import postgres from 'postgres'
import { drizzle } from "drizzle-orm/postgres-js"
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
  return c.text('Hello, Hono!!')
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

// /users
app.get('/users', async (c) => {
  const result = await db.select(
    {
      id: users.id,
      name: users.name,
      age: users.age
    }
  )
  .from(users)
  .execute()

    return c.json(result)
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
