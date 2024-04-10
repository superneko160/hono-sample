# Hono-Sample

- [Hono](https://hono.dev/)
- [PostgreSQL](https://www.postgresql.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [JSDOM](https://github.com/jsdom/jsdom)

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
docker network inspect hono-sample
```

```bash
"Containers": {
    "xxxxx": {
        "Name": "postgres",
        "IPv4Address": "xxx.xx.x.x/xx",
    }
}
```

DB host settings for .env

```
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=xxx.xx.x.x  // Setting IPv4Address
DB_PORT=5432
DB_NAME=sample

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

## VSCode Extensions

[Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client)
