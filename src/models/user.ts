import Client from '../database'

export interface User {
    id: number
    username: string
    first_name: string
    last_name: string
    email: string
    hash: string
}

export class UserStore {
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

    async showByUsername(username: string): Promise<User> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM users WHERE username = $1'
            const result = await conn.query(sql, [username])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot get user: ${err}`)
        }
    }

    async create(newUser: Omit<User, 'id'>): Promise<User> {
        try {
            const conn = await Client.connect()
            const sql =
                'INSERT INTO users (username, first_name, last_name, email, hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, first_name, last_name, email'
            const result = await conn.query(sql, [
                newUser.username,
                newUser.first_name,
                newUser.last_name,
                newUser.email,
                newUser.hash,
            ])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot create user: ${err}`)
        }
    }
}
