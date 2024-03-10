# Hono-Sample

Hono + PostgreSQL

## Setting

### Change directory .devcontainer

```bash
cd .devcontainer
```

### Create docker network

```bash
docker network create hono-sample
```

### Check docker network

```bash
docker network ls
```

```bash
NETWORK ID     NAME                       DRIVER    SCOPE
313607904df7   hono-sample                bridge    local
```

Check network details

```bash
docker network inspect network-id
```

```bash
"Containers": {
    "xxxxx": {
        "Name": "postgres",
        "IPv4Address": "xxx.xx.x.x/xx",
    }
}
```

DB host settings for index.tsx

```js
const pool = new Pool({
  user: 'postgres',
  host: 'xxx.xx.x.x',  // Setting IPv4Address
  database: 'sample',
  password: 'password',
  port: 5432,
})
```

### Build and launch docker container

```bash
docker compose up -d
```

### hono-sample container

```bash
docker exec -i -t hono-sample bash
```

```bash
bun install
```

## Run

```bash
bun run dev
```

## Access

```
http://localhost:3000
```
```
http://localhost:3000/picture
```
```
http://localhost:3000/users
```

## postgres container

### Connect postgres container

```bash
docker exec -i -t postgres bash
```

### Connect Database

```bash
psql -U postgres -d sample
```

## WebAPI

[NASA Open API](https://api.nasa.gov/)