import Client from '../database'

export interface User {
    id: number
    username: string
    first_name: string
    last_name: string
    email: string
}

export default class UserModel {
    async validateAuth(username: string, hash: string): Promise<User> {
        try {
            const conn = await Client.connect()
            const sql =
                'SELECT id, username, first_name, last_name, email FROM users WHERE username = $1 AND hash = $2'
            const result = await conn.query(sql, [username, hash])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot get user: ${err}`)
        }
    }
}
