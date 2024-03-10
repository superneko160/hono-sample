import {
    pgTable,
    serial,
    integer,
     text
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const users = pgTable("users", {
    id: serial('id').primaryKey(),
    name: text("name").notNull(),
    age: integer("age").notNull(),
});