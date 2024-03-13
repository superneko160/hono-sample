import { eq } from "drizzle-orm"
import { users } from "../../drizzle/schema"

export interface User {
    id: string;
    name: string;
    age: string;
}

/**
 * ユーザ情報を取得
 * @returns {object} db データベース
 * @param {string} id ユーザID
 * @returns {User} ユーザ情報
 */
export const getUser = async (db, id): Promise<User> => {
    return await db.select(
        {
          id: users.id,
          name: users.name,
          age: users.age
        }
      )
      .from(users)
      .where(eq(users.id, id))
}

/**
 * 全ユーザ情報を取得
 * @returns {object} db データベース
 * @returns {User[]} 全ユーザ情報
 */
export const getUsers = async (db, id): Promise<User[]> => {
    return await db.select(
        {
          id: users.id,
          name: users.name,
          age: users.age
        }
      )
      .from(users)
}