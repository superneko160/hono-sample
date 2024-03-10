import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { Pool } from 'pg'
import { fetchSpaceImage } from './utils/fetchSpaceImage'
import { SpaceImage } from './components/SpaceImage'

const app = new Hono()

const pool = new Pool({
  user: 'postgres',
  host: 'xxx.xx.x.x',
  database: 'sample',
  password: 'password',
  port: 5432,
})

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
app.get('/users', async(c) => {
  const { rows } = await pool.query('select * from users')
  return c.json(rows)
});

/**
 * === Server ===
 */
const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
