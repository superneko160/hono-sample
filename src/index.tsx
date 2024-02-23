import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { jsx } from 'hono/jsx'
import { fetchSpaceImage } from './utils/fetchSpaceImage'

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

/**
 * === Components ===
 */
/**
 * 宇宙の画像を表示するコンポーネント
 * @param props 
 * @returns 
 */
const SpaceImage = (props: {url: string}) => (
  <img src={props.url} />
)

/**
 * === Server ===
 */
const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
