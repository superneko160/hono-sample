import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import postgres from 'postgres'
import { drizzle } from "drizzle-orm/postgres-js"
import { eq } from "drizzle-orm"
import { users } from "../drizzle/schema"
import { execute } from "drizzle-kit/orm-extenstions/d1-driver/wrangler-client";
import { fetchSpaceImage } from './utils/fetchSpaceImage'
import { getUser, getUsers } from './utils/User'
import { getElements } from './utils/getElements'
import { trimHtml } from "./utils/trimHtml";
import { SpaceImage } from './components/SpaceImage'
import { CreateForm } from './components/CreateForm'
import { UploadForm } from "./components/UploadForm"
import * as dotenv from 'dotenv'
import { writeFile, readFile } from "fs/promises"
import { parse } from 'node-html-parser'
import { JSDOM } from 'jsdom'

dotenv.config()

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
  return c.json({ message: "404 Not Found" }, 404)
})

// 500
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({ message: "500 Custom Error Message" }, 500)
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
      <CreateForm />
    </div>
  )
})

// /upload
app.get('/upload', (c) => {
  return c.html(
    <div>
      <UploadForm />
    </div>
  )
})

/**
 * === Rooting (Api) ===
 */
// Create
app.post("/user", async (c) => {
  const body = await c.req.parseBody()

  await db.insert(users)
      .values({
        name: body.name,
        age: body.age
      })

  return c.json({ message: "ok" }, 201)
})

// Read
// idと一致するデータがあれば、そのユーザ情報を返す（なければ空のリストを返す）
app.get('/user/:id', async (c) => {
  const result = await getUser(db, c.req.param("id"))
  return c.json(result)
})

// Read
// idと一致するデータがあれば、そのユーザ情報を返す（なければ空のリストを返す）
app.get('/users', async (c) => {
  const result = await getUsers(db)
  return c.json(result)
})

// Update
// idと一致するデータがあった場合、そのデータを更新（なければ404返す）
app.put("/user", async (c) => {
  const body = await c.req.parseBody()

  const user = await getUser(db, body.id)

  if (user.length === 0) {
    return c.json({ message: "404 Not Found" }, 404);
  }

  await db.update(users)
      .set({
        name: body.name,
        age: body.age
      })
      .where(eq(users.id, body.id))

  return c.json({ message: "ok" })
})

// Delete
// idと一致するデータがあった場合、そのデータを削除（なければ404返す）
app.delete("/user", async (c) => {
  const body = await c.req.parseBody()

  const user = await getUser(db, body.id)

  if (user.length === 0) {
    return c.json({ message: "404 Not Found" }, 404);
  }

  await db.delete(users)
      .where(eq(users.id, body.id))

  return c.json({ message: "ok" })
})

// /upload
app.post('/upload', async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file')
  const arr = await file.arrayBuffer()

  // Note: fsのファイルパスの起点はnode.jsで実行しているファイルがあるディレクトリ
  writeFile(`./resources/images/${file.name}`, Buffer.from(arr), (e) => {
    return c.json({ error: e.toString() }, 500)
  })

  return c.json({ message: "ok" })
})

// /parse
app.get('/parse', async (c) => {
  // ファイルを読み込む
  let filedata = await readFile('./resources/html/index.html', 'utf8')

  // 以下の処理がなくても動作はするが、countElements関数内で余分な処理が走る
  filedata = trimHtml(filedata)

  const root = parse(filedata)
  const data = getElements(root)

  return c.json({ message: "ok", data: data })
})

// /note/h1
// /note/h1,div
app.get('/note/:tag', async (c) => {
  const dom = await JSDOM.fromURL("https://note.com/")
  const nodeList = dom.window.document.querySelectorAll(
    c.req.param("tag")
  )
  const items = Array.from(nodeList).map((node) => {
    // 属性名と値をすべて取得
    const attributes = Array.from(node.attributes).map((attr) => {
      return {
        name: attr.name,
        value: attr.value,
      }
    })

    return {
      tagname: node.tagName.toLowerCase(),
      content: node.textContent.replace(/\s+/g, ""),
      href: node.href,
      attributes: attributes,
    }
  })

  return c.json({ message: "ok", data: items })
})

// /hatena
app.get('/hatena', async (c) => {
  const dom = await JSDOM.fromURL("https://b.hatena.ne.jp/hotentry/it")
  const nodeList = dom.window.document.querySelectorAll(
    ".entrylist-contents-title a"
  )
  const items = Array.from(nodeList).map((node) => {
    return {
      title: node.title,
      href: node.href,
    }
  })

  return c.json({ message: "ok", data: items })
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
